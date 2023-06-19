import { UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MyContext, User } from 'src/types/general';
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
  @Query(() => User, { nullable: true, name: 'getUser' })
  async getUser(@Context() { req }: MyContext) {
    if (!req.session.userId) {
      return null;
    }

    return this.userService.findById(req.session.userId);
  }

  @UseGuards(AuthGuard)
  @Query(() => [User], { name: 'findUsers' })
  async findUsers(@Context() { req }: MyContext) {
    return this.userService.findUsers(req.session.userId);
  }

  @UseGuards(AuthGuard)
  @Query(() => User, { name: 'findOne' })
  async findOne(@Args('email') email: string) {
    return this.userService.findOne(email);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => User)
  async updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.userService.update(updateUserInput.id, updateUserInput);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => User)
  async removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.userService.remove(id);
  }
}
