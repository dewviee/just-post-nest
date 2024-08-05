import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RefreshTokenEntity } from './session-refresh-token.entity';

@Entity('session_access_token')
export class AccessTokenEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 500 })
  token: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'timestamptz' })
  expiredAt: Date;

  @ManyToOne(
    () => RefreshTokenEntity,
    (refreshToken: RefreshTokenEntity) => refreshToken.accessToken,
  )
  @JoinColumn()
  refreshToken: RefreshTokenEntity;
}
