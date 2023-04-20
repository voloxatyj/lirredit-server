import { Field, ObjectType } from '@nestjs/graphql';
import { Auth } from '../entities/auth.entity';

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
export class AuthResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Auth, { nullable: true })
  user?: Auth;
}
