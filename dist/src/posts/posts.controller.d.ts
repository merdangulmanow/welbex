/// <reference types="multer" />
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { PaginateDto } from './dto/paginate.dto';
export declare class PostsController {
    private readonly postsService;
    constructor(postsService: PostsService);
    create(file: Express.Multer.File, dto: CreatePostDto, req: any): Promise<import(".prisma/client").posts>;
    findAll(dto: PaginateDto): Promise<{
        count: number;
        pageCount: number;
        rows: (import(".prisma/client").posts & {
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
    fetchAuthorPosts(dto: PaginateDto, req: any): Promise<{
        count: number;
        pageCount: number;
        rows: (import(".prisma/client").posts & {
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
    findOne(id: string): Promise<import(".prisma/client").posts>;
    editPost(file: Express.Multer.File, dto: CreatePostDto, req: any, postId: string): Promise<import(".prisma/client").posts>;
    removePost(id: string, req: any): Promise<import(".prisma/client").posts>;
}
