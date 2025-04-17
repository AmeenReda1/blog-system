
import { AbstractRepository } from 'src/common/abstract/abstract.repository.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
@Injectable()
export class UserRepository extends AbstractRepository<User> {
    constructor(
        @InjectRepository(User) readonly userRepository: Repository<User>,
    ) {
        super(userRepository, 'User not found');
    }
}