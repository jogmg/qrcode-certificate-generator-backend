import * as fontkit from '@pdf-lib/fontkit';
import { Buffer } from 'buffer';
import { format } from 'date-fns';
import { readFileSync } from 'fs';
import { join } from 'path';
import { PDFDocument, rgb } from 'pdf-lib';
import * as QRCode from 'qrcode';

interface CertificateData {
  name: string;
  dob: string;
  matricNo: string;
  course: string;
  grade: string;
  graduationYear: string;
  issueDate: string;
  expiryDate: string;
  token: string;
}

export async function generateCertificate(
  data: CertificateData,
  verificationUrl: string,
): Promise<Buffer> {
  // Load template
  const templatePath = join(
    __dirname,
    '../../../static/templates/certificate-template.pdf',
  );
  const templateBytes = readFileSync(templatePath);
  const pdfDoc = await PDFDocument.load(templateBytes);
  pdfDoc.registerFontkit(fontkit);

  // Template page
  const page = pdfDoc.getPage(0);
  const { width, height } = page.getSize();

  // Generate QR code
  const qrCodeData = `${verificationUrl}/${data.token}`;
  const qrCode = await QRCode.toDataURL(qrCodeData, { width: 200 });

  // Embed QR code (bottom left)
  const qrImage = await pdfDoc.embedPng(
    Buffer.from(qrCode.split(',')[1], 'base64'),
  );
  page.drawImage(qrImage, {
    x: (width - 300) / 5,
    y: 100,
    width: 105,
    height: 105,
  });

  // Add Font and Color
  const funtasticPath = join(
    __dirname,
    '../../../static/fonts/Funtastic-Regular.ttf',
  );
  const balsamiqPath = join(
    __dirname,
    '../../../static/fonts/BalsamiqSans-Regular.ttf',
  );
  const funtasticData = readFileSync(funtasticPath);
  const balsamiqData = readFileSync(balsamiqPath);
  const funtasticFont = await pdfDoc.embedFont(funtasticData);
  const balsamiqFont = await pdfDoc.embedFont(balsamiqData);
  const textColor = rgb(0.482, 0.306, 0.212);

  // Add Text
  const certTextWidth = funtasticFont.widthOfTextAtSize('CERTIFICATE', 62.8);
  const certTextX = width / 6.37;
  const nameTextWidth = funtasticFont.widthOfTextAtSize(
    data.name.toUpperCase(),
    37,
  );
  const nameTextX = certTextX + (certTextWidth - nameTextWidth) / 2; // Center name text horizontally relative to Certificate text

  page.drawText(data.name.toUpperCase(), {
    x: nameTextX,
    y: height - 308,
    size: 37,
    font: funtasticFont,
    color: textColor,
  });
  page.drawText(format(data.issueDate, 'do MMMM, yyyy'), {
    x: 322,
    y: height - 359.5,
    size: 16.2,
    font: balsamiqFont,
    color: textColor,
  });

  // Save and return PDF
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
