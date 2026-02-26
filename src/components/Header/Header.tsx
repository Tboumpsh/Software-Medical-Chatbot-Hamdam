'use client';

import React from 'react';
import { Logo } from '@/components/Logo/Logo';
import { StethoscopeIcon, MonitorIcon, TrashIcon } from '@/components/Icons';
import styles from './Header.module.scss';
import type { ChatMode } from '@/types';
import clsx from 'clsx';

interface HeaderProps {
  mode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
  onClearChat: () => void;
}

export function Header({ mode, onModeChange, onClearChat }: HeaderProps) {
  return (
    <header className={styles.header} role="banner">
      <div className={styles.header__inner}>
        <Logo size="md" showText={true} />

        <nav className={styles.header__nav} aria-label="حالت دستیار">
          <button
            className={clsx(styles.modeBtn, mode === 'medical' && styles['modeBtn--active'])}
            onClick={() => onModeChange('medical')}
            aria-pressed={mode === 'medical'}
          >
            <StethoscopeIcon size={18} />
            <span>پزشکی</span>
          </button>
          <button
            className={clsx(styles.modeBtn, mode === 'software' && styles['modeBtn--active'])}
            onClick={() => onModeChange('software')}
            aria-pressed={mode === 'software'}
          >
            <MonitorIcon size={18} />
            <span>پشتیبانی</span>
          </button>
        </nav>

        <div className={styles.header__actions}>
          <button
            className={styles.clearBtn}
            onClick={onClearChat}
            aria-label="پاک کردن گفتگو"
            title="پاک کردن گفتگو"
          >
            <TrashIcon size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
