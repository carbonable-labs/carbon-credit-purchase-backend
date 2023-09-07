export const PRICE_SERVICE = 'PRICE SERVICE';

export interface IPriceService {
  getCurrentPrice(): number;
}
