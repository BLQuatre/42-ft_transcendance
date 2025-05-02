import { IsEmail, IsString, Length} from 'class-validator';

export class CreateUserDto {
    @IsString()
    @Length(6, 20)
    name!: string;

    @IsEmail()
    email!: string;
}