import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Min,
} from 'class-validator';
import { IMAGE_KEY_SRC_REGEX } from '../../../constants';

/**
{
  id: string;
  title: string;
  description: string;
  episodes: number;
  thumbnail: string;
  publishedAt: string;
  uploadedAt: string;
  views: number;
  tags?: string[];
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
  id: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsInt()
  @Min(0)
  episodes: number;

  @Matches(IMAGE_KEY_SRC_REGEX)
  thumbnail: string;

  @IsDateString()
  publishedAt: string;

  @IsDateString()
  uploadedAt: string;

  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsInt()
  @Min(0)
  views: number;
}
