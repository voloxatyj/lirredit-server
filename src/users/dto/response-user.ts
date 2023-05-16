import { Field, ObjectType } from '@nestjs/graphql';
import { FieldError } from 'src/utils/types';
import { User } from '../entities/user.entity';

@ObjectType()
export class UserResponse {
  @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

  @Field(() => User, { nullable: true })
    user?: User;
}
