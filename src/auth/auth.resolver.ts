import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';
import { Auth } from './entities/auth.entity';
import { AuthResponse } from './dto/response-auth';
import { SignUpInput } from './dto/sign-up.input';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { LoginInput } from './dto/login.input';
import { Logger, UseGuards } from '@nestjs/common';
import { AuthGuard } from './utils/auth.guard';

@Resolver(Auth)
export class AuthResolver {
  private logger = new Logger(AuthResolver.name);

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Mutation(() => AuthResponse)
  @UseGuards(AuthGuard)
  async signUp(
    @Args('credentials') credentials: SignUpInput,
    @Context() { req }: any,
  ): Promise<AuthResponse> {
    return this.authService.create(credentials, req);
  }

  @UseGuards(AuthGuard)
  @Query(() => AuthResponse, { nullable: true })
  async login(
    @Args('credentials') credentials: LoginInput,
    @Context() { req }: any,
  ): Promise<AuthResponse> {
    return this.authService.login(credentials, req);
  }

  @Mutation(() => Boolean)
  async logout(@Context() { req, res }: any) {
    return new Promise(resolve =>
      req.session.destroy((err: any) => {
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
