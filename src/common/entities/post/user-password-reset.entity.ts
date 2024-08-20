import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('user_password_reset')
export class UserPasswordResetEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  token: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'timestamptz' })
  expiredAt: Date;

  @Column({ type: 'boolean', default: false })
  isUse: boolean;

  @ManyToOne(() => UserEntity, (user) => user.userPasswordReset)
  @JoinColumn()
  user: UserEntity;
}
