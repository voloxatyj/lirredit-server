import { Request } from 'express';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetPostsInput, PostInput } from 'src/types/request';
import { PostResponse, PostsResponse } from 'src/types/response';

@Injectable()
export class PostService {
  private logger = new Logger(PostService.name);

  constructor(private prisma: PrismaService) {}

  async findAll({ limit, cursor, title, text }: GetPostsInput): Promise<PostsResponse> {
    try {
      const skip = cursor * limit;
      const posts = await this.prisma.post.findMany({
        take: limit || 20,
        skip,
        orderBy: {
          createdAt: 'desc',
        },
        where: {
          text: {
            contains: text ? text : undefined,
          },
          title: {
            contains: title ? title : undefined,
          },
        },
        include: { users: true },
      });

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
          userId,
        },
        include: { users: true },
      });

      return { post };
    } catch (error) {
      this.logger.error(`Can/'t get posts`, error.stack);
      throw new InternalServerErrorException();
    }
  }
}
