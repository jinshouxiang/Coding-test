"use client";

import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success("ログアウトしました！");
      // 少し待ってからリダイレクト（トーストが見えるように）
      setTimeout(() => router.replace("/"), 1000);
      router.replace("/"); // ← 戻るボタンでログインページに戻れないようにする
    } catch (error) {
      console.error("Sign out error:", error);
      alert("サインアウト中にエラーが発生しました。");
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className="hover:bg-gray-50 px-3 py-2 rounded transition"
    >
      ログアウト
    </button>
  );
}
