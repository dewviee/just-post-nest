import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RefreshTokenEntity } from './session-refresh-token.entity';
import { UserPasswordResetEntity } from './user-password-reset.entity';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 320 })
  email: string;

  @Column({ type: 'varchar', length: 100 })
  password: string;

  @Column({ type: 'varchar', length: 16 })
  username: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany(() => RefreshTokenEntity, (refreshToken) => refreshToken.user)
  refreshToken: RefreshTokenEntity[];

  @OneToMany(
    () => UserPasswordResetEntity,
    (userPasswordReset) => userPasswordReset.user,
  )
  userPasswordReset: UserPasswordResetEntity[];
}
