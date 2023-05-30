import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException, forwardRef } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(forwardRef(() => UserService)) private userService: UserService) {
    super();
  }

  async validate(usernameOrEmail: string, password: string): Promise<any> {
    const user = await this.userService.validateUser({ usernameOrEmail, password });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
