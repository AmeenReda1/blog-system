import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserType } from '../user/entities/user.entity';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CreateBlogResponse } from 'src/common/swagger/response/create-blog.response';
import { GetAllBlogsResponse } from 'src/common/swagger/response/get-all-blogs.response';
import { CreateTagDto } from './dto/create-tag.dto';

@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) { }

  @ApiOperation({ summary: 'Create new Blog' })
  @ApiBearerAuth()
  @ApiBody({ type: CreateBlogDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Resource' })
  @ApiResponse({ status: 201, description: 'Blog created successfully', example: CreateBlogResponse })
  @UseGuards(JwtAuthGuard)
  @Post('create')
  @UseGuards(JwtAuthGuard)
  async create(@Body() createBlogDto: CreateBlogDto, @GetUser() user: User) {
    const blog = await this.blogService.create(createBlogDto, user);
    return {
      message: 'Blog created successfully',
      data: blog
    }
  }

  @ApiOperation({ summary: 'Get All Blogs paginated' })
  @ApiQuery({ name: 'page', type: 'number', description: 'Page number', required: false })
  @ApiQuery({ name: 'limit', type: 'number', description: 'Limit number', required: false })
  @ApiQuery({ name: 'sortBy', type: 'string', description: 'Sort by field', required: false })
  @ApiQuery({ name: 'sortOrder', type: 'string', description: 'Sort order', required: false })
  @ApiQuery({ name: 'search', type: 'string', description: 'Search by title or content', required: false })
  @ApiQuery({ name: 'filter.tags', type: 'string', description: 'Filter by tags', required: false })
  @ApiResponse({ status: 200, description: 'Blogs fetched successfully', example: GetAllBlogsResponse })
  @Get()
  findAll(
    @Paginate() query: PaginateQuery
  ) {
    return this.blogService.findAll(query);
  }

  @ApiOperation({ summary: 'Get Blog by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID of the blog to fetch' })
  @ApiResponse({ status: 200, description: 'Blog fetched successfully', example: CreateBlogResponse })
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const blog = await this.blogService.findOne(id);
    return {
      message: 'Blog fetched successfully',
      data: blog
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Blog' })
  @ApiBody({ type: CreateBlogDto })
  @ApiParam({ name: 'id', type: 'number', description: 'ID of the blog to update' })
  @ApiResponse({ status: 200, description: 'Blog updated successfully', example: CreateBlogResponse })
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: number,
    @Body() updateBlogDto: Partial<CreateBlogDto>,
    @GetUser() user: User,
  ) {
    const blog = await this.blogService.update(id, updateBlogDto, user);
    return {
      message: 'Blog updated successfully',
      data: blog
    }
  }

  @ApiBody({ type: CreateTagDto })
  @Post('tags')
  async createTag(@Body() createTagDto: CreateTagDto) {
    const tag = await this.blogService.createTag(createTagDto);
    return {
      message: 'Tag created successfully',
      data: tag
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Blog' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID of the blog to delete' })
  @ApiResponse({ status: 200, description: 'Blog deleted successfully (soft delete)', example: { message: 'Blog deleted successfully' } })
  @Delete(':id')
  @Roles(UserType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async remove(@Param('id') id: number) {
    const result = await this.blogService.remove(id);
    return {
      message: result.message,
      data: null
    }
  }
}
