import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ServiceAttributesService, CreateServiceAttributeDto, UpdateServiceAttributeDto } from './service-attributes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('service-attributes')
export class ServiceAttributesController {
  constructor(private readonly serviceAttributesService: ServiceAttributesService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async findAll() {
    return this.serviceAttributesService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async findById(@Param('id') id: string) {
    return this.serviceAttributesService.findById(id);
  }

  @Get('service/:serviceId')
  async findByServiceId(@Param('serviceId') serviceId: string) {
    return this.serviceAttributesService.findByServiceId(serviceId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async create(@Body() createDto: CreateServiceAttributeDto) {
    return this.serviceAttributesService.create(createDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async update(@Param('id') id: string, @Body() updateDto: UpdateServiceAttributeDto) {
    return this.serviceAttributesService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async remove(@Param('id') id: string) {
    return this.serviceAttributesService.remove(id);
  }
}
