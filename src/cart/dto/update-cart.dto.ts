import {
  IsArray,
  IsNumber,
  IsMongoId,
  IsNotEmpty,
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

export class UpdateCartDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  productIds: CartItemDto[];
}
