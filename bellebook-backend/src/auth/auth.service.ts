import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto, LoginDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Check if email already exists
    const existingUser = await this.usersService.findByEmail(registerDto.email);

    if (existingUser) {
      throw new ConflictException('Email já está em uso');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Create user with CUSTOMER role and ACTIVE status
    const user = await this.usersService.create({
      email: registerDto.email,
      password: hashedPassword,
      name: registerDto.name,
      displayName: registerDto.displayName || registerDto.name,
      phone: registerDto.phone,
    });

    // Generate token
    const token = this.generateToken(user.id, user.email, user.role);

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        displayName: user.displayName,
        phone: user.phone,
        role: user.role,
        accountStatus: user.accountStatus,
        points: user.points,
      },
    };
  }

  async login(loginDto: LoginDto) {
    // Find user
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Update last login
    await this.usersService.updateLastLogin(user.id);

    // Generate token
    const token = this.generateToken(user.id, user.email, user.role);

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        displayName: user.displayName,
        phone: user.phone,
        role: user.role,
        accountStatus: user.accountStatus,
        points: user.points,
      },
    };
  }

  private generateToken(userId: string, email: string, role: string): string {
    const payload = { sub: userId, email, role };
    return this.jwtService.sign(payload);
  }

  async validateUser(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
