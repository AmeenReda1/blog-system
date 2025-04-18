import { ApiProperty } from '@nestjs/swagger';
import { IsString,MinLength, MaxLength } from 'class-validator';

export class CreateTagDto {
    @ApiProperty({ description: 'Tag name', example: 'tech tag' })
    @IsString()
    @MinLength(1, { message: 'Tag name must be at least 3 characters long' })
    @MaxLength(100, { message: 'Tag name cannot exceed 100 characters' })
    name: string;
}
