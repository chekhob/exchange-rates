# Exchange Rates Dashboard

A React-based dashboard for displaying real-time foreign exchange rates with currency conversion and filtering capabilities.

## Features

- **Real-time Exchange Rates**: Display conversion rates for a selected base currency
- **Currency Selection**: Choose from common base currencies (USD, EUR, GBP, etc.)
- **Search & Filter**: Filter currencies by code or name
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS
- **Mock Data**: Fully functional with mock API data matching real API structure
- **Type Safety**: Built with TypeScript for robust type checking

## Tech Stack

- **React 19** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS 4** for utility-first styling
- **PostCSS** with `@tailwindcss/postcss` plugin
- **ESLint** for code quality

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
cd react
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # React components
│   ├── CurrencySelector.tsx
│   ├── ExchangeRateTable.tsx
│   ├── SearchFilter.tsx
│   └── LastUpdated.tsx
├── hooks/              # Custom React hooks
│   └── useExchangeRates.ts
├── services/           # API and data services
│   └── api.ts
├── types/              # TypeScript interfaces
│   └── index.ts
├── utils/              # Utility functions
│   └── currencyUtils.ts
└── styles/             # CSS styles
    └── index.css
```

## API Integration

The application is designed to work with the following API response structure:

```json
{
  "time_next_update_utc": "Mon, 06 Apr 2026 00:00:01 +0000",
  "base_code": "INR",
  "conversion_rates": {
    "INR": 1,
    "USD": 0.01073,
    "EUR": 0.00994,
    ...
  }
}
```

Currently using mock data. To integrate with a real API:

1. Update `src/services/api.ts` to make actual HTTP requests
2. Set the API endpoint via environment variables
3. Handle authentication if required

## Future Enhancements

See [TODO.md](TODO.md) for planned features including currency conversion calculator, historical charts, favorites, dark mode, and real API integration.

## License

MIT
