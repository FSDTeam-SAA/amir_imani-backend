import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart, CartDocument } from './cart.schema';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartService {
  constructor(@InjectModel(Cart.name) private cartModel: Model<CartDocument>) {}

  async createCart(dto: CreateCartDto): Promise<Cart> {
    try {
      // Check if cart already exists for this user
      const existingCart = await this.cartModel
        .findOne({ userId: new Types.ObjectId(dto.userId) })
        .exec();

      if (existingCart) {
        throw new BadRequestException('Cart already exists for this user');
      }

      const newCart = new this.cartModel({
        userId: new Types.ObjectId(dto.userId),
        productIds: dto.productIds.map((item) => ({
          productId: new Types.ObjectId(item.productId),
          quantity: item.quantity,
        })),
      });

      return await newCart.save();
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to create cart');
    }
  }

  async getCartByUserId(userId: string): Promise<Cart> {
    const cart = await this.cartModel
      .findOne({ userId: new Types.ObjectId(userId) })
      .populate('productIds.productId')
      .exec();

    if (!cart) {
      throw new NotFoundException(`Cart not found for user ${userId}`);
    }

    return cart;
  }

  async updateCart(userId: string, dto: UpdateCartDto): Promise<Cart> {
    try {
      const updatedCart = await this.cartModel
        .findOneAndUpdate(
          { userId: new Types.ObjectId(userId) },
          {
            productIds: dto.productIds.map((item) => ({
              productId: new Types.ObjectId(item.productId),
              quantity: item.quantity,
            })),
          },
          { new: true },
        )
        .populate('productIds.productId')
        .exec();

      if (!updatedCart) {
        throw new NotFoundException(`Cart not found for user ${userId}`);
      }

      return updatedCart;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update cart');
    }
  }

  async deleteCart(userId: string): Promise<{ message: string }> {
    const result = await this.cartModel
      .findOneAndDelete({ userId: new Types.ObjectId(userId) })
      .exec();

    if (!result) {
      throw new NotFoundException(`Cart not found for user ${userId}`);
    }

    return { message: 'Cart deleted successfully' };
  }
}
