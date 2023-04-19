import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { validateRegister } from 'src/utils/validation';
import { CreateUserInput } from './dto/create-user.input';
import { UserResponse } from './dto/response-user';
import { UpdateUserInput } from './dto/update-user.input';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);

  constructor(private prisma: PrismaService) {}
  async create(credentials: CreateUserInput): Promise<UserResponse> {
    const errors = validateRegister(credentials);
    if (errors) {
      return { errors };
    }

    const hashedPassword = await argon2.hash(credentials.password);
    let user = null;
    try {
      user = await this.prisma.user.create({
        data: {
          email: credentials.email,
          username: credentials.username,
          password: hashedPassword,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to create user`, error.stack);
      throw new InternalServerErrorException();
    }

    return { user };
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
