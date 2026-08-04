import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto/create-product.dto';

export type ProductSort = 'new' | 'top' | 'trending';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(opts: { sort?: ProductSort; categorySlug?: string; page?: number; limit?: number; search?: string }) {
    const { sort = 'new', categorySlug, page = 1, limit = 20, search } = opts;
    const take = Math.min(50, Math.max(1, limit));
    const skip = (Math.max(1, page) - 1) * take;

    const where: any = {};
    if (categorySlug) where.category = { slug: categorySlug };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { tagline: { contains: search, mode: 'insensitive' } },
      ];
    }

    const orderBy =
      sort === 'new'
        ? { createdAt: 'desc' as const }
        : sort === 'top'
        ? { votes: { _count: 'desc' as const } }
        : { createdAt: 'desc' as const };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        orderBy,
        take,
        skip,
        include: this.defaultInclude(),
      }),
      this.prisma.product.count({ where }),
    ]);

    return { items, total, page, limit: take, hasMore: skip + take < total };
  }

  async findById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        ...this.defaultInclude(),
        comments: {
          orderBy: { createdAt: 'desc' },
          include: { user: { select: { id: true, username: true, avatarUrl: true } } },
        },
      },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  create(hunterId: string, dto: CreateProductDto) {
    return this.prisma.product.create({
      data: { ...dto, hunterId },
      include: this.defaultInclude(),
    });
  }

  async update(id: string, userId: string, dto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    if (product.hunterId !== userId) throw new ForbiddenException('Not your product');
    return this.prisma.product.update({ where: { id }, data: dto, include: this.defaultInclude() });
  }

  async remove(id: string, userId: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    if (product.hunterId !== userId) throw new ForbiddenException('Not your product');
    await this.prisma.product.delete({ where: { id } });
    return { deleted: true };
  }

  private defaultInclude() {
    return {
      hunter: { select: { id: true, username: true, avatarUrl: true } },
      category: { select: { id: true, name: true, slug: true, color: true } },
      _count: { select: { votes: true, comments: true } },
    };
  }
}
