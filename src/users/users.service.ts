import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.client.user.findMany({
      include: { tasks: true, roles: true },
    });
  }

  findOne(id: number) {
    return this.prisma.client.user.findUnique({
      where: { id },
      include: { tasks: true, roles: true },
    });
  }

  async create(data: { username: string; email: string }) {
    return this.prisma.client.user.create({
      data,
      include: { tasks: true, roles: true },
    });
  }

  async findByName(username: string) {
    return this.prisma.client.user.findUnique({
      where: { username },
      include: { tasks: true, roles: true },
    });
  }

  async assignRole(userId: number, roleName: string) {
    const user = await this.prisma.client.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException(`Пользователь с id=${userId} не найден!`);
    }

    const role = await this.prisma.client.role.findUnique({
      where: { name: roleName },
    });
    if (!role) {
      throw new BadRequestException(`Роль '${roleName}' не существует в бд.`);
    }

    return this.prisma.client.user.update({
      where: { id: userId },
      data: {
        roles: {
          connect: { id: role.id },
        },
      },
      include: {
        roles: true,
      },
    });
  }
}
