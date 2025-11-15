import { IsString, MinLength } from 'class-validator';

export class RejectRoleRequestDto {
  @IsString()
  @MinLength(10, {
    message: 'Razão da rejeição deve ter no mínimo 10 caracteres',
  })
  reason: string;
}
