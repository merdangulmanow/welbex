import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { ResendDto } from './dto/resend-email.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signup(dto: SignUpDto): Promise<import(".prisma/client").users>;
    resendEmail(dto: ResendDto): Promise<import(".prisma/client").users>;
    signin(dto: SignInDto): Promise<{
        token: string;
        id: string;
        email: string;
        password: string;
        name: string;
        activated: boolean;
        createdAt: Date;
    }>;
    activateUser(id: string): Promise<import(".prisma/client").users>;
}
