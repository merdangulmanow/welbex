import { Injectable, ArgumentsHost, Catch, HttpStatus, HttpException } from "@nestjs/common";
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaException {

  validateException(exception: Prisma.PrismaClientKnownRequestError){
    console.error(exception.message);
    console.log(exception.code)
    const message = exception.message.replace(/\n/g, '');
    

    switch (exception.code) {
      case 'P2000': {
        throw new HttpException({ statusCode: 446, success: false, message: `so long data, ${message}`}, HttpStatus.BAD_REQUEST);
      }
      
      case 'P2001': {
        throw new HttpException({ statusCode: 447, success: false, message: `undefined field where, ${message}`}, HttpStatus.BAD_REQUEST);
      }
      
      case 'P2002': {
        throw new HttpException({ statusCode: 447, success: false, message: `already exists, ${message}`}, HttpStatus.BAD_REQUEST);
      }

      case 'P2003': {
        throw new HttpException({ statusCode: 457, success: false, message: `not found, ${message}`}, HttpStatus.BAD_REQUEST);
      }

      case 'P2004': {
        throw new HttpException({ statusCode: 448, success: false, message: `Ошибка ограничения в базе данных: {database_error}, ${message}`}, HttpStatus.BAD_REQUEST);
      }

      case 'P2006': {
        throw new HttpException({ statusCode: 449, success: false, message: `database_error, ${message}`}, HttpStatus.BAD_REQUEST);
      }

      case 'P2011': {
        throw new HttpException({ statusCode: 450, success: false, message: `database_error, ${message}`,}, HttpStatus.BAD_REQUEST);
      }

      case 'P2012': {
        throw new HttpException({ statusCode: 451, success: false, message: `database_error, ${message}`}, HttpStatus.BAD_REQUEST);
      }

      case 'P2013': {
        throw new HttpException({ statusCode: 452, success: false, message: `database_error, ${message}`}, HttpStatus.BAD_REQUEST);
      }

      case 'P2015': {
        throw new HttpException({ statusCode: 453, success: false, message: `database_error, ${message}`}, HttpStatus.BAD_REQUEST);
      }

      case 'P2017': {
        throw new HttpException({ statusCode: 454, success: false, message: `database_error, ${message}`}, HttpStatus.BAD_REQUEST);
      }

      case 'P2021': {
        throw new HttpException({ statusCode: 455, success: false, message: `database_error, ${message}`}, HttpStatus.BAD_REQUEST);
      }

      case 'P2022': {
        throw new HttpException({ statusCode: 456, success: false, message: `database_error, ${message}`}, HttpStatus.BAD_REQUEST);
      }
      
      case 'P2025': {
        throw new HttpException({ statusCode: HttpStatus.NOT_FOUND, success: false, message: `database_error, ${message}`}, HttpStatus.BAD_REQUEST);
      }
      default: 
        throw new HttpException({ statusCode: 440, success: false, message: `database_error, ${message}`}, HttpStatus.BAD_REQUEST);
    }
  }
}
/*
  throw new HttpException({ statusCode: 457, success: false, message: `you are not the author`}, HttpStatus.BAD_REQUEST);
*/