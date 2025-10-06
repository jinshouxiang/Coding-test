import Container from "@/components/Container";
import ArticleCard from "@/components/ArticleCard";
import { client } from "@/lib/microcms";
export const dynamic = "force-dynamic";

// microCMS の記事型
// TODO:あとで src/types にまとめる
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

export default async function Home() {
  // 取得時に型を指定
  const data: ListResponse<MCMSArticle> = await client.getList<MCMSArticle>({
    endpoint: "articles",
    queries: { limit: 3, orders: "-publishedAt" },
  });

  return (
    <Container>
      <h1 className="text-2xl font-bold py-6">新着記事</h1>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {data.contents.map((a) => (
          <ArticleCard
            key={a.id}
            id={a.id}
            title={a.title}
            description={a.description ?? ""}
            eyecatch={
              a.eyecatch
                ? {
                    url: a.eyecatch.url,
                    width: a.eyecatch.width ?? 1200,
                    height: a.eyecatch.height ?? 630,
                  }
                : undefined
            }
            publishedAt={a.publishedAt}
          />
        ))}
      </div>
    </Container>
  );
}
