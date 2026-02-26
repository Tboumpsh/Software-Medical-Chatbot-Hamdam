// =====================================================================
//  Hamdam – useChat Hook
//  Manages conversation state, streaming, sessions, and safety
// =====================================================================

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type {
  ChatMessage,
  ChatMode,
  ChatSession,
  EmergencyAction,
} from '@/types';
import { CHAT_CONSTANTS } from '../constants';

const STORAGE_KEY = 'hamdam_session';

function createSession(mode: ChatMode): ChatSession {
  return {
    id: crypto.randomUUID(),
    messages: [],
    mode,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

function createMessage(
  role: ChatMessage['role'],
  content: string,
  mode: ChatMode,
  extra?: Partial<ChatMessage>,
): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    mode,
    timestamp: Date.now(),
    ...extra,
  };
}

// ── Hook ─────────────────────────────────────────────────────────────

export function useChat(initialMode: ChatMode = 'medical') {
  const [session, setSession] = useState<ChatSession>(() => createSession(initialMode));
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emergencyAction, setEmergencyAction] = useState<EmergencyAction | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const streamingMessageIdRef = useRef<string | null>(null);

  // Restore session from storage on mount (session persistence across page reload)
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: ChatSession = JSON.parse(stored);
        const age = Date.now() - parsed.updatedAt;
        if (age < CHAT_CONSTANTS.SESSION_TIMEOUT_MS) {
          setSession(parsed);
          return;
        }
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Persist session to storage
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch {
      // Ignore storage errors
    }
  }, [session]);

  const addMessage = useCallback((message: ChatMessage) => {
    setSession((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
      updatedAt: Date.now(),
    }));
  }, []);

  const updateLastAssistantMessage = useCallback((updater: (content: string) => string) => {
    setSession((prev) => {
      const messages = [...prev.messages];
      const lastIdx = messages.length - 1;
      if (lastIdx >= 0 && messages[lastIdx].role === 'assistant') {
        messages[lastIdx] = {
          ...messages[lastIdx],
          content: updater(messages[lastIdx].content),
        };
      }
      return { ...prev, messages, updatedAt: Date.now() };
    });
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      setError(null);
      setEmergencyAction(null);

      // Add user message
      const userMsg = createMessage('user', content.trim(), session.mode);
      addMessage(userMsg);

      setIsLoading(true);

      // Prepare history (exclude current message)
      const history = session.messages
        .slice(-CHAT_CONSTANTS.MAX_HISTORY_LENGTH)
        .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));

      try {
        abortControllerRef.current = new AbortController();

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: session.id,
            message: content.trim(),
            mode: session.mode,
            history,
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error((errData as { error?: string }).error ?? 'خطای سرور');
        }

        const contentType = response.headers.get('content-type') ?? '';

        // ── Non-streaming (emergency/policy) response
        if (contentType.includes('application/json')) {
          const data = await response.json();
          const assistantMsg = createMessage('assistant', data.content, session.mode, {
            safetyLevel: data.safetyLevel,
          });
          addMessage(assistantMsg);

          if (data.emergencyAction) {
            setEmergencyAction(data.emergencyAction);
          }
          return;
        }

        // ── Streaming SSE response
        const assistantMsgId = crypto.randomUUID();
        streamingMessageIdRef.current = assistantMsgId;

        const safetyLevel = (response.headers.get('X-Safety-Level') ?? 'safe') as ChatMessage['safetyLevel'];
        const assistantMsg = createMessage('assistant', '', session.mode, {
          id: assistantMsgId,
          isStreaming: true,
          safetyLevel,
        });
        addMessage(assistantMsg);
        setIsStreaming(true);

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) throw new Error('No reader');

        let buffer = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const raw = line.slice(6).trim();
            if (raw === '[DONE]') continue;

            try {
              const parsed = JSON.parse(raw) as { content?: string; error?: string };
              if (parsed.error) {
                throw new Error(parsed.error);
              }
              if (parsed.content) {
                updateLastAssistantMessage((prev) => prev + parsed.content);
              }
            } catch {
              // Ignore parse errors in stream
            }
          }
        }

        // Mark streaming complete
        setSession((prev) => ({
          ...prev,
          messages: prev.messages.map((m) =>
            m.id === assistantMsgId ? { ...m, isStreaming: false } : m,
          ),
          updatedAt: Date.now(),
        }));
      } catch (err: unknown) {
        if ((err as Error).name === 'AbortError') return;

        const errMsg = (err as Error).message ?? 'خطایی رخ داد. لطفاً دوباره تلاش کنید.';
        setError(errMsg);

        // Add error message bubble
        addMessage(
          createMessage('assistant', errMsg, session.mode, {
            isError: true,
          }),
        );
      } finally {
        setIsLoading(false);
        setIsStreaming(false);
        streamingMessageIdRef.current = null;
      }
    },
    [session, isLoading, addMessage, updateLastAssistantMessage],
  );

  const clearChat = useCallback(() => {
    abortControllerRef.current?.abort();
    setSession(createSession(session.mode));
    setError(null);
    setEmergencyAction(null);
    setIsLoading(false);
    setIsStreaming(false);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch { /* ignore */ }
  }, [session.mode]);

  const setMode = useCallback((mode: ChatMode) => {
    setSession((prev) => ({ ...prev, mode }));
  }, []);

  const cancelStream = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsLoading(false);
    setIsStreaming(false);
  }, []);

  return {
    session,
    messages: session.messages,
    mode: session.mode,
    isLoading,
    isStreaming,
    error,
    emergencyAction,
    sendMessage,
    clearChat,
    setMode,
    cancelStream,
    dismissEmergency: () => setEmergencyAction(null),
  };
}
