import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { User } from 'src/common/decorators/user.decorator';
import { UserEntity } from 'src/common/entities/post/user.entity';
import { CreatePostDTO } from './dto/create-post.dto';
import { GetPostDTO } from './dto/get-posts.dto';
import { PostService } from './post.service';

@Controller({ path: '/post' })
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('/')
  async createPost(@Body() body: CreatePostDTO, @User() user: UserEntity) {
    return await this.postService.createPost(body, user);
  }

  @Get('/')
  async getPost(@Query() body: GetPostDTO) {
    return await this.postService.getNextPost(body);
  }
}
