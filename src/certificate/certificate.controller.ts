import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProduces,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import {
  CERTIFICATE_SERVICE,
  ICertificateService,
} from './certificate.interface';
import { Response } from 'express';

@ApiTags('Certificate')
@Controller('certificate')
export class CertificateController {
  constructor(
    @Inject(CERTIFICATE_SERVICE)
    private readonly _certificateService: ICertificateService,
  ) {}

  @ApiOperation({ summary: 'Mint a certificate on admin wallet' })
  @ApiOkResponse({
    description: 'Return a transaction hash',
    type: String,
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({ description: 'Order not found' })
  @Get()
  mintForAdminWallet() {
    return this._certificateService.mint();
  }

  @ApiOperation({ summary: 'Get metadata from transaction' })
  @ApiOkResponse({
    description: 'Return a metadata object',
    type: Array,
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({ description: 'Transaction not found' })
  @Get(':transaction_hash')
  getMetadata(@Param('transaction_hash') transaction_hash: string) {
    return this._certificateService.retrieveMetadata(transaction_hash);
  }

  @ApiOperation({ summary: 'Generate certificate from metadata' })
  @ApiCreatedResponse({
    description: 'Successfully generated PDF file',
    content: {
      'application/pdf': {},
    },
  })
  @ApiProduces('application/pdf')
  @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @Post()
  async generateCertificate(@Body() metadata: string, @Res() res: Response) {
    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=example.pdf');
    const pdfBuffer =
      await this._certificateService.generateCertificate(metadata);
    // Send PDF content in response
    res.send(Buffer.from(pdfBuffer));
  }
}
