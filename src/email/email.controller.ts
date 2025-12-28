import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import { NotifyAdminDto } from './dto/notify-admin.dto';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('notify-admin')
  async notifyAdmin(@Body() dto: NotifyAdminDto) {
    return await this.emailService.notifyAdmin(dto);
  }
}
