import { Prisma } from '@prisma/client';
export declare class PrismaException {
    validateException(exception: Prisma.PrismaClientKnownRequestError): void;
}
