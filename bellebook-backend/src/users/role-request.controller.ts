import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';
import { RoleRequestService } from './role-request.service';
import { CreateRoleRequestDto } from './dto/create-role-request.dto';
import { ApproveRoleRequestDto } from './dto/approve-role-request.dto';
import { RejectRoleRequestDto } from './dto/reject-role-request.dto';

@Controller('role-requests')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RoleRequestController {
  constructor(private readonly roleRequestService: RoleRequestService) {}

  @Post()
  async createRequest(
    @Body() dto: CreateRoleRequestDto,
    @CurrentUser() user: any,
  ) {
    return this.roleRequestService.requestRoleChange(
      user.id,
      dto.requestedRole,
      dto.reason,
    );
  }

  @Get()
  async getUserRequests(@CurrentUser() user: any) {
    return this.roleRequestService.getUserRequests(user.id);
  }

  @Get('pending')
  @Roles(UserRole.ADMIN)
  async getPendingRequests() {
    return this.roleRequestService.getPendingRequests();
  }

  @Get(':id')
  async getRequestById(@Param('id') id: string, @CurrentUser() user: any) {
    const request = await this.roleRequestService.getRequestById(id);

    // Usuários normais só podem ver suas próprias solicitações
    if (user.role !== UserRole.ADMIN && request.userId !== user.id) {
      throw new Error('Não autorizado');
    }

    return request;
  }

  @Patch(':id/approve')
  @Roles(UserRole.ADMIN)
  async approveRequest(
    @Param('id') id: string,
    @Body() dto: ApproveRoleRequestDto,
    @CurrentUser() user: any,
  ) {
    return this.roleRequestService.approveRoleRequest(id, user.id, dto.notes);
  }

  @Patch(':id/reject')
  @Roles(UserRole.ADMIN)
  async rejectRequest(
    @Param('id') id: string,
    @Body() dto: RejectRoleRequestDto,
    @CurrentUser() user: any,
  ) {
    return this.roleRequestService.rejectRoleRequest(id, user.id, dto.reason);
  }
}
