import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AdminUsersService } from '../services/admin-users.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminUsersController {
  constructor(private usersService: AdminUsersService) {}

  @Get()
  async getAllUsers(@Query() filters: any) {
    return this.usersService.getAllUsers(filters);
  }

  @Get('stats')
  async getUserStats() {
    return this.usersService.getUserStats();
  }

  @Get('employees')
  async getAllEmployees(@Query() filters: any) {
    return this.usersService.getAllEmployees(filters);
  }

  @Get(':id')
  async getUserDetails(@Param('id') id: string) {
    return this.usersService.getUserDetails(id);
  }

  @Patch(':id/suspend')
  async suspendUser(
    @Param('id') id: string,
    @Body() body: { reason: string },
    @Req() req: any,
  ) {
    return this.usersService.suspendUser(
      id,
      req.user.id,
      body.reason,
      req.ip,
      req.headers['user-agent'],
    );
  }

  @Patch(':id/reactivate')
  async reactivateUser(@Param('id') id: string, @Req() req: any) {
    return this.usersService.reactivateUser(
      id,
      req.user.id,
      req.ip,
      req.headers['user-agent'],
    );
  }

  @Patch('employees/:id')
  async updateEmployeeProfile(
    @Param('id') id: string,
    @Body() data: any,
    @Req() req: any,
  ) {
    return this.usersService.updateEmployeeProfile(
      id,
      req.user.id,
      data,
      req.ip,
      req.headers['user-agent'],
    );
  }
}
