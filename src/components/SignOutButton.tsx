"use client";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut(auth)}
      className="rounded border px-3 py-1 text-sm hover:bg-gray-50"
    >
      ログアウト
    </button>
  );
}
