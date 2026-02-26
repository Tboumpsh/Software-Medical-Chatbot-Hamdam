import type { Metadata, Viewport } from 'next';
import './globals.scss';

export const metadata: Metadata = {
  title: 'همدم – دستیار هوشمند پزشکی',
  description:
    'همدم – دستیار هوشمند برای دریافت اطلاعات پزشکی سریع و قابل اعتماد. مناسب برای افراد بالای ۱۸ سال.',
  applicationName: 'Hamdam',
  authors: [{ name: 'Fatemeh Satouri' }],
  creator: 'Fatemeh Satouri',
  keywords: [
    'دستیار پزشکی',
    'چت‌بات پزشکی',
    'اطلاعات پزشکی',
    'سلامت',
    'همدم',
    'Hamdam',
  ],
  robots: {
    index: false,  // Medical apps should not be indexed broadly
    follow: false,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'همدم – دستیار هوشمند پزشکی',
    description: 'دریافت اطلاعات پزشکی سریع و قابل اعتماد',
    type: 'website',
    locale: 'fa_IR',
    siteName: 'Hamdam',
  },
};

export const viewport: Viewport = {
  themeColor: '#0ea5e9',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {/* Accessibility: Skip to main content */}
        <a className="skip-link" href="#main-content">
          رفتن به محتوای اصلی
        </a>
        <main id="main-content" role="main">
          {children}
        </main>
      </body>
    </html>
  );
}
