import { createClient } from "microcms-js-sdk";

const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN!;
const apiKey = process.env.MICROCMS_API_KEY!;

if (!serviceDomain || !apiKey) {
  throw new Error(
    "microCMS env missing: set MICROCMS_SERVICE_DOMAIN and MICROCMS_API_KEY"
  );
}

export const client = createClient({
  serviceDomain,
  apiKey,
});
