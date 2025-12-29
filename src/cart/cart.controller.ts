import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { sendResponse } from '../common/utils/sendResponse';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  async createCart(@Body() dto: CreateCartDto, @Res() res: Response) {
    // console.log('first', dto);
    const cart = await this.cartService.createCart(dto);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Cart created successfully',
      data: cart,
    });
  }

  @Get('user/:userId')
  async getCartByUserId(@Param('userId') userId: string, @Res() res: Response) {
    const cart = await this.cartService.getCartByUserId(userId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Cart retrieved successfully',
      data: cart,
    });
  }

  @Put('user/:userId')
  async updateCart(
    @Param('userId') userId: string,
    @Body() dto: UpdateCartDto,
    @Res() res: Response,
  ) {
    const cart = await this.cartService.updateCart(userId, dto);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Cart updated successfully',
      data: cart,
    });
  }

  @Delete(':cartId')
  async deleteCartById(@Param('cartId') cartId: string, @Res() res: Response) {
    const result = await this.cartService.deleteCartById(cartId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: result.message,
    });
  }

  @Delete(':cartId/product/:productId')
  async deleteProductFromCart(
    @Param('cartId') cartId: string,
    @Param('productId') productId: string,
    @Res() res: Response,
  ) {
    const updatedCart = await this.cartService.deleteProductFromCart(
      cartId,
      productId,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Product removed from cart successfully',
      data: updatedCart,
    });
  }
}
