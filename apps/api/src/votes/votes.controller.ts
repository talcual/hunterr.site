import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { VotesService } from './votes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../auth/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('votes')
export class VotesController {
  constructor(private readonly votes: VotesService) {}

  @Post(':productId/toggle')
  toggle(@CurrentUser() user: AuthUser, @Param('productId') productId: string) {
    return this.votes.toggle(user.id, productId);
  }

  @Get('me')
  myVotes(@CurrentUser() user: AuthUser) {
    return this.votes.listByUser(user.id);
  }
}
