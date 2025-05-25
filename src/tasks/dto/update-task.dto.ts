import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { TaskStatus } from 'src/interfaces/task-status.enum';

export class UpdateTaskDTO {
  @IsOptional() 
  @IsNotEmpty({ message: 'Title should not be empty' })
  title?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus, {
    message: 'Status must be one of: pending, in-progress, completed',
  })
  status?: TaskStatus;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'dueDate must be a valid date' })
  dueDate?: Date;
}
