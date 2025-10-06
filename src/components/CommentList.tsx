"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  DocumentData,
} from "firebase/firestore";

type Comment = {
  id: string;
  text: string;
  userEmail: string;
  createdAt?: { seconds: number; nanoseconds: number };
};

export default function CommentList({ articleId }: { articleId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "articles", articleId, "comments"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const list: Comment[] = snap.docs.map((doc) => {
        const data = doc.data() as DocumentData;
        return {
          id: doc.id,
          text: data.text ?? "",
          userEmail: data.userEmail ?? "",
          createdAt: data.createdAt,
        };
      });
      setComments(list);
    });

    return () => unsub();
  }, [articleId]);

  return (
    <div className="mt-8">
      <h2 className="mb-3 text-lg font-bold">コメント</h2>
      {comments.length === 0 && (
        <p className="text-sm text-gray-500">まだコメントはありません</p>
      )}
      <ul className="space-y-3">
        {comments.map((c) => (
          <li key={c.id} className="rounded border p-3">
            <p className="text-sm">{c.text}</p>
            <p className="mt-1 text-xs text-gray-500">
              {c.userEmail} /{" "}
              {c.createdAt
                ? new Date(c.createdAt.seconds * 1000).toLocaleString("ja-JP")
                : ""}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
