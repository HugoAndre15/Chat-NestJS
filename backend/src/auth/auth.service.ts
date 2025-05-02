import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/user.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwt: JwtService) {}

  async register(username: string, password: string) {
    const existing = await this.usersService.findByUsername(username);
    if (existing) throw new Error('Username already exists');
    const user = await this.usersService.create(username, password);
    return this.login(user);
  }

  async loginWithCredentials(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException();
    }
    return this.login(user);
  }

  private login(user: any) {
    const payload = { sub: user.id, username: user.username };
    return {
      access_token: this.jwt.sign(payload),
    };
  }
}
