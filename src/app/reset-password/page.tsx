"use client";

import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";

function resetErrMsg(code?: string) {
  const map: Record<string, string> = {
    "auth/invalid-email": "メールアドレスの形式が不正です",
    "auth/user-not-found": "このメールアドレスのユーザーは登録されていません",
    "auth/missing-email": "メールアドレスを入力してください",
    "auth/too-many-requests":
      "試行回数が多すぎます。しばらくしてから再試行してください",
  };
  return map[code ?? ""] ?? `エラーが発生しました (${code})`;
}

function isFirebaseError(e: unknown): e is { code?: string } {
  return typeof e === "object" && e !== null && "code" in e;
}

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const onReset = async () => {
    setMsg("");
    if (!email) return setMsg("パスワード再設定にはメールを入力してください");
    setBusy(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setMsg("再設定用メールを送信しました。メールをご確認ください。");
    } catch (e: unknown) {
      const code = isFirebaseError(e) ? e.code : "unknown-error";
      setMsg(resetErrMsg(code));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto mt-16 max-w-md rounded-2xl border p-6">
      <h1 className="mb-6 text-center text-xl font-bold">パスワード再設定</h1>
      <p className="mb-4 text-sm text-gray-600">
        登録済みのメールアドレスを入力してください。
      </p>

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="mb-3 w-full rounded border p-2"
      />

      {msg && <p className="mb-3 text-sm text-red-600">{msg}</p>}

      <button
        onClick={onReset}
        disabled={busy}
        className="w-full rounded bg-black px-4 py-2 text-white hover:bg-gray-800 disabled:opacity-50 cursor-pointer"
      >
        {busy ? "送信中..." : "再設定メールを送信"}
      </button>
    </div>
  );
}
