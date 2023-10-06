import { CommentObject, CommentsInput, CommentResponse, CommentsResponse, CommentInput } from 'src/models/comment.model';
import { CommentService } from './comment.service';
import { Args, Context, Mutation, Resolver, Query } from '@nestjs/graphql';
import { MyContext } from 'src/models/general.model';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/utils/authentication/auth.guard';


@Resolver(() => CommentObject)
export class CommentResolver {
  constructor(private readonly commentsService: CommentService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => CommentResponse)
  async createComment(
    @Args('input') input: CommentInput,
    @Context() { req }: MyContext,
  ): Promise<CommentResponse> {
    return this.commentsService.create(input, req.session.userId);
  }

  @UseGuards(AuthGuard)
  @Query(() => CommentsResponse, { name: 'getComments' })
  async getAllcomments(@Args('input') input: CommentsInput): Promise<CommentsResponse> {
    return this.commentsService.getAll(input);
  }
}
