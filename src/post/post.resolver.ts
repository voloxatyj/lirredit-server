import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MyContext } from 'src/types/general';
import { PostInput } from 'src/types/request';
import { PostResponse } from 'src/types/response';
import { AuthGuard } from 'src/utils/authentication/auth.guard';
import { PostService } from './post.service';

@Resolver()
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @UseGuards(AuthGuard)
  @Query(() => PostResponse)
  async posts(): Promise<PostResponse> {
    return this.postService.findAll();
  }

  @UseGuards(AuthGuard)
  @Mutation(() => PostResponse)
  async createPost(
    @Args('input') input: PostInput,
    @Context() { req }: MyContext,
  ): Promise<PostResponse> {
    return this.postService.createPost(input, req);
  }
}
