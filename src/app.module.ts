import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CertificateModule } from './certificate/certificate.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI!),
    CertificateModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
