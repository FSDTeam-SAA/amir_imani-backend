import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class QrcodeDetails extends Document {
  @Prop({ required: true })
  gameName: string;

  @Prop({ required: true })
  redirectCode: string; // 🔥 permanent code used inside QR

  @Prop({ required: true })
  finalUrl: string; // 🔥 editable multiple times
  @Prop()
  qrCode: string; // Will store the Base64 PNG or hosted image URL
}

export const QrcodeSchema = SchemaFactory.createForClass(QrcodeDetails);
