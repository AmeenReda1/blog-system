import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { Blog } from './entities/blog.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { BlogRepository } from './repositories/blog.repository';
import { UserModule } from '../user/user.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([Blog]),
    UserModule
],
  controllers: [BlogController],
  providers: [BlogService,BlogRepository,JwtService,JwtAuthGuard,RolesGuard],
  exports:[BlogService]
})
export class BlogModule { }
