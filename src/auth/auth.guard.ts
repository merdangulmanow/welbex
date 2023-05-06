import {CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const req = context.switchToHttp().getRequest()
      try {
        const authHeader = req.headers.authorization;
        const bearer = authHeader.split(' ')[0]
        const token = authHeader.split(' ')[1]

        if (bearer !== 'Bearer' || !token) {
          throw new HttpException({ statusCode: HttpStatus.UNAUTHORIZED, success: false, message: "unauthorized"}, HttpStatus.BAD_REQUEST);
        }
        const user = this.jwtService.verify(token);
        req.user = user;
        return true;
      } catch (e) {
        throw new HttpException({ statusCode: HttpStatus.UNAUTHORIZED, success: false, message: "unauthorized"}, HttpStatus.BAD_REQUEST);
      }
    }

}
