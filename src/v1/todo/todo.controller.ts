import { Body, Controller, Post } from '@nestjs/common';
import { User } from 'src/common/decorators/user.decorator';
import { IPublicUser } from 'src/common/interfaces/user.interface';
import { CreateTodoDto } from './dtos/create-todo.dto';
import { TodoService } from './todo.service';

@Controller('/todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post('/')
  async postTodo(@Body() body: CreateTodoDto, @User() user: IPublicUser) {
    return await this.todoService.createTodo(body, user);
  }
}
