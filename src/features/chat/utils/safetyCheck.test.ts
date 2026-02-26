// =====================================================================
//  Hamdam – Safety Check Tests
//  Critical: these tests MUST pass before any deployment
// =====================================================================

import { describe, it, expect } from 'vitest';
import { checkSafety, isPrescriptiveRequest, redactSensitiveData } from '@/features/chat/utils/safetyCheck';

describe('checkSafety', () => {
  // ── Emergency detection ─────────────────────────────────────────────

  it('detects cardiac emergency keywords (Persian)', () => {
    const result = checkSafety('درد شدید قفسه سینه دارم');
    expect(result.level).toBe('emergency');
    expect(result.emergencyAction?.phoneNumber).toBe('115');
  });

  it('detects stroke keywords', () => {
    const result = checkSafety('یک طرف صورتم افتاده و نمی توانم صحبت کنم');
    expect(result.level).toBe('emergency');
  });

  it('detects self-harm intent', () => {
    const result = checkSafety('می خواهم خودم را بکشم');
    expect(result.level).toBe('emergency');
    expect(result.emergencyAction?.phoneNumber).toBe('123');
  });

  it('detects poisoning', () => {
    const result = checkSafety('مسمومیت با قارچ دارم');
    expect(result.level).toBe('emergency');
    expect(result.emergencyAction?.type).toBe('call_poison_center');
  });

  // ── Caution detection ───────────────────────────────────────────────

  it('flags medication dose questions as caution', () => {
    const result = checkSafety('دوز داروی مصرفی من چقدر باشد؟');
    expect(result.level).toBe('caution');
  });

  it('flags high fever as caution', () => {
    const result = checkSafety('تب بالا دارم');
    expect(result.level).toBe('caution');
  });

  // ── Safe messages ───────────────────────────────────────────────────

  it('marks general questions as safe', () => {
    const result = checkSafety('علائم سرماخوردگی چیست؟');
    expect(result.level).toBe('safe');
  });

  it('marks software questions as safe', () => {
    const result = checkSafety('نمی توانم وارد حساب کاربری شوم');
    expect(result.level).toBe('safe');
  });
});

describe('isPrescriptiveRequest', () => {
  it('detects drug prescription requests', () => {
    expect(isPrescriptiveRequest('چه دارویی بخورم؟')).toBe(true);
    expect(isPrescriptiveRequest('چه دوز دارویی بگیرم؟')).toBe(true);
  });

  it('allows general medical information', () => {
    expect(isPrescriptiveRequest('علائم فشار خون بالا چیست؟')).toBe(false);
    expect(isPrescriptiveRequest('دیابت چه نوع‌هایی دارد؟')).toBe(false);
  });
});

describe('redactSensitiveData', () => {
  it('redacts phone numbers', () => {
    const text = 'شماره من 09123456789 است';
    expect(redactSensitiveData(text)).not.toContain('09123456789');
    expect(redactSensitiveData(text)).toContain('[شماره پنهان‌شده]');
  });

  it('redacts email addresses', () => {
    const text = 'my email is user@example.com';
    expect(redactSensitiveData(text)).not.toContain('user@example.com');
  });

  it('leaves non-sensitive text unchanged', () => {
    const text = 'سردرد دارم و می خواهم کمک بگیرم';
    expect(redactSensitiveData(text)).toBe(text);
  });
});
