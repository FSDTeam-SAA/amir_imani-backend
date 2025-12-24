import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PaymentDocument = PaymentRecord & Document;

@Schema({ timestamps: true })
export class PaymentRecord {
  @Prop({ required: true })
  userId: string;

  @Prop()
  itemIds: string;

  @Prop()
  seasonId: string;

  @Prop()
  paymentIntent: string;

  @Prop()
  checkoutSessionId: string;

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ default: 'pending' })
  paymentStatus: string; // pending | success | failed
}

export const PaymentSchema = SchemaFactory.createForClass(PaymentRecord);
