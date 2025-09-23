"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

function errMsg(e: any, mode: "signin" | "signup") {
  const code = e?.code || "";

  // 共通
  const common: Record<string, string> = {
    "auth/invalid-email": "メールアドレスの形式が不正です",
    "auth/user-disabled": "このユーザーは無効です",
    "auth/too-many-requests":
      "試行回数が多すぎます。しばらくしてからお試しください",
    "auth/network-request-failed": "ネットワークエラーが発生しました",
  };

  // ログイン時
  const signInOnly: Record<string, string> = {
    "auth/user-not-found": "メールアドレスまたはパスワードが正しくありません",
    "auth/wrong-password": "メールアドレスまたはパスワードが正しくありません",
    "auth/invalid-credential":
      "メールアドレスまたはパスワードが正しくありません",
  };

  // 新規登録時
  const signUpOnly: Record<string, string> = {
    "auth/email-already-in-use": "このメールは既に使われています",
    "auth/weak-password": "パスワードは6文字以上にしてください",
    "auth/missing-password": "パスワードを入力してください",
  };

  const tbl = {
    ...common,
    ...(mode === "signin" ? signInOnly : signUpOnly),
  };

  return tbl[code] ?? `エラーが発生しました (${code || e?.message})`;
}

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // 既にログイン済みならトップへ
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) router.replace("/");
    });
    return () => unsub();
  }, [router]);

  const onSubmit = async () => {
    setError("");

    // 入力バリデーション（最低限）
    if (!email || !password) {
      setError("メールとパスワードを入力してください");
      return;
    }
    if (mode === "signup" && password.length < 6) {
      setError("パスワードは6文字以上にしてください");
      return;
    }

    setBusy(true);
    try {
      if (mode === "signin") {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      } else {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      }
    } catch (e: any) {
      setError(errMsg(e, mode));
    } finally {
      setBusy(false);
    }
  };

  // パスワード再設定
  const onReset = async () => {
    setError("");
    if (!email) return setError("パスワード再設定にはメールを入力してください");
    setBusy(true);
    try {
      await sendPasswordResetEmail(auth, email);
      alert(
        "パスワード再設定用のメールを送信しました。メールをご確認ください。"
      );
    } catch (e: any) {
      setError(errMsg(e, mode));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto mt-16 max-w-md rounded-2xl border p-6">
      <h1 className="mb-6 text-center text-2xl font-bold">
        {mode === "signin" ? "ログイン" : "新規登録"}
      </h1>

      <label className="mb-2 block text-sm font-medium">メールアドレス</label>
      <input
        type="email"
        className="mb-4 w-full rounded border px-3 py-2"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
      />

      <label className="mb-2 block text-sm font-medium">パスワード</label>
      <input
        type="password"
        className="mb-2 w-full rounded border px-3 py-2"
        placeholder="6文字以上"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete={mode === "signin" ? "current-password" : "new-password"}
      />

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      <button
        onClick={onSubmit}
        disabled={busy}
        className="mt-4 w-full rounded bg-black px-4 py-2 font-medium text-white hover:bg-gray-800 disabled:opacity-50"
      >
        {busy ? "処理中..." : mode === "signin" ? "ログイン" : "アカウント作成"}
      </button>

      <div className="mt-4 flex items-center justify-between text-sm">
        <button
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="underline"
        >
          {mode === "signin" ? "新規登録はこちら" : "ログインに切り替える"}
        </button>
        <button onClick={onReset} className="underline">
          パスワードをお忘れですか？
        </button>
      </div>
    </div>
  );
}
