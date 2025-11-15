import { IsEnum, IsString, MinLength, IsOptional, IsIn } from 'class-validator';
import { UserRole } from '@prisma/client';

export class CreateRoleRequestDto {
  @IsEnum(UserRole)
  @IsIn(['EMPLOYEE', 'ADMIN'], {
    message: 'Apenas EMPLOYEE ou ADMIN podem ser solicitados',
  })
  requestedRole: 'EMPLOYEE' | 'ADMIN';

  @IsString()
  @MinLength(50, { message: 'Justificativa deve ter no mínimo 50 caracteres' })
  reason: string;

  // Campos específicos para Employee
  @IsString()
  @IsOptional()
  @MinLength(100, {
    message: 'Experiência profissional deve ter no mínimo 100 caracteres',
  })
  experience?: string;

  @IsString()
  @IsOptional()
  certifications?: string;

  @IsString()
  @IsOptional()
  motivation?: string;

  // Campos específicos para Admin
  @IsString()
  @IsOptional()
  department?: string;
}
