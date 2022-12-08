export type Episode = {
  _id: string;
  title: string;
  thumbnail: string;
  video: string;
  publishedAt: string;
  uploadedAt: string;
  views: number;
};

export type OrderBy = 'publishedAt' | 'uploadedAt' | 'views';
export const orderBy = ['publishedAt', 'uploadedAt', 'views'] as const;

export type SortBy = 'asc' | 'desc';
export const sortBy = ['asc', 'desc'] as const;
