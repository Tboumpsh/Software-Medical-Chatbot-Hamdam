'use client';

import React, { useState, useRef, useCallback } from 'react';
import styles from './ChatInput.module.scss';
import { CHAT_CONSTANTS } from '@/features/chat/constants';
import clsx from 'clsx';
import { SendIcon, StopIcon, ChevronLeftIcon } from '@/components/Icons';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  isStreaming: boolean;
  onCancel?: () => void;
  placeholder?: string;
  suggestions?: string[];
}

export function ChatInput({
  onSend,
  isLoading,
  isStreaming,
  onCancel,
  placeholder = 'پیام خود را بنویسید...',
  suggestions = [],
}: ChatInputProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const maxLen = CHAT_CONSTANTS.MAX_MESSAGE_LENGTH;

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setValue('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  }, [value, isLoading, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (val.length > maxLen) return;
    setValue(val);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  };

  const remaining = maxLen - value.length;
  const isNearLimit = remaining < 100;

  return (
    <div className={styles.inputArea}>
      {suggestions.length > 0 && !value && (
        <div className={styles.suggestions} role="list" aria-label="سوالات پیشنهادی">
          {suggestions.map((s) => (
            <button
              key={s}
              className={styles.suggestion}
              onClick={() => onSend(s)}
              disabled={isLoading}
              role="listitem"
            >
              <ChevronLeftIcon size={14} />
              {s}
            </button>
          ))}
        </div>
      )}

      <div className={styles.inputRow}>
        <div className={styles.textareaWrap}>
          <textarea
            ref={textareaRef}
            className={styles.textarea}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            disabled={isLoading && !isStreaming}
            aria-label="پیام شما"
            aria-multiline="true"
            dir="rtl"
          />
          {isNearLimit && (
            <span
              className={clsx(styles.charCount, remaining < 20 && styles['charCount--warn'])}
              aria-live="polite"
            >
              {remaining}
            </span>
          )}
        </div>

        {isStreaming ? (
          <button
            className={clsx(styles.sendBtn, styles['sendBtn--stop'])}
            onClick={onCancel}
            aria-label="توقف پاسخ"
            title="توقف"
          >
            <StopIcon size={18} />
          </button>
        ) : (
          <button
            className={clsx(styles.sendBtn, (!value.trim() || isLoading) && styles['sendBtn--disabled'])}
            onClick={handleSubmit}
            disabled={!value.trim() || isLoading}
            aria-label="ارسال پیام"
            title="ارسال (Enter)"
          >
            {isLoading ? (
              <span className={styles.spinner} aria-hidden="true" />
            ) : (
              <SendIcon size={20} color="white" />
            )}
          </button>
        )}
      </div>

      <p className={styles.disclaimer}>
        همدم جایگزین پزشک نیست. در موارد اضطراری با{' '}
        <a href="tel:115" className={styles.emergencyLink}>۱۱۵</a>{' '}
        تماس بگیرید.
      </p>
    </div>
  );
}
