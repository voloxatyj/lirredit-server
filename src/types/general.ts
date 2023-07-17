import { Field, ObjectType, Int } from '@nestjs/graphql';
import { Request, Response } from 'express';
import { Session, SessionData } from 'express-session';

declare module 'express-session' {
  interface SessionData {
    userId: number;
  }
}

export const CLOUDINARY = 'Cloudinary';

export type MyContext = {
  req: Request & {
    session: Session & Partial<SessionData>;
  };
  res: Response;
};

@ObjectType()
export class FieldError {
  @Field()
    field: string;
  @Field()
    message: string;
}

@ObjectType()
export class User {
  @Field(() => Int)
    id: number;

  @Field()
    username!: string;

  @Field()
    email!: string;

  @Field({ nullable: true })
    image: string;

  @Field(() => Date)
    createdAt: Date;

  @Field(() => Date)
    updatedAt: Date;
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
export class Post {
  @Field(() => Int)
    id: number;

  @Field()
    text!: string;

  @Field()
    title!: string;

  @Field()
    points: number;

  @Field()
    voteStatus: number;

  @Field()
    userId!: number;

  @Field()
    users!: User;

  @Field(() => [Image])
    images!: Image[] | [];

  @Field(() => Date)
    createdAt: Date;

  @Field(() => Date)
    updatedAt: Date;
}
