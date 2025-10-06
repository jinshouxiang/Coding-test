"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import SignOutButton from "@/components/SignOutButton";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  // 外側クリックでメニューを閉じる
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="border-b bg-white/80 backdrop-blur z-50 relative">
      {/* grid: 左・中央・右で常に中央を固定 */}
      <div className="mx-auto max-w-5xl px-4 py-4 grid grid-cols-3 items-center gap-2">
        {/* 左：ロゴ */}
        <div>
          <Link
            href="/"
            className="block truncate text-lg font-bold hover:opacity-80"
          >
            Media Site
          </Link>
        </div>

        {/* 中央：Articles */}
        <div className="text-center">
          <Link
            href="/articles"
            className="inline-block font-medium hover:underline"
          >
            Articles
          </Link>
        </div>

        {/* 右：ユーザーメニュー */}
        <div className="justify-self-end min-w-0" ref={menuRef}>
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-1 font-medium hover:opacity-80 focus:outline-none"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
              >
                {/* 👤 スマホではアイコンのみ、PCでは名前/メール */}
                <span className="block sm:hidden text-xl">👤</span>
                <span className="hidden sm:inline truncate max-w-[52vw] sm:max-w-[240px] md:max-w-[280px]">
                  {user?.displayName?.trim() || user.email}
                </span>
                <span className="text-gray-400">▾</span>
              </button>

              {/* ドロップダウンメニュー */}
              <div
                role="menu"
                className={`absolute right-0 mt-2 w-56 rounded-lg border bg-white py-2 shadow-lg z-[9999] transition
                ${
                  menuOpen
                    ? "opacity-100 translate-y-0"
                    : "pointer-events-none opacity-0 -translate-y-1"
                }`}
              >
                <Link
                  href="/profile"
                  className="block px-4 py-2 hover:bg-gray-100"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                >
                  👤 プロフィール
                </Link>
                <Link
                  href="/comments"
                  className="block px-4 py-2 hover:bg-gray-100"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                >
                  💬 コメントした記事
                </Link>
                <Link
                  href="/likes"
                  className="block px-4 py-2 hover:bg-gray-100"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                >
                  ❤️ いいねした記事
                </Link>
                <div className="my-2 h-px bg-gray-100" />
                <div className="px-4">
                  <SignOutButton />
                </div>
              </div>
            </div>
          ) : (
            <Link href="/login" className="underline">
              ログイン / 登録
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
