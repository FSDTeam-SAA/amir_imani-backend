import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { EmailService } from '../email/email.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Email } from '../email/email.schema';

interface ProductNotificationJobData {
  productId: string;
  productName: string;
  price: number;
  feature: string;
  description: string;
  imgs?: string[];
  productType: string;
}

@Processor('product-notification')
export class ProductNotificationProcessor extends WorkerHost {
  constructor(
    private readonly emailService: EmailService,
    @InjectModel(Email.name) private emailModel: Model<Email>,
  ) {
    super();
  }

  async process(job: Job<ProductNotificationJobData>) {
    try {
      const { productName, price, feature, description, imgs, productType } =
        job.data;

      console.log(
        `Sending product notifications for ${productName} (attempt ${job.attemptsMade})`,
      );

      // Get all saved email subscribers
      const subscribers = await this.emailModel.find().exec();

      if (subscribers.length === 0) {
        console.log('No subscribers found');
        return { success: true, message: 'No subscribers to notify' };
      }

      // Send emails to all subscribers
      const emailPromises = subscribers.map((subscriber) =>
        this.emailService.sendProductNotificationEmail({
          subscriberName: subscriber.name,
          subscriberEmail: subscriber.email,
          productName,
          price,
          feature,
          description,
          productType,
          productImage: imgs?.[0],
        }),
      );

      await Promise.all(emailPromises);

      console.log(
        `Successfully sent product notification emails to ${subscribers.length} subscribers`,
      );

      return {
        success: true,
        message: `Notified ${subscribers.length} subscribers`,
      };
    } catch (error) {
      console.error('Product notification job failed', error);
      throw error;
    }
  }
}
