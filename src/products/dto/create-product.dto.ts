import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ProductType } from '../product.schema';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  feature: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  videoLink?: string;

  @IsString()
  @IsOptional()
  img?: string;

  @IsEnum(ProductType, {
    message: 'Product type must be card or marchandice',
  })
  productType: string;
}
