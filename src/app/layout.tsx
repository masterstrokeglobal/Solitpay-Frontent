"use client";
import { Plus_Jakarta_Sans } from 'next/font/google';
import "./globals.css";
import QueryProvider from '@/lib/query-provider';
import { Toaster } from 'sonner';
import { UserProvider } from '@/context/auth-context';
import { appName } from '@/lib/utils';



const plusJarkartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jarkarta-sans',
})



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>{appName} - All in one payment solution</title>
        <script src="https://unpkg.com/@bitjson/qr-code@1.0.2/dist/qr-code.js"></script>
      </head>
      <body
        className={`${plusJarkartaSans.variable} antialiased`}
      >
        <Toaster richColors />
        <UserProvider>
          <QueryProvider>
            {children}
          </QueryProvider>
        </UserProvider>
      </body>
    </html>
  );
}
