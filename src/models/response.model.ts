import { Field, ObjectType } from '@nestjs/graphql';
import { Follows } from '@prisma/client';
import { FieldError, Post, User, Image, PostLikes, Comments } from './general.model';

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
    posts?: (Post & {
    users: User;
    images: Image[];
    post_likes: PostLikes[];
    comments: Comments[];
  })[];

  @Field(() => [Boolean])
    isLikes?: boolean[];
}

@ObjectType()
export class PostResponse {
  @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

  @Field(() => Post, { nullable: true })
    post?: Post & { users: User; images: Image[]; post_likes: PostLikes[]; comments: Comments[] };

  @Field(() => Boolean)
    isLike?: boolean;
}

@ObjectType()
export class LikeResponse {
  @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

  @Field(() => Boolean)
    success: boolean;

  @Field(() => String)
    message: string;
}

@ObjectType()
export class ViewResponse {
  @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

  @Field(() => Boolean)
    success?: boolean;

  @Field(() => String)
    message?: string;
}
