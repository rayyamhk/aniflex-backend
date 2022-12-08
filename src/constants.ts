// Database Name
export const ANIME_SERIES_DATABASE = 'series';
export const ANIME_EPISODES_DATABASE = 'episodes';

// Storage Name
export const IMAGES_STORAGE = 'aniflex-images';
export const VIDEOS_STORAGE = 'aniflex-videos';

// Regular Expressions
export const MEDIA_KEY_REGEX = /^[0-9a-f]{16}$/i;
export const IMAGE_KEY_SRC_REGEX = /^\/images\/[0-9a-f]{16}$/;
export const IMAGE_MIMETYPE_REGEX = /^image\/(jpeg|png|webp)$/i;
export const VIDEO_KEY_SRC_REGEX = /^\/videos\/[0-9a-f]{16}\/out\.m3u8$/;
export const VIDEO_MIMETYPE_REGEX = /^video\/mp4$/i;
export const VIDEO_CHUNK_NAME = /^(out\.m3u8|[0-9]{1,4}\.ts)$/;
export const UUIDV4_REGEX =
  /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

// Other
export const MAX_VIDEO_SIZE = 1024 * 1024 * 1024 * 1; // 1GB
export const MAX_IMAGE_SIZE = 1024 * 1024 * 5; // 500KB

// Symbols
export const COLLECTION_NAME = Symbol('COLLECTION_NAME');
export const BUCKET_NAME = Symbol('BUCKET_NAME');
