// types/article.ts
export type MicroCMSImage = {
  url: string;
  width?: number;
  height?: number;
};

export type Article = {
  id: string;
  title: string;
  description?: string;
  image?: { url: string; width: number; height: number };
  body?: string;
  publishedAt?: string;
  revisedAt?: string;
};

export type ListResponse<T> = {
  contents: T[];
  totalCount: number;
  offset: number;
  limit: number;
};
