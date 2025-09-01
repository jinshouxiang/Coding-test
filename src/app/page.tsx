import Container from "@/components/Container";
import ArticleCard from "@/components/ArticleCard";
import { client } from "@/lib/microcms";
export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await client.getList({
    endpoint: "articles",
    queries: { limit: 3, orders: "-publishedAt" },
  });
  return (
    <Container>
      <h1 className="text-2xl font-bold py-6">新着記事</h1>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {data.contents.map((a: any) => (
          <ArticleCard
            key={a.id}
            id={a.id}
            title={a.title}
            description={a.description ?? ""}
            eyecatch={a.eyecatch}
            publishedAt={a.publishedAt}
          />
        ))}
      </div>
    </Container>
  );
}
