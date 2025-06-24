import type {Metadata} from 'next';
import { GeistSans, GeistMono } from 'geist/font';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'Inspectra - Web Vulnerability Scanner',
  description: 'Analyze domains for HTML, JS, and CSP vulnerabilities with Inspectra.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} dark`}>
      <body className={`antialiased font-sans`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
