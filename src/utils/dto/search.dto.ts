import { PartialType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { PaginateDto } from "./paginate.dto";


export class searchDto extends PartialType(PaginateDto){
    @IsNotEmpty()
    @IsString()
    readonly searchStr: string
}