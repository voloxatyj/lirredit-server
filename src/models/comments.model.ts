import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { User } from './user.model';
import { FieldError } from './general.model';
import { Comments } from '@prisma/client';

@ObjectType()
export class CommentsObject {
  @Field(() => Int)
    id: number;

  @Field(() => String)
    text!: string;

  @Field(() => Int)
    postId!: number;

  @Field(() => Int)
    userId!: number;

  @Field(() => Int)
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

  @Field(() => CommentsObject)
    comment: Comments & { users: User };
}

@ObjectType()
export class CommentsResponse {
  @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

  @Field(() => Boolean)
    success: boolean;

  @Field(() => [CommentsObject])
    comments: (Comments & {
    users: User;
  })[];
}

@InputType()
export class CommentsInput {
  @Field()
    text: string;

  @Field(() => Int)
    postId: number;
}
