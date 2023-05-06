/// <reference types="multer" />
interface FileMapper {
    file: Express.Multer.File;
}
interface FilesMapper {
    files: Express.Multer.File[];
}
export declare const fileMapper: ({ file }: FileMapper, type: string) => string;
export declare const filesMapper: ({ files }: FilesMapper, type: string) => any[];
export {};
