export const CERTIFICATE_SERVICE = 'CERTIFICATE SERVICE';

export interface ICertificateService {
  mint(orderId?: string): Promise<string>;
  retrieveMetadata(transactionHash: string): Promise<string>;
  generateCertificate(metadata: string): Promise<ArrayBuffer>;
}
