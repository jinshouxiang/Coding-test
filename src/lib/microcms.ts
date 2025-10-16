import { createClient } from "microcms-js-sdk";

type MC = ReturnType<typeof createClient>;

let _client: MC | null = null;

export function getMicroCMS() {
  const sd = process.env.MICROCMS_SERVICE_DOMAIN;
  const ak = process.env.MICROCMS_API_KEY;
  if (!sd || !ak) return null;
  if (!_client) _client = createClient({ serviceDomain: sd, apiKey: ak });
  return _client;
}

// 既存の `import { client }` を壊さないためのプロキシ（型付き）
export const client: MC = new Proxy({} as MC, {
  get(_target, prop: keyof MC) {
    const c = getMicroCMS();
    if (!c)
      throw new Error(
        "microCMS env missing: set MICROCMS_SERVICE_DOMAIN and MICROCMS_API_KEY"
      );
    return c[prop];
  },
});
