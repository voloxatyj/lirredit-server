import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MyContext } from 'src/types/general';
import { GetPostsInput, PostInput } from 'src/types/request';
import { PostsResponse, PostResponse } from 'src/types/response';
import { AuthGuard } from 'src/utils/authentication/auth.guard';
import { PostService } from './post.service';

@Resolver()
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @UseGuards(AuthGuard)
  @Query(() => PostsResponse)
  async posts(@Args('input') input: GetPostsInput): Promise<PostsResponse> {
    return this.postService.findAll(input);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => PostResponse)
  async create(
    @Args('input') input: PostInput,
    @Context() { req }: MyContext,
  ): Promise<PostResponse> {
    return this.postService.createPost(input, req);
  }
}
