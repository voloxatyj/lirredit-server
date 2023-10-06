import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { User } from './user.model';
import { FieldError } from './general.model';
import { Comments } from '@prisma/client';
import { GraphQLBigInt } from 'graphql-scalars';
import { Image } from './post.model';

@ObjectType()
export class CommentObject {
  @Field(() => Int)
    id: number;

  @Field(() => String)
    text!: string;

  @Field(() => Int)
    postId!: number;

  @Field(() => Int)
    userId!: number;

  @Field(() => GraphQLBigInt)
    views: bigint;

  @Field(() => [Image], { nullable: true })
    images!: Image[] | [];

  @Field(() => Int, { nullable: true })
    commentId: number;

  @Field()
    users: User;

  @Field(() => Date)
    createdAt: Date;

  @Field(() => Date)
    updatedAt: Date;
}

@ObjectType()
export class CommentLikes {
  @Field(() => Int)
    userId: number;

  @Field(() => [User])
    users!: User[] | [];

  @Field(() => Int)
    commentId: number;

  @Field(() => [User])
    comments!: User[] | [];

  @Field(() => Date)
    createdAt: Date;
}

@ObjectType()
export class CommentResponse {
  @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

  @Field(() => Boolean)
    success: boolean;

  @Field(() => CommentObject)
    comment: Comments & { users: User };
}

@ObjectType()
export class CommentsResponse {
  @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

  @Field(() => Boolean)
    success: boolean;

  @Field(() => [CommentObject])
    comments: (Comments & {
    users: User;
  })[];
}

@InputType()
export class CommentInput {
  @Field()
    text: string;

  @Field(() => Int)
    postId: number;
}

@InputType()
export class CommentsInput {
  @Field(() => Int)
    postId: number;
}
