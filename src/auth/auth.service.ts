import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';

import { v4 as uuidv4 } from 'uuid';

import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserResponse } from 'src/users/dto/response-user';
import { UsersService } from 'src/users/users.service';
import { sendEmail } from 'src/utils/sendEmai';
import { validateEmail, validatePassword, validateRegister } from 'src/utils/validation';
import { ChangePasswordInput } from './dto/change-password.input';
import { LoginInput } from './dto/login.input';
import { PasswordAuthResponse } from './dto/response-auth-password';
import { SignUpInput } from './dto/sign-up.input';
import { Request } from 'express';
import { hashingPassword, verifyingPassword } from 'src/utils/helpers';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private readonly userService: UsersService,
    private config: ConfigService,
  ) {}

  async register(credentials: SignUpInput, req: Request): Promise<UserResponse> {
    const errors = validateRegister(credentials);

    if (errors) {
      return { errors };
    }

    const hashedPassword = await hashingPassword(credentials.password);
    let user = null;

    try {
      user = await this.prisma.users.create({
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

  async login({ usernameOrEmail, password }: LoginInput, req: Request): Promise<UserResponse> {
    let user = null;

    try {
      user = await this.prisma.users.findFirst({
        where: usernameOrEmail.includes('@')
          ? { email: usernameOrEmail }
          : { username: usernameOrEmail },
      });
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

    const valid = await verifyingPassword(user.password, password);

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
    const result = await verifyingPassword(password, user.password);
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

    const token = uuidv4();
    const clientURL = `${this.config.get('CLIENT_PROTOCOL')}://${this.config.get(
      'CLIENT_HOST',
    )}:${this.config.get('CLIENT_PORT')}`;

    try {
      const user = await this.prisma.users.update({
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

  async changePassword({ password, token }: ChangePasswordInput, req: any): Promise<UserResponse> {
    try {
      const user = await this.prisma.users.findUnique({ where: { token } });

      if (!user) {
        return {
          errors: [
            {
              field: 'token',
              message: 'token expired',
            },
          ],
        };
      }

      const is_password_not_valide = validatePassword({ password });

      if (is_password_not_valide) {
        return { errors: is_password_not_valide };
      }

      const hashedPassword = await hashingPassword(password);

      await this.prisma.users.update({
        where: { id: user.id },
        data: { password: hashedPassword, token: null },
      });

      sendEmail(
        user.email,
        'Password Changed Successfully',
        {
          name: user.username,
        },
        './template/resetPassword.handlebars',
      );

      req.session.userId = user.id;

      return { user };
    } catch (error) {
      this.logger.error(`Failed to change password`, error.stack);
      throw new InternalServerErrorException();
    }
  }
}
