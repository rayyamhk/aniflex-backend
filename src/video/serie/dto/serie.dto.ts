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
 *  tags: number[]
 * }
 */

export class CreateSerieDTO {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsDateString()
  publishedAt: string;

  @IsInt({ each: true })
  @IsOptional()
  tags?: number[];
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

  @IsInt({ each: true })
  @IsOptional()
  tags?: number[];

  @IsInt()
  @Min(0)
  views: number;
}
