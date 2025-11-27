import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(data: { username: string; email: string; password: string }) {
    const saltRounds = 10;
    console.log(data.password);
    const hash = await bcrypt.hash(data.password, saltRounds);
    console.log(hash);
    const user = await this.prisma.client.user.create({
      data: { username: data.username, email: data.email, password: hash },
    });
    const role = await this.prisma.client.role.findUnique({
      where: { name: 'user' },
    });
    if (role) {
      await this.prisma.client.user.update({
        where: { id: user.id },
        data: { roles: { connect: { id: role.id } } },
      });
    }
    return { id: user.id, username: user.username, email: user.email };
  }

  async validateUser(username: string, pass: string) {
    const user = await this.usersService.findByName(username);
    if (!user) return null;
    const match = await bcrypt.compare(pass, user.password);
    if (match) {
      const { password, ...result } = user as any;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      username: user.username,
      sub: user.id,
      roles: user.roles?.map((r) => r.name),
    };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '30m' }),
    };
  }
}
