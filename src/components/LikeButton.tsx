"use client";

import { useEffect, useState, useMemo } from "react";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  serverTimestamp,
  query,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { getCountFromServer } from "firebase/firestore";

type Props = { articleId: string };

export default function LikeButton({ articleId }: Props) {
  const [userId, setUserId] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState<number>(0);
  const [busy, setBusy] = useState(false);

  // パスをメモ化
  const likesColRef = useMemo(
    () => collection(db, "articles", articleId, "likes"),
    [articleId]
  );

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUserId(u ? u.uid : null);
    });
    return () => unsub();
  }, []);

  // 自分がいいね済みか
  useEffect(() => {
    if (!userId) {
      setLiked(false);
      return;
    }
    const likeDocRef = doc(db, "articles", articleId, "likes", userId);
    const unsub = onSnapshot(likeDocRef, (snap) => setLiked(snap.exists()));
    return () => unsub();
  }, [articleId, userId]);

  // 件数（初期は集計API、以降はリアルタイム購読でもOK）
  useEffect(() => {
    (async () => {
      const agg = await getCountFromServer(likesColRef);
      setCount(agg.data().count);
    })();

    const unsub = onSnapshot(query(likesColRef), (snap) => {
      setCount(snap.size);
    });
    return () => unsub();
  }, [likesColRef]);

  const toggle = async () => {
    if (!userId) {
      alert("いいねするにはログインしてください");
      return;
    }
    setBusy(true);
    try {
      const likeRef = doc(db, "articles", articleId, "likes", userId);
      if (liked) {
        await deleteDoc(likeRef);
      } else {
        await setDoc(likeRef, {
          userId: userId,
          createdAt: serverTimestamp(),
        });
      }
    } catch (e) {
      console.error(e);
      alert("処理に失敗しました");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggle}
        disabled={busy}
        aria-pressed={liked}
        className={`rounded-full px-4 py-2 text-sm font-medium transition
          ${liked ? "bg-pink-600 text-white" : "bg-gray-100 hover:bg-gray-200"}
          disabled:opacity-50`}
        title={liked ? "いいね済み" : "いいね"}
      >
        {liked ? "♥ いいね済み" : "♡ いいね"}
      </button>
      <span className="text-sm text-gray-600">{count}</span>
    </div>
  );
}
