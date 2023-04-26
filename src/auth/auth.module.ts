import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from './auth.service';
import { LocalStrategy } from './utils/local.strategy';
import { AuthSerializer } from './utils/serializer';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  providers: [AuthResolver, AuthService, PrismaService, LocalStrategy, AuthSerializer],
})
export class AuthModule {}
