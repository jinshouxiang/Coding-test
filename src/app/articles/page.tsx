// src/app/page.tsx
import { client } from "@/lib/microcms";
import ArticleCard from "@/components/ArticleCard";
import Pagination from "@/components/Pagination";

type MicroCMSImage = { url: string; width?: number; height?: number };
type MCMSArticle = {
  id: string;
  title: string;
  description?: string;
  eyecatch?: MicroCMSImage;
  publishedAt?: string;
};
type ListResponse<T> = {
  contents: T[];
  totalCount: number;
  offset: number;
  limit: number;
};

export const dynamic = "force-dynamic";
const PER_PAGE = 6;

export default async function Home({
  searchParams,
}: {
  // Promise で渡ってくるケースがあるので union で吸収
  searchParams: { page?: string } | Promise<{ page?: string }>;
}) {
  const sp =
    searchParams instanceof Promise ? await searchParams : searchParams;
  const page = Math.max(1, Number(sp?.page ?? "1"));
  const offset = (page - 1) * PER_PAGE;

  // 取得に型を付ける
  const data = (await client.getList<MCMSArticle>({
    endpoint: "articles",
    queries: { limit: PER_PAGE, offset, orders: "-publishedAt" },
  })) as ListResponse<MCMSArticle>;

  const totalPages = Math.max(1, Math.ceil(data.totalCount / PER_PAGE));

  return (
    <main className="mx-auto max-w-5xl p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">記事一覧</h1>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {data.contents.map((a) => (
          <ArticleCard
            key={a.id}
            id={a.id}
            title={a.title}
            description={a.description}
            eyecatch={
              a.eyecatch
                ? {
                    url: a.eyecatch.url,
                    width: a.eyecatch.width ?? 1200, // デフォルト
                    height: a.eyecatch.height ?? 630, // デフォルト
                  }
                : undefined
            }
            publishedAt={a.publishedAt}
          />
        ))}
      </div>

      <Pagination basePath="/" page={page} totalPages={totalPages} />
    </main>
  );
}
