import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, Matches } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @IsString()
  @IsOptional()
  displayName?: string;

  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Telefone em formato inválido. Use formato internacional (+5511999999999)' })
  @IsNotEmpty({ message: 'Telefone é obrigatório' })
  phone: string;
}
