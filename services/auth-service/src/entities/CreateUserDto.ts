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
	@MinLength(12)
	password!: string
}
