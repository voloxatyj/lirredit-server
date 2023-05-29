import { UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from 'src/types/general';
import { UpdateUserInput } from 'src/types/request';
import { AuthGuard } from 'src/utils/authentication/auth.guard';
import { UserResponse } from '../types/response';
import { UserService } from './user.service';

@Resolver(User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => UserResponse)
  create() {
    // return this.userService.create();
  }

  @UseGuards(AuthGuard)
  @Query(() => User, { nullable: true })
  getUser(@Context() { req }: any) {
    if (!req.session.userId) {
      return null;
    }

    return this.userService.findById(req.session.userId);
  }

  @Query(() => [User], { name: 'user' })
  findAll() {
    return this.userService.findAll();
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('email') email: string) {
    return this.userService.findOne(email);
  }

  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.userService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => User)
  removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.userService.remove(id);
  }
}
