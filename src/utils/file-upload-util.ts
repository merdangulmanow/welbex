import { HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { extname } from 'path';
import {v4} from 'uuid'

export const editFileName = (
  req: Request,
  file: Express.Multer.File,
  callback
) => {
  console.log('...........................',file.originalname.toLowerCase())
  callback(null, `${v4()}${extname(file.originalname.toLowerCase())}`);
};

export const imageFileFilter = ( req: Request, file: Express.Multer.File, callback ) => {
  if (!Buffer.from(file.originalname.toLowerCase(), 'latin1').toString('utf8').match(/\.(jpg|jpeg|png|gif)$/)) {
    callback(new HttpException({ statusCode: 555, success: false, message: "invalid file type"}, HttpStatus.BAD_REQUEST));
  }
  callback(null, true);
};

export const fileStorageFilter = (req: Request, file: Express.Multer.File, callback)=>{
  // Buffer.from(file.originalname.toLowerCase(), 'latin1').toString('utf8')
  if (!Buffer.from(file.originalname.toLowerCase(), 'latin1').toString('utf8').match(/\.(doc|docx|pdf|xlsx|xls|ppt|pptx|zip|rar|jpg|jpeg|png|gif)$/)) {
    callback(new HttpException({ statusCode: 555, success: false, message: "invalid file type"}, HttpStatus.BAD_REQUEST));
  }
  callback(null, true);
}

export const videoFileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback
) => {
  if (!file.originalname.toLowerCase().match(/\.(mp4)$/)) {
    throw new HttpException('Only image files are allowed!', HttpStatus.INTERNAL_SERVER_ERROR), false;
    // return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};



// if ((file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg" || file.mimetype === "application/octet-stream") && fileSize <= 1282810) {
//   cb(null, true)
// } 