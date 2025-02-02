import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoItemEntity } from 'src/common/entities/post/todo-items.entity';
import { TodoEntity } from 'src/common/entities/post/todo.entity';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

@Module({
  imports: [TypeOrmModule.forFeature([TodoEntity, TodoItemEntity])],
  controllers: [TodoController],
  providers: [TodoService],
  exports: [],
})
export class TodoModule {}
