import { Field, InputType, Int, ObjectType, PartialType } from '@nestjs/graphql';
import { FieldError } from './general.model';
import { Follows } from '@prisma/client';

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

@ObjectType()
export class UserResponse {
  @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

  @Field(() => User, { nullable: true })
    user?: User;
}

@ObjectType()
export class UsersResponse {
  @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

  @Field(() => [User], { nullable: true })
    users?: (User & { followedBy: Follows[]; following: Follows[] })[];
}
