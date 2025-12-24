import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PaymentService } from '../payment/payment.service';

@Processor('payment-status')
export class PaymentProcessor extends WorkerHost {
  constructor(private readonly paymentService: PaymentService) {
    super();
  }

  async process(job: Job) {
    try {
      interface JobData {
        paymentId: string;
      }

      const { paymentId }: JobData = job.data as JobData;

      console.log(
        `Checking payment status for ${paymentId} (attempt ${job.attemptsMade})`,
      );

      await this.paymentService.checkStripePaymentStatus(paymentId);
    } catch (error) {
      console.error('Payment status check failed', error);
      throw error; // BullMQ will mark job as failed
    }
  }
}
