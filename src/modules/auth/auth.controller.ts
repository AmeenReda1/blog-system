import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './guards/local-user.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async registerUser(@Body() createUserDto: CreateUserDto) {

    const data = await this.authService.registerUser(createUserDto);
    return {
      message: 'User registered successfully',
      data
    }
  }
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req) {
    return{
      message: 'User logged in successfully',
      data: req.user
    }
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.authService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
