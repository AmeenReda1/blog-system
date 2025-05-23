import { Repository, FindOneOptions, FindManyOptions, SelectQueryBuilder, IsNull, FindOptionsWhere, UpdateResult } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { AbstractEntity } from './abstract.entity';

export abstract class AbstractRepository<TEntity extends AbstractEntity> {
    constructor(
        protected readonly entityRepository: Repository<TEntity>,
        protected notFoundMsg: string,
    ) { }

    async findAll(where?: FindManyOptions<TEntity>): Promise<TEntity[]> {
        if (where)
            return this.entityRepository.find(where);
        else return this.entityRepository.find();

    }
    async findOne(where: FindOneOptions<TEntity>): Promise<TEntity | null> {
        return this.entityRepository.findOne(where);
    }

    async findOneOrThrow(where: FindOneOptions<TEntity>): Promise<TEntity> {
        const entity = await this.entityRepository.findOne(where);
        if (!entity) throw new NotFoundException(this.notFoundMsg);
        return entity;
    }

    async saveOne(entity: TEntity): Promise<TEntity> {
        return this.entityRepository.save(entity);
    }
    createQueryBuilder(alias: string): SelectQueryBuilder<TEntity> {
        return this.entityRepository.createQueryBuilder(alias);
    }

    async findOneAndUpdate(
        where: FindOneOptions<TEntity>,
        update: Partial<TEntity>,
    ): Promise<TEntity> {
        const entity = await this.entityRepository.findOne(where);
        if (!entity) throw new NotFoundException(this.notFoundMsg);
        Object.assign(entity, update);
        return await this.entityRepository.save(entity);
    }

    async delete(id: number): Promise<void> {
        await this.entityRepository.delete(id);
    }
    async softDelete(id: number): Promise<UpdateResult> {
        const existing = await this.entityRepository.findOne({
            where: { id: id as any }
        });

        if (!existing) {
            throw new NotFoundException(this.notFoundMsg);
        }

        if (existing.deleted_at) {
            // Already soft-deleted - return affected: 0
            return { affected: 0, raw: [], generatedMaps: [] };
        }

        // Perform the soft delete
        return this.entityRepository.softDelete(id);
    }
}
