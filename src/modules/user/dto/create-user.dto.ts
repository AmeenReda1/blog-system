import { IsEmail, IsString, IsEnum, IsOptional, MinLength, IsNotEmpty, Matches } from 'class-validator';
import { UserType } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({description:'email of the user',example:'test@gmail.com'})
    @IsEmail()
    email: string;

    @ApiProperty({description:'first name of the user',example:'John'})
    @IsString()
    firstName: string;

    @ApiProperty({description:'last name of the user',example:'Doe'})
    @IsString()
    lastName: string;


    @ApiProperty({description:'password of the user',example:'passwordAbc#123'})
    @IsNotEmpty({message:'password is required'})
    @IsString()
    @MinLength(6)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%#*?&]{6,}$/,{message: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'})
    password: string;

    @ApiProperty({description:'user type of the user',example:UserType.EDITOR})
    @IsNotEmpty({message:`user type is required to be one of the following: ${Object.values(UserType).join(', ')}`})
    @IsEnum(UserType)
    @IsOptional()
    userType?: UserType;

    @ApiProperty({description:'mobile number of the user',example:'01234567890'})
    @IsNotEmpty({message:'mobile number is required'})
    @IsString()
    @MinLength(6, { message: 'Mobile number must be at least 6 characters long' })
    mobileNumber?: string;
}
