import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog, BlogDocument } from './blog.schema';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<BlogDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(dto: CreateBlogDto, file?: Express.Multer.File): Promise<Blog> {
    let imageUrl = dto.img;
    if (file) {
      const upload = await this.cloudinaryService.uploadImage(file);
      imageUrl = upload?.secure_url || imageUrl;
    }
    const blog = new this.blogModel({ ...dto, img: imageUrl });
    return await blog.save();
  }

  async findAll(): Promise<Blog[]> {
    return this.blogModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Blog> {
    const blog = await this.blogModel.findById(id).exec();
    if (!blog) {
      throw new NotFoundException(`Blog with ID ${id} not found`);
    }
    return blog;
  }

  async update(
    id: string,
    dto: UpdateBlogDto,
    file?: Express.Multer.File,
  ): Promise<Blog> {
    try {
      let imageUrl = dto.img;
      if (file) {
        const upload = await this.cloudinaryService.uploadImage(file);
        imageUrl = upload?.secure_url || imageUrl;
      }
      const updated = await this.blogModel
        .findByIdAndUpdate(
          id,
          { $set: { ...dto, img: imageUrl } },
          { new: true },
        )
        .exec();
      if (!updated) {
        throw new NotFoundException(`Blog with ID ${id} not found`);
      }
      return updated;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException('Failed to update blog');
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    const deleted = await this.blogModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException(`Blog with ID ${id} not found`);
    }
    return { message: 'Blog deleted successfully' };
  }
}
