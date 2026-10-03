import { NextResponse } from "next/server";
import { portfolioStocks } from "@/data/portfolio";
import { getYahooQuote } from "@/lib/financial-data";
import { getGoogleFinanceData } from "@/lib/google-finance";

const CACHE_DURATION = 15 * 1000;

let cachedStocks: any[] | null = null;
let lastFetched = 0;

function getGoogleSymbol(stockName: string) {
  const symbolMap: Record<string, string> = {
    "HDFC Bank": "NSE:HDFCBANK",
    "Bajaj Finance": "NSE:BAJFINANCE",
    "ICICI Bank": "NSE:ICICIBANK",
    "Bajaj Housing": "NSE:BAJAJHFL",
    "Savani Financials": "BOM:511577",
    "Affle India": "NSE:AFFLE",
    "LTI Mindtree": "NSE:LTIM",
    "KPIT Tech": "NSE:KPIT",
    "Tata Tech": "NSE:TATATECH",
    "BLS E-Services": "BOM:544107",
    "Tanla": "BOM:532790",
    "Dmart": "NSE:DMART",
    "Tata Consumer": "NSE:TATACONSUM",
    "Pidilite": "NSE:PIDILITE",
    "Tata Power": "NSE:TATAPOWER",
    "KPI Green": "BOM:542323",
    Suzlon: "NSE:SUZLON",
    Gensol: "BOM:542851",
    "Hariom Pipes": "BOM:543517",
    Astral: "NSE:ASTRAL",
    Polycab: "BOM:542652",
    "Clean Science": "BOM:543318",
    "Deepak Nitrite": "NSE:DEEPAKNTR",
    "Fine Organic": "NSE:FINEORG",
    Gravita: "NSE:GRAVITA",
    "SBI Life": "NSE:SBILIFE",
    Infosys: "NSE:INFY",
    "Happiest Minds": "BOM:543237",
    EaseMyTrip: "BOM:543272",
  };

  return symbolMap[stockName] ?? null;
}

export async function GET() {
  try {
    const now = Date.now();

    // Return cached data if it is still fresh
    if (cachedStocks && now - lastFetched < CACHE_DURATION) {
      return NextResponse.json({
        stocks: cachedStocks,
        cached: true,
      });
    }

    // Fetch Google Finance data once
    const googleFinanceData = await getGoogleFinanceData();

    const stocks = await Promise.all(
      portfolioStocks.map(async (stock) => {
        // Yahoo Finance → CMP
        const yahooQuote = await getYahooQuote(stock.yahooSymbol);

        // Google Finance → P/E + Latest Earnings
        const googleSymbol = getGoogleSymbol(stock.name);

        const googleData = googleSymbol
          ? googleFinanceData.get(googleSymbol.toUpperCase())
          : undefined;

        return {
          ...stock,
          cmp: yahooQuote.price,
          peRatio: googleData?.peRatio ?? null,
          latestEarnings: googleData?.latestEarnings ?? null,
        };
      })
    );

    // Save fresh data in cache
    cachedStocks = stocks;
    lastFetched = now;

    return NextResponse.json({
      stocks,
      cached: false,
    });
  } catch (error) {
    console.error("Portfolio API error:", error);

    return NextResponse.json(
      {
        error: "Unable to fetch portfolio data",
      },
      { status: 500 }
    );
  }
}