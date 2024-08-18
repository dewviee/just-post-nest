import { HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from 'src/common/entities/post/post.entity';
import { ESimpleOrderBy } from 'src/common/enum/search-opt.enum';
import { CustomErrorException } from 'src/common/exceptions/custom-error.exception';
import {
  Equal,
  FindOperator,
  LessThanOrEqual,
  MoreThanOrEqual,
  Not,
  Repository,
} from 'typeorm';
import { GetPostDTO } from './dto/get-posts.dto';

export class PostGetFeedService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepo: Repository<PostEntity>,
  ) {}

  async getPostOffset(body: GetPostDTO): Promise<number> {
    if (!body?.latestLoadID) {
      return 0;
    }

    const latestPost = await this.findLatestPost(body.latestLoadID);
    if (!latestPost) {
      throw new CustomErrorException(
        'id of latest load post not found',
        HttpStatus.NOT_FOUND,
      );
    }

    const orderOption = this.getOrderOption(body.orderBy, latestPost.createdAt);
    const latestPostOffset = await this.calculateOffset(
      latestPost.id,
      orderOption,
    );

    return latestPostOffset + 1;
  }

  private async findLatestPost(id: string) {
    return this.postRepo.findOneBy({ id: Equal(id) });
  }

  private getOrderOption(orderBy: ESimpleOrderBy, createdAt: Date) {
    return orderBy === 'DESC'
      ? MoreThanOrEqual(createdAt)
      : LessThanOrEqual(createdAt);
  }

  private async calculateOffset(
    latestPostId: string,
    orderOption: FindOperator<Date>,
  ): Promise<number> {
    return this.postRepo.countBy({
      id: Not(latestPostId),
      createdAt: orderOption,
    });
  }
}
