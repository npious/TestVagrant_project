# QA Automation Framework

End-to-end test automation for Web UI (SauceDemo) and API (Restful-Booker), built with Playwright + TypeScript and Jest + Supertest.

---

## Repository Structure

```
qa-automation/
├── ui/                          # Playwright UI tests
│   ├── fixtures/                # Extended test fixtures (base + auth)
│   ├── locators/                # All element selectors
│   ├── pages/                   # Page Object Model classes
│   ├── data/                    # Test data (reads from env)
│   ├── tests/                   # Test specs + auth setup
│   └── playwright.config.ts
├── api/                         # API tests
│   ├── clients/                 # HTTP client (BookerClient)
│   ├── schemas/                 # Zod response schemas
│   ├── types/                   # TypeScript interfaces
│   ├── data/                    # Payload factories
│   ├── utils/                   # Auth helper
│   ├── tests/                   # Test specs
│   └── jest.config.ts
├── .github/workflows/
│   └── test.yml                 # GitHub Actions pipeline
├── .env.example                 # Environment variable template
└── README.md
```

---

## Setup

### Prerequisites

- Node.js 20+
- npm 10+

### 1. Clone and install

```bash
git clone <repo-url>
cd qa-automation
npm install          # installs all workspaces
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```bash
# UI
BASE_URL=https://www.saucedemo.com
STANDARD_PASSWORD=<password>
USER_STANDARD=<username>
USER_LOCKED_OUT=<username>
USER_PROBLEM=<username>
USER_PERFORMANCE_GLITCH=<username>
USER_ERROR=<username>
USER_VISUAL=<username>

# API
BOOKER_BASE_URL=https://restful-booker.herokuapp.com
BOOKER_USERNAME=<username>
BOOKER_PASSWORD=<password>
```

### 3. Install Playwright browsers

```bash
# macOS / Windows
node_modules/.bin/playwright install chromium

# Linux (also installs system dependencies)
node_modules/.bin/playwright install --with-deps chromium
```

---

## Running Tests

### UI Tests

```bash
# All UI tests (headless)
cd ui && npm test

# Headed (watch the browser)
cd ui && npm run test:headed

# Debug mode
cd ui && npm run test:debug

# View last HTML report
cd ui && npm run test:report
```

### API Tests

```bash
cd api && npm test

# With coverage
cd api && npm run test:coverage
```

### Both suites from root

```bash
npm run test:all
```

---

## Framework Architecture

### UI — Page Object Model + Fixture Composition

```
Test file
  └── imports from fixtures/base.fixture.ts   (provides typed page objects)
        └── imports from fixtures/auth.fixture.ts  (provides storageState for pre-auth)
              └── Page classes (LoginPage, InventoryPage, CartPage, CheckoutPage)
                    └── Locator files (all selectors in one place)
```

**Key decisions:**
- **Locators isolated** in `locators/` — one place to update when the UI changes
- **`auth.fixture.ts`** saves browser session to `.auth/user.json` via Playwright's `storageState` — non-login tests skip the login step entirely (faster, less flaky)
- **`auth.setup.ts`** runs once as a Playwright "setup project" before all other tests
- All test data comes from `.env.local` — no credentials in source

### API — Client + Schema + Factory pattern

```
Test file
  └── BookerClient     (owns all HTTP calls, manages auth token)
  └── Zod schemas      (validates response shape, not just status codes)
  └── Data factories   (createBookingPayload(), updatedBookingPayload())
  └── Auth helper      (getAuthenticatedClient() — cached singleton per run)
```

**Key decisions:**
- `BookerClient` is stateful (holds token) — `authenticate()` stores it, `requireToken()` guards against unauthenticated calls
- Two delete methods: `deleteBooking()` (authenticated) and `deleteBookingWithoutAuth()` — negative tests call the right variant explicitly
- Zod schemas provide runtime type safety on top of status code assertions

---

## CI/CD Pipeline

**Trigger:** push/PR to `main` or `develop`, or manual dispatch with suite selector.

**Jobs run in parallel:**

| Job | Runner | Key steps |
|---|---|---|
| `ui-tests` | ubuntu-latest | Install deps → Cache browsers → Run Playwright → Upload HTML report |
| `api-tests` | ubuntu-latest | Install deps → Run Jest → Upload coverage |

**Artifacts retained for 14 days:**
- `playwright-report` — full HTML report with traces/screenshots
- `playwright-test-results` — raw results on failure only
- `api-coverage` — Jest coverage report

**GitHub Secrets required:**

| Secret | Used by |
|---|---|
| `STANDARD_PASSWORD` | UI |
| `USER_STANDARD` | UI |
| `USER_LOCKED_OUT` | UI |
| `USER_PROBLEM` | UI |
| `USER_PERFORMANCE_GLITCH` | UI |
| `USER_ERROR` | UI |
| `USER_VISUAL` | UI |
| `BOOKER_USERNAME` | API |
| `BOOKER_PASSWORD` | API |

**GitHub Variables required** (non-sensitive):

| Variable | Value |
|---|---|
| `BASE_URL` | `https://www.saucedemo.com` |
| `BOOKER_BASE_URL` | `https://restful-booker.herokuapp.com` |

---

## Team Onboarding

1. Clone the repo and run `npm install`
2. Copy `.env.example` → `.env.local` and fill in credentials (ask team lead)
3. Run `cd ui && npx playwright install --with-deps chromium`
4. Run `npm run test:all` from root to confirm everything passes
5. Read `ui/fixtures/base.fixture.ts` to understand how page objects are injected into tests
6. To add a new UI test: create a spec in `ui/tests/`, import from `fixtures/auth.fixture.ts` (pre-authenticated) or `fixtures/base.fixture.ts` (unauthenticated)
7. To add a new API test: create a spec in `api/tests/`, use `getAuthenticatedClient()` from `utils/auth.helper.ts`

---

## Test Coverage Summary

### UI (13 tests)

| Module | Positive | Negative |
|---|---|---|
| Login | Valid credentials → inventory page | Invalid password, locked user, empty fields |
| Product Catalog | Add to cart → badge updates, multi-item | No badge on empty cart |
| Checkout | Full checkout flow | Missing first name, last name, postal code |
| E2E | Login → Add to Cart → Checkout → Confirmation | — |

### API (15 tests)

| Endpoint | Positive | Negative |
|---|---|---|
| POST /auth | Valid creds → token | Invalid password, invalid username |
| GET /booking | Returns id list | — |
| GET /booking/:id | Valid id → booking schema | Non-existent id → 404 |
| POST /booking | Creates booking + schema validation | Without optional fields |
| PUT /booking/:id | Updates all fields | Without auth → 403 |
| DELETE /booking/:id | Deletes + verifies 404 | Without auth → 403 |
| E2E | Create → Update → Verify → Delete → Confirm gone | — |
