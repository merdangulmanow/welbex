import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as nodemailer from "nodemailer"
import {google} from 'googleapis'
import { SignUpDto } from './dto/sign-up.dto';
import { Prisma, users } from '@prisma/client';
import { PrismaException } from 'src/prisma/prisma.exception';
import { PrismaService } from 'src/prisma/prisma.service';
import {hash} from 'bcryptjs'
import { SignInDto } from './dto/sign-in.dto';
import * as bcrypt from 'bcryptjs'
import { JwtService } from '@nestjs/jwt';
import { ResendDto } from './dto/resend-email.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService, 
    private readonly prismaException: PrismaException,
    private readonly jwtService: JwtService,
  ){}

  async signup(dto: SignUpDto):Promise<users>{
    try {
      await this.prismaService.users.create({data: {
        email: "sdfsd", name: "sdfsd", password: 'sdfsdfs', activated: true, posts: {
          createMany: {
            data: [
              {
                media: "sfsdfsdf",
                message: "dfsdfsdfsd"
              }
            ]
          }
        }
      }})

      const hashPassword = await hash(dto.password, 5)
      const user= await this.prismaService.users.upsert({
        where: {email: dto.email},
        create: {email: dto.email, name: dto.name, password: hashPassword},
        update: {}
      })
      await this.sendEmail(dto.email, `${process.env.API_URL}/auth/activate/${user.id}`);
      return user
      
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        this.prismaException.validateException(err)
      }
      throw new HttpException({ statusCode: err.statusCode || HttpStatus.BAD_REQUEST, success: false, message: err.message}, HttpStatus.BAD_REQUEST);
    }
  }

  async resendEmail(dto: ResendDto){
    try {
      const {email}= dto
      const user= await this.prismaService.users.findUniqueOrThrow({where: {email: email}})
      await this.sendEmail(user.email, `${process.env.API_URL}/auth/activate/${user.id}`);
      return user
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        this.prismaException.validateException(err)
      }
      throw new HttpException({ statusCode: err.statusCode || HttpStatus.BAD_REQUEST, success: false, message: err.message}, HttpStatus.BAD_REQUEST);
    }
  }

  async activateUser(id: string):Promise<users>{
    try {
      await this.prismaService.users.findFirstOrThrow({where: {id: id}})
      return this.prismaService.users.update({where: {id: id}, data: {activated: true}})
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        this.prismaException.validateException(err)
      }
      throw new HttpException({ statusCode: err.statusCode || HttpStatus.BAD_REQUEST, success: false, message: err.message}, HttpStatus.BAD_REQUEST);
    }
  }

  async signin(dto: SignInDto){
    try {
      const _user= await this.prismaService.users.findFirstOrThrow({where: {email: dto.email}})
      const compare: boolean = await bcrypt.compare(dto.password, _user.password)
      if(compare === false){
        throw new HttpException({ status: HttpStatus.CONFLICT, success: false, message: "undefined user"}, HttpStatus.CONFLICT);
      }

      const token = await this._createToken(_user)
      delete _user.password
      return {..._user, token: token}
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        this.prismaException.validateException(err)
      }
      throw new HttpException({ statusCode: err.statusCode || HttpStatus.BAD_REQUEST, success: false, message: err.message}, HttpStatus.BAD_REQUEST);
    }
  }

  private async _createToken(user: users):Promise<string>{
    try {
        const token: string= await this.jwtService.sign({id: user.id, email: user.email})
        return token
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        this.prismaException.validateException(err)
      }
      throw new HttpException({ statusCode: err.statusCode || HttpStatus.BAD_REQUEST, success: false, message: err.message}, HttpStatus.BAD_REQUEST);
    }
  }

  private async sendEmail(email: string, link: string){
    try {
      const oAuth2Client = new google.auth.OAuth2(
        process.env.CLIENT_ID,
        process.env.CLEINT_SECRET,
        process.env.REDIRECT_URI
      );
        oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
        const accessToken = await oAuth2Client.getAccessToken();
        const transport  = nodemailer.createTransport({
        service : "gmail",
        //   secure : false,
        auth: {
            type: 'OAuth2',
            user: 'payhasmerkezi@gmail.com',
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLEINT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
            accessToken: accessToken,
        },
        });

        const mailOptions = {
            from: 'Welbex team <payhasmerkezi@gmail.com>',
            to: email,
            subject: 'Welbex Authorization',
            text: '',
            html: `
              <p>Verify your email address to complete the signup and login into your account.</p>
              <p>This link <b> expires in 2 hours.</b> Press
              <a href=${link}>here</a> to proceed.</p>
            `,
        };
        console.log(mailOptions)
        const response = await transport.sendMail(mailOptions)
        console.log(response)
        return response
    } catch (err) {
      throw err
    }
  }

}