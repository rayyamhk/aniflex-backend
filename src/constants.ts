// Database Name
export const ANIME_SERIES_DATABASE = 'AnimeSeries';
export const ANIME_EPISODES_DATABASE = 'AnimeEpisodes';

// Storage Name
export const IMAGES_STORAGE = 'aniflex-images';
export const VIDEOS_STORAGE = 'aniflex-videos';

// Regular Expressions
export const UUID_REGEX =
  /^[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}$/i;
export const MEDIA_KEY_REGEX = /^[0-9a-f]{16}$/i;
export const IMAGE_KEY_SRC_REGEX = /^\/images\/[0-9a-f]{16}$/;
export const IMAGE_MIMETYPE_REGEX = /^image\/(jpeg|png|webp)$/i;
export const VIDEO_KEY_SRC_REGEX = /^\/videos\/[0-9a-f]{16}\/out\.m3u8$/;
export const VIDEO_MIMETYPE_REGEX = /^video\/mp4$/i;
export const VIDEO_CHUNK_NAME = /^(out\.m3u8|[0-9]{1,4}\.ts)$/;

// Other
export const MAX_VIDEO_SIZE = 1024 * 1024 * 1024 * 1; // 1GB
export const MAX_IMAGE_SIZE = 1024 * 1024 * 5; // 500KB
