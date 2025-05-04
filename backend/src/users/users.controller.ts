import { Controller, Get, Patch, UseGuards, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@CurrentUser() user) {
    // Recherche l'utilisateur complet par email
    return this.usersService.findByEmail(user.email);
  }

  @Patch('color')
  @UseGuards(JwtAuthGuard)
  async updateColor(@CurrentUser() user, @Body('color') color: string) {
      // Met à jour la couleur de l'utilisateur
      return this.usersService.updateColor(user.email, color);
  }
}
