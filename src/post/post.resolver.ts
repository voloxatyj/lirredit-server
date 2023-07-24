import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { MyContext, Post } from 'src/types/general';
import { GetPostsInput, LikePostInput, PostInput } from 'src/types/request';
import { LikeResponse, PostResponse, PostsResponse } from 'src/types/response';
import { AuthGuard } from 'src/utils/authentication/auth.guard';
import { PostService } from './post.service';

@Resolver(() => Post)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @UseGuards(AuthGuard)
  @Query(() => PostsResponse, { name: 'getPosts' })
  async posts(
    @Args('input') input: GetPostsInput,
    @Context() { req }: MyContext,
  ): Promise<PostsResponse> {
    return this.postService.findAll(input, req.session.userId);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => PostResponse)
  async create(
    @Args('input') input: PostInput,
    @Context() { req }: MyContext,
  ): Promise<PostResponse> {
    return this.postService.createPost(input, req);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => LikeResponse)
  async like(@Args('input') input: LikePostInput, @Context() { req }: MyContext) {
    const { postId, isLike } = input;

    if (isLike) {
      return this.postService.notLikePost(postId, req.session.userId);
    }

    return this.postService.likePost(postId, req.session.userId);
  }

  @ResolveField(() => String)
  short_text(@Parent() post: Post) {
    return post.text.slice(0, 100);
  }

  @ResolveField(() => String)
  comments_count(@Parent() post: Post) {
    return post.comments.length;
  }

  @ResolveField(() => String)
  likes_count(@Parent() post: Post) {
    return post.post_likes.length;
  }
}
