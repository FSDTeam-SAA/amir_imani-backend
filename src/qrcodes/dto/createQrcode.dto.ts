import { IsNotEmpty, IsString } from 'class-validator';

export class createQrDto {
  @IsString()
  @IsNotEmpty()
  gameName: string;

  @IsString()
  @IsNotEmpty()
  link: string;
}
