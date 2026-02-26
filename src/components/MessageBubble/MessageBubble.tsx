'use client';

import React, { useEffect, useRef } from 'react';
import type { ChatMessage } from '@/types';
import styles from './MessageBubble.module.scss';
import clsx from 'clsx';
import { markdownToSafeHtml } from '@/features/chat/utils/sanitize';
import { UserIcon, BotIcon, WarningIcon, InfoIcon } from '@/components/Icons';

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAssistant || !contentRef.current) return;
    if (typeof window !== 'undefined') {
      import('dompurify').then(({ default: DOMPurify }) => {
        if (contentRef.current) {
          const html = markdownToSafeHtml(message.content);
          contentRef.current.innerHTML = DOMPurify.sanitize(html, {
            ALLOWED_TAGS: ['p', 'strong', 'em', 'ul', 'ol', 'li', 'code', 'h2', 'h3', 'br', 'span', 'hr', 'blockquote'],
            ALLOWED_ATTR: ['class'],
          });
        }
      });
    }
  }, [message.content, isAssistant]);

  const timestamp = new Intl.DateTimeFormat('fa-IR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(message.timestamp));

  return (
    <div
      className={clsx(
        styles.bubble,
        isUser ? styles['bubble--user'] : styles['bubble--assistant'],
        message.safetyLevel === 'emergency' && styles['bubble--emergency'],
        message.safetyLevel === 'caution' && styles['bubble--caution'],
        message.isError && styles['bubble--error'],
        message.isStreaming && styles['bubble--streaming'],
      )}
      role="article"
      aria-label={isUser ? 'پیام شما' : 'پاسخ همدم'}
    >
      {/* Avatar */}
      <div className={clsx(styles.bubble__avatar, isUser && styles['bubble__avatar--user'])} aria-hidden="true">
        {isUser ? <UserIcon size={20} /> : <BotIcon size={20} />}
      </div>

      {/* Bubble content */}
      <div className={styles.bubble__content}>
        {/* Safety badge */}
        {message.safetyLevel === 'emergency' && (
          <div className={styles.bubble__badge} role="alert">
            <WarningIcon size={14} />
            هشدار اضطراری
          </div>
        )}
        {message.safetyLevel === 'caution' && (
          <div className={clsx(styles.bubble__badge, styles['bubble__badge--caution'])}>
            <InfoIcon size={14} />
            توجه پزشکی
          </div>
        )}

        {isUser ? (
          <p className={styles.bubble__text}>{message.content}</p>
        ) : (
          <div
            ref={contentRef}
            className={styles.bubble__markdown}
            aria-live={message.isStreaming ? 'polite' : undefined}
          >
            {message.content}
          </div>
        )}

        {message.isStreaming && (
          <span className={styles.bubble__cursor} aria-hidden="true" />
        )}

        <time
          className={styles.bubble__time}
          dateTime={new Date(message.timestamp).toISOString()}
          dir="ltr"
        >
          {timestamp}
        </time>
      </div>
    </div>
  );
}
