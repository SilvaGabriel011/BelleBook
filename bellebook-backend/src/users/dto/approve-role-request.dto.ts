import { IsString, IsOptional } from 'class-validator';

export class ApproveRoleRequestDto {
  @IsString()
  @IsOptional()
  notes?: string;
}
