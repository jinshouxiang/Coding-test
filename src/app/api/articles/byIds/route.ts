// src/app/api/articles/byIds/route.ts
import { NextRequest, NextResponse } from "next/server";
import { client } from "@/lib/microcms";
import type { Article, ListResponse } from "@/types";

// microCMS の SDK は Node/Edge どちらでも動きますが、
// 他の Admin SDK 等を混ぜる可能性を考えて Node.js に固定しておくのもアリ。
// 必要なければこの行は削除可。
export const runtime = "nodejs";

// /api/articles/byIds?ids=id1,id2,id3
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ids = (searchParams.get("ids") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  if (ids.length === 0) {
    // 空の場合でも microCMS のレスポンス形に寄せて返す
    const empty: ListResponse<Article> = {
      contents: [],
      totalCount: 0,
      offset: 0,
      limit: 0,
    };
    return NextResponse.json(empty);
  }

  try {
    // microCMS は ids クエリで一括取得可能
    // limit は安全のため MAX を絞る（必要に応じて上限値を調整）
    const data = await client.getList<Article>({
      endpoint: "articles",
      queries: {
        ids: ids.join(","), // "a,b,c"
        limit: Math.min(ids.length, 100),
      },
    });

    // data は ListResponse<Article>
    return NextResponse.json(data);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "fetch failed";
    console.error("GET /api/articles/byIds error:", e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
