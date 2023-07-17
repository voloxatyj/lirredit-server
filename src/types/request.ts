import { Field, InputType, Int, PartialType } from '@nestjs/graphql';

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
export class ImageInput {
  @Field(() => String)
    secure_url: string;

  @Field(() => String)
    public_id: string;
}

@InputType()
export class PostInput {
  @Field(() => String)
    title: string;

  @Field(() => String)
    text: string;

  @Field(() => [ImageInput])
    images: ImageInput[];
}

@InputType()
export class GetPostsInput {
  @Field(() => Number)
    limit?: number;

  @Field(() => Number)
    cursor?: number;

  @Field(() => String, { nullable: true })
    text?: string | null;

  @Field(() => String, { nullable: true })
    title?: string | null;
}
