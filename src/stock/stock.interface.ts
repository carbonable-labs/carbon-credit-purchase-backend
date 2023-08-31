import { AvailableStockDto } from './dto/available-stock.dto';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { Stock } from './entities/stock.entity';

export const STOCK_SERVICE = 'STOCK SERVICE';

export interface IStockService {
  findAll(): Promise<Stock[]>;
  findOne(id: string): Promise<Stock>;
  create(projectId: string, stock: CreateStockDto): Promise<Stock>;
  update(id: string, stock: UpdateStockDto): Promise<Stock>;
  remove(id: string): Promise<string>;
  availableStock(): Promise<AvailableStockDto>;
  getExPostStock(): Promise<Stock[]>;
  getExAnteStock(): Promise<Stock[]>;
  getExPostStockCount(): Promise<number>;
  getExAnteStockCount(): Promise<number>;
}
