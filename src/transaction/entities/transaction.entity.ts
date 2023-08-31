export class Transaction {
  id: string;
  paymentProvider: string;
  externalId: string;
  amount: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  orderId: string;
}
