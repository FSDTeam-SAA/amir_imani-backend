import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as QRCode from 'qrcode';
import { createQrDto } from './dto/createQrcode.dto';
import { updateQrcodeDto } from './dto/updateQrcode.dto';
import { QrcodeDetails } from './qrcode.schema';

@Injectable()
export class QrcodesService {
  constructor(
    @InjectModel(QrcodeDetails.name)
    private readonly QrcodeDetailsModel: Model<QrcodeDetails>,
  ) {}

  async create(dto: createQrDto) {
    const redirectCode = Math.random().toString(36).substring(2, 10);

    const peramentUrl = `https://amir-imani-backend.onrender.com/qrcodes/${redirectCode}`;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const qrCode = await QRCode.toDataURL(peramentUrl, {
      width: 800, // bigger size (regulations usually require 400–600px)
      margin: 2, // lower margin
      errorCorrectionLevel: 'H', // highest error correction (more stable)
    });

    const data = await this.QrcodeDetailsModel.create({
      gameName: dto.gameName,
      redirectCode,
      finalUrl: dto.finalUrl,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      qrCode,
    });

    return {
      success: true,
      message: 'Created',
      data,
    };
  }

  async findAll(search?: string) {
    const filter = search
      ? {
          $or: [
            { gameName: { $regex: search, $options: 'i' } },
            { link: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const data = await this.QrcodeDetailsModel.find(filter);

    return { success: true, message: 'List fetched', data };
  }

  async update(id: string, dto: updateQrcodeDto) {
    const item = await this.QrcodeDetailsModel.findById(id);
    if (!item) throw new NotFoundException('Data not found');

    const updated = await this.QrcodeDetailsModel.findByIdAndUpdate(
      id,
      { ...dto },
      { new: true },
    );

    return { success: true, message: 'Updated', data: updated };
  }

  async delete(id: string) {
    const item = await this.QrcodeDetailsModel.findByIdAndDelete(id);
    if (!item) throw new NotFoundException('Data not found');

    return { success: true, message: 'Deleted' };
  }

  async handleRedirect(code: string, res: any) {
    const item = await this.QrcodeDetailsModel.findOne({ redirectCode: code });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    if (!item) return res.status(404).send('Invalid QR code');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return res.redirect(item.finalUrl);
  }
}
