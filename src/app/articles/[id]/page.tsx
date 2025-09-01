import { client } from "@/lib/microcms";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

function formatJa(date?: string) {
  if (!date) return "";
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "long",
  }).format(new Date(date));
}

export default async function ArticleDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await client.get({ endpoint: "articles", contentId: id });

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      {/* サムネイル画像（image を使用） */}
      {article.image?.url && (
        <div className="relative w-full aspect-[16/9] overflow-hidden rounded-xl bg-gray-100">
          <Image
            src={article.image.url}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* 記事タイトル */}
      <h1 className="mt-8 text-3xl font-bold">{article.title}</h1>

      {/* 公開日時 */}
      {article.publishedAt && (
        <p className="mt-2 text-sm text-gray-500">
          {formatJa(article.publishedAt)}（公開日時）
        </p>
      )}

      {/* 記事本文 */}
      {article.body && (
        <div
          className="prose prose-neutral max-w-none mt-8"
          dangerouslySetInnerHTML={{ __html: article.body }}
        />
      )}

      {/* 記事一覧に戻る */}
      <div className="mt-12 flex justify-center">
        <Link
          href="/articles"
          className="inline-block px-6 py-2 rounded-lg border bg-black text-white hover:bg-gray-800"
        >
          一覧に戻る
        </Link>
      </div>
    </main>
  );
}
