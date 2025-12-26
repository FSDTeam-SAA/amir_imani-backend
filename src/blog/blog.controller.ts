import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { sendResponse } from '../common/utils/sendResponse';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @UseInterceptors(FileInterceptor('img'))
  async create(
    @Body() dto: CreateBlogDto,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    const blog = await this.blogService.create(dto, file);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Blog created successfully',
      data: blog,
    });
  }

  @Get()
  async findAll(@Res() res: Response) {
    const blogs = await this.blogService.findAll();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Blogs retrieved successfully',
      data: blogs,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const blog = await this.blogService.findOne(id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Blog retrieved successfully',
      data: blog,
    });
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('img'))
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateBlogDto,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    const blog = await this.blogService.update(id, dto, file);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Blog updated successfully',
      data: blog,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    const result = await this.blogService.remove(id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: result.message,
      data: null,
    });
  }
}
