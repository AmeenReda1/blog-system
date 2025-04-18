
import { AbstractRepository } from 'src/common/abstract/abstract.repository.entity';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from '@nestjs/common';
@Injectable()
export class UserRepository extends AbstractRepository<User> {
    constructor(
        @InjectRepository(User) readonly userRepository: Repository<User>,
    ) {
        super(userRepository, 'User not found');
    }
}