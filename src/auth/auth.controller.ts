import { Body, Controller, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { responseInterceptor } from 'src/utils/response.interceptor';
import { ResendDto } from './dto/resend-email.dto';

@UseInterceptors(responseInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: SignUpDto){
    return this.authService.signup(dto)
  }

  @Post('/resend')
  resendEmail(@Body() dto: ResendDto){
    return this.authService.resendEmail(dto)
  }

  @Post('signin')
  signin(@Body() dto: SignInDto){
    return this.authService.signin(dto)
  }

  @Get('activate/:id')
  activateUser(@Param('id') id: string){
    return this.authService.activateUser(id)
  }
}
