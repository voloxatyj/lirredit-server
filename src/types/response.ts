import { Field, ObjectType } from '@nestjs/graphql';
import { FieldError, Post, User } from './general';

/* USER RESPONSE TYPES */

@ObjectType()
export class UserResponse {
  @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

  @Field(() => User, { nullable: true })
    user?: User;
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
  @Field(() => String, { nullable: true })
    error?: string;

  @Field(() => [Post])
    posts: Post[];
}

@ObjectType()
export class PostResponse {
  @Field(() => String, { nullable: true })
    error?: string;

  @Field(() => Post)
    post: Post;
}
