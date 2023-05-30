import { PassportSerializer } from '@nestjs/passport';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { User } from '@prisma/client';

@Injectable()
export class AuthSerializer extends PassportSerializer {
  constructor(@Inject(forwardRef(() => UserService)) private userService: UserService) {
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
    return userDb ? done(null, userDb) : done(null, null);
  }
}
