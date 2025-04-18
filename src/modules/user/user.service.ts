import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './repositories/user.repository';
import { User } from './entities/user.entity';
import { FindOneOptions } from 'typeorm';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  async create(createUserDto: CreateUserDto):Promise<User> {
    let newUser= new User();
    Object.assign(newUser,createUserDto);
    return this.userRepository.saveOne(newUser);
  }


  findOneById(id: number) {
    return this.userRepository.findOne({where:{id}});
  }
  async findOne(where: FindOneOptions):Promise<User| null>{
    const user:User| null = await this.userRepository.findOne(where);
    return user;
  }
  async findOneOrThrow(where: FindOneOptions):Promise<User>{
    const user = await this.userRepository.findOneOrThrow(where);
    return user;
  }

}
