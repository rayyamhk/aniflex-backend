import { Type } from 'class-transformer';
import {
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Matches,
  Min,
} from 'class-validator';
import { IMAGE_KEY_SRC_REGEX } from '../../../constants';
import { OrderBy, orderBy, SortBy, sortBy } from '../types/Serie';

/**
{
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
 */

export class CreateSerieDTO {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @Matches(IMAGE_KEY_SRC_REGEX)
  thumbnail: string;

  @IsDateString()
  publishedAt: string;

  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}

export class UpdateSerieDTO {
  @IsUUID(4)
  _id: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsUUID(4, { each: true })
  episodes: string[];

  @Matches(IMAGE_KEY_SRC_REGEX)
  thumbnail: string;

  @IsDateString()
  publishedAt: string;

  @IsDateString()
  uploadedAt: string;

  @IsString({ each: true })
  tags: string[];

  @IsInt()
  @Min(0)
  views: number;
}

export class QuerySeriesDTO {
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  limit?: number = 8;

  @IsOptional()
  @IsIn(orderBy)
  orderBy?: OrderBy = 'publishedAt';

  @IsOptional()
  @IsIn(sortBy)
  sortBy?: SortBy = 'desc';
}
