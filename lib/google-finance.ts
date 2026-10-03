const GOOGLE_SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRXFGC5yJIyC_7JP1EChK6_jUb4VpaB0XnQK6NyB1l7QMIU2SzayxV6sp4ufTdgObxtv6N4cNnQpcXf/pub?gid=0&single=true&output=csv";

export interface GoogleFinanceData {
  peRatio: number | null;
  latestEarnings: number | null;
}

export async function getGoogleFinanceData(): Promise<
  Map<string, GoogleFinanceData>
> {
  try {
    const response = await fetch(GOOGLE_SHEET_CSV_URL, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        `Google Sheet request failed: ${response.status}`
      );
    }

    const csvText = await response.text();

    const lines = csvText
      .trim()
      .split(/\r?\n/)
      .slice(1);

    const data = new Map<string, GoogleFinanceData>();

    for (const line of lines) {
      const columns = line.split(",");

      const symbol = columns[0]?.trim();
      const peValue = columns[1]?.trim();
      const earningsValue = columns[2]?.trim();

      if (!symbol) {
        continue;
      }

      const peRatio =
        peValue && peValue !== "#N/A"
          ? Number(peValue)
          : null;

      const latestEarnings =
        earningsValue && earningsValue !== "#N/A"
          ? Number(earningsValue)
          : null;

      data.set(symbol.toUpperCase(), {
        peRatio: Number.isNaN(peRatio) ? null : peRatio,
        latestEarnings: Number.isNaN(latestEarnings)
          ? null
          : latestEarnings,
      });
    }

    return data;
  } catch (error) {
    console.error("Failed to fetch Google Finance data:", error);

    return new Map();
  }
}