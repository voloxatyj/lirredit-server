import { Logger, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { UserResponse } from 'src/users/dto/response-user';
import { User } from 'src/users/entities/user.entity';
import { MyContext } from 'src/utils/types';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { PasswordAuthResponse } from './dto/response-auth-password';
import { SignUpInput } from './dto/sign-up.input';
import { AuthGuard } from './utils/auth.guard';

@Resolver(User)
export class AuthResolver {
  private logger = new Logger(AuthResolver.name);

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @UseGuards(AuthGuard)
  @Mutation(() => UserResponse)
  async signUp(
    @Args('credentials') credentials: SignUpInput,
    @Context() { req }: MyContext,
  ): Promise<UserResponse> {
    return this.authService.register(credentials, req);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => UserResponse, { nullable: true })
  async login(
    @Args('credentials') credentials: LoginInput,
    @Context() { req }: MyContext,
  ): Promise<UserResponse> {
    return this.authService.login(credentials, req);
  }

  @Mutation(() => Boolean)
  async logout(@Context() { req, res }: MyContext) {
    return new Promise(resolve =>
      req.session.destroy((err: unknown) => {
        res.clearCookie(this.configService.get('COOKIE_NAME'));

        if (err) {
          this.logger.error(err);
          resolve(false);
          return;
        }

        resolve(true);
      }),
    );
  }

  @UseGuards(AuthGuard)
  @Mutation(() => PasswordAuthResponse)
  async forgotPassword(@Args('email') email: string): Promise<PasswordAuthResponse> {
    return this.authService.forgotPassword(email);
  }
}
