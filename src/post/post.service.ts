import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  GetPostsInput,
  PostInput,
  LikeResponse,
  PostResponse,
  PostsResponse,
  GetPostInput,
} from 'src/models/post.model';
import { validateCreatePost, validationText } from 'src/utils/validation';

@Injectable()
export class PostService {
  private logger = new Logger(PostService.name);

  constructor(private prisma: PrismaService) {}

  async findAll({ limit, cursor, title, text }: GetPostsInput, id: number): Promise<PostsResponse> {
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
        include: { users: true, images: true, post_likes: true, comments: true },
      });

      const isLikes = posts.map(({ post_likes }) => {
        return post_likes.some(({ userId }) => userId === id);
      });

      return { posts, isLikes };
    } catch (error) {
      this.logger.error(`Can/'t get posts`, error.stack);
      throw new InternalServerErrorException();
    }
  }

  async createPost({ title, text, images }: PostInput, req: Request): Promise<PostResponse> {
    const errors = validateCreatePost({ title, text });

    if (errors) {
      return { errors };
    }

    const edit_title = await validationText(title);
    const edit_text = await validationText(text);

    const {
      session: { userId },
    } = req;
    const response: PostResponse = {
      post: null,
      errors: null,
      isLike: false,
    };

    try {
      if (images.length === 0) {
        response.post = await this.prisma.post.create({
          data: {
            title: edit_title,
            text: edit_text,
            userId,
          },
          include: { users: true, images: true, comments: true, post_likes: true },
        });

        return { post: response.post };
      }

      await this.prisma.$transaction(async (prisma) => {
        response.post = await prisma.post.create({
          data: {
            title: edit_title,
            text: edit_text,
            userId,
          },
          include: { users: true, images: true, comments: true, post_likes: true },
        });

        const images_promises = images.map(({ secure_url, public_id }) =>
          prisma.image.create({
            data: {
              secure_url,
              public_id,
              postId: response.post.id,
            },
          }),
        );
        const saved_images = await Promise.all(images_promises);
        response.post.images = [...saved_images];
      });

      return { post: response.post, isLike: response.isLike };
    } catch (error) {
      this.logger.error(`Can/'t get post`, error.stack);
      throw new InternalServerErrorException();
    }
  }

  async likePost(postId: number, userId: number): Promise<LikeResponse> {
    try {
      await this.prisma.postLikes.create({
        data: {
          postId,
          userId,
        },
      });

      return {
        success: true,
        message: 'Liked post successfully',
      };
    } catch (error) {
      this.logger.error(`Can/'t like smth`, error.stack);
      throw new InternalServerErrorException();
    }
  }

  async notLikePost(postId: number, userId: number): Promise<LikeResponse> {
    try {
      await this.prisma.postLikes.deleteMany({
        where: { postId, userId },
      });

      return {
        success: true,
        message: 'Not liked post successfully',
      };
    } catch (error) {
      this.logger.error(`Can/'t not like smth`, error.stack);
      throw new InternalServerErrorException();
    }
  }

  async findOne({ postId } : GetPostInput): Promise<PostResponse> {
    let post = null;
    let isLike = null;

    try {
      await this.prisma.$transaction(async (prisma) => {
        const { views } = await prisma.post.findUnique({
          where: { id: postId },
        });

        const updated_views = Number(views) + 1;

        await prisma.post.update({
          where: { id: postId },
          data: {
            views: updated_views,
          },
        });

        post = await prisma.post.findUnique({
          where: { id: postId },
          include: { users: true, images: true, comments: true, post_likes: true },
        });

        isLike = post.post_likes.some(({ userId }) => userId === postId);
      });

      return { post, isLike };
    } catch (error) {
      this.logger.error(`Can/'t get post`, error.stack);
      throw new InternalServerErrorException();
    }
  }
}
