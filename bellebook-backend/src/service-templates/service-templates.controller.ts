import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ServiceTemplatesService, CreateServiceTemplateDto, UpdateServiceTemplateDto } from './service-templates.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('service-templates')
export class ServiceTemplatesController {
  constructor(private readonly serviceTemplatesService: ServiceTemplatesService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async findAll() {
    return this.serviceTemplatesService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async findById(@Param('id') id: string) {
    return this.serviceTemplatesService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async create(@Body() createDto: CreateServiceTemplateDto) {
    return this.serviceTemplatesService.create(createDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async update(@Param('id') id: string, @Body() updateDto: UpdateServiceTemplateDto) {
    return this.serviceTemplatesService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async remove(@Param('id') id: string) {
    return this.serviceTemplatesService.remove(id);
  }
}
