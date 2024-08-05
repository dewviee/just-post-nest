import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AccessTokenEntity } from './session-access-token.entity';
import { UserEntity } from './user.entity';

@Entity('session_refresh_token')
export class RefreshTokenEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 500 })
  token: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'timestamptz' })
  expiredAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.refreshToken)
  @JoinColumn()
  user: UserEntity;

  @OneToMany(
    () => AccessTokenEntity,
    (accessToken) => accessToken.refreshToken,
    { cascade: ['insert'] },
  )
  accessToken: AccessTokenEntity[];
}
