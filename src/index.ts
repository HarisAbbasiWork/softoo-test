import { promises as fs } from 'fs';
import path from 'path';

interface Stock {
  sku: string;
  stock: number;
}

interface Transaction {
  sku: string;
  type: 'order' | 'refund';
  qty: number;
}

interface CurrentStock {
  sku: string;
  qty: number;
}

export async function getCurrentStockLevel(sku: string): Promise<CurrentStock> {
  const stockFilePath = 'src/stock.json';
  const transactionsFilePath = 'src/transactions.json';
  console.log("src/stock.json ",)
  console.log("await fs.readFile(stockFilePath, 'utf-8') ",await fs.readFile(stockFilePath, 'utf-8'))

  // Read and parse the stock.json file
  const stockData: Stock[] = JSON.parse(await fs.readFile(stockFilePath, 'utf-8'));

  // Read and parse the transactions.json file
  const transactionsData: Transaction[] = JSON.parse(await fs.readFile(transactionsFilePath, 'utf-8'));

  // Find the initial stock level for the given SKU
  let initialStock = stockData.find(item => item.sku === sku);

  console.log("initialStock ",initialStock)
  // Filter transactions for the given SKU
  const skuTransactions = transactionsData.filter(transaction => transaction.sku === sku);
  console.log("skuTransactions ",skuTransactions)
  if (skuTransactions.length === 0 && !initialStock) {
    throw new Error(`SKU ${sku} does not exist in both stock and transactions.`);
  }

  // Calculate the current stock level
  let currentStock = initialStock ? initialStock.stock : 0;
  skuTransactions.forEach(transaction => {
    if (transaction.type === 'order') {
      currentStock -= transaction.qty;
    } else if (transaction.type === 'refund') {
      currentStock += transaction.qty;
    }
  });

  return { sku, qty: currentStock };
}
getCurrentStockLevel('LTV719449/39/39').then(result => console.log("result ",result)).catch(err => console.log(err))