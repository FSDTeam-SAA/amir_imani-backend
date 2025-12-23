import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async createProduct(
    dto: CreateProductDto,
    file?: Express.Multer.File,
  ): Promise<Product> {
    try {
      let imageUrl = dto.img;

      if (file) {
        const uploadResult = await this.cloudinaryService.uploadImage(file);
        imageUrl = uploadResult?.secure_url;
      }

      const newProduct = new this.productModel({
        ...dto,
        img: imageUrl,
      });
      return await newProduct.save();
    } catch (error) {
      throw new BadRequestException('Failed to create product');
    }
  }

  async getAllProducts(): Promise<Product[]> {
    return await this.productModel.find().exec();
  }

  async getProductById(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async updateProduct(
    id: string,
    dto: UpdateProductDto,
    file?: Express.Multer.File,
  ): Promise<Product> {
    try {
      let imageUrl = dto.img;

      if (file) {
        const uploadResult = await this.cloudinaryService.uploadImage(file);
        imageUrl = uploadResult?.secure_url;
      }

      const updatedProduct = await this.productModel
        .findByIdAndUpdate(id, { ...dto, img: imageUrl }, { new: true })
        .exec();

      if (!updatedProduct) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }

      return updatedProduct;
    } catch (error) {
      throw new BadRequestException('Failed to update product');
    }
  }

  async deleteProduct(id: string): Promise<{ message: string }> {
    const result = await this.productModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return { message: 'Product deleted successfully' };
  }
}
