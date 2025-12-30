import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { ProductSize } from '../product.schema';
import { Type } from 'class-transformer';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  productName?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
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

  @IsString()
  @IsOptional()
  size?: ProductSize;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  quantity?: number;
}
