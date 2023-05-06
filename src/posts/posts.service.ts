import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaException } from 'src/prisma/prisma.exception';
import { Prisma, posts } from '@prisma/client';
import { PaginateDto } from './dto/paginate.dto';

@Injectable()
export class PostsService {
  constructor(
    private readonly prismaService: PrismaService, 
    private readonly prismaException: PrismaException
  ){}

  async createPost(dto: CreatePostDto, userId: string, fileName: string) {
    try {
      await this.prismaService.users.findUniqueOrThrow({where: {id: userId}})
      return this.prismaService.posts.create({data: {...dto, authorId: userId, media: fileName}})
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        this.prismaException.validateException(err)
      }
      throw new HttpException({ statusCode: err.statusCode || HttpStatus.BAD_REQUEST, success: false, message: err.message}, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(dto: PaginateDto) {
    try {
      var limit: number= dto.limit || 20;
      var page: number= dto.page || 1;
      const _skip: number= Number(page)* Number(limit)- Number(limit)
      const _count= await this.prismaService.posts.count()
      const _pageCount= Math.ceil(_count/ limit)
      const _posts= await this.prismaService.posts.findMany({
        include: {
          author: {
            select: {
              id: true, name: true, email: true, activated: true, 
              _count: {
                select: {posts: true}
              }
            }
          }
        },
        take: Number(limit), 
        skip: _skip, 
        orderBy: {id: 'desc'}
      })
      return {count: _count, pageCount: _pageCount, rows: _posts}
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        this.prismaException.validateException(err)
      }
      throw new HttpException({ statusCode: err.statusCode || HttpStatus.BAD_REQUEST, success: false, message: err.message}, HttpStatus.BAD_REQUEST);
    }
  }

  async fetchAuthorPosts(dto: PaginateDto, userId: string){
    try {
      const _author= await this.prismaService.users.findUniqueOrThrow({where: {id: userId}})
      var limit: number= dto.limit || 20;
      var page: number= dto.page || 1;
      const _skip: number= Number(page)* Number(limit)- Number(limit)
      const _count= await this.prismaService.posts.count({where: {authorId: userId}})
      const _pageCount= Math.ceil(_count/ limit)
      const _posts= await this.prismaService.posts.findMany({
        where: {authorId: userId},
        include: {
          author: {
            select: {
              id: true, name: true, email: true, activated: true, 
              _count: {
                select: {posts: true}
              }
            }
          }
        },
        take: Number(limit), 
        skip: _skip, 
        orderBy: {id: 'desc'}
      })
      return {count: _count, pageCount: _pageCount, rows: _posts}
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        this.prismaException.validateException(err)
      }
      throw new HttpException({ statusCode: err.statusCode || HttpStatus.BAD_REQUEST, success: false, message: err.message}, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: string):Promise<posts> {
    try {
      const _post= await this.prismaService.posts.findUniqueOrThrow({
        where: {id: id},
        include: {
          author: {
            select: {
              id: true, name: true, email: true, activated: true, 
              _count: {
                select: {posts: true}
              }
            }
          }
        },
      })
      return _post
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        this.prismaException.validateException(err)
      }
      throw new HttpException({ statusCode: err.statusCode || HttpStatus.BAD_REQUEST, success: false, message: err.message}, HttpStatus.BAD_REQUEST);
    }
  }

  async editPost(dto: CreatePostDto, postId: string, userId: string, fileName: string):Promise<posts> {
    try {
      console.log(userId)
      const _post= await this.prismaService.posts.findUniqueOrThrow({where: {id: postId}})
      if(_post.authorId != userId){
        throw new HttpException({ statusCode: HttpStatus.CONFLICT, success: false, message: "not author"}, HttpStatus.CONFLICT);
      }
      await this.prismaService.posts.update({where: {id: postId}, data: {message: dto.message, media: fileName?.length? fileName : _post.media}})
      return this.findOne(postId)
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        this.prismaException.validateException(err)
      }
      throw new HttpException({ statusCode: err.statusCode || HttpStatus.BAD_REQUEST, success: false, message: err.message}, HttpStatus.BAD_REQUEST);
    }
  }

  async removePost(id: string, userId: string):Promise<posts> {
    try {
      const _post= await this.prismaService.posts.findUniqueOrThrow({where: {id: id}})
      if(_post.authorId != userId){
        throw new HttpException({ statusCode: HttpStatus.CONFLICT, success: false, message: "not author"}, HttpStatus.CONFLICT);
      }
      const post= await this.prismaService.posts.delete({where: {id: id}})
      return post
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        this.prismaException.validateException(err)
      }
      throw new HttpException({ statusCode: err.statusCode || HttpStatus.BAD_REQUEST, success: false, message: err.message}, HttpStatus.BAD_REQUEST);
    }
  }
}
