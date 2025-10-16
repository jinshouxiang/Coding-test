// src/types/index.ts

// === MicroCMS ===
export type MicroCMSImage = {
  url: string;
  width?: number;
  height?: number;
};

export type ListResponse<T> = {
  contents: T[];
  totalCount: number;
  offset: number;
  limit: number;
};

export type MCMSArticle = {
  id: string;
  title: string;
  description?: string;
  eyecatch?: MicroCMSImage;
  publishedAt?: string;
};

// === Firestore / App用 ===
export type Article = {
  id: string;
  title: string;
  description?: string;
  image?: MicroCMSImage;
  body?: string;
  publishedAt?: string;
  revisedAt?: string;
  authorId?: string;
  tags?: string[];
  likeCount?: number;
  commentCount?: number;
  isPublished?: boolean;
};

export type Comment = {
  id: string;
  articleId: string;
  userId: string;
  content: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
  replyCount: number;
};

export type Like = {
  id: string;
  articleId: string;
  userId: string;
  createdAt: string;
};

export type UserProfile = {
  uid: string;
  displayName: string;
  photoURL?: string | null;
  bio?: string | null;
  createdAt: string;
  updatedAt: string;
};
