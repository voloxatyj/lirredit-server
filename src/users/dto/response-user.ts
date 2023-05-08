import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@ObjectType()
class FieldErrorUser {
  @Field()
    field: string;
  @Field()
    message: string;
}

@ObjectType()
export class UserResponse {
  @Field(() => [FieldErrorUser], { nullable: true })
    errors?: FieldErrorUser[];

  @Field(() => User, { nullable: true })
    user?: User;
}
