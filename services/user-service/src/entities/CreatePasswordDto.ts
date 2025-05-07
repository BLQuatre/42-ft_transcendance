import { IsNotEmpty, Length } from "class-validator";

export class CreatePasswordDto {
	@IsNotEmpty()
	@Length(12, 30)
	password!: string
}