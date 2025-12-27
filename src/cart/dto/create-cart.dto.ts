import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Optional } from '@nestjs/common';

class CartItemDto {
  @IsMongoId()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @Optional()
  color: string;

  @Optional()
  size: string;
}

export class CreateCartDto {
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  productIds: CartItemDto[];
}
