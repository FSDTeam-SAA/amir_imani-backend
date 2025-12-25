import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

enum ProductType {
  CARD = 'card',
  MARCHANDICE = 'marchandice',
}

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  productName: string;

  @Prop({ required: true })
  price: number;

  @Prop({
    type: String,
    enum: ProductType,
    required: true,
  })
  productType: ProductType;

  @Prop({ required: true })
  feature: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  videoLink?: string;

  @Prop()
  img?: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
