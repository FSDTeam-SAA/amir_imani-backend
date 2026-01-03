import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class createQrDto {
  @IsNotEmpty({ message: 'gameName is required' })
  @IsString()
  gameName: string;

  @IsNotEmpty({ message: 'finalUrl is required' })
  @IsUrl()
  finalUrl: string;
}
