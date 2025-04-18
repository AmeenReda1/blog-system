import { Injectable, NotFoundException, Inject, BadRequestException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { User } from '../user/entities/user.entity';
import { BLOG_PAGINATION_CONFIG } from './config/pagination.config';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { BlogRepository } from './repositories/blog.repository';
import { Repository } from 'typeorm';
import { TagRepository } from './repositories/tag.repository';
import { Tag } from './entities/tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class BlogService {
  constructor(
    private readonly blogRepository: BlogRepository,
    private readonly tagRepository: TagRepository,
    private readonly redisService: RedisService
  ) {}

  async create(createBlogDto: CreateBlogDto, user: User): Promise<Blog> {
    const blog = new Blog();
    Object.assign(blog, createBlogDto);
    blog.author_id = user.id;
    const tags = await this.tagRepository.findByIds(createBlogDto.tags || []);
    blog.tags = tags;
    return this.blogRepository.saveOne(blog);
  }

  async findAll(query: PaginateQuery): Promise<Paginated<Blog>> {

    if (query.filter?.tags) {
      query.filter['tags.name'] = query.filter.tags;
      delete query.filter.tags;
    }
    return paginate(query, this.blogRepository.blogRepository, BLOG_PAGINATION_CONFIG);
  }

  async findOne(id: number): Promise<Blog> {
    const cacheKey = `blog_${id}`;

    try {
      const cachedBlog = await this.redisService.get<Blog>(cacheKey);
      if (cachedBlog) {
        console.log('get from redis');
        return cachedBlog;
      }
    } catch (error) {
      console.error(`Redis GET error for key ${cacheKey}:`, error);
    }
    const blog = await this.blogRepository.findOne({ where: { id } });
    if (!blog) {
      throw new NotFoundException(`Blog with ID ${id} not found`);
    }
    try {
      console.log('set to redis');
      await this.redisService.set(cacheKey, blog);
    } catch (error) {
      console.error(`Redis SET error for key ${cacheKey}:`, error);
    }
    return blog;
  }
  async createTag(createTagDto: CreateTagDto): Promise<Tag> {
    let tag = await this.tagRepository.findOne({ where: { name: createTagDto.name } });
    if (tag) {
      throw new BadRequestException('Tag already exists');
    }
    tag = new Tag();
    Object.assign(tag, createTagDto);
    return this.tagRepository.saveOne(tag);
  }
  async update(id: number, updateBlogDto: UpdateBlogDto, user: User): Promise<Blog> {
    const blog = await this.blogRepository.findOne({
      where: { id },
    });
    if (!blog) {
      throw new NotFoundException(`Blog with ID ${id} not found`);
    }

    Object.assign(blog, updateBlogDto);
    const updatedBlog = await this.blogRepository.saveOne(blog);

    const cacheKey = `blog_${id}`;
    try {
      await this.redisService.del(cacheKey);
    } catch (error) {
      console.error(`Redis DEL error for key ${cacheKey}:`, error);
    }
    return updatedBlog;
  }

  async remove(id: number): Promise<{ message: string }> {
    try {
      const deleteResult = await this.blogRepository.softDelete(id);
      console.log('Delete result:', deleteResult);
      const cacheKey = `blog_${id}`;
      await this.redisService.del(cacheKey);

      if (deleteResult.affected === 0) {
        return { message: 'Blog was already deleted or not found' };
      }

      return { message: 'Blog deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        return { message: error.message };
      }
      throw error;
    }
  }
}
