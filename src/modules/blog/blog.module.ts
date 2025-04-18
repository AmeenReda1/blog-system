import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { Blog } from './entities/blog.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { BlogRepository } from './repositories/blog.repository';
import { Tag } from './entities/tag.entity';
import { TagRepository } from './repositories/tag.repository';

@Module({
  imports:[
    TypeOrmModule.forFeature([Blog,Tag]),
],
  controllers: [BlogController],
  providers: [BlogService, BlogRepository, TagRepository,JwtService,JwtAuthGuard,RolesGuard],
  exports:[BlogService]
})
export class BlogModule { }
