'use client';

import React, { useEffect, useRef } from 'react';
import type { ChatMessage, ChatMode } from '@/types';
import { MessageBubble } from '@/components/MessageBubble/MessageBubble';
import { TypingIndicator } from '@/components/TypingIndicator/TypingIndicator';
import { HamdamLogoMark, SparkleIcon, StethoscopeIcon, MonitorIcon } from '@/components/Icons';
import { DISCLAIMERS, MEDICAL_SUGGESTIONS, SOFTWARE_SUGGESTIONS } from '@/features/chat/constants';
import styles from './ChatWindow.module.scss';

interface ChatWindowProps {
  messages: ChatMessage[];
  isLoading: boolean;
  isStreaming: boolean;
  mode: ChatMode;
}

export function ChatWindow({ messages, isLoading, isStreaming, mode }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isLoading]);

  const isEmpty = messages.length === 0;
  const suggestions = mode === 'medical' ? MEDICAL_SUGGESTIONS : SOFTWARE_SUGGESTIONS;
  const ModeIcon = mode === 'medical' ? StethoscopeIcon : MonitorIcon;

  return (
    <div
      className={styles.window}
      role="log"
      aria-label="گفتگو"
      aria-live="polite"
      aria-atomic="false"
    >
      {isEmpty && (
        <div className={styles.welcome}>
          {/* Animated logo mark */}
          <div className={styles.welcome__logoWrap} aria-hidden="true">
            <HamdamLogoMark size={88} className={styles.welcome__logo} />
            <div className={styles.welcome__sparkles} aria-hidden="true">
              <SparkleIcon size={16} className={styles.welcome__sparkle1} />
              <SparkleIcon size={12} className={styles.welcome__sparkle2} />
              <SparkleIcon size={10} className={styles.welcome__sparkle3} />
            </div>
          </div>

          <h2 className={styles.welcome__title}>سلام! من همدم هستم</h2>
          <p className={styles.welcome__body}>{DISCLAIMERS.greeting}</p>

          <div className={styles.welcome__chips}>
            <p className={styles.welcome__chipsLabel}>سوالات متداول:</p>
            <div className={styles.welcome__chipList}>
              {suggestions.slice(0, 4).map((s) => (
                <div key={s} className={styles.welcome__chip}>{s}</div>
              ))}
            </div>
          </div>

          <div className={styles.welcome__modeBadge}>
            <ModeIcon size={16} />
            <span>{mode === 'medical' ? 'حالت پزشکی' : 'حالت پشتیبانی'}</span>
          </div>
        </div>
      )}

      <div className={styles.messages}>
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isLoading && !isStreaming && (
          <div className={styles.typingWrap}>
            <TypingIndicator />
          </div>
        )}
      </div>

      <div ref={bottomRef} aria-hidden="true" />
    </div>
  );
}
