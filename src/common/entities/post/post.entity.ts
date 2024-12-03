import { InternalServerErrorException } from '@nestjs/common';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PostLikeEntity } from './post-like.entity';
import { UserEntity } from './user.entity';

@Entity()
export class PostEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 500 })
  content: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.post)
  @JoinColumn()
  user: UserEntity;

  @OneToMany(() => PostLikeEntity, (postLike) => postLike.post)
  postLike: PostLikeEntity[];

  @BeforeInsert()
  validateUser() {
    if (!this.user) {
      throw new InternalServerErrorException('user in post must not be empty');
    }
  }
}
