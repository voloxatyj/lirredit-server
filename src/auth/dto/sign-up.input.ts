import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class SignUpInput {
  @Field()
    username: string;

  @Field()
    email: string;

  @Field()
    password: string;
}
