import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostLikeEntity } from 'src/common/entities/post/post-like.entity';
import { PostEntity } from 'src/common/entities/post/post.entity';
import { UserEntity } from 'src/common/entities/post/user.entity';
import { DataSource, Equal, Repository } from 'typeorm';
import { CreatePostDTO } from './dto/create-post.dto';
import { GetPostDTO } from './dto/get-posts.dto';
import { PostGetFeedService } from './post-get-feed.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepo: Repository<PostEntity>,
    @InjectRepository(PostLikeEntity)
    private readonly postLikeRepo: Repository<PostLikeEntity>,
    private readonly postGetFeed: PostGetFeedService,
    private readonly dataSource: DataSource,
  ) {}

  async createPost(body: CreatePostDTO, user: UserEntity) {
    const post = this.postRepo.create({
      content: body.content,
      user: user,
    });

    const createdPost = await this.postRepo.save(post);

    const userData = {
      username: createdPost.user.username,
    };
    createdPost.user = undefined;

    return { ...createdPost, user: userData };
  }

  async getNextPost(body: GetPostDTO) {
    const offset = await this.postGetFeed.getPostOffset(body);

    const posts = await this.postRepo.find({
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        user: {
          id: true,
          username: true,
        },
      },
      relations: { user: true },
      order: { createdAt: body.orderBy },
      take: body.quantity,
      skip: offset,
    });

    return posts;
  }

  async getNextPostV2(body: GetPostDTO, user: UserEntity) {
    const offset = await this.postGetFeed.getPostOffset(body);

    const posts = await this.createSelectNextPostQuery(
      body,
      user,
      offset,
    ).getRawMany();

    const mappingPosts = posts.map((post) => {
      const user = { username: post.user_username };
      return {
        ...post,
        user_username: undefined,
        user: user,
      };
    });

    return mappingPosts;
  }
  private createSelectNextPostQuery(
    body: GetPostDTO,
    user: UserEntity,
    offset: number,
  ) {
    return this.dataSource
      .getRepository(PostEntity)
      .createQueryBuilder('post')
      .select('post.id', 'id')
      .addSelect('post.content', 'content')
      .addSelect('post.created_at', 'createdAt')
      .addSelect('post.updated_at', 'updatedAt')
      .addSelect(
        `(SELECT COUNT(*) FROM post_like WHERE post_like.post_id = post.id)`,
        'like',
      )
      .addSelect(
        `(CASE WHEN
          (SELECT COUNT(*) FROM post_like 
          WHERE post_like.post_id = post.id AND post_like.user_id = :userId) > 0 
          THEN false 
          ELSE true 
          END)`,
        'isLike',
      )
      .leftJoin('post.user', 'user')
      .addSelect('user.username', 'user_username')
      .setParameter('userId', user.id)
      .orderBy('post.created_at', body.orderBy)
      .offset(offset)
      .limit(body.quantity);
  }

  async findPostById(postId: string) {
    return this.postRepo.findOneBy({ id: Equal(postId) });
  }
}
