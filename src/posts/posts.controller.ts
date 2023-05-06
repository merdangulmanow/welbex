import { Controller, Get, Post, Body, Query, Param, Delete, UseInterceptors, UseGuards, Req, UploadedFile } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { responseInterceptor } from 'src/utils/response.interceptor';
import { AuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName } from 'src/utils/file-upload-util';
import { fileMapper } from 'src/utils/file-mapper';
import { PaginateDto } from './dto/paginate.dto';

@UseInterceptors(responseInterceptor)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: `../public/images`,
        filename: editFileName,
      }),
    })
  )
  @Post()
  create(@UploadedFile() file: Express.Multer.File,
    @Body() dto: CreatePostDto, @Req() req) {
    const userId: string= req.user.id
    const fileName: string = fileMapper({ file }, 'images')
    return this.postsService.createPost(dto, userId, fileName);
  }

  @Get()
  findAll(@Query() dto: PaginateDto) {
    return this.postsService.findAll(dto);
  }

  @UseGuards(AuthGuard)
  @Get("/author")
  fetchAuthorPosts(@Query() dto: PaginateDto, @Req() req){
    const userId: string= req.user.id
    return this.postsService.fetchAuthorPosts(dto, userId)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: `public/images`,
        filename: editFileName,
      }),
    })
  )
  @Post('/edit/:postId')
  editPost(@UploadedFile() file: Express.Multer.File, @Body() dto: CreatePostDto, @Req() req, @Param('postId') postId: string){
    const userId: string= req.user.id
    const fileName: string = fileMapper({ file }, 'images')
    return this.postsService.editPost(dto, postId, userId, fileName)
  }

  @UseGuards(AuthGuard)
  @Post('remove/:id')
  removePost(@Param('id') id: string, @Req() req,) {
    const userId: string= req.user.id
    return this.postsService.removePost(id, userId);
  }
}
