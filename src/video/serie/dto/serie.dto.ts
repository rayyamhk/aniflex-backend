import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

/**
 * {
 *  id: string
 *  title: string
 *  description: string
 *  episodes: number
 *  publishedAt: string
 *  uploadedAt: string
 *  tags: string[]
 * }
 */

export class CreateSerieDTO {
  @IsString()
  title: string;

  @IsString()
  description: string;

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
