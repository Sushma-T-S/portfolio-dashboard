# Dynamic Portfolio Dashboard – Technical Document

## 1. Project Overview

The Dynamic Portfolio Dashboard is a web application built using Next.js, React, TypeScript and Tailwind CSS.

It displays portfolio holdings along with live/current market information and calculates investment value, present value and gain/loss.

## 2. Architecture

The application follows a simple client-server architecture.

```text
Portfolio Data
      ↓
Next.js API
      ↓
External Market Data
      ↓
Data Transformation
      ↓
Portfolio Calculations
      ↓
React Dashboard
```

The portfolio information is maintained as structured data in the application.

## 3. Market Data Integration

### CMP

Yahoo Finance is used to obtain the current market price (CMP).

The Next.js API calls Yahoo Finance on the server side and returns the price to the dashboard.

### P/E Ratio and Latest Earnings

Google Finance values are maintained using Google Sheets `GOOGLEFINANCE` formulas.

The Google Sheet is published as CSV.

The application fetches the published CSV and maps the values to the corresponding portfolio stocks.

```text
Google Finance
      ↓
Google Sheet
      ↓
Published CSV
      ↓
Next.js API
      ↓
Dashboard
```

## 4. Portfolio Calculations

### Investment

Investment is calculated as:

Purchase Price × Quantity

### Present Value

Present Value is calculated as:

CMP × Quantity

### Gain/Loss

Gain/Loss is calculated as:

Present Value - Investment

### Portfolio Percentage

Portfolio percentage is calculated as:

Investment / Total Investment × 100

These calculations are performed dynamically from the portfolio data.

## 5. Automatic Refresh

The dashboard automatically requests updated portfolio data every 15 seconds.

A manual **Refresh Data** button is also provided.

This allows the displayed market information to be refreshed without reloading the complete page.

## 6. Server-Side Caching

A 15-second in-memory cache is implemented in the portfolio API.

When a request is received, the API first checks whether recently fetched data is available in the cache.

If the cached data is still valid, it is returned instead of making new external requests.

This helps:

* Reduce unnecessary API requests
* Reduce response time
* Reduce dependency on external services
* Handle external API rate limitations

## 7. Sector Analysis

Portfolio holdings are grouped by sector.

For each sector, the dashboard calculates:

* Total Investment
* Total Present Value
* Total Gain/Loss
* Return percentage

Charts are displayed using Recharts to provide a visual representation of sector-level investment and gain/loss.

## 8. Search and Sorting

The portfolio table supports searching by:

* Stock name
* Sector
* Exchange

The table also supports sorting of portfolio columns.

This makes it easier to analyze individual holdings.

## 9. Error Handling

External market-data services may fail or may not provide information for some stocks.

The application uses error handling around external requests.

If data cannot be retrieved, the application returns `null` and displays `N/A` instead of breaking the complete dashboard.

For example, if a Yahoo Finance symbol cannot be found, the corresponding CMP is displayed as `N/A`.

## 10. API Limitations

The application depends on external market-data sources.

Possible limitations include:

* API rate limits
* Temporary service failures
* Missing stock symbols
* Exchange-specific symbol differences
* Delayed market data
* Unavailable financial metrics

The application handles unavailable values gracefully.

## 11. Security

External market-data requests are performed through the Next.js server-side API.

Private credentials are not exposed to the browser.

The published Google Sheet contains market-data values and does not contain private API credentials.

## 12. Performance

The application uses server-side caching to reduce repeated external requests.

The dashboard also uses asynchronous data fetching so multiple portfolio stocks can be processed efficiently.

The production build was successfully tested using:

```bash
npm run build
```

## 13. Technology Stack

* Next.js 16
* React
* TypeScript
* Tailwind CSS
* Recharts
* Yahoo Finance
* Google Sheets
* Google Finance
* Node.js

## 14. Future Improvements

Possible future improvements include:

* Persistent database caching
* User authentication
* User-specific portfolios
* Historical price charts
* WebSocket-based real-time updates
* Portfolio import/export
* Automated unit and integration tests
* Dedicated financial market-data API
* More robust CSV parsing
