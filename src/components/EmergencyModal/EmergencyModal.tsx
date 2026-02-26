'use client';

import React, { useEffect } from 'react';
import type { EmergencyAction } from '@/types';
import styles from './EmergencyModal.module.scss';
import { SirenIcon, PhoneIcon, CloseIcon } from '@/components/Icons';

interface EmergencyModalProps {
  action: EmergencyAction;
  onDismiss: () => void;
}

const actionConfig: Record<EmergencyAction['type'], { label: string }> = {
  call_emergency:    { label: 'تماس با اورژانس ۱۱۵' },
  call_poison_center: { label: 'تماس با مرکز مسمومیت' },
  visit_er:          { label: 'رفتن به اورژانس' },
  call_doctor:       { label: 'تماس با پزشک' },
};

export function EmergencyModal({ action, onDismiss }: EmergencyModalProps) {
  const config = actionConfig[action.type];

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onDismiss(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onDismiss]);

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="emergency-title"
      onClick={(e) => { if (e.target === e.currentTarget) onDismiss(); }}
    >
      <div className={styles.modal}>
        <div className={styles.modal__pulse} aria-hidden="true" />

        {/* Close */}
        <button className={styles.modal__closeBtn} onClick={onDismiss} aria-label="بستن">
          <CloseIcon size={18} />
        </button>

        {/* Icon */}
        <div className={styles.modal__icon} aria-hidden="true">
          <SirenIcon size={52} color="#ef4444" />
        </div>

        <h2 id="emergency-title" className={styles.modal__title}>
          توجه فوری
        </h2>

        <p className={styles.modal__message}>{action.message}</p>

        {action.phoneNumber && (
          <a
            href={`tel:${action.phoneNumber}`}
            className={styles.modal__callBtn}
            aria-label={`${config.label}: ${action.phoneNumber}`}
          >
            <PhoneIcon size={20} color="white" />
            {config.label}
            <strong dir="ltr">{action.phoneNumber}</strong>
          </a>
        )}

        <button className={styles.modal__dismissBtn} onClick={onDismiss}>
          متوجه شدم
        </button>
      </div>
    </div>
  );
}
