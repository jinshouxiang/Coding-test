"use client";

import { useEffect, useState } from "react";
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

// microCMSのリストレスポンス
type ListResponse<T> = {
  contents: T[];
  totalCount: number;
  offset: number;
  limit: number;
};

export default function LikesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [uid, setUid] = useState<string | null>(null);

  // ログイン状態を監視
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUid(u?.uid ?? null));
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!uid) return;

    (async () => {
      const likesCg = collectionGroup(db, "likes");
      const q = query(likesCg, where("userId", "==", uid));
      const snap = await getDocs(q);

      const ids = new Set<string>();
      snap.forEach((doc) => {
        const articleId = doc.ref.parent.parent?.id;
        if (articleId) ids.add(articleId);
      });

      if (ids.size === 0) {
        setArticles([]);
        return;
      }

      // microCMS API で記事をまとめて取得
      const res = await fetch(
        `/api/articles/byIds?ids=${Array.from(ids).join(",")}`
      );
      if (!res.ok) {
        setArticles([]);
        return;
      }
      const data: ListResponse<Article> = await res.json(); // ← 型を付ける
      setArticles(data.contents ?? []);
    })();
  }, [uid]);

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-xl font-bold mb-6">いいねした記事</h1>
      {articles.length === 0 ? (
        <p>まだありません</p>
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
