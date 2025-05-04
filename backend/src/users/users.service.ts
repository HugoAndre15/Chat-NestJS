import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  private users: any[] = [];

  async create(email: string, password: string, username: string, color: string) {
    const existingUser = this.users.find(u => u.email === email);
    if (existingUser) {
      throw new Error('User already exists');
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = { id: Date.now(), email, password: hashed, username, color };
    this.users.push(user);
    return { id: user.id, email: user.email, username: user.username, color: user.color };
  }

  async findByEmail(email: string) {
    return this.users.find(u => u.email === email);
  }

  async updateColor(email: string, color: string) {
    const user = this.users.find(u => u.email === email);
    if (user) {
      user.color = color;
      return { id: user.id, email: user.email, username: user.username, color: user.color };
    }
    throw new Error('User not found');
  }

  async validateUser(email: string, password: string) {
    const user = await this.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      return { id: user.id, email: user.email, username: user.username, color: user.color };
    }
    return null;
  }
}
