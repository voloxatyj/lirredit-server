import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  exports: [UsersService],
  providers: [UsersResolver, UsersService, PrismaService],
})
export class UsersModule {}
