import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
	@IsString()
	@IsNotEmpty()
	@Length(6, 20)
	name!: string;

	@IsNotEmpty()
	password!: string
}
