import { Type } from 'class-transformer';
import {
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Min,
} from 'class-validator';
import { orderBy, OrderBy, sortBy, SortBy } from '../types/Episode';
import { IMAGE_KEY_SRC_REGEX, VIDEO_KEY_SRC_REGEX } from '../../../constants';

/**
 * _id: string,
 * title: string,
 * thumbnail: string,
 * video: string,
 * publishedAt: string,
 * uploadedAt: string,
 * views: number,
 */

export class CreateEpisodeDTO {
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
  _id: string;

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

export class QueryEpisodesDTO {
  @IsOptional()
  @IsUUID(4)
  serie?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  limit?: number = 8;

  @IsOptional()
  @IsIn(orderBy)
  orderBy?: OrderBy = 'uploadedAt';

  @IsOptional()
  @IsIn(sortBy)
  sortBy?: SortBy = 'desc';
}
