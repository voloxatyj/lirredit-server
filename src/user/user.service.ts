import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/models/general.model';
import { LoginInput, UpdateUserInput } from 'src/models/request.model';
import { generateUniqueRandom } from 'src/utils/generateUniqueRandom';
import { verifyingPassword } from 'src/utils/helpers';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);

  constructor(private prisma: PrismaService, private config: ConfigService) {}

  async findById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async validateUser({ usernameOrEmail, password }: LoginInput) {
    const user = await this.findOne(usernameOrEmail);
    const result = await verifyingPassword(password, user.password);
    return result;
  }

  async findUsers(id: number): Promise<User[]> {
    const maxNr = await this.prisma.user.count();
    const length = +this.config.get('DISPLAY_USERS');
    const unique = generateUniqueRandom(maxNr, length, id)() as number[];
    const users = await this.prisma.user.findMany({
      where: {
        id: { in: unique },
      },
      include: { followedBy: true, following: true },
    });

    return users;
  }

  async findOne(usernameOrEmail: string): Promise<User | any> {
    try {
      const user = await this.prisma.user.findFirst({
        where: usernameOrEmail.includes('@')
          ? { email: usernameOrEmail }
          : { username: usernameOrEmail },
      });
      return { user };
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
