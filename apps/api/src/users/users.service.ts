import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from '../auth/dto/auth.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findByUsername(username: string) {
    return this.prisma.user.findUnique({ where: { username } });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        bio: true,
        avatarUrl: true,
        institution: true,
        createdAt: true,
        _count: { select: { products: true, votes: true } },
      },
    });
  }

  async getPublicProfile(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        bio: true,
        avatarUrl: true,
        institution: true,
        createdAt: true,
        products: {
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            name: true,
            tagline: true,
            logoUrl: true,
            createdAt: true,
            _count: { select: { votes: true, comments: true } },
          },
        },
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  create(data: { email: string; username: string; passwordHash: string; institution?: string }) {
    return this.prisma.user.create({
      data,
      select: { id: true, email: true, username: true, institution: true, createdAt: true },
    });
  }

  update(id: string, dto: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: { id: true, email: true, username: true, bio: true, avatarUrl: true, institution: true },
    });
  }
}
