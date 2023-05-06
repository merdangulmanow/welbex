import { IsEmail, IsNotEmpty } from "class-validator";

export class ResendDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string
}