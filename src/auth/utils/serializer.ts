import { PassportSerializer } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { User } from '@prisma/client';

@Injectable()
export class AuthSerializer extends PassportSerializer {
  constructor(@Inject(UsersService) private userService: UsersService) {
    super();
  }
  serializeUser(user: User, done: (err: Error, user: { id: number; role: string }) => void) {
    done(null, { id: user.id, role: user.role });
  }

  async deserializeUser(
    payload: { id: number; role: string },
    done: (err: Error, user: User) => void,
  ) {
    const userDb = await this.userService.findById(payload.id);
    Reflect.deleteProperty(userDb, 'password');
    return userDb ? done(null, userDb) : done(null, null);
  }
}
