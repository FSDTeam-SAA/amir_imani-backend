import { PartialType } from '@nestjs/mapped-types';
import { createQrDto } from './createQrcode.dto';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export class updateQrcodeDto extends PartialType(createQrDto) {
  link: any;
}
