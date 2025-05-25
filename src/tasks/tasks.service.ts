import { Injectable } from '@nestjs/common';
import { CreateTaskDTO } from './dto/create-task.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from './task.schema';
import { Model, Types } from 'mongoose';
import { UpdateTaskDTO } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}
  async createTask(CreateTask: CreateTaskDTO, userID: string) {
    console.log('Cholche Vai!!!');
    const task = new this.taskModel({...CreateTask, userId: new Types.ObjectId(userID)});
    await task.save();
    return { message: 'Task created successfully', data: task };
  }

  async updateTask(UpdateTaskDTO: UpdateTaskDTO, TaskId: string) {
    const updatedTask = await this.taskModel.findByIdAndUpdate(
      TaskId,
      UpdateTaskDTO,
      { new: true },
    );
    return { message: 'Updated Task', data: updatedTask };
  }
}
