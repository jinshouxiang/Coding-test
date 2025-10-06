"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, updateProfile, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";

function isFirebaseError(e: unknown): e is { code?: string; message?: string } {
  return typeof e === "object" && e !== null && ("code" in e || "message" in e);
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  // ログインチェック
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) {
        router.replace("/login");
      } else {
        setUser(u);
        setDisplayName(u.displayName ?? "");
      }
    });
    return () => unsub();
  }, [router]);

  const onSave = async () => {
    if (!user) return;
    setSaving(true);
    setMsg("");
    try {
      const trimmed = (displayName ?? "").trim();
      // 空にしたい時は空文字で上書き
      await updateProfile(user, { displayName: trimmed === "" ? "" : trimmed });
      setMsg("保存しました");
    } catch (e: unknown) {
      const detail = isFirebaseError(e) ? e.code || e.message : "unknown-error";
      setMsg(`保存に失敗しました: ${detail}`);
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    // onAuthStateChanged 判定中
    return <div className="mx-auto mt-16 max-w-md p-6">読み込み中...</div>;
  }

  return (
    <div className="mx-auto mt-12 max-w-lg rounded-2xl border p-6">
      <h1 className="mb-6 text-2xl font-bold text-center">プロフィール</h1>

      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium">
          メールアドレス（変更不可）
        </label>
        <input
          value={user.email ?? ""}
          readOnly
          className="w-full rounded border bg-gray-50 p-2 text-gray-700"
        />
      </div>

      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium">表示名</label>
        <input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="サイト上に表示する名前"
          className="w-full rounded border p-2"
        />
      </div>

      {msg && <p className="mb-3 text-sm text-gray-600">{msg}</p>}

      <button
        onClick={onSave}
        disabled={saving}
        className="w-full rounded bg-black px-4 py-2 text-white hover:bg-gray-800 disabled:opacity-50 cursor-pointer"
      >
        {saving ? "保存中..." : "保存する"}
      </button>

      <div className="mt-6 text-sm text-right">
        <Link href="/reset-password" className="underline">
          パスワード変更はこちら
        </Link>
      </div>
    </div>
  );
}
