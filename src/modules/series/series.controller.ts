import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { Public } from '../../decorators/public.decorator';
import { UtilsService } from '../utils/utils.service';
import { CreateSerieDTO, UpdateSerieDTO } from './dto/serie.dto';
import { SeriesService } from './series.service';

@Controller('series')
export class SeriesController {
  constructor(
    private readonly seriesService: SeriesService,
    private readonly utilsService: UtilsService,
  ) {}

  @Public()
  @Get(':id')
  async getSerie(@Param('id', ParseUUIDPipe) id: string) {
    const serie = await this.seriesService.get(id, {
      ttl: 1000 * 60 * 5,
      namespace: 'SeriesController:getSerie',
    });
    return this.utilsService.formatResponse(null, serie);
  }

  @Public()
  @Get()
  async getSeries() {
    const series = await this.seriesService.getAll();
    return this.utilsService.formatResponse(null, series);
  }

  @Post()
  async createSerie(@Body() body: CreateSerieDTO) {
    const serie = await this.seriesService.create(body);
    return this.utilsService.formatResponse(
      `Serie created (id: ${serie.id})`,
      serie,
    );
  }

  @Put()
  async updateSerie(@Body() serie: UpdateSerieDTO) {
    await this.seriesService.update(serie);
    return this.utilsService.formatResponse(
      `Serie updated (id: ${serie.id})`,
      serie,
    );
  }

  @Delete()
  async deleteSerie(@Body('id', ParseUUIDPipe) id: string) {
    const deletedSerie = await this.seriesService.delete(id);
    return this.utilsService.formatResponse(
      `Serie deleted (id: ${id})`,
      deletedSerie,
    );
  }
}
