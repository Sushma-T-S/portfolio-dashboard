"use client";

import { PortfolioStock } from "@/types/portfolio";

interface SectorSummaryProps {
  stocks: PortfolioStock[];
}

export default function SectorSummary({
  stocks,
}: SectorSummaryProps) {
  const sectors = Array.from(
    new Set(stocks.map((stock) => stock.sector))
  );

  const sectorData = sectors.map((sector) => {
    const sectorStocks = stocks.filter(
      (stock) => stock.sector === sector
    );

    const investment = sectorStocks.reduce(
      (total, stock) =>
        total + stock.purchasePrice * stock.quantity,
      0
    );

    const currentValue = sectorStocks.reduce(
      (total, stock) =>
        total + (stock.cmp ?? 0) * stock.quantity,
      0
    );

    const gainLoss = currentValue - investment;

    const returnPercentage =
      investment > 0
        ? (gainLoss / investment) * 100
        : 0;

    return {
      sector,
      investment,
      currentValue,
      gainLoss,
      returnPercentage,
    };
  });

  return (
    <div className="mb-8">
      <h2 className="mb-4 text-2xl font-bold">
        Sector Summary
      </h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sectorData.map((sector) => (
          <div
            key={sector.sector}
            className="rounded-xl border bg-white p-5 shadow-sm"
          >
            <h3 className="text-lg font-semibold">
              {sector.sector}
            </h3>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">
                  Investment
                </span>

                <span className="font-medium">
                  ₹{sector.investment.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Current Value
                </span>

                <span className="font-medium">
                  ₹{sector.currentValue.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Gain/Loss
                </span>

                <span
                  className={`font-medium ${
                    sector.gainLoss >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  ₹{sector.gainLoss.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Return
                </span>

                <span
                  className={`font-medium ${
                    sector.returnPercentage >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {sector.returnPercentage.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}