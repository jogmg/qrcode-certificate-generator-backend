import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as crypto from 'crypto';
import { Model } from 'mongoose';
import { decryptData, encryptData } from '../shared/utils/encryption.util';
import { generateCertificate } from '../shared/utils/pdf-generator.util';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { VerifyCertificateDto } from './dto/verify-certificate.dto';
import { Certificate } from './entities/certificate.entity';

@Injectable()
export class CertificateService {
  constructor(
    @InjectModel(Certificate.name) private certificateModel: Model<Certificate>,
  ) {}

  async generateCertificate(createDto: CreateCertificateDto) {
    // Generate unique token
    const token = crypto.randomBytes(32).toString('hex');

    const issueDate = new Date();
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 5); // 5-year validity

    const certificateData = {
      ...createDto,
      token,
      issueDate: issueDate.toISOString(),
      expiryDate: expiryDate.toISOString(),
    };

    const encryptedData = encryptData({
      name: createDto.name,
      dob: createDto.dob,
      matricNo: createDto.matricNo,
      course: createDto.course,
      grade: createDto.grade,
      graduationYear: createDto.graduationYear,
    });

    await this.certificateModel.create({
      token,
      encryptedData,
      expiryDate,
    });

    const verificationUrl = `${process.env.FRONTEND_URL}/verify`;
    const pdfBuffer = await generateCertificate(
      certificateData,
      verificationUrl,
    );

    return {
      pdfBuffer,
      token,
      fileName: `certificate_${token.slice(-3)}.pdf`,
    };
  }

  async verifyCertificate(verifyDto: VerifyCertificateDto) {
    const certificate = await this.certificateModel.findOne({
      token: verifyDto.token,
    });

    if (!certificate) {
      return { valid: false, message: 'Certificate is not valid' };
    }

    if (new Date() > certificate.expiryDate) {
      return { valid: false, message: 'Certificate has expired' };
    }

    const decryptedData = decryptData(certificate.encryptedData);

    return {
      valid: true,
      ...decryptedData,
      issueDate: certificate.createdAt?.toISOString(),
      expiryDate: certificate.expiryDate.toISOString(),
    };
  }
}
