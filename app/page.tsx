"use client";

import { useEffect, useState } from "react";
import PortfolioTable from "@/components/PortfolioTable";
import { PortfolioStock } from "@/types/portfolio";
import SectorSummary from "@/components/SectorSummary";
import PortfolioCharts from "@/components/PortfolioCharts";

export default function Home() {
  const [stocks, setStocks] = useState<PortfolioStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");

  async function fetchPortfolio(isRefresh = false) {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await fetch("/api/portfolio", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch portfolio data");
      }

      const data = await response.json();

      setStocks(data.stocks);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Failed to load portfolio:", error);
      setError("Unable to load portfolio data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

 useEffect(() => {
  fetchPortfolio();

  const interval = setInterval(() => {
    fetchPortfolio(true);
  }, 15 * 1000);

  return () => clearInterval(interval);
}, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-2 text-3xl font-bold">
            Dynamic Portfolio Dashboard
          </h1>

          <p className="text-gray-600">
            Loading portfolio data...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-2 text-3xl font-bold">
            Dynamic Portfolio Dashboard
          </h1>

          <p className="mb-4 text-red-600">{error}</p>

          <button
            onClick={() => fetchPortfolio()}
            className="rounded-lg bg-black px-4 py-2 text-white"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  const totalInvestment = stocks.reduce(
    (total, stock) =>
      total + stock.purchasePrice * stock.quantity,
    0
  );

  const currentValue = stocks.reduce(
    (total, stock) =>
      total +
      (stock.cmp ?? 0) * stock.quantity,
    0
  );

  const totalGainLoss = currentValue - totalInvestment;

  const overallReturn =
    totalInvestment > 0
      ? (totalGainLoss / totalInvestment) * 100
      : 0;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Dynamic Portfolio Dashboard
            </h1>

            <p className="mt-1 text-gray-600">
              Portfolio tracking with live market data.
            </p>

            {lastUpdated && (
              <p className="mt-1 text-sm text-gray-500">
                Last updated: {lastUpdated}
              </p>
            )}
          </div>

          <button
            onClick={() => fetchPortfolio(true)}
            disabled={refreshing}
            className="rounded-lg bg-black px-5 py-2.5 font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {refreshing ? "Refreshing..." : "Refresh Data"}
          </button>
        </div>

        {/* Summary Cards */}
        <div className="mb-8 grid gap-4 md:grid-cols-4">

          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Investment
            </p>

            <p className="mt-2 text-2xl font-bold">
              ₹{totalInvestment.toFixed(2)}
            </p>
          </div>

          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Current Value
            </p>

            <p className="mt-2 text-2xl font-bold">
              ₹{currentValue.toFixed(2)}
            </p>
          </div>

          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Gain/Loss
            </p>

            <p
              className={`mt-2 text-2xl font-bold ${
                totalGainLoss >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              ₹{totalGainLoss.toFixed(2)}
            </p>
          </div>

          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Overall Return
            </p>

            <p
              className={`mt-2 text-2xl font-bold ${
                overallReturn >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {overallReturn.toFixed(2)}%
            </p>
          </div>

        </div>

       {/* Sector Summary */}
<SectorSummary stocks={stocks} />

{/* Charts */}
<PortfolioCharts stocks={stocks} />

{/* Portfolio Table */}
<PortfolioTable stocks={stocks} />


      </div>
    </main>
  );
}