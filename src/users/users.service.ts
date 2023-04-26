import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private logger = new Logger(UsersService.name);

  constructor(private prisma: PrismaService) {}
  async findById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(usernameOrEmail: string): Promise<User | any> {
    let user = null;
    try {
      if (usernameOrEmail.includes('@')) {
        user = await this.prisma.user.findUnique({ where: { email: usernameOrEmail } });
        return user;
      }
      user = await this.prisma.user.findUnique({ where: { username: usernameOrEmail } });
      return user;
    } catch (error) {
      this.logger.error(`Failed to login`, error.stack);
      throw new InternalServerErrorException();
    }
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    console.log(updateUserInput);
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
