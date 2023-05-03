import * as argon2 from 'argon2';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { validateRegister } from 'src/utils/validation';
import { AuthResponse } from './dto/response-auth';
import { SignUpInput } from './dto/sign-up.input';
import { LoginInput } from './dto/login.input';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(private prisma: PrismaService, private readonly userService: UsersService) {}

  async register(credentials: SignUpInput, req: any): Promise<AuthResponse> {
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
      if (error.code === 'P2002') {
        return {
          errors: [
            {
              field: error.meta.target[0],
              message: `${error.meta.target[0]} already taken`,
            },
          ],
        };
      }

      this.logger.error(`Failed to create user`, error.stack);
      throw new InternalServerErrorException();
    }

    req.session.userId = user.id;

    return {
      user,
    };
  }

  async login({ usernameOrEmail, password }: LoginInput, req: any) {
    let user = null;

    try {
      if (usernameOrEmail.includes('@')) {
        user = await this.prisma.user.findUnique({ where: { email: usernameOrEmail } });
      } else {
        user = await this.prisma.user.findUnique({ where: { username: usernameOrEmail } });
      }
    } catch (error) {
      this.logger.error(`Failed to login`, error.stack);
      throw new InternalServerErrorException();
    }

    if (!user) {
      return {
        errors: [
          {
            field: 'usernameOrEmail',
            message: "that username doesn't exist",
          },
        ],
      };
    }

    const valid = await argon2.verify(user.password, password);

    if (!valid) {
      return {
        errors: [
          {
            field: 'password',
            message: 'incorrect password',
          },
        ],
      };
    }

    req.session.userId = user.id;

    return {
      user,
    };
  }

  async validateUser({ usernameOrEmail, password }: LoginInput) {
    const user = await this.userService.findOne(usernameOrEmail);
    const result = await argon2.verify(password, user.password);
    return result;
  }
}
