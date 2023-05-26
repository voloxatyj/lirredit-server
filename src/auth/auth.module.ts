import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { LocalStrategy } from './utils/local.strategy';
import { AuthSerializer } from './utils/serializer';

@Module({
  imports: [UsersModule, PrismaModule],
  providers: [AuthResolver, AuthService, LocalStrategy, AuthSerializer],
})
export class AuthModule {}
