import { Controller, Get, Inject, Param } from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  CERTIFICATE_SERVICE,
  ICertificateService,
} from './certificate.interface';

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
    description: 'Return a list of metadata',
    type: Array,
  })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({ description: 'Transaction not found' })
  @Get(':transaction_hash')
  getMetadata(@Param('transaction_hash') transaction_hash: string) {
    return this._certificateService.retrieveMetadata(transaction_hash);
  }
}
