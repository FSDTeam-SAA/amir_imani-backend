import { BullModule } from '@nestjs/bullmq';
import { Module, forwardRef } from '@nestjs/common';
import { PaymentProcessor } from './payment.processor';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [
    forwardRef(() => PaymentModule),
    BullModule.registerQueue({
      name: 'payment-status',
    }),
  ],
  providers: [PaymentProcessor],
  exports: [BullModule],
})
export class PaymentQueueModule {}
