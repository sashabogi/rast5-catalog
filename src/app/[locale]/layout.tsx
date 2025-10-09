import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n';
import { Navbar } from "@/components/Navbar";
import { AOSInit } from "@/components/AOSInit";
import { AuthProvider } from "@/lib/auth/AuthProvider";
import "../css/style.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "RAST 5 Connector Catalog",
  description: "Professional catalog for RAST 5 electrical connectors with detailed specifications, compatibility information, and 360° views",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as typeof locales[number])) {
    notFound();
  }

  // Providing all messages to the client side is the easiest way to get started
  const messages = await getMessages({ locale });

  return (
    <html lang={locale}>
      <body
        className={`${inter.variable} font-inter antialiased bg-white text-slate-800 tracking-tight`}
      >
        <AuthProvider>
          <NextIntlClientProvider messages={messages} locale={locale}>
            <AOSInit />
            <Navbar />
            <main className="min-h-screen">
              {children}
            </main>
          </NextIntlClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
