// =====================================================================
//  Hamdam – Custom Icon Library
//  All icons are hand-crafted SVGs. No system icons, no emoji, no fonts.
//  Every icon follows the same 24×24 viewBox grid.
// =====================================================================

import React from 'react';

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
  'aria-hidden'?: boolean;
}

const defaultProps: Required<Pick<IconProps, 'size' | 'color' | 'strokeWidth'>> = {
  size: 24,
  color: 'currentColor',
  strokeWidth: 1.8,
};

// ── Helper wrapper ─────────────────────────────────────────────────────

function Icon({
  size,
  className,
  ariaHidden = true,
  children,
}: {
  size: number;
  className?: string;
  ariaHidden?: boolean;
  children: React.ReactNode;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden={ariaHidden}
    >
      {children}
    </svg>
  );
}

// ── Heart (medical/care) ───────────────────────────────────────────────

export function HeartIcon({ size = 24, color = 'currentColor', strokeWidth = 1.8, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <path
        d="M12 21C12 21 3 14.5 3 8.5C3 5.46 5.46 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.54 3 23 5.46 23 8.5C23 14.5 14 21 12 21Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}

// ── Stethoscope (doctor/medical mode) ─────────────────────────────────

export function StethoscopeIcon({ size = 24, color = 'currentColor', strokeWidth = 1.8, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <path
        d="M4.5 6.5C4.5 4.567 6.067 3 8 3C9.933 3 11.5 4.567 11.5 6.5V12C11.5 14.485 13.515 16.5 16 16.5C18.485 16.5 20.5 14.485 20.5 12V10"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <circle cx="20.5" cy="8.5" r="1.5" stroke={color} strokeWidth={strokeWidth} />
      <path
        d="M6.5 6.5H9.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <circle cx="8" cy="19" r="2.5" stroke={color} strokeWidth={strokeWidth} />
      <path
        d="M8 16.5V16"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Icon>
  );
}

// ── Monitor/Screen (software mode) ────────────────────────────────────

export function MonitorIcon({ size = 24, color = 'currentColor', strokeWidth = 1.8, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <rect x="2" y="3" width="20" height="14" rx="2.5" stroke={color} strokeWidth={strokeWidth} />
      <path d="M8 21H16M12 17V21" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M7 8L10 11L7 14" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 14H17" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Icon>
  );
}

// ── Send (message send button) ────────────────────────────────────────

export function SendIcon({ size = 24, color = 'currentColor', strokeWidth = 1.8, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <path
        d="M22 2L11 13"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 2L15 22L11 13L2 9L22 2Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}

// ── Stop square (stop streaming) ──────────────────────────────────────

export function StopIcon({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <rect x="6" y="6" width="12" height="12" rx="2.5" fill={color} />
    </Icon>
  );
}

// ── Trash / Delete (clear chat) ───────────────────────────────────────

export function TrashIcon({ size = 24, color = 'currentColor', strokeWidth = 1.8, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <path d="M3 6H21" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M8 6V4H16V6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M19 6L18 20H6L5 6"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M10 11V17M14 11V17" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Icon>
  );
}

// ── Warning triangle (caution/emergency) ──────────────────────────────

export function WarningIcon({ size = 24, color = 'currentColor', strokeWidth = 1.8, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <path
        d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 9V13" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <circle cx="12" cy="17" r="0.5" fill={color} stroke={color} strokeWidth={1} />
    </Icon>
  );
}

// ── Siren / Alert (emergency modal) ──────────────────────────────────

export function SirenIcon({ size = 24, color = 'currentColor', strokeWidth = 1.8, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <path d="M12 2L12 5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M4.22 4.22L6.34 6.34" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M19.78 4.22L17.66 6.34" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path
        d="M7 14H17C17 10.13 14.87 7 12 7C9.13 7 7 10.13 7 14Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="5" y="14" width="14" height="3" rx="1.5" stroke={color} strokeWidth={strokeWidth} />
      <path d="M9 17V19M15 17V19" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Icon>
  );
}

// ── Phone (emergency call) ─────────────────────────────────────────────

export function PhoneIcon({ size = 24, color = 'currentColor', strokeWidth = 1.8, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <path
        d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8a19.79 19.79 0 01-3.07-8.7A2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006 6l1.27-.57a2 2 0 012.11.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(1 1)"
      />
    </Icon>
  );
}

// ── User (user avatar) ─────────────────────────────────────────────────

export function UserIcon({ size = 24, color = 'currentColor', strokeWidth = 1.8, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <circle cx="12" cy="8" r="4" stroke={color} strokeWidth={strokeWidth} />
      <path
        d="M4 21C4 17.13 7.58 14 12 14C16.42 14 20 17.13 20 21"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Icon>
  );
}

// ── Bot / AI assistant (assistant avatar) ─────────────────────────────

export function BotIcon({ size = 24, color = 'currentColor', strokeWidth = 1.8, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <rect x="3" y="8" width="18" height="12" rx="3" stroke={color} strokeWidth={strokeWidth} />
      <path d="M12 3V8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <circle cx="12" cy="3" r="1.5" stroke={color} strokeWidth={strokeWidth} />
      <circle cx="8.5" cy="13" r="1.5" fill={color} />
      <circle cx="15.5" cy="13" r="1.5" fill={color} />
      <path d="M9 17.5C9.83 18.17 10.87 18.5 12 18.5C13.13 18.5 14.17 18.17 15 17.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M3 13H1M21 13H23" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Icon>
  );
}

// ── Close / X ─────────────────────────────────────────────────────────

export function CloseIcon({ size = 24, color = 'currentColor', strokeWidth = 1.8, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <path d="M18 6L6 18M6 6L18 18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Icon>
  );
}

// ── Check (success) ───────────────────────────────────────────────────

export function CheckIcon({ size = 24, color = 'currentColor', strokeWidth = 2, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <path d="M20 6L9 17L4 12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

// ── Sparkle (AI / intelligent) ────────────────────────────────────────

export function SparkleIcon({ size = 24, color = 'currentColor', strokeWidth = 1.8, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <path
        d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M19 19L19.5 20.5L21 21L19.5 21.5L19 23L18.5 21.5L17 21L18.5 20.5L19 19Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M5 5L5.5 6.5L7 7L5.5 7.5L5 9L4.5 7.5L3 7L4.5 6.5L5 5Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}

// ── Pill / Medicine ───────────────────────────────────────────────────

export function PillIcon({ size = 24, color = 'currentColor', strokeWidth = 1.8, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <path
        d="M4.5 15.5L15.5 4.5A4.95 4.95 0 0122.5 11.5L11.5 22.5A4.95 4.95 0 014.5 15.5Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path d="M8.5 19.5L19.5 8.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Icon>
  );
}

// ── Calendar (appointment) ────────────────────────────────────────────

export function CalendarIcon({ size = 24, color = 'currentColor', strokeWidth = 1.8, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <rect x="3" y="4" width="18" height="18" rx="2.5" stroke={color} strokeWidth={strokeWidth} />
      <path d="M16 2V6M8 2V6M3 10H21" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <circle cx="8" cy="14.5" r="1" fill={color} />
      <circle cx="12" cy="14.5" r="1" fill={color} />
      <circle cx="16" cy="14.5" r="1" fill={color} />
    </Icon>
  );
}

// ── Activity / Pulse ──────────────────────────────────────────────────

export function ActivityIcon({ size = 24, color = 'currentColor', strokeWidth = 1.8, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <polyline
        points="22 12 18 12 15 21 9 3 6 12 2 12"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}

// ── Info ──────────────────────────────────────────────────────────────

export function InfoIcon({ size = 24, color = 'currentColor', strokeWidth = 1.8, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth={strokeWidth} />
      <path d="M12 16V12M12 8H12.01" stroke={color} strokeWidth={strokeWidth + 0.4} strokeLinecap="round" />
    </Icon>
  );
}

// ── Arrow right (suggestion chip) ─────────────────────────────────────

export function ChevronLeftIcon({ size = 24, color = 'currentColor', strokeWidth = 1.8, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <path d="M15 18L9 12L15 6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

// ── Copy ──────────────────────────────────────────────────────────────

export function CopyIcon({ size = 24, color = 'currentColor', strokeWidth = 1.8, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <rect x="9" y="9" width="13" height="13" rx="2" stroke={color} strokeWidth={strokeWidth} />
      <path
        d="M5 15H4C2.9 15 2 14.1 2 13V4C2 2.9 2.9 2 4 2H13C14.1 2 15 2.9 15 4V5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Icon>
  );
}

// ── Refresh / New chat ────────────────────────────────────────────────

export function RefreshIcon({ size = 24, color = 'currentColor', strokeWidth = 1.8, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <polyline points="1 4 1 10 7 10" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M3.51 15a9 9 0 102.13-9.36L1 10"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}

// ── Hamdam Logo Mark (heart + open hand) ─────────────────────────────

export function HamdamLogoMark({
  size = 48,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="lgHand" x1="10" y1="20" x2="48" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7dd3fc" />
          <stop offset="1" stopColor="#0ea5e9" />
        </linearGradient>
        <linearGradient id="lgHeart" x1="16" y1="18" x2="48" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38bdf8" />
          <stop offset="1" stopColor="#0369a1" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Open hand / palm – cupping upward */}
      {/* Thumb */}
      <path
        d="M14 35 C12 30 11 25 13 22 C15 19 18 19 20 22"
        stroke="url(#lgHand)" strokeWidth="3.5" strokeLinecap="round" fill="none"
      />
      {/* Index finger */}
      <path
        d="M20 22 L20 16 C20 14 22 13 24 14 L24 20"
        stroke="url(#lgHand)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
      {/* Middle finger */}
      <path
        d="M24 20 L24 14 C24 12 26 11 28 12 L28 20"
        stroke="url(#lgHand)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
      {/* Ring finger */}
      <path
        d="M28 20 L28 15 C28 13 30 12 32 13 L32 20"
        stroke="url(#lgHand)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
      {/* Little finger */}
      <path
        d="M32 20 L32 17 C32 15 34 14 36 15 L36 22"
        stroke="url(#lgHand)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
      {/* Palm arc */}
      <path
        d="M14 35 C13 42 17 48 24 50 L32 51 C40 51 47 45 48 38 L48 22 C48 20 46 19 44 20 L44 28"
        stroke="url(#lgHand)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
      {/* Connect fingers to palm */}
      <path
        d="M20 22 L20 28 M24 20 L24 28 M28 20 L28 28 M32 20 L32 28 M36 22 L36 28"
        stroke="url(#lgHand)" strokeWidth="3.5" strokeLinecap="round" fill="none"
      />

      {/* Heart nestled in the palm */}
      <path
        d="M32 42 C32 42 20 34 20 27.5 C20 23.9 22.7 21 26 21 C28 21 29.8 22 31 23.5 C32.2 22 34 21 36 21 C39.3 21 42 23.9 42 27.5 C42 34 32 42 32 42Z"
        fill="url(#lgHeart)"
        filter="url(#glow)"
      />
      {/* Heart highlight */}
      <ellipse cx="27.5" cy="25" rx="3" ry="1.8" fill="white" opacity="0.30" transform="rotate(-15 27.5 25)" />
    </svg>
  );
}

// ── Emergency cross ───────────────────────────────────────────────────

export function EmergencyCrossIcon({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <rect x="2" y="2" width="20" height="20" rx="4" fill={color} />
      <path d="M12 7V17M7 12H17" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    </Icon>
  );
}

// ── Lungs (respiratory) ───────────────────────────────────────────────

export function LungsIcon({ size = 24, color = 'currentColor', strokeWidth = 1.8, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <path d="M12 3V12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path
        d="M12 12C12 12 4 13 4 18C4 20 5.5 21.5 7.5 21.5C9.5 21.5 11 20 11 18V16"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d="M12 12C12 12 20 13 20 18C20 20 18.5 21.5 16.5 21.5C14.5 21.5 13 20 13 18V16"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path d="M9 16C9 16 7 15 6 17" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M15 16C15 16 17 15 18 17" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Icon>
  );
}

// ── Thermometer ────────────────────────────────────────────────────────

export function ThermometerIcon({ size = 24, color = 'currentColor', strokeWidth = 1.8, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <path
        d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}

// ── Question mark bubble ──────────────────────────────────────────────

export function QuestionBubbleIcon({ size = 24, color = 'currentColor', strokeWidth = 1.8, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <path
        d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <circle cx="12" cy="17" r="0.5" fill={color} />
    </Icon>
  );
}
