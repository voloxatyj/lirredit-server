import * as argon2 from 'argon2';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { validateRegister } from 'src/utils/validation';
import { AuthResponse } from './dto/response-auth';
import { SignUpInput } from './dto/sign-up.input';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(private prisma: PrismaService) {}
  async create(credentials: SignUpInput): Promise<AuthResponse> {
    const errors = validateRegister(credentials);
    if (errors) {
      return { errors };
    }

    const hashedPassword = await argon2.hash(credentials.password);
    let user = null;
    try {
      user = await this.prisma.user.create({
        data: {
          email: credentials.email,
          username: credentials.username,
          password: hashedPassword,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to create user`, error.stack);
      throw new InternalServerErrorException();
    }

    return { user };
  }
}
