import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { User } from 'src/common/decorators/user.decorator';
import { UserEntity } from 'src/common/entities/post/user.entity';
import { CreatePostDTO } from './dto/create-post.dto';
import { GetPostDTO } from './dto/get-posts.dto';
import { LikePostDto } from './dto/like-post.dto';
import { PostLikeService } from './like-post.service';
import { PostService } from './post.service';

@Controller({ path: '/post' })
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly postLikeService: PostLikeService,
  ) {}

  @Post('/')
  async createPost(@Body() body: CreatePostDTO, @User() user: UserEntity) {
    return await this.postService.createPost(body, user);
  }

  @Get('/')
  async getPost(@Query() body: GetPostDTO) {
    return await this.postService.getNextPost(body);
  }

  @Post('/like/:id')
  async likePost(@Param() params: LikePostDto, @User() user: UserEntity) {
    return await this.postLikeService.likePost(params.id, user);
  }

  @Delete('/like/:id')
  async unlikePost(@Param() params: LikePostDto, @User() user: UserEntity) {
    return await this.postLikeService.unlikePost(params.id, user);
  }
}
