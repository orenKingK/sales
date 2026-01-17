
import { Controller, Get, Param } from '@nestjs/common';
import { BrandsService } from './brands.service';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Get()
  async getBrands() {
    return await this.brandsService.getBrands();
  }

  @Get(':id')
  getBrand(@Param('id') id: string) {
    return this.brandsService.getBrandById(id);
  }
}
