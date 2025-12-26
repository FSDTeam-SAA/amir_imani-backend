import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { Product, ProductDocument } from './product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PaymentRecord, PaymentDocument } from '../payment/paymentRecord';
import { Cart, CartDocument } from '../cart/cart.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(PaymentRecord.name)
    private paymentModel: Model<PaymentDocument>,
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
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

  async getAllProducts(type?: string, search?: string): Promise<Product[]> {
    const query: FilterQuery<Product> = {};

    if (type) {
      query.productType = type;
    }

    if (search) {
      query.productName = { $regex: search, $options: 'i' };
    }

    return await this.productModel.find(query).exec();
  }

  async getProductById(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async findPurchasedProducts(userId: string): Promise<Product[]> {
    const successfulPayments = await this.paymentModel
      .find({ userId, paymentStatus: 'paid' })
      .exec();

    if (!successfulPayments.length) {
      return [];
    }

    const cartIds = successfulPayments
      .map((payment) => payment.itemIds)
      .filter(Boolean)
      .map((id) => new Types.ObjectId(id));

    const carts = await this.cartModel
      .find(
        cartIds.length
          ? { _id: { $in: cartIds } }
          : { userId: new Types.ObjectId(userId) },
      )
      .exec();

    const productIds = carts.flatMap((cart) =>
      cart.productIds.map((item) => item.productId),
    );
    const uniqueProductIds = [...new Set(productIds.map(String))];

    return this.productModel.find({ _id: { $in: uniqueProductIds } }).exec();
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
