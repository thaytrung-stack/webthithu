import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tạo đề thi AI',
  description: 'Tạo đề thi bằng AI Gemini',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body style={{ fontFamily: 'Arial, sans-serif' }}>{children}</body>
    </html>
  );
}
