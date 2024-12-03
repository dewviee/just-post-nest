import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostLikeEntity } from 'src/common/entities/post/post-like.entity';
import { PostEntity } from 'src/common/entities/post/post.entity';
import { UserModule } from '../user/user.module';
import { PostLikeService } from './like-post.service';
import { PostGetFeedService } from './post-get-feed.service';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity, PostLikeEntity]), UserModule],
  controllers: [PostController],
  providers: [PostService, PostGetFeedService, PostLikeService],
})
export class PostModule {}
