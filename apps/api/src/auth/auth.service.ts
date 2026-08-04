import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';

export interface JwtPayload {
  sub: string;
  email: string;
  username: string;
}

export const ACCESS_TOKEN_COOKIE = 'hunterrd_token';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {}

  static setAuthCookie(res: Response, token: string) {
    res.cookie(ACCESS_TOKEN_COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  static clearAuthCookie(res: Response) {
    res.clearCookie(ACCESS_TOKEN_COOKIE, { path: '/' });
  }

  async register(dto: RegisterDto) {
    const existingEmail = await this.users.findByEmail(dto.email);
    if (existingEmail) throw new ConflictException('Email already in use');

    const existingUsername = await this.users.findByUsername(dto.username);
    if (existingUsername) throw new ConflictException('Username already taken');

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.users.create({
      email: dto.email,
      username: dto.username,
      passwordHash,
      institution: dto.institution,
    });
    return this.signTokenFor(user);
  }

  async login(dto: LoginDto) {
    const user = await this.users.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    return this.signTokenFor(user);
  }

  private signTokenFor(user: { id: string; email: string; username: string }) {
    const payload: JwtPayload = { sub: user.id, email: user.email, username: user.username };
    return {
      accessToken: this.jwt.sign(payload),
      user: { id: user.id, email: user.email, username: user.username },
    };
  }
}
