import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { User } from '../user/entities/user.entity';
import { BlogRepository } from './repositories/blog.repository';
import { Blog } from './entities/blog.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class BlogService {
  constructor(private readonly blogRepository: BlogRepository,
    private readonly userService: UserService

  ) { }
  async create(createBlogDto: CreateBlogDto, user: User) {
    const blog = new Blog();
    const userData = await this.userService.findOne({ where: { id: user.id } });
    if (!userData) {
      throw new NotFoundException('User not found');
    }
    Object.assign(blog, createBlogDto);
    blog.author_id = userData.id;
    return this.blogRepository.saveOne(blog);
  }

  async findAll(page: number, limit: number, tags?: string[]) {
    const skip = (page - 1) * limit;
    const queryBuilder = this.blogRepository.createQueryBuilder('blog')
      .leftJoinAndSelect('blog.author', 'author')
      .skip(skip)
      .take(limit);

    if (tags && tags.length > 0) {
      queryBuilder.where('blog.tags @> :tags', { tags });
    }

    const [blogs, total] = await queryBuilder.getManyAndCount();

    return {
      data: blogs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async findOne(id: number) {
    const blog = await this.blogRepository.findOne({
      where: { id },
      relations: ['author']
    });

    if (!blog) {
      throw new NotFoundException(`Blog with ID ${id} not found`);
    }

    return blog;
  }

  update(id: number, updateBlogDto: UpdateBlogDto, user: User) {
    return `This action updates a #${id} blog`;
  }

  remove(id: number) {
    return `This action removes a #${id} blog`;
  }
}
