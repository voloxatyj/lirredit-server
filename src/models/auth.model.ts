import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { FieldError } from './general.model';

@InputType()
export class LoginInput {
  @Field()
    usernameOrEmail: string;

  @Field()
    password: string;
}

@InputType()
export class SignUpInput {
  @Field()
    username: string;

  @Field()
    email: string;

  @Field()
    password: string;
}

@InputType()
export class ChangePasswordInput {
  @Field(() => String)
    password: string;

  @Field(() => String)
    token: string;
}

@ObjectType()
export class PasswordAuthResponse {
  @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

  @Field(() => Boolean)
    success: boolean;
}
