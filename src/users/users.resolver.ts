import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto/update-user.input';
import { UserResponse } from './dto/response-user';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/utils/auth.guard';

@Resolver(User)
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}

  @Mutation(() => UserResponse)
  create() {
    // return this.userService.create();
  }

  @UseGuards(AuthGuard)
  @Query(() => User, { nullable: true })
  getUser(@Context() { req }: any) {
    // you are not logged in
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
