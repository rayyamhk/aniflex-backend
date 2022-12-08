export type Serie = {
  _id: string;
  title: string;
  description: string;
  episodes: string[];
  thumbnail: string;
  publishedAt: string;
  uploadedAt: string;
  views: number;
  tags: string[];
};

export type OrderBy = 'publishedAt' | 'uploadedAt' | 'views';
export const orderBy = ['publishedAt', 'uploadedAt', 'views'] as const;
export type SortBy = 'asc' | 'desc';
export const sortBy = ['asc', 'desc'] as const;
