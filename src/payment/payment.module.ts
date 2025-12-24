import { Module, forwardRef } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentRecord, PaymentSchema } from './paymentRecord';
import { PaymentQueueModule } from '../queues/payment-queue.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PaymentRecord.name, schema: PaymentSchema },
    ]),
    forwardRef(() => PaymentQueueModule),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
