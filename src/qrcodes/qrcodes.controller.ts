import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';

import { createQrDto } from './dto/createQrcode.dto';
import { updateQrcodeDto } from './dto/updateQrcode.dto';
import { QrcodesService } from './qrcodes.service';

@Controller('qrcodes')
export class QrcodesController {
  constructor(private readonly verificationInfoService: QrcodesService) {}

  @Post()
  create(@Body() dto: createQrDto) {
    return this.verificationInfoService.create(dto);
  }

  @Get()
  findAll(@Query('search') search?: string) {
    return this.verificationInfoService.findAll(search);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: updateQrcodeDto) {
    return this.verificationInfoService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.verificationInfoService.delete(id);
  }
}
