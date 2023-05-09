import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { SignUpInput } from './dto/sign-up.input';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { LoginInput } from './dto/login.input';
import { Logger, UseGuards } from '@nestjs/common';
import { AuthGuard } from './utils/auth.guard';
import { UserResponse } from 'src/users/dto/response-user';
import { User } from 'src/users/entities/user.entity';
import { MyContext } from 'src/utils/types';

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
  async logout(@Context() { req, res, redis }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err: unknown) => {
        console.log(req, res, redis);
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
}
