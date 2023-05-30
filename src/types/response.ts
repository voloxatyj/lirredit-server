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
export class PostResponse {
  @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

  @Field(() => Post, { nullable: true })
    post?: Post;

  @Field(() => Post, { nullable: true })
    posts?: Post[];

  @Field(() => User, { nullable: true })
    author?: User;
}
