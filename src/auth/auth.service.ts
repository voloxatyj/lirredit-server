import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';

import * as argon2 from 'argon2';
import { uuid } from 'uuidv4';

import { PrismaService } from 'src/prisma/prisma.service';
import { UserResponse } from 'src/users/dto/response-user';
import { UsersService } from 'src/users/users.service';
import { validateEmail, validateRegister } from 'src/utils/validation';
import { LoginInput } from './dto/login.input';
import { PasswordAuthResponse } from './dto/response-auth-password';
import { SignUpInput } from './dto/sign-up.input';
import { sendEmail } from 'src/utils/sendEmai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private readonly userService: UsersService,
    private configService: ConfigService
  ) {}

  async register(credentials: SignUpInput, req: any): Promise<UserResponse> {
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

  async forgotPassword(email: string): Promise<PasswordAuthResponse> {
    const is_email_valid = validateEmail({ email });

    if (is_email_valid) {
      return {
        errors: is_email_valid,
        success: false,
      };
    }

    const token = uuid();
    const clientURL = `${this.configService.get('CLIENT_PROTOCOL')}://${this.configService.get(
      'CLIENT_HOST',
    )}:${this.configService.get('CLIENT_PORT')}`;

    try {
      const user = await this.prisma.user.update({
        where: { email },
        data: { token },
      });


      const link = `${clientURL}/passwordReset/${token}`;

      if (user) {
        sendEmail(
          email,
          'Password Reset Request',
          {
            name: user.username,
            link,
          },
          './template/requestResetPassword.handlebars',
        );
        return { success: true };
      }

      return {
        errors: [
          {
            field: 'email',
            message: "can't find such email",
          },
        ],
        success: false,
      };
    } catch (error) {
      this.logger.error(`Failed to send forgotPassword message`, error.stack);
      throw new InternalServerErrorException();
    }
  }
}
