// =====================================================================
//  Hamdam – Response Engine
//  Generates contextual, natural-sounding Persian responses from
//  the knowledge base without any external AI API.
//
//  Features:
//  - Context-aware follow-ups
//  - Response variation to avoid repetition
//  - Medical disclaimer injection
//  - Graceful fallback for unknown queries
// =====================================================================

import { type KBEntry } from './knowledgeBase';
import { type ClassifierResult } from './intentClassifier';

const MEDICAL_DISCLAIMER =
  '\n\n---\n*⚕️ این اطلاعات آموزشی است و جایگزین مشاوره پزشک نمی‌شود. در صورت نگرانی با پزشک مشورت کنید.*';

// ── Empathy openers ────────────────────────────────────────────────────
// Rotated to avoid robotic repetition

const EMPATHY_OPENERS = [
  'متوجه شدم. ',
  'ممنون که به اشتراک گذاشتید. ',
  'این موضوع مهمی است. ',
  '',
  '',
  '',
];

const FOLLOW_UP_PROMPTS = [
  '\n\nآیا سوال دیگری دارید؟',
  '\n\nاگر علائم دیگری دارید، بپرسید.',
  '\n\nاگر سوال خاص‌تری دارید، بگویید.',
  '',
];

const UNKNOWN_RESPONSES = [
  `متأسفم، پاسخ دقیقی برای این سوال در پایگاه دانش من وجود ندارد.

می‌توانم در موارد زیر کمک کنم:
- سرماخوردگی، تب، سردرد
- فشار خون، دیابت، تیروئید
- اضطراب، افسردگی، بی‌خوابی
- کمردرد، مشکلات گوارشی
- کمک‌های اولیه
- تغذیه و ورزش

لطفاً سوال دیگری بپرسید یا **با پزشک یا داروساز مشورت کنید**.`,

  `پاسخ این سوال خارج از حوزه اطلاعات فعلی من است.

برای اطلاعات پزشکی دقیق‌تر:
- **پزشک عمومی** نزدیک خود را ببینید
- با **خط ۱۴۹۰** (اورژانس اجتماعی) مشورت کنید
- پایگاه اطلاعاتی **webmd.com** یا **mayoclinic.org** را بررسی کنید

سوال دیگری دارید؟`,
];

// ── Session-level counter for variation ──────────────────────────────

let openerIndex = 0;
let fallbackIndex = 0;

function pickOpener(): string {
  const v = EMPATHY_OPENERS[openerIndex % EMPATHY_OPENERS.length];
  openerIndex++;
  return v;
}

function pickFallback(): string {
  const v = UNKNOWN_RESPONSES[fallbackIndex % UNKNOWN_RESPONSES.length];
  fallbackIndex++;
  return v;
}

function pickFollowUp(): string {
  return FOLLOW_UP_PROMPTS[Math.floor(Math.random() * FOLLOW_UP_PROMPTS.length)];
}

// ── Main response builder ─────────────────────────────────────────────

export interface GeneratedResponse {
  content: string;
  safetyLevel: 'safe' | 'caution' | 'emergency';
  followUps?: string[];
  entryId?: string;
}

export function generateResponse(
  classifierResult: ClassifierResult,
  mode: 'medical' | 'software',
  _userMessage: string,
): GeneratedResponse {
  const { entry, confidence } = classifierResult;

  // No match or low confidence → fallback
  if (!entry || confidence < 0.25) {
    return {
      content: pickFallback(),
      safetyLevel: 'safe',
    };
  }

  // Build response
  let content = '';

  // Add empathy opener for medical responses (not for greetings or software)
  if (mode === 'medical' && entry.category !== 'greeting') {
    content += pickOpener();
  }

  content += entry.response;

  // Add safety note if present
  if (entry.safetyNote) {
    content += `\n\n> ⚠️ **توجه:** ${entry.safetyNote}`;
  }

  // Add medical disclaimer
  if (entry.addDisclaimer && mode === 'medical') {
    content += MEDICAL_DISCLAIMER;
  }

  // Soft follow-up prompt for non-greeting entries
  if (entry.category !== 'greeting') {
    content += pickFollowUp();
  }

  // Determine safety level
  let safetyLevel: GeneratedResponse['safetyLevel'] = 'safe';
  if (entry.safetyNote) {
    safetyLevel = entry.safetyNote.includes('اورژانس') ? 'emergency' : 'caution';
  } else if (entry.addDisclaimer) {
    safetyLevel = 'caution';
  }

  return {
    content,
    safetyLevel,
    followUps: entry.followUps,
    entryId: entry.id,
  };
}

// ── Streamed simulation ───────────────────────────────────────────────

/**
 * Split a response string into chunks for simulated streaming.
 * Groups characters naturally (word by word with some variation).
 */
export function* streamChunks(text: string): Generator<string> {
  // Split at word boundaries including Persian spacing
  const words = text.split(/(?<= )|(?=[\n])/);

  for (const word of words) {
    // Yield in small chunks for natural feel
    if (word.length <= 4) {
      yield word;
    } else {
      // Split longer words into 2-4 char pieces
      let i = 0;
      while (i < word.length) {
        const chunkSize = 2 + Math.floor(Math.random() * 3);
        yield word.slice(i, i + chunkSize);
        i += chunkSize;
      }
    }
  }
}
