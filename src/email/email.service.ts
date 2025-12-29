import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { sendEmail } from '../utils/sendEmail';
import { NotifyAdminDto } from './dto/notify-admin.dto';
import { Email } from './email.schema';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(
    private configService: ConfigService,
    @InjectModel(Email.name) private emailModel: Model<Email>,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    this.transporter = nodemailer.createTransport({
      host: configService.get<string>('MAIL_HOST'),
      port: configService.get<number>('MAIL_PORT'),
      secure: false, // true if using 465
      auth: {
        user: configService.get<string>('MAIL_USER'),
        pass: configService.get<string>('MAIL_PASS'),
      },
    });
  }

  async sendOtpMail(to: string, otp: string) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      await this.transporter.sendMail({
        from: `"No Reply" <${process.env.MAIL_USER}>`,
        to,
        subject: 'Password Reset OTP',
        html: `
          <div>
            <h3>Your OTP Code</h3>
            <p style="font-size: 20px; font-weight: bold;">${otp}</p>
            <p>This OTP will expire in 10 minutes.</p>
          </div>
        `,
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to send email');
    }
  }

  async notifyAdmin(dto: NotifyAdminDto) {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      throw new InternalServerErrorException('ADMIN_EMAIL is not configured');
    }

    try {
      // Save notification data to database
      await this.emailModel.create({
        name: dto.name,
        email: dto.email,
      });

      const html = `
        <h2>New user details</h2>
        <p><strong>Name:</strong> ${dto.name}</p>
        <p><strong>Email:</strong> ${dto.email}</p>
      `;

      await sendEmail(adminEmail, `New submission from ${dto.name}`, html);

      return { message: 'Admin notified successfully' };
    } catch (error) {
      console.error('Error in notifyAdmin:', error);
      throw new InternalServerErrorException(
        'Failed to process admin notification',
      );
    }
  }
}
