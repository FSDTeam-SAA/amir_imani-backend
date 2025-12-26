import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ProductSize } from '../product.schema';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  productName?: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  feature?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  videoLink?: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  imgs?: string[];

  @IsString()
  @IsOptional()
  color?: string;

  @IsEnum(ProductSize, {
    message: 'Size must be one of: s, m, l, xl, xxl',
  })
  @IsOptional()
  size?: ProductSize;

  @IsNumber()
  @IsOptional()
  quantity?: number;
}
