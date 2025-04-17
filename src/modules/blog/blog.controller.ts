import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserType } from '../user/entities/user.entity';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';

@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) { }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async create(@Body() createBlogDto: CreateBlogDto, @GetUser() user: User) {
    const blog=await this.blogService.create(createBlogDto, user);
    return{
      message:'Blog created successfully',
      data:blog
    }
  }

  @Get()
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('tags') tags?: string,
  ) {
    const tagArray = tags ? tags.split(',') : undefined;
    return this.blogService.findAll(+page, +limit, tagArray);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.blogService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: number,
    @Body() updateBlogDto: Partial<CreateBlogDto>,
    @GetUser() user: User,
  ) {
    return this.blogService.update(id, updateBlogDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(UserType.ADMIN)
  remove(@Param('id') id: number) {
    return this.blogService.remove(id);
  }
}
