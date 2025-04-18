
import { AbstractRepository } from 'src/common/abstract/abstract.repository.entity';
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from '@nestjs/common';
import { Tag } from '../entities/tag.entity';
import { In, Repository } from 'typeorm';
@Injectable()
export class TagRepository extends AbstractRepository<Tag> {
    constructor(
        @InjectRepository(Tag) readonly tagRepository: Repository<Tag>,
    ) {
        super(tagRepository, 'Tag not found');
    }
    async findByIds(ids: number[]): Promise<Tag[]> {
        return this.findAll({ where: { id: In(ids) } });
    }
}