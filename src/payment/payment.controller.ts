import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { Public } from '../common/decorators/public.decorator';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { sendResponse } from '../common/utils/sendResponse';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  /* Create Stripe Payment */
  @Public()
  @Post('stripe/create')
  async createStripePayment(
    @Body() dto: CreatePaymentDto,
    @Res() res: Response,
  ) {
    const payment = await this.paymentService.createStripePayment(dto);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Payment session created successfully',
      data: payment,
    });
  }

  /* Get all payments (admin) */
  @Public()
  @Get()
  async getAllPayments(@Res() res: Response) {
    const payments = await this.paymentService.getAllPayments();

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Payments retrieved successfully',
      data: payments,
    });
  }

  /* Get payments by user */
  @Get('user/:userId')
  async getPaymentsByUser(
    @Param('userId') userId: string,
    @Res() res: Response,
  ) {
    const payments = await this.paymentService.getPaymentsByUser(userId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'User payments retrieved successfully',
      data: payments,
    });
  }

  /* Get single payment */
  @Get(':id')
  async getPayment(@Param('id') id: string, @Res() res: Response) {
    const payment = await this.paymentService.getPaymentById(id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Payment retrieved successfully',
      data: payment,
    });
  }
}
