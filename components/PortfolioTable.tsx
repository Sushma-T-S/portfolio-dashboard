"use client";

import { useState } from "react";
import { PortfolioStock } from "@/types/portfolio";
import {
  calculateInvestment,
  calculatePortfolioPercentage,
  calculatePresentValue,
  calculateGainLoss,
} from "@/lib/portfolio-calculations";

interface PortfolioTableProps {
  stocks: PortfolioStock[];
}

type SortKey =
  | "name"
  | "purchasePrice"
  | "quantity"
  | "investment"
  | "portfolioPercentage"
  | "cmp"
  | "presentValue"
  | "gainLoss"
  | "peRatio"
  | "latestEarnings";

export default function PortfolioTable({
  stocks,
}: PortfolioTableProps) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(
    "asc"
  );

  const totalInvestment = stocks.reduce(
    (total, stock) =>
      total + calculateInvestment(stock.purchasePrice, stock.quantity),
    0
  );

  const filteredStocks = stocks.filter((stock) =>
    stock.name.toLowerCase().includes(search.toLowerCase()) ||
    stock.exchange.toLowerCase().includes(search.toLowerCase()) ||
    stock.sector.toLowerCase().includes(search.toLowerCase())
  );

  const sortedStocks = [...filteredStocks].sort((a, b) => {
    if (!sortKey) return 0;

    let valueA: string | number | null;
    let valueB: string | number | null;

    switch (sortKey) {
      case "name":
        valueA = a.name;
        valueB = b.name;
        break;

      case "purchasePrice":
        valueA = a.purchasePrice;
        valueB = b.purchasePrice;
        break;

      case "quantity":
        valueA = a.quantity;
        valueB = b.quantity;
        break;

      case "investment":
        valueA = calculateInvestment(
          a.purchasePrice,
          a.quantity
        );
        valueB = calculateInvestment(
          b.purchasePrice,
          b.quantity
        );
        break;

      case "portfolioPercentage":
        valueA =
          calculateInvestment(a.purchasePrice, a.quantity) /
          totalInvestment;

        valueB =
          calculateInvestment(b.purchasePrice, b.quantity) /
          totalInvestment;
        break;

      case "cmp":
        valueA = a.cmp;
        valueB = b.cmp;
        break;

      case "presentValue":
        valueA = calculatePresentValue(
          a.cmp,
          a.quantity
        );
        valueB = calculatePresentValue(
          b.cmp,
          b.quantity
        );
        break;

      case "gainLoss":
        valueA = calculateGainLoss(
          calculatePresentValue(a.cmp, a.quantity),
          calculateInvestment(a.purchasePrice, a.quantity)
        );

        valueB = calculateGainLoss(
          calculatePresentValue(b.cmp, b.quantity),
          calculateInvestment(b.purchasePrice, b.quantity)
        );
        break;

      case "peRatio":
        valueA = a.peRatio;
        valueB = b.peRatio;
        break;

      case "latestEarnings":
        valueA = a.latestEarnings;
        valueB = b.latestEarnings;
        break;

      default:
        return 0;
    }

    if (valueA === null) return 1;
    if (valueB === null) return -1;

    if (typeof valueA === "string" && typeof valueB === "string") {
      return sortDirection === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }

    return sortDirection === "asc"
      ? Number(valueA) - Number(valueB)
      : Number(valueB) - Number(valueA);
  });

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDirection(
        sortDirection === "asc" ? "desc" : "asc"
      );
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  }

  function sortIcon(key: SortKey) {
    if (sortKey !== key) return "↕";

    return sortDirection === "asc" ? "↑" : "↓";
  }

  return (
    <div className="rounded-xl border bg-white shadow-sm">

      {/* Table Header */}
      <div className="flex flex-col gap-4 border-b p-5 md:flex-row md:items-center md:justify-between">

        <div>
          <h2 className="text-xl font-bold">
            Portfolio Holdings
          </h2>

          <p className="text-sm text-gray-500">
            {filteredStocks.length} of {stocks.length} stocks
          </p>
        </div>

        {/* Search */}
        <div className="w-full md:w-80">
          <input
            type="text"
            placeholder="Search stock, sector or NSE/BSE..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            className="w-full rounded-lg border px-4 py-2.5 outline-none focus:ring-2"
          />
        </div>
      </div>

      {/* Table */}
      <div className="max-h-[650px] overflow-auto">
        <table className="min-w-[1200px] text-sm">

          <thead className="sticky top-0 z-10 bg-gray-100">
            <tr>

              <th
                className="cursor-pointer whitespace-nowrap px-4 py-3 text-left"
                onClick={() => handleSort("name")}
              >
                Particulars {sortIcon("name")}
              </th>

              <th
                className="cursor-pointer whitespace-nowrap px-4 py-3 text-right"
                onClick={() => handleSort("purchasePrice")}
              >
                Purchase Price {sortIcon("purchasePrice")}
              </th>

              <th
                className="cursor-pointer px-4 py-3 text-right"
                onClick={() => handleSort("quantity")}
              >
                Qty {sortIcon("quantity")}
              </th>

              <th
                className="cursor-pointer px-4 py-3 text-right"
                onClick={() => handleSort("investment")}
              >
                Investment {sortIcon("investment")}
              </th>

              <th
                className="cursor-pointer px-4 py-3 text-right"
                onClick={() =>
                  handleSort("portfolioPercentage")
                }
              >
                Portfolio % {sortIcon("portfolioPercentage")}
              </th>

              <th className="px-4 py-3 text-left">
                NSE/BSE
              </th>

              <th
                className="cursor-pointer px-4 py-3 text-right"
                onClick={() => handleSort("cmp")}
              >
                CMP {sortIcon("cmp")}
              </th>

              <th
                className="cursor-pointer px-4 py-3 text-right"
                onClick={() =>
                  handleSort("presentValue")
                }
              >
                Present Value {sortIcon("presentValue")}
              </th>

              <th
                className="cursor-pointer px-4 py-3 text-right"
                onClick={() => handleSort("gainLoss")}
              >
                Gain/Loss {sortIcon("gainLoss")}
              </th>

              <th
                className="cursor-pointer px-4 py-3 text-right"
                onClick={() => handleSort("peRatio")}
              >
                P/E Ratio {sortIcon("peRatio")}
              </th>

              <th
                className="cursor-pointer px-4 py-3 text-right"
                onClick={() =>
                  handleSort("latestEarnings")
                }
              >
                Latest Earnings {sortIcon("latestEarnings")}
              </th>

            </tr>
          </thead>

          <tbody>
            {sortedStocks.map((stock) => {
              const investment = calculateInvestment(
                stock.purchasePrice,
                stock.quantity
              );

              const portfolioPercentage =
                calculatePortfolioPercentage(
                  investment,
                  totalInvestment
                );

              const presentValue =
                calculatePresentValue(
                  stock.cmp,
                  stock.quantity
                );

              const gainLoss = calculateGainLoss(
                presentValue,
                investment
              );

              return (
                <tr
                  key={stock.name}
                  className="border-t hover:bg-gray-50"
                >

                  <td className="px-4 py-3 font-medium">
                    {stock.name}
                  </td>

                  <td className="px-4 py-3 text-right">
                    ₹{stock.purchasePrice.toFixed(2)}
                  </td>

                  <td className="px-4 py-3 text-right">
                    {stock.quantity}
                  </td>

                  <td className="px-4 py-3 text-right">
                    ₹{investment.toFixed(2)}
                  </td>

                  <td className="px-4 py-3 text-right">
                    {portfolioPercentage.toFixed(2)}%
                  </td>

                  <td className="px-4 py-3">
                    {stock.exchange}
                  </td>

                  <td className="px-4 py-3 text-right">
                    {stock.cmp === null
                      ? "N/A"
                      : `₹${stock.cmp.toFixed(2)}`}
                  </td>

                  <td className="px-4 py-3 text-right">
                    {presentValue === null
                      ? "N/A"
                      : `₹${presentValue.toFixed(2)}`}
                  </td>

                  <td
                    className={`px-4 py-3 text-right font-semibold ${
                      gainLoss === null
                        ? "text-gray-500"
                        : gainLoss > 0
                        ? "text-green-600"
                        : gainLoss < 0
                        ? "text-red-600"
                        : "text-gray-600"
                    }`}
                  >
                    {gainLoss === null
                      ? "N/A"
                      : `₹${gainLoss.toFixed(2)}`}
                  </td>

                  <td className="px-4 py-3 text-right">
                    {stock.peRatio === null
                      ? "N/A"
                      : stock.peRatio.toFixed(2)}
                  </td>

                  <td className="px-4 py-3 text-right">
                    {stock.latestEarnings === null
                      ? "N/A"
                      : stock.latestEarnings.toFixed(2)}
                  </td>

                </tr>
              );
            })}
          </tbody>

        </table>
      </div>

      {sortedStocks.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          No stocks found.
        </div>
      )}

    </div>
  );
}