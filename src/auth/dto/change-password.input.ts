import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ChangePasswordInput {
  @Field(() => String)
    password: string;

  @Field(() => String)
    token: string;
}
