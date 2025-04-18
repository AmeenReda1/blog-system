import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional, MinLength, MaxLength, IsNumber } from 'class-validator';

export class CreateBlogDto {
    @ApiProperty({ description: 'Title of the blog', example: 'My First Blog' })
    @IsString()
    @MinLength(3, { message: 'Title must be at least 3 characters long' })
    @MaxLength(100, { message: 'Title cannot exceed 100 characters' })
    title: string;

    @ApiProperty({ description: 'Content of the blog', example: 'This is the content of my first blog.' })
    @IsString()
    @MinLength(10, { message: 'Content must be at least 10 characters long' })
    content: string;

    @ApiProperty({ description: 'Tags of the blog', example: [1, 2, 3] })
    @IsArray()
    @IsNumber({}, { each: true })
    tags?: number[];
}
