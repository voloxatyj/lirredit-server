import { Field, ObjectType, Int } from '@nestjs/graphql';
import { Request, Response } from 'express';
import { Session, SessionData } from 'express-session';

declare module 'express-session' {
  interface SessionData {
    userId: number;
  }
}

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

  @Field(() => String)
    createdAt: Date;

  @Field(() => String)
    updatedAt: Date;
}
