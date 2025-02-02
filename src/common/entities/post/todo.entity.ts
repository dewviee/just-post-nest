import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TodoItemEntity } from './todo-items.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'todos' })
export class TodoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 120 })
  name: string;

  @OneToMany(() => TodoItemEntity, (todoItems) => todoItems.todo)
  todoItems: TodoItemEntity[];

  @ManyToOne(() => UserEntity, (user) => user.todos)
  @JoinColumn()
  user: UserEntity;
}
