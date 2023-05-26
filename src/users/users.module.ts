import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [PrismaModule],
  exports: [UsersService],
  providers: [UsersResolver, UsersService],
})
export class UsersModule {}
