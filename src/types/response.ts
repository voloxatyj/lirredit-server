import { Field, ObjectType } from '@nestjs/graphql';
import { Follows } from '@prisma/client';
import { FieldError, Post, User, Image } from './general';

/* USER RESPONSE TYPES */

@ObjectType()
export class UserResponse {
  @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

  @Field(() => User, { nullable: true })
    user?: User;
}

@ObjectType()
export class UsersResponse {
  @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

  @Field(() => [User], { nullable: true })
    users?: (User & { followedBy: Follows[]; following: Follows[] })[];
}

/* AUTH RESPONSE TYPES */

@ObjectType()
export class PasswordAuthResponse {
  @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

  @Field(() => Boolean)
    success: boolean;
}

/* Post RESPONSE TYPES */

@ObjectType()
export class PostsResponse {
  @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

  @Field(() => [Post], { nullable: true })
    posts?: (Post & { users: User; images: Image[] })[];
}

@ObjectType()
export class PostResponse {
  @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

  @Field(() => Post, { nullable: true })
    post?: (Post & { users: User; images: Image[] });
}
