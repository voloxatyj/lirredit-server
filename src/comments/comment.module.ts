import { Module } from '@nestjs/common';
import { CommentResolver } from './comment.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CommentService } from './comment.service';

@Module({
  imports: [PrismaModule],
  providers: [CommentService, CommentResolver],
})
export class CommentModule {}
