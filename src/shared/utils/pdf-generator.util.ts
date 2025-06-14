import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as QRCode from 'qrcode';
import { Buffer } from 'buffer';
import { format } from 'date-fns';

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
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();

  // Add a new page (A4 size: 595 x 842 points)
  const page = pdfDoc.addPage([595, 842]);
  const { width, height } = page.getSize();

  // Draw a simple border
  page.drawRectangle({
    x: 50,
    y: 50,
    width: width - 100,
    height: height - 100,
    borderColor: rgb(0, 0, 0),
    borderWidth: 2,
  });

  // Add title
  page.drawText('OFFICIAL CERTIFICATE', {
    x: 170,
    y: height - 100,
    size: 24,
    color: rgb(0, 0, 0),
  });

  // Generate QR code
  const qrCodeData = `${verificationUrl}/${data.token}`;
  const qrCode = await QRCode.toDataURL(qrCodeData, { width: 200 });
  const qrImage = await pdfDoc.embedPng(
    Buffer.from(qrCode.split(',')[1], 'base64'),
  );

  // Embed QR code (middle bottom)
  page.drawImage(qrImage, {
    x: (width - 180) / 2,
    y: 80,
    width: 200,
    height: 200,
  });

  // Draw text fields
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 14;

  // Certificate header
  page.drawText('This certifies that:', {
    x: 150,
    y: height - 180,
    size: fontSize,
    font,
  });

  // Student Info
  page.drawText(`Name: ${data.name}`, {
    x: 150,
    y: height - 220,
    size: fontSize,
    font,
  });

  page.drawText(`Matriculation Number: ${data.matricNo}`, {
    x: 150,
    y: height - 250,
    size: fontSize,
    font,
  });

  page.drawText(`Date of Birth: ${data.dob}`, {
    x: 150,
    y: height - 280,
    size: fontSize,
    font,
  });

  // Academic Info
  page.drawText(`Course: ${data.course}`, {
    x: 150,
    y: height - 330,
    size: fontSize,
    font,
  });

  page.drawText(`Grade: ${data.grade}`, {
    x: 150,
    y: height - 360,
    size: fontSize,
    font,
  });

  page.drawText(`Graduation Year: ${data.graduationYear}`, {
    x: 150,
    y: height - 390,
    size: fontSize,
    font,
  });

  // Dates
  page.drawText(`Issued On: ${format(data.issueDate, 'MMMM do, yyyy')}`, {
    x: 150,
    y: height - 450,
    size: fontSize,
    font,
  });

  page.drawText(`Valid Until: ${format(data.expiryDate, 'MMMM do, yyyy')}`, {
    x: 150,
    y: height - 480,
    size: fontSize,
    font,
  });

  // Save and return PDF
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
