import { PaginateDto } from "./paginate.dto";
declare const searchDto_base: import("@nestjs/mapped-types").MappedType<Partial<PaginateDto>>;
export declare class searchDto extends searchDto_base {
    readonly searchStr: string;
}
export {};
