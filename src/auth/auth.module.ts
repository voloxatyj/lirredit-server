import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from './auth.service';

@Module({
  providers: [AuthResolver, AuthService, PrismaService, AuthService],
})
export class AuthModule {}
