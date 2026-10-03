import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance({
  suppressNotices: ["yahooSurvey"],
});

export async function getYahooQuote(symbol: string) {
  try {
    const quote = await yahooFinance.quoteSummary(symbol, {
      modules: ["price"],
    });

    const price = quote.price?.regularMarketPrice ?? null;

    return {
      symbol,
      price,
    };
  } catch (error) {
    console.error(`Failed to fetch Yahoo data for ${symbol}`, error);

    return {
      symbol,
      price: null,
    };
  }
}