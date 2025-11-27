import { IsIn, IsNotEmpty } from 'class-validator';

export const availableRoles = ['user', 'administrator'];

export class AssignRoleDto {
  @IsNotEmpty()
  @IsIn(availableRoles, {
    message: `Роль должна быть одной из следующих: ${availableRoles.join(', ')}`,
  })
  roleName: string;
}
