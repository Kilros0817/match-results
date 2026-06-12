# Match Results

A production-quality Angular 21 application for displaying football match results with league selection, debounced search, KPI metrics, and detailed match views.

**Live Demo:** https://match-results.vercel.app/  

## Stack

- **Angular 21** (standalone components, strict mode)
- **TypeScript** with strict mode enabled
- **RxJS** with debouncing operators for search
- **Signals** for reactive state management (`signal`, `computed`, `effect`)
- **Vitest** for unit testing
- **SCSS** with CSS variables for theming
- **TheSportsDB API** for match data (free, no authentication)

## Quick Start

### Prerequisites
- Node.js 18+ with npm

### Installation & Running

```bash
# Install dependencies
npm install

# Start development server (http://localhost:4200)
npm start

# Run tests
npm test

# Check linting
npm run lint

# Build for production
npm run build
```

## Architecture

### Folder Structure
```
src/app/results/
├── components/
│   ├── results-list/          # Results list page with KPI tiles
│   ├── match-detail/          # Match detail page
│   ├── match-card/            # Reusable match card component
│   ├── kpi-tile/              # KPI metric tiles
│   ├── search-box/            # Debounced search input
│   ├── league-selector/       # League dropdown
│   └── state-message/         # Loading/error/empty states
├── services/
│   ├── match-api.service.ts   # Typed HTTP service
│   └── results-store.service.ts # State management
├── models/
│   └── match.model.ts         # TypeScript interfaces
├── constants/
│   └── league.constants.ts    # League configurations
└── results.routes.ts          # Lazy-loaded routes
```

## Features

✅ **Results List Page** (`/results`)
- League selector (6 major European leagues: Premier League, Bundesliga, Serie A, Ligue 1, La Liga, Belgian Pro League)
- Search with 300ms debounce for real-time filtering by team name
- KPI tiles showing: total matches, total goals, average goals per match
- Recent match results with score, date, and team information
- Responsive 2-column grid layout with smooth animations
- Loading, error, and empty states

✅ **Match Detail Page** (`/results/:id`)
- Comprehensive match information: teams, score, venue, season
- Multiple detail sections: overview, schedule, venue & attendance, teams
- Media gallery with available match photos/banners
- External links to related resources

✅ **Type Safety & State**
- Fully typed HTTP service with no `any` types
- Signals-based state management with reactive updates
- Computed signals for KPI calculations
- Debounced search handling at component level

✅ **Testing**
- 14 unit tests for KPI computations
- Tests cover: empty state, filtering, null handling, edge cases
- Tests verify all signals update correctly

## Design Decisions & Trade-offs

### No API Caching
- **Decision:** Fresh API call on each league change
- **Benefit:** Always shows current data, no staleness issues
- **Trade-off:** More API calls but within free tier limits

### Styling Approach
- **Decision:** BEM methodology with CSS variables for theming
- **Benefit:** Maintainable, scalable styling
- **Trade-off:** Slightly larger stylesheet (~5KB per detail view)

## Testing

```bash
# Run unit tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- results-list.component.spec.ts
```

**Test Coverage:**
- 14 unit tests for KPI computations
- Tests verify: totalMatches, totalGoals, averageGoals signals
- Tests cover: empty state, filtering, null handling, integration

## Deployment

The application is deployed to **Vercel** with continuous integration:

```bash
# Manual build
npm run build
```

## API Notes

- Uses **TheSportsDB** free API (test key: `3`)
- No authentication required

### Available Leagues
- English Premier League (ID: 4328)
- German Bundesliga (ID: 4331) - Default
- Italian Serie A (ID: 4332)
- French Ligue 1 (ID: 4334)
- Spanish La Liga (ID: 4335)
- Belgian Pro League (ID: 4338)

## Code Quality

- **Linting:** `npm run lint` → All files pass ESLint
- **Build:** `npm run build` → Production build with no errors/warnings
- **Tests:** `npm test` → 14 tests passing
- **TypeScript:** Strict mode enabled, no `any` types
