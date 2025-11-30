import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Param,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { PrismaService } from '../prisma.service';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private prisma: PrismaService,
  ) {}

  @Public()
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const user = await this.authService.register(
      dto.email,
      dto.password,
      dto.name,
    );
    return { user };
  }

  @Public()
  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }

  @Post('logout')
  async logout(@Req() req: Request) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return { success: true };

    const token = authHeader.split(' ')[1];
    return this.authService.revokeToken(token);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@Req() req: any) {
    return req.user;
  }

  @Public()
  @Get('check-username/:name')
  async checkUsername(@Param('name') name: string) {
    const normalizedName = name.trim();
    const user = await this.prisma.user.findFirst({
      where: { name: { equals: normalizedName, mode: 'insensitive' } },
    });
    return { available: !user };
  }

  @Public()
  @Get('check-email/:email')
  async checkEmail(@Param('email') email: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    return { available: !user };
  }
}
