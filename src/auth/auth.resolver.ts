import { Resolver, Mutation, Args, Int } from '@nestjs/graphql';
import { Auth } from './entities/auth.entity';
import { UpdateUserInput } from 'src/user/dto/update-user.input';
import { AuthResponse } from './dto/response-auth';
import { SignUpInput } from './dto/sign-up.input';
import { AuthService } from './auth.service';

@Resolver(Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse)
  signUp(@Args('credentials') credentials: SignUpInput): Promise<AuthResponse> {
    return this.authService.create(credentials);
  }

  @Mutation(() => Auth)
  updateAuth(@Args('updateAuthInput') updateAuthInput: UpdateUserInput) {
    console.log(updateAuthInput);
  }

  @Mutation(() => Auth)
  removeAuth(@Args('id', { type: () => Int }) id: number) {
    console.log(id);
  }
}
