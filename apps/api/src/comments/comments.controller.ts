import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../auth/decorators/current-user.decorator';

@Controller()
export class CommentsController {
  constructor(private readonly comments: CommentsService) {}

  @Get('products/:productId/comments')
  list(@Param('productId') productId: string) {
    return this.comments.listByProduct(productId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('products/:productId/comments')
  create(
    @Param('productId') productId: string,
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateCommentDto,
  ) {
    return this.comments.create(user.id, productId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('comments/:id')
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.comments.remove(id, user.id);
  }
}
