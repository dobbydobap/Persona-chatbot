import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Scaler Persona Chat — Talk to Anshuman, Abhimanyu, Kshitij",
  description:
    "A persona-based AI chatbot built for the Scaler Prompt Engineering assignment. Have real conversations with three Scaler/InterviewBit voices.",
  openGraph: {
    title: "Scaler Persona Chat",
    description:
      "Chat with three Scaler/InterviewBit voices — Anshuman Singh, Abhimanyu Saxena, Kshitij Mishra.",
    type: "website",
  },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${sora.variable} h-full antialiased`}
    >
      <body className="min-h-[100dvh] flex flex-col">{children}</body>
    </html>
  );
}
