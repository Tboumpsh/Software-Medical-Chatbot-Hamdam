import React from 'react';
import { BotIcon } from '@/components/Icons';
import styles from './TypingIndicator.module.scss';

export function TypingIndicator() {
  return (
    <div className={styles.indicator} role="status" aria-label="همدم در حال تایپ است">
      <div className={styles.indicator__avatar} aria-hidden="true">
        <BotIcon size={22} />
      </div>
      <div className={styles.indicator__dots}>
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}
