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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const qrCode = await QRCode.toDataURL(dto.link);

    const data = await this.QrcodeDetailsModel.create({
      ...dto,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      qrCode,
    });

    return { success: true, message: 'Created', data };
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

    let qrCode = item.qrCode;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    if (dto.link) qrCode = await QRCode.toDataURL(dto.link);

    const updated = await this.QrcodeDetailsModel.findByIdAndUpdate(
      id,
      { ...dto, qrCode },
      { new: true },
    );

    return { success: true, message: 'Updated', data: updated };
  }

  async delete(id: string) {
    const item = await this.QrcodeDetailsModel.findByIdAndDelete(id);
    if (!item) throw new NotFoundException('Data not found');

    return { success: true, message: 'Deleted' };
  }
}
