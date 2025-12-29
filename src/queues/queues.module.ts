import { BullModule } from '@nestjs/bullmq';
import { Module, forwardRef } from '@nestjs/common';
import { ProductNotificationProcessor } from './product-notification.processor';
import { PaymentProcessor } from './payment.processor';
import { PaymentModule } from '../payment/payment.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    forwardRef(() => PaymentModule),
    forwardRef(() => EmailModule),
    BullModule.registerQueue({
      name: 'payment-status',
    }),
    BullModule.registerQueue({
      name: 'product-notification',
    }),
  ],
  providers: [PaymentProcessor, ProductNotificationProcessor],
  exports: [BullModule],
})
export class QueuesModule {}
