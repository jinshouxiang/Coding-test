"use client";

import { useEffect, useMemo, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collectionGroup, getDocs, query, where } from "firebase/firestore";
import ArticleCard from "@/components/ArticleCard";

type Article = {
  id: string;
  title: string;
  description?: string;
  publishedAt?: string;
};

export default function MyCommentsPage() {
  const [uid, setUid] = useState<string | null>(null);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Auth 監視
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u?.uid !== uid) {
        setUid(u?.uid ?? null);
      }
    });
    return () => unsub();
  }, [uid]);

  // collectionGroup は useMemo で固定化
  const commentsCg = useMemo(() => collectionGroup(db, "comments"), []);

  // コメント取得
  useEffect(() => {
    if (!uid) return; // ログインしてない時は何もしない

    setLoading(true);

    (async () => {
      const q = query(commentsCg, where("userId", "==", uid));
      const snap = await getDocs(q);

      const ids = new Set<string>();
      snap.forEach((doc) => {
        const articleId = doc.ref.parent.parent?.id;
        if (articleId) ids.add(articleId);
      });

      if (ids.size === 0) {
        setArticles([]);
        setLoading(false);
        return;
      }

      // microCMS から記事をまとめて取得
      const res = await fetch(
        `/api/articles/byIds?ids=${Array.from(ids).join(",")}`
      );
      const data = await res.json();

      setArticles(data.contents ?? []);
      setLoading(false);
    })();
  }, [uid, commentsCg]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-8 text-center text-2xl font-bold">コメントした記事</h1>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-2xl bg-gray-200"
            />
          ))}
        </div>
      ) : articles.length === 0 ? (
        <p className="text-center text-sm text-gray-500">
          まだコメントした記事はありません。
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <ArticleCard
              key={a.id}
              id={a.id}
              title={a.title}
              description={a.description}
              publishedAt={a.publishedAt}
            />
          ))}
        </div>
      )}
    </main>
  );
}
