import "../../styles/globals.css";
import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Media Site",
  description: "microCMS + Next.js + Firebase",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-dvh bg-white text-gray-900">
        <Header />
        <main>{children}</main>
        <footer className="mt-12 border-t">
          <div className="mx-auto max-w-5xl p-4 text-sm text-gray-500">
            ©2025
          </div>
        </footer>
      </body>
    </html>
  );
}
