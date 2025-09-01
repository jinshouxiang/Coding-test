import { client } from "@/lib/microcms";
import ArticleCard from "@/components/ArticleCard";
import Pagination from "@/components/Pagination";

export const dynamic = "force-dynamic";
const PER_PAGE = 6;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>; // ← Promise を受け取る
}) {
  const sp = await searchParams; // ← await する
  const page = Math.max(1, Number(sp.page ?? "1"));
  const offset = (page - 1) * PER_PAGE;

  const data = await client.getList({
    endpoint: "articles",
    queries: { limit: PER_PAGE, offset, orders: "-publishedAt" },
  });

  const totalPages = Math.max(1, Math.ceil(data.totalCount / PER_PAGE));

  return (
    <main className="mx-auto max-w-5xl p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">記事一覧</h1>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {data.contents.map((a: any) => (
          <ArticleCard
            key={a.id}
            id={a.id}
            title={a.title}
            description={a.description}
            eyecatch={a.eyecatch}
            publishedAt={a.publishedAt}
          />
        ))}
      </div>

      {
        /* 既存のPaginationをそのまま */
        <Pagination basePath="/articles" page={page} totalPages={totalPages} />
      }
    </main>
  );
}
