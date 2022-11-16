import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UtilsService } from '../../utils/utils.service';
import { ParsePositiveIntPipe } from '../../pipes/parsePositiveInt.pipe';
import { CreateSerieDTO, UpdateSerieDTO } from './dto/serie.dto';
import { SerieService } from './serie.service';

@Controller('videos/series')
export class SerieController {
  constructor(
    private readonly serieService: SerieService,
    private readonly utilsService: UtilsService,
  ) {}

  @Get()
  async getSeries(
    @Query('limit', new DefaultValuePipe(12), ParsePositiveIntPipe)
    limit: number,
  ) {
    const series = await this.serieService.getAllSeries(limit, {
      namespace: 'SerieController:getSeries',
      ttl: 1000 * 60 * 30, // 30 min
    });
    const formattedSeries = series.map((item) =>
      this.serieService.getPublicSerie(item),
    );
    return this.utilsService.formatResponse(null, formattedSeries);
  }

  @Post()
  async createSerie(@Body() body: CreateSerieDTO) {
    const serie = await this.serieService.createSerie(body);
    return this.utilsService.formatResponse(
      `Serie created (id: ${serie.id})`,
      serie,
    );
  }

  @Put()
  async updateSerie(@Body() serie: UpdateSerieDTO) {
    await this.serieService.updateSerie(serie);
    return this.utilsService.formatResponse(
      `Serie updated (id: ${serie.id})`,
      serie,
    );
  }

  @Delete()
  async deleteSerie(@Body('id', ParseUUIDPipe) id: string) {
    const deletedSerie = await this.serieService.deleteSerie(id);
    return this.utilsService.formatResponse(
      `Serie deleted (id: ${id})`,
      deletedSerie,
    );
  }
}
