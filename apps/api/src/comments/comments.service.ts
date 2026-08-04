import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: string, productId: string, dto: CreateCommentDto) {
    return this.prisma.comment.create({
      data: { ...dto, userId, productId },
      include: { user: { select: { id: true, username: true, avatarUrl: true } } },
    });
  }

  listByProduct(productId: string) {
    return this.prisma.comment.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, username: true, avatarUrl: true } } },
    });
  }

  async remove(id: string, userId: string) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.userId !== userId) throw new ForbiddenException('Not your comment');
    await this.prisma.comment.delete({ where: { id } });
    return { deleted: true };
  }
}
