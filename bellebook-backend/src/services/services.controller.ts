import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { ServicesService, ServiceFilters } from './services.service';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get('categories')
  async getAllCategories() {
    return this.servicesService.getAllCategories();
  }

  @Get('category/:categoryId')
  async getByCategory(
    @Param('categoryId') categoryId: string,
    @Query('sort') sort?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('search') search?: string,
  ) {
    const filters: ServiceFilters = {
      sort,
      minPrice: minPrice ? parseInt(minPrice, 10) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice, 10) : undefined,
      search,
    };

    if (filters.minPrice && filters.maxPrice && filters.minPrice > filters.maxPrice) {
      throw new BadRequestException('Preço mínimo não pode ser maior que o máximo');
    }

    return this.servicesService.findByCategory(categoryId, filters);
  }

  @Get('search')
  async searchServices(@Query('q') query: string) {
    if (!query) {
      throw new BadRequestException('Query de busca é obrigatória');
    }
    return this.servicesService.searchServices(query);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.servicesService.findById(id);
  }
}
