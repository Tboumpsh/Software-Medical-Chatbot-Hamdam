// =====================================================================
//  Hamdam – Chat Constants
// =====================================================================

export const CHAT_CONSTANTS = {
  MAX_MESSAGE_LENGTH: 1000,
  MAX_HISTORY_LENGTH: 20,    // Keep last N messages for context
  STREAM_CHUNK_DELAY: 0,     // ms between chunks (0 = max speed)
  SESSION_TIMEOUT_MS: 30 * 60 * 1000,  // 30 minutes
} as const;

// ── Disclaimer Messages (Persian) ─────────────────────────────────────

export const DISCLAIMERS = {
  medical: 'همدم یک دستیار اطلاعاتی است و جایگزین پزشک نمی‌شود. در موارد اضطراری با ۱۱۵ تماس بگیرید.',
  greeting: 'سلام! من همدم هستم، دستیار اطلاعاتی پزشکی شما. می‌توانم اطلاعات کلی درباره علائم و مراقبت‌های بهداشتی ارائه دهم. لطفاً توجه داشته باشید که این اطلاعات جایگزین مشاوره پزشک نمی‌شود.',
  emergency: '⚠️ این علائم نیاز به توجه فوری دارند. لطفاً با اورژانس یا پزشک تماس بگیرید.',
  prescriptive: 'من نمی‌توانم داروی خاصی تجویز کنم یا توصیه دوز دارویی بدهم. لطفاً با پزشک یا داروساز خود مشورت کنید.',
} as const;

// ── Suggested Questions ───────────────────────────────────────────────

export const MEDICAL_SUGGESTIONS = [
  'علائم سرماخوردگی چیست؟',
  'چه زمانی باید به اورژانس بروم؟',
  'راه‌های کنترل فشار خون بالا',
  'علائم دیابت نوع ۲',
  'چطور سردرد میگرن را مدیریت کنم؟',
];

export const SOFTWARE_SUGGESTIONS = [
  'نمی‌توانم وارد حساب کاربری‌ام شوم',
  'چطور اشتراک خود را مدیریت کنم؟',
  'گزارش یک مشکل فنی',
  'راهنمای شروع کار',
];

// ── Emergency Numbers ─────────────────────────────────────────────────

export const EMERGENCY_CONTACTS = {
  ir_emergency: { label: 'اورژانس', number: '115' },
  ir_social_emergency: { label: 'اورژانس اجتماعی', number: '123' },
  ir_police: { label: 'پلیس', number: '110' },
  ir_poison_center: { label: 'مرکز مسمومیت', number: '021-66402000' },
} as const;
