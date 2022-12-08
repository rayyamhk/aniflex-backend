import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UtilsService } from '../utils/utils.service';
import {
  CreateSerieDTO,
  QuerySeriesDTO,
  UpdateSerieDTO,
} from './dto/serie.dto';
import { SeriesService } from './series.service';

@Controller('series')
export class SeriesController {
  constructor(
    private readonly seriesService: SeriesService,
    private readonly utilsService: UtilsService,
  ) {}

  @Get()
  async getSeries(@Query() query: QuerySeriesDTO) {
    const series = await this.seriesService.getSeries(query);
    return this.utilsService.formatResponse(null, series);
  }

  @Get(':id')
  async getSerie(@Param('id', ParseUUIDPipe) id: string) {
    const serie = await this.seriesService.getSerie(id);
    return this.utilsService.formatResponse(null, serie);
  }

  @Post()
  async createSerie(@Body() body: CreateSerieDTO) {
    const serie = await this.seriesService.create(body);
    return this.utilsService.formatResponse(`Serie created.`, serie);
  }

  @Put()
  async updateSerie(@Body() serie: UpdateSerieDTO) {
    await this.seriesService.update(serie);
    return this.utilsService.formatResponse(`Serie updated.`, serie);
  }

  @Delete()
  async deleteSerie(@Body('_id', ParseUUIDPipe) id: string) {
    await this.seriesService.delete(id);
    return this.utilsService.formatResponse(`Serie deleted.`);
  }
}
