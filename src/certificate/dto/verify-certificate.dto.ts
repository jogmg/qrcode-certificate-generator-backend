import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyCertificateDto {
  @IsNotEmpty({ message: 'Token is required' })
  @IsString()
  token: string;
}
