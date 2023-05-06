/// <reference types="express-serve-static-core" />
/// <reference types="multer" />
import { Request } from 'express';
export declare const editFileName: (req: Request, file: Express.Multer.File, callback: any) => void;
export declare const imageFileFilter: (req: Request, file: Express.Multer.File, callback: any) => void;
export declare const fileStorageFilter: (req: Request, file: Express.Multer.File, callback: any) => void;
export declare const videoFileFilter: (req: Request, file: Express.Multer.File, callback: any) => void;
