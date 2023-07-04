import { UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { MyContext, User } from 'src/types/general';
import { UpdateUserInput } from 'src/types/request';
import { AuthGuard } from 'src/utils/authentication/auth.guard';
import { UserResponse } from '../types/response';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Query(() => User, { nullable: true, name: 'getUser' })
  async getUser(@Context() { req }: MyContext): Promise<User> {
    if (!req.session.userId) {
      return null;
    }

    return this.userService.findById(req.session.userId);
  }

  @UseGuards(AuthGuard)
  @Query(() => [User], { name: 'findUsers' })
  async findUsers(@Context() { req }: MyContext): Promise<User[]> {
    return this.userService.findUsers(req.session.userId);
  }

  @UseGuards(AuthGuard)
  @Query(() => UserResponse, { name: 'findOne' })
  async findOne(@Args('email') email: string): Promise<UserResponse> {
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

  @ResolveField(() => String)
  avatarName(@Parent() user: User) {
    const name = user.username.slice(0, 2).toUpperCase();
    const avatarName = `${name[0]} ${name[1]}`;
    return avatarName;
  }

  @ResolveField(() => String)
  short_username(@Parent() user: User) {
    return user.username.substring(0, 5);
  }
}
