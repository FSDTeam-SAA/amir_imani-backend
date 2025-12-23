import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  productName: string;

  @Prop({ required: true })
  price: number;

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
