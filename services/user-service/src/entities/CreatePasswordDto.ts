import { IsNotEmpty } from "class-validator";

export class CreatePasswordDto {
	@IsNotEmpty()
	password!: string;
}
