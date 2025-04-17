import { IsString, IsArray, IsOptional, MinLength, MaxLength } from 'class-validator';

export class CreateBlogDto {
    @IsString()
    @MinLength(3, { message: 'Title must be at least 3 characters long' })
    @MaxLength(100, { message: 'Title cannot exceed 100 characters' })
    title: string;

    @IsString()
    @MinLength(10, { message: 'Content must be at least 10 characters long' })
    content: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    tags?: string[];
}
