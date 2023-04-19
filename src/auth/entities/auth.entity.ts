import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Auth {
  @Field(() => Int)
  id: number;

  @Field()
  username!: string;

  @Field()
  email!: string;

  @Field()
  password!: string;

  @Field(() => String)
  createdAt: Date;

  @Field(() => String)
  updatedAt: Date;
}
