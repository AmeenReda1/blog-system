import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindOneOptions } from 'typeorm';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  create(createUserDto: CreateUserDto) {
    const user = new User();
    Object.assign(user, createUserDto);
    return this.userRepository.saveOne(user);
  }

  findAll() {
    return `This action returns all user`;
  }
  findOneById(id: number): Promise<User|null> {
    return this.userRepository.findOne({ where: { id } });
  }

  findOne(where: FindOneOptions): Promise<User|null> {
    return this.userRepository.findOne(where);
  }
  findOneOrThrow(where: FindOneOptions): Promise<User> {
    return this.userRepository.findOneOrThrow(where);
  }
  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
