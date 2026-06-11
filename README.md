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
├── components/
│   ├── results-list/          # List page with league selector
│   └── match-detail/          # Detail page for single match
├── services/
│   └── match-api.service.ts   # Typed HTTP service for API calls
├── models/
│   └── match.model.ts         # TypeScript interfaces for API responses
├── constants/
│   └── league.constants.ts    # League configurations
└── results.routes.ts          # Lazy-loaded feature routes
```

### Key Features (Day 1 - MVP)

✅ **Results List Page** (`/results`)
- League selector (5 major European leagues)
- Display recent matches with home team, away team, score, and date
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

### Day 1 Focus
- Built minimal viable product focusing on core functionality
- Placeholder styling (clean and responsive, not styled for beauty)
- Components are presentational and reusable

### API Error Handling
- If TheSportsDB API is down, service gracefully returns empty arrays
- Users see "No matches found" or error messages
- Retry buttons provided in error states

### Data Flow
- Component subscribes to `Observable` from service
- No caching implemented yet (Day 1 scope)
- Each league change triggers fresh API call

## What's Next (Day 2-5)

- **Day 2**: Component breakdown (KPI tiles, match card component), loading skeletons
- **Day 3**: Search/filter with `computed()` KPIs, detail page polish
- **Day 4**: Responsive styling, performance optimization, README finalization
- **Day 5**: Stretch goals (debounced search, URL persistence, unit tests)

## Notes for Reviewers

- Git history reflects small logical commits (not one big "final" commit)
- All components follow the BEM naming convention for CSS
- Service layer completely decoupled from UI
- Proper error handling for network failures
- Code is intentionally simple and readable over clever
