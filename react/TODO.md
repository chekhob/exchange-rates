# Future Features

## High Priority
1. **Currency conversion calculator**
   - Input field for amount
   - Select source and target currencies
   - Real-time conversion with current rates
   - Swap currencies button

2. **Historical exchange rate charts**
   - Chart showing rate trends over time (7 days, 1 month, 1 year)
   - Interactive chart with tooltips
   - Multiple currency pair comparison

3. **Favorites/starred currencies**
   - Ability to mark favorite currencies
   - Persistent storage (localStorage or backend)
   - Quick access section for favorites
   - Reorder favorites via drag & drop

4. **Dark/light mode toggle**
   - Theme switching with system preference detection
   - Persistent theme preference
   - Smooth transitions

## Medium Priority
5. **Real API integration**
   - Connect to backend server API
   - Environment variable configuration
   - Error handling for API failures
   - Rate limiting and caching

6. **Currency flags/icons**
   - Display country flags for each currency
   - Icon library integration or SVG flags
   - Fallback for missing flags

7. **Advanced filtering/sorting**
   - Sort by currency code, rate, change percentage
   - Filter by currency groups (major, minor, exotic)
   - Custom currency lists

8. **Export functionality**
   - Export rates as CSV, JSON
   - Print-friendly view
   - Shareable links for specific currency pairs

## Low Priority
9. **Notifications/alerts**
   - Price alerts for specific rate thresholds
   - Email/push notification integration
   - Alert history

10. **Multi-language support**
    - Internationalization (i18n)
    - Currency names in multiple languages
    - Date/number formatting per locale

11. **Mobile app**
    - Progressive Web App (PWA) setup
    - Mobile-optimized UI
    - Offline functionality

12. **Analytics dashboard**
    - User interaction tracking
    - Popular currency pairs
    - Usage statistics

## Technical Debt
- Add comprehensive unit tests (Vitest)
- Add integration tests (Playwright)
- Improve accessibility (ARIA labels, keyboard navigation)
- Performance optimization (virtualized lists for large currency sets)
- Bundle size optimization (code splitting, lazy loading)
- SEO improvements (meta tags, structured data)

## Backend Integration
- User authentication (optional)
- User preferences sync across devices
- Historical data storage
- Rate change notifications

---

**Notes:**
- Current implementation uses mock data with the exact API structure provided
- Ready for real API integration when backend server is complete
- Built with React + TypeScript + Vite + Tailwind CSS for maintainability and scalability