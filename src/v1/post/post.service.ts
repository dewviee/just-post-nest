import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from 'src/common/entities/post/post.entity';
import { UserEntity } from 'src/common/entities/post/user.entity';
import { Repository } from 'typeorm';
import { CreatePostDTO } from './dto/create-post.dto';
import { GetPostDTO } from './dto/get-posts.dto';
import { PostGetFeedService } from './post-get-feed.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepo: Repository<PostEntity>,
    private readonly postGetFeed: PostGetFeedService,
  ) {}

  async createPost(body: CreatePostDTO, user: UserEntity) {
    const post = this.postRepo.create({
      content: body.content,
      user: user,
    });

    const createdPost = await this.postRepo.save(post);
    createdPost.user = undefined;

    return createdPost;
  }

  async getNextPost(body: GetPostDTO) {
    const offset = await this.postGetFeed.getPostOffset(body);

    const posts = await this.postRepo.find({
      select: ['id', 'content', 'createdAt', 'updatedAt'],
      order: { createdAt: body.orderBy },
      take: body.quantity,
      skip: offset,
    });

    return posts;
  }
}
