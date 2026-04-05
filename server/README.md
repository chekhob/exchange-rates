# Exchange Rates Backend API

Node.js Express server that provides exchange rate data using ExchangeRate-API (primary) with Frankfurter API fallback. Returns data in a simplified format ready for tabular display.

## Features

- **Dual API Strategy**: Primary ExchangeRate-API with Frankfurter fallback
- **Simplified Response**: Clean, consistent JSON format optimized for frontend tables
- **Currency Validation**: Validates ISO 4217 currency codes
- **CORS Enabled**: Configurable allowed origins for frontend integration
- **Error Handling**: Comprehensive error handling with appropriate HTTP status codes
- **Testing**: Full test suite with Jest and Supertest

## API Endpoint

### GET `/api/rates`

Returns latest exchange rates for a specified base currency.

**Query Parameters:**
- `base` (optional): Base currency code (3-letter ISO code, default: `USD`)
- `symbols` (optional): Comma-separated target currency codes (default: all supported currencies)

**Example Request:**
```
GET /api/rates?base=USD&symbols=EUR,GBP,JPY
```

**Success Response (200):**
```json
{
  "last_updated_at": "2026-04-05T15:00:00Z",
  "next_update_at": "2026-04-06T15:00:00Z",
  "base": "USD",
  "rates": {
    "USD": 1,
    "EUR": 0.86562,
    "GBP": 0.75476,
    "JPY": 110.25
  }
}
```

**Error Responses:**
- `400`: Invalid currency code or parameters
- `404`: Currency not found
- `429`: Rate limit exceeded (ExchangeRate-API)
- `500`: Internal server error

## Project Structure

```
server/
├── .env                    # Environment variables
├── app.js                  # Express app setup
├── routes/
│   └── rates.js           # API routes
├── services/
│   ├── exchangeRateService.js  # ExchangeRate-API integration
│   ├── frankfurterService.js   # Frankfurter API integration
│   └── rateService.js          # Orchestrator with fallback logic
├── utils/
│   └── transform.js       # Response transformation
├── tests/                 # Test suite
└── README.md             # This file
```

## Setup Instructions

### 1. Prerequisites
- Node.js 18 or higher
- npm or yarn
- ExchangeRate-API key (free tier available)

### 2. Installation

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install
```

### 3. Configuration

Copy the example environment file and update with your values:

```bash
cp .env.example .env
```

Edit `.env` file:
```env
PORT=3001
ALLOWED_ORIGINS=http://localhost:3000
EXCHANGERATE_API_KEY=your_api_key_here  # Get from https://www.exchangerate-api.com
FRANKFURTER_API_BASE_URL=https://api.frankfurter.dev/v1
```

**Get ExchangeRate-API Key:**
1. Visit [exchangerate-api.com](https://www.exchangerate-api.com)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Add it to `.env` file

### 4. Running the Server

**Development mode (with auto-restart):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3001` (or your configured port).

### 5. Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## API Integration Details

### ExchangeRate-API (Primary)
- **Endpoint**: `https://v6.exchangerate-api.com/v6/{key}/latest/{base}`
- **Free Tier**: 1,500 requests/month
- **Features**: Real-time rates, 160+ currencies
- **Response Time**: < 100ms

### Frankfurter API (Fallback)
- **Endpoint**: `https://api.frankfurter.dev/v1/latest?base={base}&symbols={symbols}`
- **Limits**: No quotas, rate-limiting only
- **Features**: 30+ currencies, daily updates
- **Update Time**: ~16:00 CET daily

### Fallback Logic
1. Attempt ExchangeRate-API if API key is provided
2. If ExchangeRate-API fails (any error), fallback to Frankfurter
3. If both APIs fail, return 500 error

## Development

### Adding New Features
1. Create service functions in `services/` directory
2. Add corresponding tests in `tests/`
3. Update routes if needed
4. Run tests to ensure compatibility

### Logging
Console logging is enabled for development. Key events:
- API selection (ExchangeRate-API vs Frankfurter)
- Request parameters
- Error conditions
- Fallback triggers

### Environment Variables
| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3001 |
| `ALLOWED_ORIGINS` | CORS allowed origins (comma-separated) | http://localhost:3000 |
| `EXCHANGERATE_API_KEY` | ExchangeRate-API key | (required) |
| `FRANKFURTER_API_BASE_URL` | Frankfurter API base URL | https://api.frankfurter.dev/v1 |
| `LOG_LEVEL` | Logging verbosity | info |

## Troubleshooting

### Common Issues

**ExchangeRate-API Errors:**
- `invalid-key`: Verify API key in `.env`
- `quota-reached`: Free tier limit reached, wait for reset or upgrade
- `unsupported-code`: Currency code not supported

**CORS Errors:**
- Ensure `ALLOWED_ORIGINS` includes your frontend URL
- Restart server after changing `.env`

**Server Not Starting:**
- Check if port 3001 is already in use
- Verify Node.js version (requires 18+)
- Check `.env` file syntax

### Testing API Connectivity

```bash
# Test health endpoint
curl http://localhost:3001/health

# Test rates endpoint
curl "http://localhost:3001/api/rates?base=USD&symbols=EUR,GBP"
```

## License

MIT