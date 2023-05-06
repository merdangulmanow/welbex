import { IsNumberString, IsOptional } from "class-validator";

export class PaginateDto{
  @IsOptional()
  @IsNumberString()
  readonly limit: number | 15

  @IsOptional()
  @IsNumberString()
  readonly page: number | 1
}