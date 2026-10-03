export interface PortfolioStock {
  name: string;
  sector: string;
  purchasePrice: number;
  quantity: number;
  exchange: string;
  yahooSymbol: string;
  cmp: number | null;
  peRatio: number | null;
  latestEarnings: number | null;
}