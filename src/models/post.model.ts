import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { GraphQLBigInt } from 'graphql-scalars';
import { User } from './user.model';
import { FieldError } from './general.model';

@ObjectType()
export class Post {
  @Field(() => Int)
    id: number;

  @Field()
    text!: string;

  @Field()
    title!: string;

  @Field(() => GraphQLBigInt)
    views: bigint;

  @Field()
    userId!: number;

  @Field()
    users!: User;

  @Field(() => [Image])
    images!: Image[] | [];

  @Field(() => [Comments])
    comments: Comments[];

  @Field(() => [PostLikes])
    post_likes: PostLikes[];

  @Field(() => Date)
    createdAt: Date;

  @Field(() => Date)
    updatedAt: Date;
}

@ObjectType()
export class PostLikes {
  @Field(() => Int)
    postId: number;

  @Field(() => Int)
    userId: number;

  @Field(() => Date)
    createdAt: Date;
}

@ObjectType()
export class Comments {
  @Field(() => Int)
    id: number;

  @Field(() => Int)
    postId: number;

  @Field(() => Int)
    userId: number;

  @Field(() => Date)
    createdAt: Date;

  @Field(() => Date)
    updatedAt: Date;
}

@InputType()
export class ImageInput {
  @Field(() => String)
    secure_url: string;

  @Field(() => String)
    public_id: string;
}

@InputType()
export class PostInput {
  @Field(() => String)
    title: string;

  @Field(() => String)
    text: string;

  @Field(() => [ImageInput])
    images: ImageInput[];
}

@InputType()
export class GetPostsInput {
  @Field(() => Number)
    limit?: number;

  @Field(() => Number)
    cursor?: number;

  @Field(() => String, { nullable: true })
    text?: string | null;

  @Field(() => String, { nullable: true })
    title?: string | null;
}

@InputType()
export class LikePostInput {
  @Field(() => Int)
    postId: number;

  @Field(() => Boolean)
    isLike: boolean;
}

@InputType()
export class ViewPostInput {
  @Field(() => Int)
    postId: number;

  @Field(() => GraphQLBigInt)
    views: bigint;
}

@ObjectType()
export class Image {
  @Field(() => Int)
    id: number;

  @Field(() => String)
    secure_url!: string;

  @Field(() => String)
    public_id: string;

  @Field(() => Int)
    postId: number;

  @Field(() => Date)
    createdAt: Date;
}

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
