import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TodoEntity } from './todo.entity';

@Entity('todo_items')
export class TodoItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'smallint' })
  order: number;

  @Column({ type: 'varchar', length: 255 })
  content: string;

  @ManyToOne(() => TodoEntity, (todo) => todo.todoItems)
  @JoinColumn()
  todo: TodoEntity;
}
