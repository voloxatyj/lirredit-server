import { Field, ObjectType } from '@nestjs/graphql';
import { FieldError } from 'src/utils/types';

@ObjectType()
export class PasswordAuthResponse {
  @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

  @Field(() => Boolean)
    success: boolean;
}
