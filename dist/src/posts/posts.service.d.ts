import { CreatePostDto } from './dto/create-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaException } from 'src/prisma/prisma.exception';
import { posts } from '@prisma/client';
import { PaginateDto } from './dto/paginate.dto';
export declare class PostsService {
    private readonly prismaService;
    private readonly prismaException;
    constructor(prismaService: PrismaService, prismaException: PrismaException);
    createPost(dto: CreatePostDto, userId: string, fileName: string): Promise<posts>;
    findAll(dto: PaginateDto): Promise<{
        count: number;
        pageCount: number;
        rows: (posts & {
            author: {
                id: string;
                email: string;
                name: string;
                activated: boolean;
                _count: {
                    posts: number;
                };
            };
        })[];
    }>;
    fetchAuthorPosts(dto: PaginateDto, userId: string): Promise<{
        count: number;
        pageCount: number;
        rows: (posts & {
            author: {
                id: string;
                email: string;
                name: string;
                activated: boolean;
                _count: {
                    posts: number;
                };
            };
        })[];
    }>;
    findOne(id: string): Promise<posts>;
    editPost(dto: CreatePostDto, postId: string, userId: string, fileName: string): Promise<posts>;
    removePost(id: string, userId: string): Promise<posts>;
}
