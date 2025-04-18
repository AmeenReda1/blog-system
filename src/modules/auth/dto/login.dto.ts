import { ApiAcceptedResponse, ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
    @ApiProperty({description:'email of the user',example:'test@gmail.com'})
    @IsEmail()
    email: string;

    @ApiProperty({description:'password of the user',example:'passwordAbc#123'})
    @IsString()
    @MinLength(6)
    password: string;
} 