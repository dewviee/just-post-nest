import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostLikeEntity } from 'src/common/entities/post/post-like.entity';
import { PostEntity } from 'src/common/entities/post/post.entity';
import { UserEntity } from 'src/common/entities/post/user.entity';
import { Equal, Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { PostService } from './post.service';

export class PostLikeService {
  constructor(
    @InjectRepository(PostLikeEntity)
    private readonly postLikeRepo: Repository<PostLikeEntity>,
    private readonly userService: UserService,
    private readonly postService: PostService,
  ) {}

  async findByPostAndUserId(postId: string, userId: string) {
    return this.postLikeRepo.findOneBy({
      post: {
        id: Equal(postId),
      },
      user: {
        id: Equal(userId),
      },
    });
  }

  async likePost(postId: string, userInfo: UserEntity) {
    const findPost = this.postService.findPostById(postId);
    const findUser = this.userService.getUserBy({ id: Equal(userInfo.id) });

    const [post, user] = await Promise.all([findPost, findUser]);
    if (!post) {
      throw new NotFoundException('post not found');
    }

    const likedPost = await this.findByPostAndUserId(post.id, user.id);
    if (likedPost) return;

    const likePost = this.postLikeRepo.create({ post: post, user: user });
    await this.postLikeRepo.save(likePost);
  }

  async unlikePost(postId: string, userInfo: UserEntity) {
    const findPost = this.postService.findPostById(postId);
    const findUser = this.userService.getUserBy({ id: Equal(userInfo.id) });

    const [post, user] = await Promise.all([findPost, findUser]);
    if (!post) {
      throw new NotFoundException('post not found');
    }

    const likedPost = await this.findByPostAndUserId(post.id, user.id);
    if (!likedPost) return;

    await this.postLikeRepo.remove(likedPost);
  }

  async countLikeFromPosts(posts: PostEntity[]) {
    const jobs = posts.map(async (post) => await this.countLikeFromPost(post));

    return Promise.all(jobs);
  }

  async countLikeFromPost(post: PostEntity) {
    return this.postLikeRepo.countBy({
      post: { id: Equal(post.id) },
    });
  }

  async isUserLikePosts(posts: PostEntity[], userId: string) {
    const jobs = posts.map((post) => this.isUserLikePost(post.id, userId));
    return await Promise.all(jobs);
  }

  async isUserLikePost(postId: string, userId: string) {
    return !!(await this.postLikeRepo.findOneBy({
      user: {
        id: Equal(userId),
      },
      post: {
        id: Equal(postId),
      },
    }));
  }
}
