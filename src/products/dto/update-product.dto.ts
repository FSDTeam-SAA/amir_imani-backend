import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
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

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  color?: string[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  size?: string[];

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  quantity?: number;
}
