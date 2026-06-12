# Match Results

A production-quality Angular 21 feature for displaying football match results with league selection, search/filter capabilities, and detailed match views.

## Stack

- **Angular 21** (standalone components, no NgModules)
- **TypeScript** with strict mode enabled
- **RxJS** for asynchronous operations
- **Signals** for reactive state management
- **TheSportsDB API** for match data (free, no authentication required)

## Architecture

### Folder Structure

```
src/app/results/
├── results-list/              # Routed list page
├── match-detail/              # Routed detail page
├── components/
│   ├── kpi-tile/              # Reusable metric tile
│   ├── league-selector/       # Presentational league selector
│   ├── match-card/            # Presentational match card
│   ├── search-box/            # Presentational search input
│   └── state-message/         # Loading, empty, and error states
├── services/
│   └── match-api.service.ts   # Typed HTTP service with JSON fallback
├── models/
│   └── match.model.ts         # TypeScript interfaces for API responses
├── constants/
│   └── league.constants.ts    # League configurations
└── results.routes.ts          # Lazy-loaded feature routes
```

### Key Features

✅ **Results List Page** (`/results`)
- League selector (major European leagues)
- Display recent matches with team/league logos, scores, and dates
- Debounced team-name search
- Computed KPI tiles for total matches, total goals, and average goals
- Goals-per-match sort toggle
- Loading, error, and empty states
- Responsive grid layout

✅ **Match Detail Page** (`/results/:id`)
- Full match information from API
- Venue and season details
- Back navigation to results list

✅ **Typed HTTP Service**
- `MatchApiService` handles all API communication
- Strongly typed request/response interfaces
- Error handling with graceful fallbacks

✅ **Code Quality**
- Angular 21 standalone components with `OnPush` detection strategy
- Signals for state management (`signal()`, `computed()`)
- New control flow syntax (`@if`, `@for`)
- `inject()` for dependency injection
- ESLint configuration - all files pass linting
- Conventional Commits with logical separation

## Getting Started

### Prerequisites
- Node.js 18+ with npm

### Installation & Running

```bash
# Install dependencies
npm install

# Start development server (runs on http://localhost:4200)
npm start
```

The app will automatically reload when you modify source files.

### Building

```bash
# Build for production
npm run build
```

Output is in `dist/match-results/`

### Linting

```bash
# Check code quality
ng lint
```

## Developer Guide Compliance

This project strictly follows the team's Angular standards as defined in `DEVELOPER_GUIDE.md`:

- ✅ Standalone components only (no `NgModules`)
- ✅ `ChangeDetectionStrategy.OnPush` on all components
- ✅ Signals for state management
- ✅ New control flow syntax (`@if`, `@for`, `@switch`)
- ✅ `inject()` for dependency injection
- ✅ HTTP in dedicated service with typed interfaces
- ✅ Lazy-loaded standalone routes
- ✅ Strict TypeScript (no `any`, no non-null `!` operator)
- ✅ Clean lint with ESLint
- ✅ Conventional Commits

## Design Decisions & Trade-offs

### Senior Code Quality Focus
- Routed feature components live directly under the feature folder, matching `DEVELOPER_GUIDE.md`
- KPI values are derived from source signals with `computed()`
- Debounced search keeps UI state predictable without unnecessary recalculation
- API access stays isolated in a typed service with JSON fallback data

### API Error Handling
- If TheSportsDB API is down, the service falls back to local JSON under `public/assets/mock/`
- Users can still view match results during external API outages
- Retry buttons are provided for unrecoverable error states

### Data Flow
- League changes trigger a fresh typed HTTP request through `MatchApiService`
- Component state is stored with signals
- Filtered matches, visible matches, and KPIs are derived with `computed()`


## Notes for Reviewers

- Git history reflects small logical commits (not one big "final" commit)
- All components follow the BEM naming convention for CSS
- Service layer completely decoupled from UI
- Proper error handling for network failures
- Code is intentionally simple and readable over clever

## API Fallback

The application uses TheSportsDB API as the primary data source.

If TheSportsDB is unavailable during development or review, the app automatically falls back to local JSON files under `public/assets/mock/`. These files use the same top-level `events` response shape as TheSportsDB, so the UI can continue rendering match results without external API availability blocking the task.
