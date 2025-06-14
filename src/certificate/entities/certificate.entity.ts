import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from 'src/shared/utils/base-schema.util';

@Schema({ timestamps: true })
export class Certificate extends BaseSchema {
  @Prop({ required: true, unique: true, index: true })
  token: string;

  @Prop({ required: true })
  encryptedData: string;

  @Prop({ required: true })
  expiryDate: Date;
}

export const CertificateSchema = SchemaFactory.createForClass(Certificate);
