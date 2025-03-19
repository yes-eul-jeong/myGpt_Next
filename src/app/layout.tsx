// src/app/layout.tsx
import { SystemProvider } from '../context/SystemContext';
import { Noto_Sans_KR } from 'next/font/google';
import './globals.css';



const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"], // 라틴 문자 서브셋을 포함
});


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${notoSansKr.variable} antialiased`}>
        <SystemProvider>
          {children}
        </SystemProvider> 
      </body>
    </html>
  );
}
