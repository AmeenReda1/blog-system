import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MIN, MinLength } from "class-validator";
import { UserType } from "../entities/user.entity";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty({ message: 'First name is required' })
    firstName: string;

    @IsString()
    @IsNotEmpty({ message: 'Last name is required' })
    lastName: string;

    @IsEmail()
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @IsString()
    @IsNotEmpty({ message: 'Password is required' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, { message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character' })
    password: string;


    @IsNotEmpty({ message: 'User type is required' })
    @IsOptional()
    @IsEnum(UserType, { message: `User type must be either ${UserType.ADMIN} or ${UserType.EDITOR}` })
    userType: UserType;

    @IsString()
    @IsNotEmpty({ message: 'Mobile number is required' })
    @MinLength(6, { message: 'Mobile number must be at least 6 characters long' })
    @MaxLength(12, { message: 'Mobile number must be at most 12 characters long' })
    mobileNumber: string;
}
