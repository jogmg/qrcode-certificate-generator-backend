import {
  Body,
  Controller,
  Get,
  Header,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { CertificateService } from './certificate.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { VerifyCertificateDto } from './dto/verify-certificate.dto';

@Controller('certificates')
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  @Post()
  @Header('Content-Type', 'application/pdf')
  async createCertificate(
    @Body() createDto: CreateCertificateDto,
    @Res() res: Response,
  ) {
    const { pdfBuffer, fileName } =
      await this.certificateService.generateCertificate(createDto);

    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(pdfBuffer);
  }

  @Get('verify')
  async verifyCertificate(@Query() verifyDto: VerifyCertificateDto) {
    return await this.certificateService.verifyCertificate(verifyDto);
  }
}
