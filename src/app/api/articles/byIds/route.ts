import { NextResponse } from "next/server";
import { client } from "@/lib/microcms";

// /api/articles/byIds?ids=id1,id2,id3
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ids = (searchParams.get("ids") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (ids.length === 0) {
    return NextResponse.json({ contents: [] });
  }

  try {
    // microCMS は ids クエリで一括取得できます（最大数に注意）
    const data = await client.getList({
      endpoint: "articles",
      queries: {
        ids: ids.join(","), // "a,b,c"
        limit: ids.length,
      },
    });
    return NextResponse.json(data);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { error: e?.message || "fetch failed" },
      { status: 500 }
    );
  }
}
