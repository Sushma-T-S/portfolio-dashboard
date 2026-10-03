import { portfolioStocks } from "@/data/portfolio";
import {
  calculateInvestment,
  calculatePortfolioPercentage,
  calculatePresentValue,
  calculateGainLoss,
} from "./portfolio-calculations";

export function getPortfolioData() {
  const totalInvestment = portfolioStocks.reduce(
    (total, stock) =>
      total + calculateInvestment(stock.purchasePrice, stock.quantity),
    0
  );

  return portfolioStocks.map((stock) => {
    const investment = calculateInvestment(
      stock.purchasePrice,
      stock.quantity
    );

    const portfolioPercentage = calculatePortfolioPercentage(
      investment,
      totalInvestment
    );

    const presentValue = calculatePresentValue(
      stock.cmp,
      stock.quantity
    );

    const gainLoss = calculateGainLoss(
      presentValue,
      investment
    );

    return {
      ...stock,
      investment,
      portfolioPercentage,
      presentValue,
      gainLoss,
    };
  });
}