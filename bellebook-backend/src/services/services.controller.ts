import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { ServicesService, ServiceFilters, CreateServiceDto, UpdateServiceDto } from './services.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

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

    if (
      filters.minPrice &&
      filters.maxPrice &&
      filters.minPrice > filters.maxPrice
    ) {
      throw new BadRequestException(
        'Preço mínimo não pode ser maior que o máximo',
      );
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

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async create(@Body() createServiceDto: CreateServiceDto) {
    return this.servicesService.create(createServiceDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async update(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
  ) {
    return this.servicesService.update(id, updateServiceDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async remove(@Param('id') id: string) {
    return this.servicesService.remove(id);
  }

  @Put(':id/toggle-active')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async toggleActive(@Param('id') id: string) {
    return this.servicesService.toggleActive(id);
  }
}
