import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QrcodesService } from './qrcodes.service';
import { QrcodesController } from './qrcodes.controller';
import { QrcodeDetails, QrcodeSchema } from './qrcode.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: QrcodeDetails.name, schema: QrcodeSchema },
    ]),
  ],
  controllers: [QrcodesController],
  providers: [QrcodesService],
})
export class QrcodesModule {}
