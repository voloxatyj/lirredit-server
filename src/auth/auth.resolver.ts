import { Logger, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { MyContext } from 'src/models/general.model';
import { ChangePasswordInput, LoginInput, SignUpInput, AuthResponse } from 'src/models/auth.model';
import { User, UserResponse } from 'src/models/user.model';
import { AuthGuard } from 'src/utils/authentication/auth.guard';
import { AuthService } from './auth.service';

@Resolver(User)
export class AuthResolver {
  private logger = new Logger(AuthResolver.name);

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Mutation(() => UserResponse)
  async signUp(
    @Args('credentials') credentials: SignUpInput,
    @Context() { req }: MyContext,
  ): Promise<UserResponse> {
    return this.authService.register(credentials, req);
  }

  @Mutation(() => UserResponse)
  async login(
    @Args('credentials') credentials: LoginInput,
    @Context() { req }: MyContext,
  ): Promise<UserResponse> {
    return this.authService.login(credentials, req);
  }

  @UseGuards(AuthGuard)
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
  @Mutation(() => AuthResponse)
  async forgotPassword(@Args('email') email: string): Promise<AuthResponse> {
    return this.authService.forgotPassword(email);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => UserResponse)
  async changePassword(
    @Args('credentials') credentials: ChangePasswordInput,
    @Context() { req }: MyContext,
  ): Promise<UserResponse> {
    return this.authService.changePassword(credentials, req);
  }
}
