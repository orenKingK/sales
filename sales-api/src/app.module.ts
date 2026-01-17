
import { Module } from '@nestjs/common';
import { ZaraModule } from './zara/zara.module';
import { BrandsModule } from './brands/brands.module';

@Module({
  imports: [ZaraModule, BrandsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
