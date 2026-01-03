import { IsOptional, IsString, IsUrl } from 'class-validator';

export class updateQrcodeDto {
  @IsOptional()
  @IsString()
  gameName?: string;

  @IsOptional()
  @IsUrl()
  finalUrl?: string; // only update redirect target
}
