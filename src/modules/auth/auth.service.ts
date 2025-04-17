import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) { }
  async registerUser(createUserDto: CreateUserDto) {
    const { email, mobileNumber } = createUserDto;
    let existingUser = await this.userService.findOne({ where: [{ email }, { mobileNumber }] });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }
    return await this.userService.create(createUserDto);
  }
  async validateUser(email: string, password: string):Promise<{user:User, token:string}> {
    const existingUser = await this.userService.findOne({ where: { email } });
    if (!existingUser) {
      throw new NotFoundException('email or passowrd in correct');
    }
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      throw new NotFoundException('email or passowrd in correct');
    }

    const payload = {
      id: existingUser.id,
      email: existingUser.email,
      name: existingUser.firstName + ' ' + existingUser.lastName,
      type: existingUser.userType,
    };
    const token = await this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });
    return { user:existingUser, token };
  }
  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
