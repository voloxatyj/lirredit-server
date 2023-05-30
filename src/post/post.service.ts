import { Request } from 'express';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostInput } from 'src/types/request';
import { PostResponse } from 'src/types/response';

@Injectable()
export class PostService {
  private logger = new Logger(PostService.name);

  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<PostResponse> {
    try {
      const posts = await this.prisma.post.findMany();
      return { posts };
    } catch (error) {
      this.logger.error(`Can/'t get posts`, error.stack);
      throw new InternalServerErrorException();
    }
  }

  async createPost({ title, text }: PostInput, req: Request): Promise<PostResponse> {
    try {
      const {
        session: { userId },
      } = req;
      const post = await this.prisma.post.create({
        data: {
          title,
          text,
          userId
        },
        include: { users: true }
      });

      return { post, author: post.users };
    } catch (error) {
      this.logger.error(`Can/'t get posts`, error.stack);
      throw new InternalServerErrorException();
    }
  }
}
