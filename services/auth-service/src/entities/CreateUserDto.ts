import { IsNotEmpty, IsString, Length, MinLength } from "class-validator";

export class CreateUserDto {
	@IsString()
	@IsNotEmpty()
	@Length(6, 20)
	name!: string;

	@IsNotEmpty()
	password!: string;
}
