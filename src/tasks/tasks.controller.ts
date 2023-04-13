import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task.dto';
import { Task, TaskStatus } from './task.model';
import { TasksService } from './tasks.service';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Post('/write-to-file')
  async writeToFileSync(@Body() body: { message: string }): Promise<string> {
    writeFileSync(join(__dirname, 'liad.txt'), body.message, {
      flag: 'w',
    });
    return join(__dirname, 'liad.txt');
  }


  @Get()
  getAllTasks(@Query() filterDto: GetTaskFilterDto): Task[] {
    if (Object.keys(filterDto).length) {
      return this.taskService.getTaslsWithFilters(filterDto);
    } else {
      return this.taskService.getAllTasks();
    }
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Task {
    return this.taskService.createTask(createTaskDto);
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string): Task {
    return this.taskService.getTaskById(id);
  }

  @Delete('/:id')
  deleteTaskById(@Param('id') id: string): void {
    this.taskService.deleteTaskById(id);
  }

  @Patch('/:id/status')
  updateTaskStatusById(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ): Task {
    const { status } = updateTaskStatusDto;
    return this.taskService.patchTaskStatusById(id, status);
  }
}
