import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { sendResponse } from '../common/utils/sendResponse';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('imgs'))
  async createProduct(
    @Body() dto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Res() res: Response,
  ) {
    const product = await this.productsService.createProduct(dto, files);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  }

  @Get()
  async getAllProducts(
    @Res() res: Response,
    @Query('type') type?: string,
    @Query('search') search?: string,
  ) {
    const products = await this.productsService.getAllProducts(type, search);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Products retrieved successfully',
      data: products,
    });
  }

  @Get('purchased/:userId')
  async getPurchasedProducts(
    @Param('userId') userId: string,
    @Res() res: Response,
  ) {
    const products = await this.productsService.findPurchasedProducts(userId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Purchased products retrieved successfully',
      data: products,
    });
  }

  @Get(':id')
  async getProductById(@Param('id') id: string, @Res() res: Response) {
    const product = await this.productsService.getProductById(id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Product retrieved successfully',
      data: product,
    });
  }

  @Put(':id')
  @UseInterceptors(FilesInterceptor('imgs'))
  async updateProduct(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Res() res: Response,
  ) {
    const product = await this.productsService.updateProduct(id, dto, files);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string, @Res() res: Response) {
    const result = await this.productsService.deleteProduct(id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: result.message,
    });
  }
}
