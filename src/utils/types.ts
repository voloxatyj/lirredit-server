import { Field, ObjectType } from '@nestjs/graphql';
import { Request, Response } from 'express';
import { Session, SessionData } from 'express-session';

export type MyContext = {
  req: Request & {
    session: Session & Partial<SessionData> & { UserID: number };
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
