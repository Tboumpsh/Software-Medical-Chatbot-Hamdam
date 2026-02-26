// =====================================================================
//  Hamdam – Safety Check Utility
//  Critical: detect emergency symptoms and route appropriately
//  This runs BEFORE sending to the LLM
// =====================================================================

import type { SafetyCheckResult, EmergencyAction } from '@/types';

// Emergency keywords in Persian (Farsi)
const EMERGENCY_PATTERNS: Array<{
  patterns: RegExp[];
  action: EmergencyAction;
}> = [
  // ── Cardiac ──────────────────────────────────────────────────────────
  {
    patterns: [
      /درد\s*(شدید)?\s*قفسه\s*سینه/i,
      /chest\s*pain/i,
      /حمله\s*قلبی/i,
      /انفارکتوس/i,
      /سکته\s*قلبی/i,
    ],
    action: {
      type: 'call_emergency',
      message: 'علائم احتمالی حمله قلبی. فوراً با اورژانس تماس بگیرید.',
      phoneNumber: '115',
    },
  },
  // ── Stroke ────────────────────────────────────────────────────────────
  {
    patterns: [
      /سکته\s*مغزی/i,
      /فلج\s*(ناگهانی|یک\s*طرفه)/i,
      /صورت\s*(کج|افتاده)/i,
      /ضعف\s*(ناگهانی|یک\s*طرفه)/i,
      /مشکل\s*در\s*صحبت\s*کردن/i,
    ],
    action: {
      type: 'call_emergency',
      message: 'علائم احتمالی سکته مغزی. هر لحظه مهم است – فوراً با اورژانس تماس بگیرید.',
      phoneNumber: '115',
    },
  },
  // ── Breathing ─────────────────────────────────────────────────────────
  {
    patterns: [
      /تنگی\s*نفس\s*شدید/i,
      /نمی‌?توانم\s*نفس\s*بکشم/i,
      /خفگی/i,
      /آنافیلاکسی/i,
      /واکنش\s*آلرژیک\s*شدید/i,
    ],
    action: {
      type: 'call_emergency',
      message: 'مشکل تنفسی شدید. فوراً با اورژانس تماس بگیرید.',
      phoneNumber: '115',
    },
  },
  // ── Self-harm / Suicide ───────────────────────────────────────────────
  {
    patterns: [
      /می‌?خواهم\s*(خودم\s*را\s*بکشم|بمیرم)/i,
      /آسیب\s*به\s*خود/i,
      /خودکشی/i,
      /دیگر\s*نمی‌?خواهم\s*زندگی/i,
    ],
    action: {
      type: 'call_emergency',
      message: 'در صورت بحران اضطراری با اورژانس اجتماعی تماس بگیرید.',
      phoneNumber: '123',
    },
  },
  // ── Poisoning ─────────────────────────────────────────────────────────
  {
    patterns: [
      /مسموم(یت)?/i,
      /قرص\s*خورده/i,
      /بلع\s*(تصادفی|سم)/i,
      /سم\s*خورده/i,
    ],
    action: {
      type: 'call_poison_center',
      message: 'در موارد مسمومیت فوراً با مرکز کنترل مسمومیت تماس بگیرید.',
      phoneNumber: '021-66402000',
    },
  },
  // ── Severe bleeding ───────────────────────────────────────────────────
  {
    patterns: [
      /خونریزی\s*شدید/i,
      /خون\s*(زیادی|متوقف\s*نمی‌?شود)/i,
    ],
    action: {
      type: 'call_emergency',
      message: 'خونریزی شدید – فوراً با اورژانس تماس بگیرید.',
      phoneNumber: '115',
    },
  },
];

// Yellow-flag keywords: require caution disclaimer but not emergency
const CAUTION_PATTERNS: RegExp[] = [
  /تب\s*(بالا|شدید)/i,
  /سردرد\s*شدید/i,
  /درد\s*شدید/i,
  /داروی\s*تجویزی/i,
  /دوز\s*(دارو|قرص)/i,
  /عوارض\s*دارو/i,
  /آنتی‌?بیوتیک/i,
];

/**
 * Performs safety triage on the user's message BEFORE it reaches the LLM.
 * Returns emergency action if crisis detected.
 */
export function checkSafety(message: string): SafetyCheckResult {
  const triggeredKeywords: string[] = [];

  // Check emergency patterns first (highest priority)
  for (const { patterns, action } of EMERGENCY_PATTERNS) {
    for (const pattern of patterns) {
      if (pattern.test(message)) {
        triggeredKeywords.push(pattern.source);
        return {
          level: 'emergency',
          triggeredKeywords,
          emergencyAction: action,
        };
      }
    }
  }

  // Check caution patterns
  for (const pattern of CAUTION_PATTERNS) {
    if (pattern.test(message)) {
      triggeredKeywords.push(pattern.source);
    }
  }

  if (triggeredKeywords.length > 0) {
    return {
      level: 'caution',
      triggeredKeywords,
    };
  }

  return {
    level: 'safe',
    triggeredKeywords: [],
  };
}

/**
 * Check if a message is asking for prescriptive medical advice
 * (which the bot must NOT provide)
 */
export function isPrescriptiveRequest(message: string): boolean {
  const prescriptivePatterns = [
    /چه\s*دارویی\s*(بخورم|بگیرم|استفاده\s*کنم)/i,
    /دوز\s*(دارو|قرص)\s*(چقدر|چه\s*مقدار)/i,
    /آیا\s*می‌?توانم\s*\w+\s*را\s*با\s*\w+\s*ترکیب\s*کنم/i,
    /چه\s*(درمانی|دارویی)\s*برای\s*من\s*مناسب\s*است/i,
  ];

  return prescriptivePatterns.some((p) => p.test(message));
}

/**
 * Redact potential PII/PHI from a string before logging.
 * This is a basic implementation – production should use a proper NER pipeline.
 */
export function redactSensitiveData(text: string): string {
  return text
    .replace(/\b\d{10,11}\b/g, '[شماره پنهان‌شده]')           // phone numbers
    .replace(/\b\d{3}-\d{4}-\d{4}\b/g, '[شماره پنهان‌شده]')   // formatted phone
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, '[ایمیل پنهان‌شده]') // email
    .replace(/\b\d{10}\b/g, '[شناسه پنهان‌شده]');               // national ID
}
