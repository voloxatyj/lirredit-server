import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [UserModule],
  providers: [AuthResolver, UserService, PrismaService],
})
export class AuthModule {}
