import {
  Body,
  Controller,
  Post,
  UseGuards,
  Req,
  ForbiddenException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';

import { TasksService } from './tasks.service';
import { CreateTaskDTO } from './dto/create-task.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface.ts';

@Controller('/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}
  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  async createTask(@Body() CreateTask: CreateTaskDTO, @Req() req: RequestWithUser) {
    const userID = req.user?.userId;
    const role = req.user?.role;
    console.log('role', role, 'userID', userID);
    if (!userID) throw new Error('User not found in request');
    if (role !== 'admin') {
      throw new ForbiddenException('You are not allowed to create tasks');
    }
    return await this.tasksService.createTask(CreateTask, userID);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('update/:id')
  updateTask(
    @Param('id') id: string,
    @Body() UpdateTaskDTO: UpdateTaskDTO,
    @Req() req: RequestWithUser,
  ) {
    console.log('body', UpdateTaskDTO);
    const userID = req.user?.userId;
    const role = req.user?.role;
    if (!userID) throw new Error('User not found in request');
    if (role !== 'admin') {
      throw new ForbiddenException('You are not allowed to update tasks');
    }
    console.log('id', id, typeof id, 'UpdateTaskDTO', UpdateTaskDTO,  'userID', userID);
    return this.tasksService.updateTask(UpdateTaskDTO, id);
  }
}
