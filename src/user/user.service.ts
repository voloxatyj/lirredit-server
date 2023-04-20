import { Injectable } from '@nestjs/common';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UserService {
  // private logger = new Logger(UserService.name);

  // constructor(private prisma: PrismaService) {}
  async create() {
    return `This action create user`;
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    console.log(updateUserInput);
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
