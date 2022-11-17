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
import { UtilsService } from '../utils/utils.service';
import { ParsePositiveIntPipe } from '../../pipes/parsePositiveInt.pipe';
import { CreateSerieDTO, UpdateSerieDTO } from './dto/serie.dto';
import { SeriesService } from './series.service';

@Controller('series')
export class SeriesController {
  constructor(
    private readonly seriesService: SeriesService,
    private readonly utilsService: UtilsService,
  ) {}

  @Get()
  async getSeries(
    @Query('limit', new DefaultValuePipe(12), ParsePositiveIntPipe)
    limit: number,
  ) {
    const series = await this.seriesService.getAllSeries(limit, {
      namespace: 'SerieController:getSeries',
      ttl: 1000 * 60 * 30, // 30 min
    });
    const formattedSeries = series.map((item) =>
      this.seriesService.getPublicSerie(item),
    );
    return this.utilsService.formatResponse(null, formattedSeries);
  }

  @Post()
  async createSerie(@Body() body: CreateSerieDTO) {
    const serie = await this.seriesService.createSerie(body);
    return this.utilsService.formatResponse(
      `Serie created (id: ${serie.id})`,
      serie,
    );
  }

  @Put()
  async updateSerie(@Body() serie: UpdateSerieDTO) {
    await this.seriesService.updateSerie(serie);
    return this.utilsService.formatResponse(
      `Serie updated (id: ${serie.id})`,
      serie,
    );
  }

  @Delete()
  async deleteSerie(@Body('id', ParseUUIDPipe) id: string) {
    const deletedSerie = await this.seriesService.deleteSerie(id);
    return this.utilsService.formatResponse(
      `Serie deleted (id: ${id})`,
      deletedSerie,
    );
  }
}
