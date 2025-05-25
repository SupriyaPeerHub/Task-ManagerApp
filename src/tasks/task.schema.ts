import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { TaskStatus } from 'src/interfaces/task-status.enum';

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true })
  title!: string;

  @Prop()
  description!: string;

  @Prop({ default: TaskStatus.PENDING, enum: TaskStatus })
  status!: TaskStatus;

  @Prop()
  dueDate!: Date;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId!: Types.ObjectId;
}

export type TaskDocument = Task & Document;
export const TaskSchema = SchemaFactory.createForClass(Task);