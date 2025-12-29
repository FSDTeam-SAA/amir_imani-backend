import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Email extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, lowercase: true })
  email: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const EmailSchema = SchemaFactory.createForClass(Email);
