'use client';

import React from 'react';
import { useChat } from '@/features/chat/hooks/useChat';
import { Header } from '@/components/Header/Header';
import { ChatWindow } from '@/components/ChatWindow/ChatWindow';
import { ChatInput } from '@/components/ChatInput/ChatInput';
import { EmergencyModal } from '@/components/EmergencyModal/EmergencyModal';
import styles from './page.module.scss';
import { MEDICAL_SUGGESTIONS, SOFTWARE_SUGGESTIONS } from '@/features/chat/constants';

export default function HomePage() {
  const {
    messages,
    mode,
    isLoading,
    isStreaming,
    emergencyAction,
    sendMessage,
    clearChat,
    setMode,
    cancelStream,
    dismissEmergency,
  } = useChat('medical');

  const suggestions = mode === 'medical' ? MEDICAL_SUGGESTIONS : SOFTWARE_SUGGESTIONS;

  return (
    <div className={styles.app}>
      {/* Header */}
      <Header
        mode={mode}
        onModeChange={setMode}
        onClearChat={clearChat}
      />

      {/* Chat Area */}
      <div className={styles.app__chatArea}>
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          isStreaming={isStreaming}
          mode={mode}
        />

        <ChatInput
          onSend={sendMessage}
          isLoading={isLoading}
          isStreaming={isStreaming}
          onCancel={cancelStream}
          placeholder={
            mode === 'medical'
              ? 'علائم یا سوال پزشکی خود را بنویسید...'
              : 'مشکل فنی یا سوال خود را بنویسید...'
          }
          suggestions={messages.length === 0 ? suggestions : []}
        />
      </div>

      {/* Emergency Modal */}
      {emergencyAction && (
        <EmergencyModal action={emergencyAction} onDismiss={dismissEmergency} />
      )}

      {/* Footer */}
      <footer className={styles.app__footer}>
        <p>
          طراحی و توسعه توسط{' '}
          <strong>Fatemeh Satouri</strong>
          {' · '}
          ویژه افراد بالای ۱۸ سال
          {' · '}
          همدم v1.0
        </p>
      </footer>
    </div>
  );
}
