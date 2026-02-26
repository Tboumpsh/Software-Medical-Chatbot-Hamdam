// =====================================================================
//  Hamdam – Intent Classifier
//  Converts user messages to matching KB entries using:
//  1. Exact trigger keyword matching
//  2. Partial / fuzzy matching
//  3. Context-aware follow-up detection
//  All runs locally. No external API required.
// =====================================================================

import { KNOWLEDGE_BASE, type KBEntry, type KBCategory } from './knowledgeBase';

export interface ClassifierResult {
  entry: KBEntry | null;
  confidence: number;           // 0-1
  matchedKeywords: string[];
  isFollowUp: boolean;
  category: KBCategory;
}

// Words that don't add meaning (stop words in Persian)
const STOP_WORDS = new Set([
  'من', 'تو', 'ما', 'آن', 'این', 'که', 'را', 'با', 'در', 'از', 'به', 'برای',
  'یک', 'هم', 'هست', 'است', 'دارم', 'میخوام', 'می‌خواهم', 'کنید', 'کن',
  'لطفا', 'لطفاً', 'ممنون', 'خواهش', 'می', 'ای', 'ه', 'رو', 'ام', 'ها',
  'بود', 'شد', 'شده', 'کرد', 'کنم', 'بکنم', 'چیست', 'چیه', 'چه', 'کجا',
  'چطور', 'چگونه', 'چرا', 'آیا', 'ممکنه', 'ممکن', 'باشه', 'باشد',
]);

/**
 * Normalize Persian text for matching:
 * - Unify Arabic/Persian letters
 * - Remove diacritics
 * - Remove punctuation
 * - Lowercase
 */
export function normalizePersian(text: string): string {
  return text
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/‌/g, ' ')       // zero-width non-joiner → space
    .replace(/[؟،.!?،,:;]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/**
 * Extract meaningful tokens from a message
 */
function tokenize(message: string): string[] {
  return normalizePersian(message)
    .split(' ')
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t));
}

/**
 * Score a KB entry against the normalized message
 */
function scoreEntry(
  entry: KBEntry,
  normalizedMsg: string,
  tokens: string[],
): { score: number; matched: string[] } {
  const matched: string[] = [];
  let score = 0;

  for (const trigger of entry.triggers) {
    const normalizedTrigger = normalizePersian(trigger);

    // Exact phrase match (highest value)
    if (normalizedMsg.includes(normalizedTrigger)) {
      score += 10;
      matched.push(trigger);
      continue;
    }

    // Token-level match
    const triggerTokens = tokenize(trigger);
    let tokenHits = 0;
    for (const tt of triggerTokens) {
      if (tokens.some((t) => t.includes(tt) || tt.includes(t))) {
        tokenHits++;
      }
    }

    if (tokenHits > 0) {
      score += (tokenHits / triggerTokens.length) * 5;
      if (tokenHits === triggerTokens.length) matched.push(trigger);
    }
  }

  // Boost by tag match
  for (const tag of entry.tags) {
    if (normalizedMsg.includes(normalizePersian(tag))) {
      score += 3;
    }
  }

  return { score, matched };
}

/**
 * Main classification function.
 * Returns the best-matching KB entry.
 */
export function classify(
  message: string,
  conversationHistory: Array<{ role: string; content: string }> = [],
): ClassifierResult {
  const normalizedMsg = normalizePersian(message);
  const tokens = tokenize(message);

  let bestEntry: KBEntry | null = null;
  let bestScore = 0;
  let bestMatched: string[] = [];

  for (const entry of KNOWLEDGE_BASE) {
    const { score, matched } = scoreEntry(entry, normalizedMsg, tokens);

    if (score > bestScore) {
      bestScore = score;
      bestEntry = entry;
      bestMatched = matched;
    }
  }

  // Detect follow-up from conversation history
  let isFollowUp = false;
  if (conversationHistory.length > 0 && tokens.length <= 3) {
    isFollowUp = true;
  }

  const confidence = bestScore > 0 ? Math.min(bestScore / 10, 1) : 0;

  return {
    entry: confidence > 0.2 ? bestEntry : null,
    confidence,
    matchedKeywords: bestMatched,
    isFollowUp,
    category: bestEntry?.category ?? 'unknown',
  };
}

/**
 * Detect which software/medical mode best fits the message
 */
export function detectMode(message: string): 'medical' | 'software' {
  const normalized = normalizePersian(message);

  const softwareKeywords = [
    'حساب کاربری', 'رمز عبور', 'ورود', 'ثبت‌نام', 'خطا', 'باگ',
    'اشتراک', 'پرداخت', 'فاکتور', 'تیکت', 'پشتیبانی', 'نرم‌افزار',
    'اپلیکیشن', 'سایت', 'لینک', 'login', 'password', 'account',
  ];

  const softwareScore = softwareKeywords.filter((k) =>
    normalized.includes(normalizePersian(k)),
  ).length;

  return softwareScore >= 2 ? 'software' : 'medical';
}
