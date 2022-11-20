import {
  IsDateString,
  IsInt,
  IsString,
  IsUUID,
  Matches,
  Min,
} from 'class-validator';
import { IMAGE_KEY_SRC_REGEX, VIDEO_KEY_SRC_REGEX } from '../../../constants';

/**
 * id: string,
 * episode: number,
 * title: string,
 * thumbnail: string,
 * video: string,
 * publishedAt: string,
 * uploadedAt: string,
 * views: number,
 */

export class CreateEpisodeDTO {
  @IsUUID(4)
  id: string;

  @IsInt()
  @Min(1)
  episode: number;

  @IsString()
  title: string;

  @Matches(IMAGE_KEY_SRC_REGEX)
  thumbnail: string;

  @Matches(VIDEO_KEY_SRC_REGEX)
  video: string;

  @IsDateString()
  publishedAt: string;
}

export class UpdateEpisodeDTO {
  @IsUUID(4)
  id: string;

  @IsInt()
  @Min(1)
  episode: number;

  @IsString()
  title: string;

  @Matches(IMAGE_KEY_SRC_REGEX)
  thumbnail: string;

  @Matches(VIDEO_KEY_SRC_REGEX)
  video: string;

  @IsDateString()
  publishedAt: string;

  @IsDateString()
  uploadedAt: string;

  @IsInt()
  @Min(0)
  views: number;
}

export class DeleteEpisodeDTO {
  @IsUUID(4)
  id: string;

  @IsInt()
  @Min(1)
  episode: number;
}
