import "../../styles/globals.css";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-dvh bg-white text-gray-900">
        <header className="border-b">
          <div className="mx-auto max-w-5xl p-4 flex items-center justify-between">
            <Link href="/" className="font-bold">
              Media Site
            </Link>
            <nav className="flex gap-4 text-sm">
              <Link href="/articles" className="hover:underline">
                Articles
              </Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="mt-12 border-t">
          <div className="mx-auto max-w-5xl p-4 text-sm text-gray-500">
            © {new Date().getFullYear()}
          </div>
        </footer>
      </body>
    </html>
  );
}
