import { Module } from '@nestjs/common';
import { CommentsResolver } from './comments.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CommentsService } from './comments.service';

@Module({
  imports: [PrismaModule],
  providers: [CommentsService, CommentsResolver],
})
export class CommentsModule {}
