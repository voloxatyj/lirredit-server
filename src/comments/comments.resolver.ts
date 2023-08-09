import { CommentsObject, CommentsInput, CommentResponse, CommentsResponse } from 'src/models/comments.model';
import { CommentsService } from './comments.service';
import { Args, Context, Mutation, Resolver, Query } from '@nestjs/graphql';
import { MyContext } from 'src/models/general.model';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/utils/authentication/auth.guard';


@Resolver(() => CommentsObject)
export class CommentsResolver {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => CommentResponse)
  async createComment(
    @Args('input') input: CommentsInput,
    @Context() { req }: MyContext,
  ): Promise<CommentResponse> {
    return this.commentsService.createComment(input, req.session.userId);
  }

  @UseGuards(AuthGuard)
  @Query(() => CommentsResponse, { name: 'getComments' })
  async comments(@Args('postId') postId: number): Promise<CommentsResponse> {
    return this.commentsService.getAll(postId);
  }
}
