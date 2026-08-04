import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(cfg: ConfigService) {
    const secret =
      cfg.get<string>('JWT_SECRET') ??
      (process.env.NODE_ENV === 'production' ? undefined : 'dev-insecure-secret-change-me');

    if (!secret) {
      throw new Error('JWT_SECRET is required in production');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload) {
    return { id: payload.sub, email: payload.email, username: payload.username };
  }
}
