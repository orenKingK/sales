import { Controller, Get, Post, Query } from '@nestjs/common';
import { ZaraService } from './zara.service';
import { ZaraCollectorService } from './zara.collector.service';
import { SaleFilterParams } from '../common/interfaces/sales-provider.interface';

@Controller('zara')
export class ZaraController {
  constructor(
      private readonly zaraService: ZaraService,
      private readonly zaraCollector: ZaraCollectorService
  ) {}

  @Get('count')
  async getCount() {
    return { count: await this.zaraService.getCount() };
  }

  @Get('sales')
  async getSales(@Query() query: SaleFilterParams) {
    return this.zaraService.getSales(query);
  }

  @Post('collect')
  async collectData() {
    return this.zaraCollector.collectAndSave();
  }
}
