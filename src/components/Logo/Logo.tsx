// =====================================================================
//  Hamdam – Logo Component
//  A heart embraced by a hand (as specified in design brief)
// =====================================================================

import React from 'react';
import styles from './Logo.module.scss';
import clsx from 'clsx';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export function Logo({ size = 'md', showText = true, className }: LogoProps) {
  const sizeMap = { sm: 32, md: 44, lg: 56, xl: 72 };
  const px = sizeMap[size];

  return (
    <div className={clsx(styles.logo, styles[`logo--${size}`], className)}>
      {/* SVG: Heart embraced by a hand */}
      <svg
        width={px}
        height={px}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className={styles.logo__icon}
      >
        {/* Outer glow */}
        <defs>
          <radialGradient id="heartGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
          <linearGradient id="handGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7dd3fc" />
            <stop offset="100%" stopColor="#0ea5e9" />
          </linearGradient>
        </defs>

        {/* Glow background */}
        <circle cx="32" cy="32" r="30" fill="url(#heartGlow)" />

        {/* Hand – open/cupping shape (bottom arc) */}
        {/* Palm */}
        <path
          d="M12 38 C10 32, 10 28, 14 25 C16 23, 19 23, 21 25 L21 22 C21 20, 23 18, 25 19 C25 17, 27 15, 29 16 C29 14, 31 13, 33 14 L33 20 C35 18, 38 18, 39 21 L39 26 C41 24, 44 25, 44 28 L44 36 C44 42, 40 48, 34 50 L30 51 C22 51, 14 46, 12 38 Z"
          fill="url(#handGrad)"
          opacity="0.9"
        />

        {/* Heart – nestled in palm */}
        <path
          d="M32 38 C32 38, 22 31, 22 26 C22 22, 25 20, 28 21 C29.5 21.5, 31 22.5, 32 24 C33 22.5, 34.5 21.5, 36 21 C39 20, 42 22, 42 26 C42 31, 32 38, 32 38 Z"
          fill="url(#heartGrad)"
        />

        {/* Subtle shine on heart */}
        <ellipse
          cx="28"
          cy="24"
          rx="3"
          ry="2"
          fill="white"
          opacity="0.35"
          transform="rotate(-20 28 24)"
        />
      </svg>

      {showText && (
        <div className={styles.logo__text}>
          <span className={styles.logo__name}>همدم</span>
          {size !== 'sm' && (
            <span className={styles.logo__tagline}>دستیار هوشمند</span>
          )}
        </div>
      )}
    </div>
  );
}
