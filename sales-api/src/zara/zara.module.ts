
import { Module } from '@nestjs/common';
import { ZaraController } from './zara.controller';
import { ZaraService } from './zara.service';
import { ZaraCollectorService } from './zara.collector.service';

@Module({
  controllers: [ZaraController],
  providers: [ZaraService, ZaraCollectorService],
  exports: [ZaraService]
})
export class ZaraModule {}
