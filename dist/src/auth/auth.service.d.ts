import { SignUpDto } from './dto/sign-up.dto';
import { users } from '@prisma/client';
import { PrismaException } from 'src/prisma/prisma.exception';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { ResendDto } from './dto/resend-email.dto';
export declare class AuthService {
    private readonly prismaService;
    private readonly prismaException;
    private readonly jwtService;
    constructor(prismaService: PrismaService, prismaException: PrismaException, jwtService: JwtService);
    signup(dto: SignUpDto): Promise<users>;
    resendEmail(dto: ResendDto): Promise<users>;
    activateUser(id: string): Promise<users>;
    signin(dto: SignInDto): Promise<{
        token: string;
        id: string;
        email: string;
        password: string;
        name: string;
        activated: boolean;
        createdAt: Date;
    }>;
    private _createToken;
    private sendEmail;
}
