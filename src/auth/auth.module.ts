import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { LocalStrategy } from 'src/utils/authentication/local.strategy';
import { AuthSerializer } from 'src/utils/authentication/serializer';

@Module({
  imports: [UserModule, PrismaModule],
  providers: [AuthResolver, AuthService, LocalStrategy, AuthSerializer],
})
export class AuthModule {}
