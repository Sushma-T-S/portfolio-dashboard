# Dynamic Portfolio Dashboard

A dynamic portfolio tracking dashboard built using Next.js, React, TypeScript and Tailwind CSS.

## Features

* Live stock CMP using Yahoo Finance
* P/E Ratio using Google Finance
* Latest Earnings using Google Finance
* Automatic data refresh every 15 seconds
* Server-side 15-second caching
* Manual refresh
* Portfolio investment calculation
* Present Value calculation
* Gain/Loss calculation
* Portfolio allocation percentage
* Sector-wise portfolio summary
* Investment and Gain/Loss charts
* Search stocks by name, sector or exchange
* Sort portfolio columns
* Error handling and N/A handling
* Responsive portfolio table

## Tech Stack

* Next.js
* React
* TypeScript
* Tailwind CSS
* Recharts
* Yahoo Finance
* Google Finance
* Google Sheets CSV

## Data Flow

### CMP

Yahoo Finance
↓
Next.js API
↓
Portfolio Dashboard

### P/E Ratio and Latest Earnings

Google Finance
↓
Google Sheet
↓
Published CSV
↓
Next.js API
↓
Portfolio Dashboard

## Calculations

### Investment

Purchase Price × Quantity

### Present Value

CMP × Quantity

### Gain/Loss

Present Value - Investment

### Portfolio Percentage

Investment / Total Investment × 100

## Caching

The portfolio API uses a 15-second in-memory cache.

This reduces repeated requests to external market-data services and helps handle API rate limits.

## Error Handling

If an external API does not return data, the application displays `N/A` instead of breaking the complete dashboard.

## Running the Project

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the application:

```text
http://localhost:3000
```

## Production Build

To create an optimized production build:

```bash
npm run build
```

The production build was tested successfully.

## API Endpoint

The portfolio data is provided through:

```text
GET /api/portfolio
```

The API fetches market data, combines it with the portfolio information, performs the required calculations, and returns the data to the dashboard.

## External Data Limitations

The application depends on external market-data services. External services may have:

* Rate limits
* Temporary unavailability
* Missing stock data
* Delayed market information
* Symbol differences between exchanges and providers

When data is unavailable, the application safely displays `N/A`.

## Security

No private API credentials are exposed in the client-side application.

The external data fetching is handled through the Next.js server-side API.

The Google Sheet used for the market-data values is published as CSV and does not contain private credentials.

## Future Improvements

* Add a database for persistent caching
* Add authentication and user-specific portfolios
* Use a dedicated financial market-data API
* Add historical price charts
* Add WebSocket-based real-time market updates
* Add portfolio import/export
* Improve CSV parsing for complex CSV values
* Add automated tests

````

### Then do this

Save `README.md`.

After saving, **don't run `npm run build` again unless you changed code**. README changes don't affect the application build.

### Next

The remaining required deliverable is the **short technical document**.

Create:

```text
TECHNICAL_DOCUMENT.md
````

I'll give you the complete interview-ready technical document next.
