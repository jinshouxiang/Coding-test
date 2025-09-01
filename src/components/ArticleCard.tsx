import Image from "next/image";
import Link from "next/link";

type Props = {
  id: string;
  title: string;
  description?: string;
  eyecatch?: { url: string; width: number; height: number };
  publishedAt?: string;
};

function formatJa(date?: string) {
  if (!date) return "";
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(date));
}

export default function ArticleCard({
  id,
  title,
  description,
  eyecatch,
  publishedAt,
}: Props) {
  return (
    <article className="rounded-xl">
      {/* サムネ（16:9） */}
      <Link href={`/articles/${id}`} className="block">
        <div className="relative w-full aspect-[16/9] bg-gray-100 overflow-hidden">
          {eyecatch?.url && (
            <Image
              src={eyecatch.url}
              alt={title}
              fill
              sizes="(max-width: 1024px) 100vw, 33vw"
              className="object-cover"
              priority={false}
            />
          )}
        </div>

        {/* テキスト領域 */}
        <div className="p-4">
          <h3 className="text-lg font-semibold tracking-[0.01em] hover:underline">
            {title}
          </h3>

          {/* ディスクリプション */}
          {description && (
            <p className="mt-3 text-sm text-gray-500 line-clamp-3">
              {description}
            </p>
          )}

          {/* 日付 */}
          {publishedAt && (
            <p className="mt-3 text-xs text-gray-400">
              {formatJa(publishedAt)}（公開日時）
            </p>
          )}
        </div>
      </Link>
    </article>
  );
}
