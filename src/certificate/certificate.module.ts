import { Module } from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { CERTIFICATE_SERVICE } from './certificate.interface';
import { CertificateController } from './certificate.controller';

@Module({
  controllers: [CertificateController],
  providers: [
    {
      provide: CERTIFICATE_SERVICE,
      useClass: CertificateService,
    },
  ],
  exports: [CERTIFICATE_SERVICE],
})
export class CertificateModule {}
