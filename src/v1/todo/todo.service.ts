import { InjectRepository } from '@nestjs/typeorm';
import { TodoEntity } from 'src/common/entities/post/todo.entity';
import { IPublicUser } from 'src/common/interfaces/user.interface';
import { Repository } from 'typeorm';
import { CreateTodoDto } from './dtos/create-todo.dto';

export class TodoService {
  constructor(
    @InjectRepository(TodoEntity)
    private readonly todoRepo: Repository<TodoEntity>,
  ) {}

  async createTodo(body: CreateTodoDto, user: IPublicUser) {
    const todo = this.todoRepo.create({
      ...body,
      todoItems: body.items,
      user: {
        id: user.id,
      },
    });

    const createdTodo = await this.todoRepo.save(todo);
    return createdTodo;
  }
}
