export const CERTIFICATE_SERVICE = 'CERTIFICATE SERVICE';

export interface ICertificateService {
  mint(orderId?: string): Promise<string>;
  retrieveMetadata(transactionHash: string): Promise<void>;
  generateCertificate(): Promise<void>;
}
