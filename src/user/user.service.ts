import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/types/general';
import { UpdateUserInput } from 'src/types/request';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);

  constructor(private prisma: PrismaService) {}
  async findById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(usernameOrEmail: string): Promise<User | any> {
    try {
      const user = await this.prisma.user.findFirst({
        where: usernameOrEmail.includes('@')
          ? { email: usernameOrEmail }
          : { username: usernameOrEmail },
      });
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
