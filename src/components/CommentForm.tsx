"use client";

import { useState } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function CommentForm({ articleId }: { articleId: string }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const user = auth.currentUser;

  const handleSubmit = async () => {
    if (!user) {
      alert("コメントにはログインが必要です");
      return;
    }
    if (!text.trim()) return;

    setLoading(true);
    try {
      await addDoc(collection(db, "articles", articleId, "comments"), {
        text: text.trim(),
        userId: user.uid,
        userEmail: user.email,
        createdAt: serverTimestamp(),
      });
      setText("");
    } catch (e) {
      console.error(e);
      alert("コメントの送信に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  // ログインしていない場合はフォームを非表示にする
  if (!user) {
    return (
      <p className="mt-6 text-sm text-gray-500">
        コメントするにはログインしてください
      </p>
    );
  }

  return (
    <div className="mt-6">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="コメントを入力..."
        className="w-full rounded border p-2"
        name="comment"
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-2 rounded bg-black px-4 py-2 text-white hover:bg-gray-800 disabled:opacity-50"
      >
        {loading ? "送信中..." : "コメント送信"}
      </button>
    </div>
  );
}
