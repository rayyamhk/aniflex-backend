import { IsDateString, IsInt, IsString, IsUUID, Min } from 'class-validator';

/**
 * id: string,
 * episode: number,
 * title: string,
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
