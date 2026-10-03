"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { PortfolioStock } from "@/types/portfolio";

interface PortfolioChartsProps {
  stocks: PortfolioStock[];
}

export default function PortfolioCharts({
  stocks,
}: PortfolioChartsProps) {
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

    return {
      sector,
      investment,
      gainLoss: currentValue - investment,
    };
  });

  return (
    <div className="mb-8 grid gap-6 lg:grid-cols-2">

      {/* Investment Chart */}
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-xl font-bold">
          Investment by Sector
        </h2>

        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sectorData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="sector"
                tick={{ fontSize: 12 }}
              />

              <YAxis />

              <Tooltip
                formatter={(value) =>
                  `₹${Number(value).toLocaleString("en-IN")}`
                }
              />

              <Bar
                dataKey="investment"
                name="Investment"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gain/Loss Chart */}
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-xl font-bold">
          Gain/Loss by Sector
        </h2>

        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sectorData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="sector"
                tick={{ fontSize: 12 }}
              />

              <YAxis />

              <Tooltip
                formatter={(value) =>
                  `₹${Number(value).toLocaleString("en-IN")}`
                }
              />

              <Bar
                dataKey="gainLoss"
                name="Gain/Loss"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}