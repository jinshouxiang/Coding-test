import Link from "next/link";

// 現在ページ±2を表示。
export default function Pagination({
  basePath = "/",
  page,
  totalPages,
}: {
  basePath?: string;
  page: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  const clampedPage = Math.min(Math.max(1, page), totalPages);
  const prev = Math.max(1, clampedPage - 1);
  const next = Math.min(totalPages, clampedPage + 1);

  // 表示ウィンドウ: 現在±2
  const start = Math.max(1, clampedPage - 2);
  const end = Math.min(totalPages, clampedPage + 2);

  const pages: number[] = [];
  for (let p = start; p <= end; p++) pages.push(p);

  const href = (p: number) => `${basePath}?page=${p}`;

  const Btn = ({ p, active = false }: { p: number; active?: boolean }) => (
    <Link
      href={href(p)}
      aria-current={active ? "page" : undefined}
      className={`h-9 min-w-9 px-3 grid place-items-center rounded border ${
        active ? "bg-black text-white" : "hover:bg-gray-50"
      }`}
    >
      {p}
    </Link>
  );

  return (
    <nav
      className="mt-8 flex items-center justify-center gap-2"
      aria-label="Pagination"
    >
      {/* Prev */}
      <Link
        href={href(prev)}
        aria-label="前へ"
        className={`h-9 px-3 grid place-items-center rounded border ${
          clampedPage === 1
            ? "pointer-events-none opacity-40"
            : "hover:bg-gray-50"
        }`}
      >
        ‹
      </Link>

      {/* 先頭省略 */}
      {start > 1 && (
        <>
          <Btn p={1} active={clampedPage === 1} />
          {start > 2 && <span className="px-1 select-none">…</span>}
        </>
      )}

      {/* 中央ウィンドウ */}
      {pages.map((p) => (
        <Btn key={p} p={p} active={p === clampedPage} />
      ))}

      {/* 末尾省略 */}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-1 select-none">…</span>}
          <Btn p={totalPages} active={clampedPage === totalPages} />
        </>
      )}

      {/* Next */}
      <Link
        href={href(next)}
        aria-label="次へ"
        className={`h-9 px-3 grid place-items-center rounded border ${
          clampedPage === totalPages
            ? "pointer-events-none opacity-40"
            : "hover:bg-gray-50"
        }`}
      >
        ›
      </Link>
    </nav>
  );
}
