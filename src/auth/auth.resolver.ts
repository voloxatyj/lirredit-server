import { Resolver, Mutation, Args, Int } from '@nestjs/graphql';
import { Auth } from './entities/auth.entity';
import { UserService } from 'src/user/user.service';
import { UserResponse } from 'src/user/dto/response-user';
import { CreateUserInput } from 'src/user/dto/create-user.input';
import { UpdateUserInput } from 'src/user/dto/update-user.input';

@Resolver(Auth)
export class AuthResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => UserResponse)
  signUp(@Args('createAuthInput') createAuthInput: CreateUserInput): Promise<UserResponse> {
    return this.userService.create(createAuthInput);
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
