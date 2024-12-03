import {
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { PostEntity } from './post.entity';
import { UserEntity } from './user.entity';

@Entity('post_like')
@Unique(['user', 'post'])
export class PostLikeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => PostEntity, (post) => post.postLike)
  @JoinTable()
  post: PostEntity;

  @ManyToOne(() => UserEntity, (user) => user.postLike)
  @JoinTable()
  user: UserEntity;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
