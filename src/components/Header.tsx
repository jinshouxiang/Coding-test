"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import SignOutButton from "@/components/SignOutButton";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
        <Link href="/" className="font-bold text-lg">
          Media Site
        </Link>

        <Link href="/articles" className="hover:underline">
          Articles
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          {user ? (
            <>
              <span>{user.email}</span>
              <SignOutButton />
            </>
          ) : (
            <Link href="/login" className="underline">
              ログイン / 登録
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
