import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Comments, User } from '@prisma/client';
import { CommentsInput, CommentResponse, CommentsResponse } from 'src/models/comments.model';
import { PrismaService } from 'src/prisma/prisma.service';
import { validationText } from 'src/utils/validation';

@Injectable()
export class CommentsService {
  private logger = new Logger(CommentsService.name);

  constructor(private prisma: PrismaService) {}

  async createComment({ postId, text }: CommentsInput, userId: number): Promise<CommentResponse> {
    try {
      const validateText = await validationText(text);
      const comment: Comments & { users: User } = await this.prisma.comments.create({
        data: {
          postId,
          text: validateText,
          userId,
        },
        include: {
          users: true,
        },
      });

      return {
        success: true,
        comment,
      };
    } catch (error) {
      this.logger.error(`Can/'t create comment`, error.stack);
      throw new InternalServerErrorException();
    }
  }

  async getAll(postId: number): Promise<CommentsResponse> {
    try {
      const comments: (Comments & { users: User })[] = await this.prisma.comments.findMany({
        where: {
          postId,
        },
        include: {
          users: true,
        },
      });

      return {
        success: true,
        comments,
      };
    } catch (error) {
      this.logger.error(`Can/'t get comments`, error.stack);
      throw new InternalServerErrorException();
    }
  }
}
