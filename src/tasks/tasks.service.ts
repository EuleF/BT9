import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTaskDto) {
    const user = await this.prisma.client.user.findUnique({
      where: { id: dto.userId },
    });
    if (!user) throw new NotFoundException('User not found');

    return this.prisma.client.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        completed: dto.completed ?? false,
        user: { connect: { id: dto.userId } },
      },
      include: { user: true },
    });
  }

  findAll() {
    return this.prisma.client.task.findMany({ include: { user: true } });
  }

  findAllByUser(userId: number) {
    return this.prisma.client.task.findMany({
      where: { userId },
      include: { user: true },
    });
  }

  findOne(id: number) {
    return this.prisma.client.task.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  async update(id: number, dto: Partial<CreateTaskDto>) {
    const existing = await this.prisma.client.task.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundException('Task not found');

    const data: any = {};
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.completed !== undefined) data.completed = dto.completed;
    if (dto.userId !== undefined) data.user = { connect: { id: dto.userId } };

    return this.prisma.client.task.update({
      where: { id },
      data,
      include: { user: true },
    });
  }

  remove(id: number) {
    return this.prisma.client.task.delete({ where: { id } });
  }
}
