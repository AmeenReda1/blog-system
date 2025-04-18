import { Controller,Post, Body,  UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LocalAuthGuard } from './guards/local-user.guard';
import { ApiBody, ApiCreatedResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserResponse } from 'src/common/swagger/response/create-user.response';
import { LoginDto } from './dto/login.dto';
import { LoginUserResponse } from 'src/common/swagger/response/login-user.response';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}



  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({status: 201, description: 'User created successfully', example: CreateUserResponse})

  @Post('register')
  async registerUser(@Body() createUserDto: CreateUserDto) {

    const data = await this.authService.registerUser(createUserDto);
    return {
      message: 'User registered successfully',
      data
    }
  }




  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 201, description: 'User logged in successfully', example: LoginUserResponse })
  @ApiResponse({ status: 404, description: 'Email or password is incorrect',example: {message: 'email or passowrd in correct' } })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req) {
    return{
      message: 'User logged in successfully',
      data: req.user
    }
  }
}
