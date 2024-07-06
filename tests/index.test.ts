import { promises as fs } from 'fs';
import { getCurrentStockLevel } from '../src/index';
import { jest } from '@jest/globals';
jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
  }
}));

const mockStockData = [
  {
    sku: "LTV719449/39/39",
    stock: 8525
  },
  {
    sku: "SXB930757/87/87",
    stock: 3552
  },
];

const mockTransactionsData = [
  { sku: 'LTV719449/39/39', type: 'refund', qty: 10 },
  { sku: 'LTV719449/39/39', type: 'order', qty: 7 },
  { sku: 'LTV719449/39/39', type: 'order', qty: 5 },
  { sku: 'LTV719449/39/39', type: 'order', qty: 1 },
  { sku: 'LTV719449/39/39', type: 'order', qty: 9 },
  { sku: 'LTV719449/39/39', type: 'order', qty: 7 },
  { sku: 'LTV719449/39/39', type: 'order', qty: 5 },
  { sku: 'LTV719449/39/39', type: 'order', qty: 0 },
  { sku: 'LTV719449/39/39', type: 'refund', qty: 9 },
  { sku: 'SXB930757/87/87', type: 'order', qty: 1 },
  { sku: 'SXB930757/87/87', type: 'order', qty: 2 },
  { sku: 'SXB930757/87/87', type: 'order', qty: 10 },
  { sku: 'SXB930757/87/87', type: 'refund', qty: 9 },
  { sku: 'SXB930757/87/87', type: 'order', qty: 2 },
  { sku: 'SXB930757/87/87', type: 'order', qty: 6 },
  { sku: 'SXB930757/87/87', type: 'order', qty: 5 },
  { sku: 'SXB930757/87/87', type: 'order', qty: 5 },
  { sku: 'SXB930757/87/87', type: 'order', qty: 4 },
  { sku: 'SXB930757/87/87', type: 'order', qty: 6 }
];

describe('getStockLevel', () => {
  beforeEach(() => {
    (fs.readFile as jest.Mock).mockImplementation((filePath: string) => {
      if (filePath === 'src/stock.json') {
        return Promise.resolve(JSON.stringify(mockStockData));
      }
      if (filePath === 'src/transactions.json') {
        return Promise.resolve(JSON.stringify(mockTransactionsData));
      }
      return Promise.reject(new Error('File not found'));
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return the correct stock level for a given SKU', async () => {
    const result = await getCurrentStockLevel('LTV719449/39/39');
    expect(result).toEqual({ sku: 'LTV719449/39/39', qty : 8510 });
  });

  test('should return the correct stock level for a given SKU', async () => {
    const result = await getCurrentStockLevel('SXB930757/87/87');
    expect(result).toEqual({ sku: 'SXB930757/87/87', qty: 3520 });
  });

  test('should throw an error for SKUs not present in both stock.json and transactions.json', async () => {
    await expect(getCurrentStockLevel('NON_EXISTENT_SKU')).rejects.toThrow('SKU NON_EXISTENT_SKU does not exist in both stock and transactions.');
  });
});
