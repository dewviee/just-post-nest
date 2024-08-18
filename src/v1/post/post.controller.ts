import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreatePostDTO } from './dto/create-post.dto';
import { GetPostDTO } from './dto/get-posts.dto';
import { PostService } from './post.service';

@Controller({ path: '/post' })
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('/')
  async createPost(@Body() body: CreatePostDTO) {
    return this.postService.createPost(body);
  }

  @Get('/')
  async getPost(@Body() body: GetPostDTO) {
    return await this.postService.getNextPost(body);
  }
}
