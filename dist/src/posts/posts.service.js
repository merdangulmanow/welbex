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
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const prisma_exception_1 = require("../prisma/prisma.exception");
const client_1 = require("@prisma/client");
let PostsService = class PostsService {
    constructor(prismaService, prismaException) {
        this.prismaService = prismaService;
        this.prismaException = prismaException;
    }
    async createPost(dto, userId, fileName) {
        try {
            await this.prismaService.users.findUniqueOrThrow({ where: { id: userId } });
            return this.prismaService.posts.create({ data: Object.assign(Object.assign({}, dto), { authorId: userId, media: fileName }) });
        }
        catch (err) {
            if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                this.prismaException.validateException(err);
            }
            throw new common_1.HttpException({ statusCode: err.statusCode || common_1.HttpStatus.BAD_REQUEST, success: false, message: err.message }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findAll(dto) {
        try {
            var limit = dto.limit || 20;
            var page = dto.page || 1;
            const _skip = Number(page) * Number(limit) - Number(limit);
            const _count = await this.prismaService.posts.count();
            const _pageCount = Math.ceil(_count / limit);
            const _posts = await this.prismaService.posts.findMany({
                include: {
                    author: {
                        select: {
                            id: true, name: true, email: true, activated: true,
                            _count: {
                                select: { posts: true }
                            }
                        }
                    }
                },
                take: Number(limit),
                skip: _skip,
                orderBy: { id: 'desc' }
            });
            return { count: _count, pageCount: _pageCount, rows: _posts };
        }
        catch (err) {
            if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                this.prismaException.validateException(err);
            }
            throw new common_1.HttpException({ statusCode: err.statusCode || common_1.HttpStatus.BAD_REQUEST, success: false, message: err.message }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async fetchAuthorPosts(dto, userId) {
        try {
            const _author = await this.prismaService.users.findUniqueOrThrow({ where: { id: userId } });
            var limit = dto.limit || 20;
            var page = dto.page || 1;
            const _skip = Number(page) * Number(limit) - Number(limit);
            const _count = await this.prismaService.posts.count({ where: { authorId: userId } });
            const _pageCount = Math.ceil(_count / limit);
            const _posts = await this.prismaService.posts.findMany({
                where: { authorId: userId },
                include: {
                    author: {
                        select: {
                            id: true, name: true, email: true, activated: true,
                            _count: {
                                select: { posts: true }
                            }
                        }
                    }
                },
                take: Number(limit),
                skip: _skip,
                orderBy: { id: 'desc' }
            });
            return { count: _count, pageCount: _pageCount, rows: _posts };
        }
        catch (err) {
            if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                this.prismaException.validateException(err);
            }
            throw new common_1.HttpException({ statusCode: err.statusCode || common_1.HttpStatus.BAD_REQUEST, success: false, message: err.message }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findOne(id) {
        try {
            const _post = await this.prismaService.posts.findUniqueOrThrow({
                where: { id: id },
                include: {
                    author: {
                        select: {
                            id: true, name: true, email: true, activated: true,
                            _count: {
                                select: { posts: true }
                            }
                        }
                    }
                },
            });
            return _post;
        }
        catch (err) {
            if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                this.prismaException.validateException(err);
            }
            throw new common_1.HttpException({ statusCode: err.statusCode || common_1.HttpStatus.BAD_REQUEST, success: false, message: err.message }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async editPost(dto, postId, userId, fileName) {
        try {
            console.log(userId);
            const _post = await this.prismaService.posts.findUniqueOrThrow({ where: { id: postId } });
            if (_post.authorId != userId) {
                throw new common_1.HttpException({ statusCode: common_1.HttpStatus.CONFLICT, success: false, message: "not author" }, common_1.HttpStatus.CONFLICT);
            }
            await this.prismaService.posts.update({ where: { id: postId }, data: { message: dto.message, media: (fileName === null || fileName === void 0 ? void 0 : fileName.length) ? fileName : _post.media } });
            return this.findOne(postId);
        }
        catch (err) {
            if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                this.prismaException.validateException(err);
            }
            throw new common_1.HttpException({ statusCode: err.statusCode || common_1.HttpStatus.BAD_REQUEST, success: false, message: err.message }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async removePost(id, userId) {
        try {
            const _post = await this.prismaService.posts.findUniqueOrThrow({ where: { id: id } });
            if (_post.authorId != userId) {
                throw new common_1.HttpException({ statusCode: common_1.HttpStatus.CONFLICT, success: false, message: "not author" }, common_1.HttpStatus.CONFLICT);
            }
            const post = await this.prismaService.posts.delete({ where: { id: id } });
            return post;
        }
        catch (err) {
            if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                this.prismaException.validateException(err);
            }
            throw new common_1.HttpException({ statusCode: err.statusCode || common_1.HttpStatus.BAD_REQUEST, success: false, message: err.message }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
PostsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        prisma_exception_1.PrismaException])
], PostsService);
exports.PostsService = PostsService;
//# sourceMappingURL=posts.service.js.map