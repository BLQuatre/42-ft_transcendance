import { IsEmail, IsNotEmpty, IsString, Length, MinLength} from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @Length(6, 20)
    name!: string;

    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @IsNotEmpty()
    @Length(12, 30)
    password!: string
}