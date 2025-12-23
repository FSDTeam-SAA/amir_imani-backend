import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { sendResponse } from '../common/utils/sendResponse';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('img'))
  async createProduct(
    @Body() dto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    const product = await this.productsService.createProduct(dto, file);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  }

  @Get()
  async getAllProducts(@Res() res: Response) {
    const products = await this.productsService.getAllProducts();

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Products retrieved successfully',
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
  @UseInterceptors(FileInterceptor('img'))
  async updateProduct(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    const product = await this.productsService.updateProduct(id, dto, file);

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
