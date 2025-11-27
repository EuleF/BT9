import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  NotFoundException,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { UsersService } from './users.service';
import { AssignRoleDto } from './dto/assign-role.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): Promise<any[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<any | null> {
    const user = await this.usersService.findOne(+id);
    if (!user) {
      throw new NotFoundException(`Пользователь с id=${id} не найден`);
    }
    return user;
  }

  @Post()
  create(@Body() data: { username: string; email: string }): Promise<any> {
    return this.usersService.create(data);
  }

  @Patch(':id/assign-role')
  @Roles('administrator')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  assignRole(
    @Param('id') id: string,
    @Body() assignRoleDto: AssignRoleDto,
  ): Promise<any> {
    return this.usersService.assignRole(+id, assignRoleDto.roleName);
  }
}
