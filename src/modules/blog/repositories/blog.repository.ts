
import { AbstractRepository } from 'src/common/abstract/abstract.repository.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from '@nestjs/common';
import { Blog } from '../entities/blog.entity';
@Injectable()
export class BlogRepository extends AbstractRepository<Blog> {
    constructor(
        @InjectRepository(Blog) readonly blogRepository: Repository<Blog>,
    ) {
        super(blogRepository, 'Blog not found');
    }
}