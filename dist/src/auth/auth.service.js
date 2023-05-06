"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
const googleapis_1 = require("googleapis");
const client_1 = require("@prisma/client");
const prisma_exception_1 = require("../prisma/prisma.exception");
const prisma_service_1 = require("../prisma/prisma.service");
const bcryptjs_1 = require("bcryptjs");
const bcrypt = require("bcryptjs");
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    constructor(prismaService, prismaException, jwtService) {
        this.prismaService = prismaService;
        this.prismaException = prismaException;
        this.jwtService = jwtService;
    }
    async signup(dto) {
        try {
            await this.prismaService.users.create({ data: {
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
                } });
            const hashPassword = await (0, bcryptjs_1.hash)(dto.password, 5);
            const user = await this.prismaService.users.upsert({
                where: { email: dto.email },
                create: { email: dto.email, name: dto.name, password: hashPassword },
                update: {}
            });
            await this.sendEmail(dto.email, `${process.env.API_URL}/auth/activate/${user.id}`);
            return user;
        }
        catch (err) {
            if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                this.prismaException.validateException(err);
            }
            throw new common_1.HttpException({ statusCode: err.statusCode || common_1.HttpStatus.BAD_REQUEST, success: false, message: err.message }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async resendEmail(dto) {
        try {
            const { email } = dto;
            const user = await this.prismaService.users.findUniqueOrThrow({ where: { email: email } });
            await this.sendEmail(user.email, `${process.env.API_URL}/auth/activate/${user.id}`);
            return user;
        }
        catch (err) {
            if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                this.prismaException.validateException(err);
            }
            throw new common_1.HttpException({ statusCode: err.statusCode || common_1.HttpStatus.BAD_REQUEST, success: false, message: err.message }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async activateUser(id) {
        try {
            await this.prismaService.users.findFirstOrThrow({ where: { id: id } });
            return this.prismaService.users.update({ where: { id: id }, data: { activated: true } });
        }
        catch (err) {
            if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                this.prismaException.validateException(err);
            }
            throw new common_1.HttpException({ statusCode: err.statusCode || common_1.HttpStatus.BAD_REQUEST, success: false, message: err.message }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async signin(dto) {
        try {
            const _user = await this.prismaService.users.findFirstOrThrow({ where: { email: dto.email } });
            const compare = await bcrypt.compare(dto.password, _user.password);
            if (compare === false) {
                throw new common_1.HttpException({ status: common_1.HttpStatus.CONFLICT, success: false, message: "undefined user" }, common_1.HttpStatus.CONFLICT);
            }
            const token = await this._createToken(_user);
            delete _user.password;
            return Object.assign(Object.assign({}, _user), { token: token });
        }
        catch (err) {
            if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                this.prismaException.validateException(err);
            }
            throw new common_1.HttpException({ statusCode: err.statusCode || common_1.HttpStatus.BAD_REQUEST, success: false, message: err.message }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async _createToken(user) {
        try {
            const token = await this.jwtService.sign({ id: user.id, email: user.email });
            return token;
        }
        catch (err) {
            if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                this.prismaException.validateException(err);
            }
            throw new common_1.HttpException({ statusCode: err.statusCode || common_1.HttpStatus.BAD_REQUEST, success: false, message: err.message }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async sendEmail(email, link) {
        try {
            const oAuth2Client = new googleapis_1.google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLEINT_SECRET, process.env.REDIRECT_URI);
            oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
            const accessToken = await oAuth2Client.getAccessToken();
            const transport = nodemailer.createTransport({
                service: "gmail",
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
            console.log(mailOptions);
            const response = await transport.sendMail(mailOptions);
            console.log(response);
            return response;
        }
        catch (err) {
            throw err;
        }
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        prisma_exception_1.PrismaException,
        jwt_1.JwtService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map