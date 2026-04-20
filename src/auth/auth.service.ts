import { ConflictException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterRequest } from './dto/register.dto';
import * as argon2 from 'argon2';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt.interface';
import { LoginRequest } from './dto/login.dto';
import type { Response, Request } from 'express';
import { Logger } from 'logger';
import { LOGGER } from 'src/logger/logger.token';

@Injectable()
export class AuthService {
  constructor(
    @Inject(LOGGER) private readonly logger: Logger,
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
  ) {}

  async register(res: Response, dto: RegisterRequest) {
    const { username, password } = dto;

    const exist = await this.prisma.user.findUnique({
      where: { username },
    });

    if (exist) {
      throw new ConflictException('Пользователь уже существует');
    }

    const hash = await argon2.hash(password);

    const user = await this.prisma.user.create({
      data: {
        username,
        password_hash: hash,
      },
    });

    return this.auth(res, user.user_id);
  }

  async login(res: Response, dto: LoginRequest) {
    const { username, password } = dto;

    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const valid = await argon2.verify(user.password_hash, password);

    if (!valid) {
      throw new UnauthorizedException('Неверный пароль');
    }
    this.logger.info('User authenticated', {
      source: 'system',
      meta: { id: user.user_id },
    });
    return this.auth(res, user.user_id);
  }

  async refresh(req: Request, res: Response) {
    const token = req.cookies.refreshToken;

    if (!token) {
      throw new UnauthorizedException('Нет refresh токена');
    }

    let payload: JwtPayload;

    try {
      payload = await this.jwt.verifyAsync(token);
    } catch {
      throw new UnauthorizedException('Невалидный refresh токен');
    }

    const user = await this.prisma.user.findUnique({
      where: { user_id: Number(payload.user_id) },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return this.auth(res, user.user_id);
  }

  async logout(res: Response) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return { message: 'Выход выполнен' };
  }

  async validate(user_id: number) {
    const user = await this.prisma.user.findUnique({
      where: { user_id },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user;
  }

  private auth(res: Response, userId: number) {
    const payload: JwtPayload = {
      user_id: userId,
    };

    const accessToken = this.jwt.sign(payload, {
      expiresIn: this.config.get('JWT_ACCESS_TOKEN_TTL'),
    });

    const refreshToken = this.jwt.sign(payload, {
      expiresIn: this.config.get('JWT_REFRESH_TOKEN_TTL'),
    });

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });

    return { accessToken };
  }
}
