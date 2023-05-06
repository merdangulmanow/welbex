"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaException = void 0;
const common_1 = require("@nestjs/common");
let PrismaException = class PrismaException {
    validateException(exception) {
        console.error(exception.message);
        console.log(exception.code);
        const message = exception.message.replace(/\n/g, '');
        switch (exception.code) {
            case 'P2000': {
                throw new common_1.HttpException({ statusCode: 446, success: false, message: `so long data, ${message}` }, common_1.HttpStatus.BAD_REQUEST);
            }
            case 'P2001': {
                throw new common_1.HttpException({ statusCode: 447, success: false, message: `undefined field where, ${message}` }, common_1.HttpStatus.BAD_REQUEST);
            }
            case 'P2002': {
                throw new common_1.HttpException({ statusCode: 447, success: false, message: `already exists, ${message}` }, common_1.HttpStatus.BAD_REQUEST);
            }
            case 'P2003': {
                throw new common_1.HttpException({ statusCode: 457, success: false, message: `not found, ${message}` }, common_1.HttpStatus.BAD_REQUEST);
            }
            case 'P2004': {
                throw new common_1.HttpException({ statusCode: 448, success: false, message: `Ошибка ограничения в базе данных: {database_error}, ${message}` }, common_1.HttpStatus.BAD_REQUEST);
            }
            case 'P2006': {
                throw new common_1.HttpException({ statusCode: 449, success: false, message: `database_error, ${message}` }, common_1.HttpStatus.BAD_REQUEST);
            }
            case 'P2011': {
                throw new common_1.HttpException({ statusCode: 450, success: false, message: `database_error, ${message}`, }, common_1.HttpStatus.BAD_REQUEST);
            }
            case 'P2012': {
                throw new common_1.HttpException({ statusCode: 451, success: false, message: `database_error, ${message}` }, common_1.HttpStatus.BAD_REQUEST);
            }
            case 'P2013': {
                throw new common_1.HttpException({ statusCode: 452, success: false, message: `database_error, ${message}` }, common_1.HttpStatus.BAD_REQUEST);
            }
            case 'P2015': {
                throw new common_1.HttpException({ statusCode: 453, success: false, message: `database_error, ${message}` }, common_1.HttpStatus.BAD_REQUEST);
            }
            case 'P2017': {
                throw new common_1.HttpException({ statusCode: 454, success: false, message: `database_error, ${message}` }, common_1.HttpStatus.BAD_REQUEST);
            }
            case 'P2021': {
                throw new common_1.HttpException({ statusCode: 455, success: false, message: `database_error, ${message}` }, common_1.HttpStatus.BAD_REQUEST);
            }
            case 'P2022': {
                throw new common_1.HttpException({ statusCode: 456, success: false, message: `database_error, ${message}` }, common_1.HttpStatus.BAD_REQUEST);
            }
            case 'P2025': {
                throw new common_1.HttpException({ statusCode: common_1.HttpStatus.NOT_FOUND, success: false, message: `database_error, ${message}` }, common_1.HttpStatus.BAD_REQUEST);
            }
            default:
                throw new common_1.HttpException({ statusCode: 440, success: false, message: `database_error, ${message}` }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
PrismaException = __decorate([
    (0, common_1.Injectable)()
], PrismaException);
exports.PrismaException = PrismaException;
//# sourceMappingURL=prisma.exception.js.map