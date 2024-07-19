import { Injectable } from '@nestjs/common';
import { CreatePostDTO } from './dto/create-post.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from 'src/common/entities/post/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepo: Repository<PostEntity>,
  ) {}

  async createPost(body: CreatePostDTO) {
    const post = this.postRepo.create({
      content: body.content,
    });

    return await this.postRepo.save(post);
  }
}
