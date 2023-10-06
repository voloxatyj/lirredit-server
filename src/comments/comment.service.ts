import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Comments, User } from '@prisma/client';
import { CommentsInput, CommentResponse, CommentsResponse, CommentInput } from 'src/models/comment.model';
import { PrismaService } from 'src/prisma/prisma.service';
import { validationText } from 'src/utils/validation';

@Injectable()
export class CommentService {
  private logger = new Logger(CommentService.name);

  constructor(private prisma: PrismaService) {}

  async create({ postId, text }: CommentInput, userId: number): Promise<CommentResponse> {
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

  async getAll({ postId }: CommentsInput): Promise<CommentsResponse> {
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
