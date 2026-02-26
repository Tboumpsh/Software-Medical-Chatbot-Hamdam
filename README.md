# 🤝 دستیار هوشمند پزشکی | Hamdam — همدم

> **دستیار هوشمند پزشکی | Intelligent Medical Assistant**
> *Fully local AI engine · No external API required · Persian-first*

<div align="center">

**Developer:** Fatemeh Satouri &nbsp;·&nbsp; **Version:** 2.0.0 &nbsp;·&nbsp; **Target:** Adults 18+ · فارسی

[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=nextdotjs)](https://nextjs.org)
[![No API Key](https://img.shields.io/badge/AI-100%25%20Local-22c55e)](.)
[![SCSS Modules](https://img.shields.io/badge/SCSS-Modules-CC6699?logo=sass)](https://sass-lang.com)

</div>

---

## درباره همدم

**همدم** یک دستیار اطلاعاتی پزشکی است که:

- **کاملاً محلی اجرا می‌شود** — هیچ کلید API یا سرویس خارجی لازم نیست
- موتور هوش مصنوعی داخلی با پایگاه دانش پزشکی فارسی
- طبقه‌بندی هوشمند قصد کاربر (intent classification)
- تشخیص موارد اضطراری قبل از هر پردازش دیگری
- دو حالت: **پزشکی** و **پشتیبانی نرم‌افزار**

---

## معماری موتور هوش مصنوعی محلی

```
src/lib/ai/
├── knowledgeBase.ts      پایگاه دانش پزشکی فارسی (20+ موضوع)
├── intentClassifier.ts   طبقه‌بندی قصد با تطبیق الگو
└── responseEngine.ts     تولید پاسخ طبیعی + streaming شبیه‌سازی‌شده
```

### نحوه کار

```
پیام کاربر
    │
    ▼
Safety Check (بررسی اورژانس – بدون API)
    │
    ├── Emergency → پاسخ فوری + شماره اورژانس
    │
    ▼
Intent Classifier
    ├── نرمال‌سازی متن فارسی
    ├── حذف stop words
    ├── امتیاز‌دهی به trigger keywords
    └── بهترین مطابقت
    │
    ▼
Response Engine
    ├── ساخت پاسخ از KB
    ├── افزودن یادآور پزشکی
    └── Streaming chunk-by-chunk
    │
    ▼
SSE به مرورگر (بدون وقفه، بدون API خارجی)
```

---

## موضوعات پایگاه دانش

| دسته | موضوعات |
|------|---------|
| علائم عمومی | سرماخوردگی، آنفولانزا، تب |
| قلب و عروق | فشار خون، تپش قلب |
| گوارش | درد معده، رفلاکس |
| تنفسی | آسم، تنگی نفس |
| غدد | دیابت، تیروئید |
| اسکلتی-عضلانی | کمردرد |
| سلامت روان | اضطراب، افسردگی، بی‌خوابی |
| کمک‌های اولیه | سوختگی، خونریزی، زخم |
| تغذیه | رژیم غذایی سالم |
| پیشگیری | ورزش، تحرک |
| دارو | اطلاعات عمومی (بدون تجویز) |
| پشتیبانی | ورود، مشکل فنی |

---

## ساختار پروژه

```
hamdam/
├── src/
│   ├── app/
│   │   ├── api/chat/route.ts      ← API بدون وابستگی خارجی
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── Icons/index.tsx        ← آیکون‌های SVG اختصاصی (بدون emoji)
│   │   ├── Logo/                  ← لوگوی قلب در دست
│   │   ├── Header/
│   │   ├── ChatWindow/
│   │   ├── MessageBubble/
│   │   ├── ChatInput/
│   │   ├── TypingIndicator/
│   │   └── EmergencyModal/
│   │
│   ├── features/chat/
│   │   ├── hooks/useChat.ts
│   │   └── utils/
│   │       ├── safetyCheck.ts     ← تشخیص اورژانس فارسی
│   │       └── sanitize.ts
│   │
│   ├── lib/
│   │   └── ai/
│   │       ├── knowledgeBase.ts   ← پایگاه دانش پزشکی
│   │       ├── intentClassifier.ts← طبقه‌بندی قصد
│   │       └── responseEngine.ts  ← تولید پاسخ
│   │
│   ├── styles/
│   │   ├── _variables.scss
│   │   └── _mixins.scss
│   └── types/index.ts
│
├── .env.example
├── package.json              ← بدون openai یا ai SDK
└── README.md
```

---

## شروع سریع

### پیش‌نیازها

- **Node.js** ≥ 18.17.0
- **npm** ≥ 9

> **هیچ کلید API خارجی لازم نیست.**

### ۱. Clone پروژه

```bash
git clone https://github.com/your-org/hamdam.git
cd hamdam
```

### ۲. نصب وابستگی‌ها

```bash
npm install
```

### ۳. تنظیم متغیرهای محیطی

```bash
cp .env.example .env.local
# فقط SESSION_SECRET را تنظیم کنید
```


## اجرای پروژه

```bash
# Development
npm run dev
# باز کنید: http://localhost:3000

# Build production
npm run build
npm run start

# Type check
npm run type-check

# Linting
npm run lint

# تست‌ها
npm run test

# تست‌های اضطراری (اجباری قبل از deploy)
npm run test -- safetyCheck
```

---

#
## سیستم طراحی

- **رنگ‌ها:** آبی آسمانی + سفید (آرامش‌بخش)
- **شکل:** گرد، شیشه‌ای، نرم (glassmorphism)
- **فونت:** Dana (فارسی) + Vazirmatn fallback
- **جهت:** RTL کامل
- **توکن‌ها:** `src/styles/_variables.scss`

---

## امنیت

- هیچ کلید API یا اطلاعات خارجی در سمت کلاینت نیست
- تشخیص اورژانس قبل از هر پردازش دیگری
- Zod validation برای همه ورودی‌ها
- DOMPurify برای sanitize کردن HTML
- Rate limiting برای جلوگیری از سوءاستفاده
- Security headers (CSP, HSTS, X-Frame-Options)
- Audit log بدون PHI

---


## مجوز

MIT © 2024 Fatemeh Satouri

---

