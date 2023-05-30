import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

/* USER INPUT TYPES */

@InputType()
export class CreateUserInput {
  @Field()
    username: string;

  @Field()
    email: string;

  @Field()
    password: string;
}

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => Int)
    id: number;
}

/* AUTH INPUT TYPES */

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

/* POST INPUT TYPES */

@InputType()
export class PostInput {
  @Field(() => String)
    title: string;

  @Field(() => String)
    text: string;
}
