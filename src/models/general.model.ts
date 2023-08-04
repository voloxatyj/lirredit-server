import { Field, ObjectType } from '@nestjs/graphql';
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
