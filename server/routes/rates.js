const express = require('express');
const rateService = require('../services/rateService');

const router = express.Router();

/**
 * GET /api/rates
 * Query parameters:
 * - base: Base currency code (optional, default: USD)
 * - symbols: Comma-separated target currency codes (optional, default: all)
 */
router.get('/', async (req, res) => {
  try {
    const { base, symbols } = req.query;
    
    console.log(`Rates request: base=${base || 'USD'}, symbols=${symbols || 'all'}`);
    
    const rates = await rateService.getLatestRates(base, symbols);
    
    res.status(200).json(rates);
  } catch (error) {
    console.error('Error in rates endpoint:', error.message);
    
    // Determine appropriate status code
    let statusCode = 500;
    let errorMessage = error.message;
    
    if (error.message.includes('Invalid') || error.message.includes('Must be')) {
      statusCode = 400;
    } else if (error.message.includes('not found') || error.message.includes('not supported')) {
      statusCode = 404;
    } else if (error.message.includes('quota') || error.message.includes('limit')) {
      statusCode = 429;
    }
    
    res.status(statusCode).json({
      error: 'Failed to fetch exchange rates',
      message: errorMessage
    });
  }
});

module.exports = router;