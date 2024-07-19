import { Body, Controller, Post } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDTO } from './dto/create-post.dto';

@Controller({ path: '/post' })
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('/')
  async createPost(@Body() body: CreatePostDTO) {
    return this.postService.createPost(body);
  }
}
