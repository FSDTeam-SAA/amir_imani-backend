import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductType, ProductSize } from '../product.schema';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  productName: string;

  @Type(() => Number)
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

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  imgs?: string[];

  @IsEnum(ProductType, {
    message: 'Product type must be card or marchandice',
  })
  productType: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsEnum(ProductSize, {
    message: 'Size must be one of: s, m, l, xl, xxl',
  })
  @IsOptional()
  size?: ProductSize;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  quantity?: number;
}
