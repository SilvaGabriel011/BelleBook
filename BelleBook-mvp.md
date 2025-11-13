BelleBook
=========

Executive Summary
-----------------

BeautyBooker é um app mobile MVP (React Native + TypeScript) para agendamento de serviços de beleza. Inclui roles Customer e ServiceProvider, catálogo de serviços e estilos com imagens e favoritos, reserva baseada em disponibilidade do profissional, autenticação passwordless com JWT, pagamentos via Stripe (pay\_on\_site / pay\_now com desconto antecipado global de 10%), integração com Google Calendar (OAuth) para sincronizar eventos de booking, armazenamento em PostgreSQL, file storage S3 e filas Redis para tarefas assíncronas. Objetivo: lançar MVP com fluxo completo de catálogo → reserva → pagamento opcional → sincronização de calendário e histórico de bookings em ~340 horas de desenvolvimento estimadas.

Core Functionalities
--------------------

*   **User Authentication & Profiles:** Passwordless JWT authentication, user and provider profiles with avatars and settings (Priority: **High**)
    
*   **Service Catalog & Favorites:** Categorized services and style cards (images, price, likes) with favorite functionality (Priority: **High**)
    
*   **Booking & Scheduling:** Select style, view provider availability in provider timezone, reserve, cancel, reschedule, and booking history (Priority: **High**)
    
*   **Calendar Sync & Notifications:** Google Calendar OAuth integration for provider/customer, create/update/delete events, email/push reminders (Priority: **Medium**)
    
*   **Payments & Discounts:** Stripe integration for pay\_now/pay\_on\_site with global early-payment discount and webhook handling (Priority: **Medium**)
    

Personas
--------

*   **Customer (Beauty Client)** – Books services via mobile app to find and reserve beauty styles from providers.
    
    **Goals:** Find suitable styles quickly, Book and pay for appointments easily
    
    **Pain Points:** Unclear provider availability, Complex booking/payment flows
    
    **Key Tasks:** Browse catalog, view style details, book slot, manage bookings
    
*   **Service Provider (Professional)** – Manages availability, services/styles, and connects calendar for bookings.
    
    **Goals:** Fill schedule with bookings, Manage availability and client communication
    
    **Pain Points:** Double-booking across calendars, Complex schedule management
    
    **Key Tasks:** Set availability, accept bookings, sync Google Calendar
    
*   **App Administrator / Ops** – Maintains platform, monitors payments, handles disputes and content moderation.
    
    **Goals:** Ensure platform reliability and security, Resolve payment/refund issues promptly
    
    **Pain Points:** Handling escalations and fraudulent activity, Managing provider verifications
    
    **Key Tasks:** Monitor system, manage users/providers, review reports
    
*   **Guest / New User** – Explores app without creating an account; may sign up after browsing.
    
    **Goals:** Evaluate services/providers quickly, Signup with minimal friction
    
    **Pain Points:** Forced signup before browsing, Insufficient info to decide
    
    **Key Tasks:** Browse catalog, view styles, sign up
    

Stakeholders
------------

*   **Project Management Team:** Oversees project timeline, deliverables, and resource allocation.
    
*   **Development Team:** Includes Frontend, Backend, and DevOps engineers responsible for product development.
    
*   **Quality Assurance (QA) Team:** Ensures the product meets quality standards through testing.
    
*   **Design Team:** Responsible for UX/UI design and prototyping.
    
*   **Product Owner / Client:** Defines product vision, priorities, and acceptance criteria.
    
*   **Service Providers (Professionals):** End users who offer services and manage availability and bookings.
    
*   **End Customers:** Users booking services via the app; provide feedback and usage data.
    
*   **DevOps / Infrastructure Team:** Manages deployment, scaling, monitoring, and security of infrastructure.
    
*   **Payments & Legal Team:** Handles payment integration compliance, refunds, payments disputes, and legal requirements.
    
*   **Support & Operations:** Handles customer service, booking issues, and onboarding providers.
    

Tech Stack
----------

*   **Frontend:** React, Tailwind RN
    
*   **Mobile Development:** React Native, Expo
    
*   **Frontend/Backend:** TypeScript
    
*   **Navigation:** React Navigation
    
*   **User Authentication:** Firebase Authentication
    
*   **Database:** Firestore
    
*   **Backend:** Cloud Functions (Firebase)
    
*   **Calendar Integration:** Google Calendar API
    
*   **Payment Processing:** Stripe
    
*   **Storage:** Firebase Cloud Storage
    
*   **Error Monitoring:** Sentry
    
*   **State Management:** Redux
    

Project Timeline
----------------

Tasks are categorized by complexity to guide time estimations: XS, S, M, L, XL, XXL.

**Roles:**

*   **Frontend Developer** (FE)
    
*   **Backend Developer** (BE)
    
*   **DevOps Engineer** (DevOps)
    
*   **QA Engineer** (QA)
    

### **Milestone 1: Setup: repo, env, CI/CD, DB, Google Calendar API config, design system**

_Estimated 44.5 hours_

*   **Configure Environment:** As a: DevOps engineer, I want to: configure environment variables and local dev environment settings, So that: the project can run with consistent configurations across environments**(7 hours)** - Environment variables are defined in a central config file and loaded at runtime Locally and in CI, the app starts without configuration errors Validation checks confirm required keys exist and have non-empty values
    
    *   Create central env config file \`apps/api/config/env.ts\` - define keys and types (NODE\_ENV, FIREBASE\_API\_KEY, STRIPE\_KEY) - (M) (1 hours)\[FE\]\[BE\]\[DevOps\]
        
    *   Add runtime env loader in \`apps/api/src/index.ts\` to import \`apps/api/config/env.ts\` and apply process.env - (M) (1 hours)\[FE\]\[BE\]\[DevOps\]
        
    *   Implement validation helpers in \`apps/api/config/validateEnv.ts\` to check required keys non-empty and throw descriptive errors - (M) (1 hours)\[FE\]\[BE\]\[DevOps\]\[QA\]
        
    *   Add .env.example at \`apps/api/.env.example\` with required keys and placeholder values - (M) (1 hours)\[FE\]\[BE\]
        
    *   Create CI workflow \` .github/workflows/ci.yml\` to set env secrets and run startup checks for \`apps/api\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Write unit tests for validation in \`apps/api/tests/validateEnv.test.ts\` to assert missing/empty key failures - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   Add startup smoke test in \`apps/api/tests/startup.test.ts\` that imports \`apps/api/src/index.ts\` and ensures app starts without config errors - (M) (1 hours)\[FE\]\[BE\]\[DevOps\]\[QA\]
        
*   **Setup Repository:** As a: DevOps engineer, I want to: initialize and configure the repository structure and access controls, So that: versioned code and secure access are ready for development**(2.5 hours)** - Repository initialized with standard folders (src, tests, docs) Access controls and branch protection rules enforced README and contributing guidelines present and validated
    
    *   Repo: Initialize repository and create folders \`apps/api/src\`, \`apps/api/tests\`, \`docs/\` in \`.gitignore\` and project root - (XS) (0.5 hours)\[FE\]\[BE\]\[QA\]
        
    *   Infra: Add branch protection rules config in \`.github/branch-protection.yml\` and GitHub Actions \`/.github/workflows/ci.yml\` - (S) (0.5 hours)\[FE\]\[DevOps\]
        
    *   Docs: Create README.md and CONTRIBUTING.md at project root and add validation script \`scripts/validate\_docs.ts\` - (XS) (0.5 hours)\[FE\]\[QA\]
        
    *   CI: Implement CI check in \`/.github/workflows/ci.yml\` to run \`node scripts/validate\_docs.js\` and tests in \`apps/api/tests\` - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   Access: Configure CODEOWNERS and add access rules in \`.github/CODEOWNERS\` and \`/.github/branch-protection.yml\` - (S) (0.5 hours)\[FE\]\[DevOps\]
        
*   **Initialize Dependencies:** As a: Developer, I want to: install and lock project dependencies, So that: builds are reproducible and environments stable**(7 hours)** - Dependency lockfile generated (package-lock.json/yarn.lock) All dependencies install without errors in local and CI Vulnerability scan passes or is addressed
    
    *   INFRA: Initialize monorepo package.json in \`package.json\` and \`apps/api/package.json\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   DEV: Install dependencies and generate lockfile by running \`npm install\` in project root producing \`package-lock.json\` - (M) (1 hours)\[FE\]
        
    *   CI: Add CI workflow to \`.github/workflows/install.yml\` to run \`npm ci\` and cache node\_modules - (M) (1 hours)\[FE\]
        
    *   SECURITY: Add vulnerability scan step in \`.github/workflows/install.yml\` using \`npm audit --audit-level=moderate\` or Snyk CLI - (M) (1 hours)\[FE\]
        
    *   DEV: Fix vulnerabilities via \`package.json\` updates and lockfile regeneration in \`apps/api/package.json\` and root \`package.json\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   QUALITY: Add verification script in \`scripts/verify-deps.sh\` to validate installs locally and in CI - (M) (1 hours)\[FE\]
        
    *   DOCS: Document dependency install steps and CI expectations in \`docs/dependencies.md\` - (M) (1 hours)\[FE\]
        
*   **Setup CI Pipeline:** As a: DevOps engineer, I want to: configure continuous integration workflow, So that: every change is automatically tested and validated**(7 hours)** - CI pipeline runs on push and PRs Tests pass in CI for main platforms Artifacts for build validated and stored
    
    *   CI: Create GitHub Actions workflow in \`.github/workflows/ci.yml\` to run on push and pull\_request - (M) (1 hours)\[FE\]
        
    *   Testing: Add cross-platform test matrix in \`.github/workflows/ci.yml\` with Linux, macOS, Windows jobs running \`scripts/run\_tests.sh\` - (M) (1 hours)\[FE\]\[QA\]
        
    *   Scripts: Implement test runner in \`scripts/run\_tests.sh\` that installs deps and runs \`npm test\` - (M) (1 hours)\[FE\]\[QA\]
        
    *   Build: Add build script \`scripts/build\_artifact.sh\` producing artifacts and placing them in \`artifacts/\` - (M) (1 hours)\[FE\]
        
    *   CI: Add artifact upload step in \`.github/workflows/ci.yml\` calling \`ci/upload\_artifacts.ts\` to validate and store artifacts - (M) (1 hours)\[FE\]
        
    *   CI: Implement artifact upload helper in \`ci/upload\_artifacts.ts\` to validate artifact checksums and upload to storage - (M) (1 hours)\[FE\]
        
    *   Docs: Update \`README.md\` with CI status badge and CI run instructions in \`README.md\` - (M) (1 hours)\[FE\]
        
*   **Initialize Database:** As a: Admin, I want to: provision and seed the database, So that: development and tests have ready data and structure**(5 hours)** - Database schema matches design Seed data loaded and verifiable Migrations run reliably in CI/local
    
    *   DB: Create users migration in \`prisma/migrations/20251110\_create\_users.sql\` - (M) (1 hours)\[FE\]
        
    *   DB: Add User model in \`apps/api/services/db/models/User.ts\` with fields matching \`table\_users\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   DB: Implement seed script in \`scripts/seed.ts\` to load initial users into \`table\_users\` - (M) (1 hours)\[FE\]
        
    *   CI: Add migration run step in \`.github/workflows/ci.yml\` to execute \`prisma migrate deploy\` and \`ts-node scripts/seed.ts\` - (M) (1 hours)\[FE\]\[DevOps\]
        
    *   TEST: Create migration and seed verification test in \`tests/db/migrations.test.ts\` - (M) (1 hours)\[FE\]\[QA\]
        
*   **Configure Dev Tooling:** As a: Developer, I want to: configure local development tools (linters, formatters, IDE configs), So that: coding standards are enforced and developer experience is improved**(3 hours)** - Tooling configurations present and validated CI/CD uses same lint rules Developers can run lints locally without errors
    
    *   Config: Add ESLint config \`.eslintrc.js\` at project root \`/.eslintrc.js\` - (S) (0.5 hours)\[FE\]\[DevOps\]
        
    *   Config: Add Prettier config \`.prettierrc\` at project root \`/ .prettierrc\` - (S) (0.5 hours)\[FE\]\[DevOps\]
        
    *   CI: Update CI workflow \`apps/api/.github/workflows/ci.yml\` to run lint using \`npm run lint\` and cache node\_modules - (M) (1 hours)\[FE\]\[BE\]
        
    *   Validation: Add local pre-commit hook in \`hooks/pre-commit\` and Husky config in \`package.json\` to run lint and tests - (M) (1 hours)\[FE\]\[DevOps\]\[QA\]
        
*   **Database Migration: (6 hours)** - Story functionality is implemented as specified User interface is responsive and accessible Data is properly validated and stored Error handling provides helpful feedback
    
    *   DB: Create users table migration in \`prisma/migrations/20251110\_create\_users\_table/\` - (M) (1 hours)\[FE\]
        
    *   API: Implement migration runner in \`apps/api/functions/migrate.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Model: Add User model in \`apps/api/models/User.ts\` with validation and relations - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   Frontend: Build MigrationStatus component in \`components/admin/MigrationStatus.tsx\` responsive and accessible - (M) (1 hours)\[FE\]
        
    *   Testing: Add migration integration tests in \`tests/migrations.test.ts\` - (M) (1 hours)\[FE\]\[QA\]
        
    *   Docs: Write migration run instructions in \`docs/migrations.md\` and update CHANGELOG.md - (M) (1 hours)\[FE\]
        
*   **Configure Monitoring: (7 hours)** - Story functionality is implemented as specified User interface is responsive and accessible Data is properly validated and stored Error handling provides helpful feedback
    
    *   Infra: Initialize Sentry in \`apps/api/src/sentry.ts\` and \`apps/web/src/sentry.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement metrics Cloud Function in \`apps/api/functions/metrics.ts\` to record errors and performance to Firestore\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   DB: Create monitoring collection rules in \`apps/api/firestore.rules\` and seed dashboard docs in \`apps/api/seeds/monitoringSeed.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Build MonitoringDashboard component in \`apps/web/components/monitoring/Dashboard.tsx\` with responsive accessible UI\` - (M) (1 hours)\[FE\]
        
    *   API: Add telemetry helper in \`apps/api/utils/telemetry.ts\` and integrate into \`apps/api/services/auth/AuthService.ts\` for error reporting\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Infra: Add Sentry DSN and monitoring env to \`apps/api/.github/workflows/deploy.yml\` and \`apps/web/.github/workflows/deploy.yml\` - (M) (1 hours)\[FE\]\[BE\]\[DevOps\]
        
    *   Testing: Create integration tests in \`apps/api/tests/metrics.test.ts\` and \`apps/web/tests/dashboard.test.ts\` to validate data flow and error handling\` - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        

### **Milestone 2: User Onboarding & Authentication: signup/login, onboarding tour, profile basics, favorites**

_Estimated 239 hours_

*   **Welcome Tour:** As a: new visitor, I want to: take a guided tour of the app features, So that: I understand core functions and benefits of onboarding.**(9 hours)** - User completes the welcome tour sequence Tour steps are accessible from main onboarding screen Tour progress is persisted if app is closed and resumed System tracks which features are highlighted during tour No crash or performance degradation during tour playback
    
    *   API: Add startWelcomeTour and updateOnboardingStatus mutations in \`apps/api/routes/onboarding/onboardingRouter.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement OnboardingService methods in \`apps/api/services/onboarding/OnboardingService.ts\` to persist tour progress - (M) (1 hours)\[FE\]\[BE\]
        
    *   DB: Create onboarding\_progress migration in \`apps/api/db/migrations/20251110\_create\_onboarding\_progress.sql\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Build WelcomeTour component in \`apps/mobile/components/onboarding/WelcomeTour.tsx\` - (M) (1 hours)\[FE\]
        
    *   Frontend: Integrate WelcomeTour into /OnboardingPage route in \`apps/mobile/screens/OnboardingPage.tsx\` and connect to comp\_onboardingPage\_hero (comp\_onboardingPage\_hero) - (M) (1 hours)\[FE\]
        
    *   Frontend: Persist and resume tour state in \`apps/mobile/store/onboardingSlice.ts\` (Redux) and sync with \`apps/api/services/onboarding/OnboardingService.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Instrumentation: Track highlighted features during tour in \`apps/api/routes/onboarding/onboardingRouter.ts\` recordCTAClick mutation and \`apps/api/services/analytics/AnalyticsService.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Testing: Add unit tests for OnboardingService in \`apps/api/services/onboarding/\_\_tests\_\_/OnboardingService.test.ts\` and component tests for WelcomeTour in \`apps/mobile/components/onboarding/\_\_tests\_\_/WelcomeTour.test.tsx\` - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   Quality: Add e2e test for tour playback in \`apps/mobile/e2e/onboarding.spec.ts\` and add Sentry config in \`apps/mobile/config/sentry.ts\` to monitor performance - (M) (1 hours)\[FE\]\[DevOps\]\[QA\]
        
*   **Sign Up:** As a: new visitor, I want to: create an account with email and password, So that: I can access personalized features and save my preferences.**(12 hours)** - User can register with valid email and strong password System validates email format and password strength Duplicate email is rejected with clear message Welcome/email verification sent within 2 minutes Account data stored securely in database
    
    *   DB: Create users migration in \`prisma/migrations/20251110\_create\_users\` - (M) (1 hours)\[FE\]
        
    *   API: Implement signUp mutation in \`apps/api/routers/onboarding/onboardingRouter.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement createUser() in \`apps/api/services/auth/AuthService.ts\` with email duplicate check - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Add sendVerificationEmail() Cloud Function in \`apps/api/functions/sendVerificationEmail.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Build SignUpForm component in \`apps/web/components/onboarding/SignUpForm.tsx\` - (M) (1 hours)\[FE\]
        
    *   Frontend: Add route /onboardingPage Sign Up integration in \`apps/web/routes/OnboardingPage.tsx\` (route\_onboardingPage) - (M) (1 hours)\[FE\]
        
    *   Frontend: Implement email & password validation utils in \`apps/web/utils/validation.ts\` - (M) (1 hours)\[FE\]\[QA\]
        
    *   API: Store account securely in users table via \`apps/api/services/auth/AuthService.ts\` using Firestore/Firestore SDK - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Return clear duplicate-email error from \`apps/api/routers/onboarding/onboardingRouter.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Infra: Configure email provider and SMTP secrets in \`apps/api/.env\` and CI/CD secrets - (M) (1 hours)\[FE\]\[BE\]\[DevOps\]
        
    *   Testing: Add integration tests for signUp flow in \`apps/api/tests/signUp.test.ts\` and \`apps/web/tests/SignUpForm.test.tsx\` - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   Docs: Document Sign Up API and component in \`docs/onboarding/sign\_up.md\` - (M) (1 hours)\[FE\]\[BE\]
        
*   **Connect Google Calendar:** As a: registered user, I want to: connect my Google Calendar account, So that: I can sync events and improve scheduling.**(7 hours)** - OAuth flow completes with user approval Calendar events are synced within 60 minutes of connection Permissions scopes requested are minimized and documented Error handling for failed connections shows user-friendly message Connection status stored securely in user profile
    
    *   API: Add connectGoogleCalendar mutation handler in \`apps/api/routes/onboarding/connectGoogleCalendar.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement Google OAuth service in \`apps/api/services/google/GoogleService.ts\` requesting minimal scopes - (M) (1 hours)\[FE\]\[BE\]
        
    *   DB: Store connection status and tokens in \`apps/api/services/user/UserService.ts\` updating table\_users (\`table\_users\`) securely - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Build ConnectGoogleButton component in \`components/onboarding/ActionsPanel/ConnectGoogleButton.tsx\` (route\_onboardingPage -> comp\_onboardingPage\_actions) - (M) (1 hours)\[FE\]
        
    *   Infra: Create Cloud Function syncCalendar in \`apps/api/functions/syncCalendar.ts\` to sync events within 60 minutes - (M) (1 hours)\[FE\]\[BE\]
        
    *   Quality: Add error handling and user-friendly messages in \`components/onboarding/ActionsPanel/ConnectGoogleButton.tsx\` and \`apps/api/routes/onboarding/connectGoogleCalendar.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Doc: Document requested scopes and security in \`docs/integrations/google\_calendar.md\` - (M) (1 hours)\[FE\]
        
*   **Favorites Intro:** As a: registered user, I want to: see and manage my favorites, So that: I can easily access preferred items and improve discovery.**(12 hours)** - Favorites list loads without delay User can remove items from favorites Favorites persist across sessions Edge case: empty favorites shows helpful empty state Data persisted in user profile with sync to backend
    
    *   Frontend: Build FavoritesList component in \`components/onboarding/FavoritesList.tsx\` (route\_onboardingPage, comp\_onboardingPage\_main) - (M) (1 hours)\[FE\]
        
    *   Frontend: Add RemoveFavorite button and handler in \`components/onboarding/FavoritesList.tsx\` (comp\_onboardingPage\_main) - (M) (1 hours)\[FE\]
        
    *   API: Implement fetchFavoritesIntro query in \`apps/api/routes/onboardingPage.ts\` (router\_route\_onboardingPage) - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement toggleFavorite mutation in \`apps/api/routes/onboardingPage.ts\` (router\_route\_onboardingPage) - (M) (1 hours)\[FE\]\[BE\]
        
    *   DB: Create favorites table migration in \`prisma/migrations/20251110\_create\_favorites.sql\` (table\_favorites, table\_users, table\_services) - (M) (1 hours)\[FE\]\[BE\]
        
    *   Backend: Persist favorites to users profile in \`apps/api/services/favorites/FavoritesService.ts\` (router\_route\_onboardingPage, table\_favorites) - (M) (1 hours)\[FE\]\[BE\]
        
    *   Sync: Add Cloud Function to sync favorites to backend in \`functions/syncFavorites/index.ts\` (table\_favorites) - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Load favorites with optimized caching in \`components/onboarding/FavoritesList.tsx\` using Redux store (route\_onboardingPage, comp\_onboardingPage\_main) - (M) (1 hours)\[FE\]
        
    *   Frontend: Implement EmptyState view in \`components/onboarding/FavoritesEmpty.tsx\` and integrate in \`components/onboarding/FavoritesList.tsx\` (comp\_onboardingPage\_main) - (M) (1 hours)\[FE\]
        
    *   Testing: Add unit tests for FavoritesList in \`\_\_tests\_\_/components/onboarding/FavoritesList.test.tsx\` (testing) - (M) (1 hours)\[FE\]\[QA\]
        
    *   Testing: Add integration tests for API routes in \`apps/api/\_\_tests\_\_/onboardingPage.test.ts\` (router\_route\_onboardingPage) - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   Docs: Document persistence and API usage in \`docs/onboarding/favorites.md\` (documentation) - (M) (1 hours)\[FE\]\[BE\]
        
*   **Browse Catalog:** As a: registered user, I want to: browse the product catalog, So that: I can discover items to add to favorites or cart.**(11 hours)** - Catalog loads quickly under 2 seconds Search and filter work with no errors Items display with correct pricing and availability No broken images or dead links User can add items to favorites or cart from catalog
    
    *   API: Implement fetchCatalog query in \`apps/api/routes/onboardingPage.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Add toggleFavorite mutation in \`apps/api/routes/onboardingPage.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   DB: Add services and favorites migrations in \`prisma/migrations/\` for \`table\_services\` and \`table\_favorites\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Build CatalogList component in \`components/catalog/CatalogList.tsx\` using \`route\_onboardingPage\` and \`comp\_onboardingPage\_main\` props - (M) (1 hours)\[FE\]
        
    *   Frontend: Build SearchBar in \`components/catalog/SearchBar.tsx\` integrating with CatalogList - (M) (1 hours)\[FE\]
        
    *   Frontend: Implement FavoriteButton in \`components/catalog/FavoriteButton.tsx\` calling \`router\_route\_onboardingPage.toggleFavorite\` - (M) (1 hours)\[FE\]
        
    *   Frontend: Implement AddToCartButton in \`components/cart/AddToCartButton.tsx\` to add items from catalog - (M) (1 hours)\[FE\]
        
    *   Frontend: Add ImageWithFallback in \`components/common/ImageWithFallback.tsx\` to avoid broken images and dead links - (M) (1 hours)\[FE\]
        
    *   API: Implement caching in \`apps/api/services/cache/CatalogCache.ts\` to ensure catalog loads <2s - (M) (1 hours)\[FE\]\[BE\]
        
    *   QA: Add unit and e2e tests in \`tests/catalog/\` for search, filter, pricing, availability - (M) (1 hours)\[FE\]\[QA\]
        
    *   Infra: Add Sentry monitoring integration in \`utils/monitoring/sentry.ts\` and config in \`apps/api/config/\` - (M) (1 hours)\[FE\]\[BE\]\[DevOps\]
        
*   **Enter Email:** As a: registered user, I want to: enter my email address on the login flow, So that: I can be uniquely identified for authentication**(4.5 hours)** - Email field accepts valid email formats Invalid emails show clear error messages Email is persisted to the current session and used for authentication System validates email against existing user records to prevent duplicates on signup Email is transmitted securely
    
    *   Frontend: Implement EmailForm component in components/auth/EmailForm.tsx that validates email formats in real-time, displays inline errors, and interfaces with login flow. Ensure accessible UI and unit-level validation hooks; integrate with existing form patterns and error handling conventions. - (S) (0.5 hours)\[FE\]\[QA\]
        
    *   API: Implement validateEmail(email) in apps/api/services/auth/AuthService.ts that checks email format and queries table\_users to prevent duplicates during registration/login, returning a boolean or error state used by downstream flows. - (M) (1 hours)\[FE\]\[BE\]
        
    *   DB: Add email unique constraint migration for table\_users in prisma/migrations/ to enforce uniqueness at the DB level, including rollback notes and index creation. - (S) (0.5 hours)\[FE\]
        
    *   API: Persist email to session in apps/api/services/session/SessionService.ts after authentication to keep user context across requests, ensuring session storage backend compatibility. - (M) (1 hours)\[FE\]\[BE\]
        
    *   Security: Ensure secure transmission — enforce HTTPS and use apps/api/middleware/security.ts to validate TLS and headers (documentation, testing) - (S) (0.5 hours)\[FE\]\[BE\]\[QA\]
        
    *   Testing: Create unit tests for components/auth/EmailForm.tsx and apps/api/services/auth/AuthService.ts in tests/ to cover validation, API interaction, and error handling. - (S) (0.5 hours)\[FE\]\[BE\]\[QA\]
        
    *   Docs: Update README and API docs for email flow in docs/auth/EMAIL\_FLOW.md detailing flow, endpoints, and security considerations. - (XS) (0.5 hours)\[FE\]\[BE\]
        
*   **Quick Onboarding:** As a: new user, I want to: complete a swift onboarding sequence during login, So that: I can start using the app with minimal friction**(4.5 hours)** - Onboarding steps are presented sequentially Each step saves progress in session User can skip or complete onboarding On completion, user is navigated to main app area No data loss on navigation
    
    *   Frontend: Implement OnboardingStep1 screen at apps/mobile/screens/onboarding/OnboardingStep1.tsx using existing design tokens and navigation hooks; ensure state init and validation hooks ready for Step 2 transition. - (S) (0.5 hours)\[FE\]\[QA\]
        
    *   Frontend: Implement OnboardingStep2 screen at apps/mobile/screens/onboarding/OnboardingStep2.tsx with form fields to collect additional user data; integrate local validation and progress update. - (S) (0.5 hours)\[FE\]\[BE\]\[QA\]
        
    *   Frontend: Create OnboardingContainer at apps/mobile/screens/onboarding/OnboardingContainer.tsx to orchestrate sequence of onboarding steps with conditional rendering and a skip path. - (M) (1 hours)\[FE\]
        
    *   Service: Implement session save/load in apps/mobile/services/session/SessionService.ts to persist onboarding progress in local storage or secure storage and retrieve on app resume. - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   API: Add onboarding progress endpoint in apps/api/services/auth/AuthService.ts to persist to Firestore - (M) (1 hours)\[FE\]\[BE\]
        
    *   Navigation: Update apps/mobile/navigation/AppNavigator.tsx to handle skip and completion navigation to main app - (S) (0.5 hours)\[FE\]
        
    *   DB: Create Firestore collection rule doc in docs/firestore/onboarding\_collections.md referencing table\_users and table\_sessions (table\_sessions) - (XS) (0.5 hours)\[FE\]
        
    *   Testing: Add onboarding tests in apps/mobile/\_\_tests\_\_/onboarding.test.ts - (XS) (0.5 hours)\[FE\]\[QA\]
        
*   **Persist Session:** As a: user, I want to: persist session across app restarts, So that: I remain logged in and personalized without re-authenticating**(10 hours)** - Session token is created and stored securely Session persists across app restarts Logout clears session data Session data is protected at rest and in transit Recovery from token expiry handles re-authentication gracefully
    
    *   DB: Create login\_tokens migration in \`prisma/migrations/\` to store refreshToken, expiresAt (table\_login\_tokens) - (M) (1 hours)\[FE\]
        
    *   API: Implement createSessionToken() in \`apps/api/services/auth/AuthService.ts\` to issue tokens and persist to \`table\_login\_tokens\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Add refreshToken endpoint in \`apps/api/routes/auth.ts\` to validate and rotate tokens - (M) (1 hours)\[FE\]\[BE\]
        
    *   Client: Implement SessionStorage in \`apps/mobile/services/session/SessionStorage.ts\` using SecureStore/Keychain encrypted storage - (M) (1 hours)\[FE\]\[BE\]
        
    *   Client: Build useSession hook in \`apps/mobile/hooks/useSession.tsx\` to load session on startup and expose login/logout - (M) (1 hours)\[FE\]
        
    *   Client: Update LoginForm to persist token in \`components/auth/LoginForm.tsx\` via SessionStorage.save()\` - (M) (1 hours)\[FE\]
        
    *   Client: Implement logout() in \`apps/mobile/services/session/SessionStorage.ts\` and \`components/auth/LogoutButton.tsx\` to clear stored tokens - (M) (1 hours)\[FE\]\[BE\]
        
    *   Client: Add token refresh logic in \`apps/mobile/services/session/SessionRefresh.ts\` to call \`/auth/refresh\` and update \`SessionStorage.ts\` on expiry - (M) (1 hours)\[FE\]\[BE\]
        
    *   Security: Ensure transport security: enforce HTTPS in \`apps/api/middleware/secureTransport.ts\` and use Firebase Auth flows (table\_users) - (M) (1 hours)\[FE\]\[BE\]
        
    *   Testing: Add integration tests in \`apps/api/tests/auth.test.ts\` and \`apps/mobile/tests/session.test.ts\` for persistence, expiry, and logout - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
*   **Accept TOS:** As a: user, I want to: accept terms of service during login flow, So that: I agree to platform rules before proceeding**(6.5 hours)** - User can toggle to accept TOS Acceptance is required to continue Acceptance status is stored in user session System logs acceptance event for compliance No progression if not accepted
    
    *   Frontend: Build TOSCheckbox component in components/auth/TOSCheckbox.tsx (toggle UI) preserving architecture labels and ensuring integration with LoginForm. Implement with React/TSX, wiring to form state and TOS acceptance flag. - (S) (0.5 hours)\[FE\]
        
    *   Frontend: Update LoginForm to require TOS in components/auth/LoginForm.tsx (disable continue if not accepted) aligning with frontend validation flow and UX patterns. - (S) (0.5 hours)\[FE\]\[QA\]
        
    *   API: Add acceptTOS(userId, accepted) in apps/api/services/auth/AuthService.ts (store flag in users doc) implementing a write to user record flag indicating TOS acceptance. - (M) (1 hours)\[FE\]\[BE\]
        
    *   DB: Add accepted\_tos field to users table via migration in prisma/migrations/ (table\_users) - (S) (0.5 hours)\[FE\]
        
    *   Session: Persist TOS acceptance to session in apps/api/services/session/SessionService.ts (table\_sessions) - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   Logging: Implement Cloud Function acceptTOSLogger in apps/api/functions/logs/AcceptanceLogger.ts to write audit event to Firestore (compliance) - (M) (1 hours)\[FE\]\[BE\]
        
    *   Middleware: Enforce TOS acceptance in middleware/auth.ts (prevent progression when not accepted) - (M) (1 hours)\[FE\]
        
    *   Testing: Add unit tests for AuthService.acceptTOS in apps/api/services/auth/\_\_tests\_\_/AuthService.test.ts (api\_development, testing) - (S) (0.5 hours)\[FE\]\[BE\]\[QA\]
        
    *   E2E: Add acceptance flow e2e test in tests/e2e/acceptTOS.spec.ts (frontend\_component, testing) - (M) (1 hours)\[FE\]\[QA\]
        
*   **Enter Name:** As a: registered user, I want to: enter my full name on the login flow, So that: my profile can be associated with real identity for personalized experiences**(5.5 hours)** - User can input a valid full name without errors Name field enforces max length and trims whitespace System stores the name and associates with user record on submission Edge case: short or empty input is rejected with helpful message Data is transmitted securely to server
    
    *   DB: Create users table migration in prisma/migrations/create\_users.sql preserving architecture: DB migrations for User entity in Prisma. Ensure script creates users with id, name fields and timestamps. - (S) (0.5 hours)\[FE\]
        
    *   API: Add POST /user/name handler in apps/api/routes/user.ts to accept userId and name, validate inputs, call AuthService.saveUserName, return success payload. - (M) (1 hours)\[FE\]\[BE\]
        
    *   Backend: Implement saveUserName(userId, name) in apps/api/services/auth/AuthService.ts to persist the user name in DB and return updated user object. - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Build NameInput component in components/auth/NameInput.tsx to collect user name with validation hooks and propagate via onChange. - (XS) (0.5 hours)\[FE\]\[QA\]
        
    *   Frontend: Integrate NameInput into Login screen screens/auth/LoginScreen.tsx to populate name in login flow and pass to API. - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   Validation: Add name validation util in utils/validation/nameValidator.ts and tests in tests/unit/nameValidation.test.ts to enforce name rules. - (XS) (0.5 hours)\[FE\]\[QA\]
        
    *   Security: Ensure HTTPS and secure transmission in apps/api/middleware/security.ts to enforce secure channels and apply httpOnly protections where applicable. - (M) (1 hours)\[FE\]\[BE\]
        
    *   Testing: End-to-end test creating user name in tests/e2e/nameFlow.test.ts to simulate full login/name flow through API, frontend and DB. - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
*   **Login:** As a: user, I want to: log in with my credentials, So that: I can access my account and personalized features**(10 hours)** - User can login with correct credentials Incorrect credentials show appropriate error Session is created and stored securely User can remain logged in with a refresh token under valid conditions
    
    *   DB: Create users migration in \`prisma/migrations/\` - (M) (1 hours)\[FE\]
        
    *   DB: Add User model in \`apps/api/models/User.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement login() in \`apps/api/services/auth/AuthService.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Add login mutation in \`apps/api/routes/login.ts\` (router\_route\_loginPage) - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement SessionService in \`apps/api/services/session/SessionService.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement refresh token handling in \`apps/api/services/auth/RefreshService.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Build LoginForm component in \`components/auth/LoginForm.tsx\` (comp\_loginPage\_authPanel) - (M) (1 hours)\[FE\]
        
    *   Frontend: Wire LoginForm into \`route\_loginPage\` at \`/loginPage\` - (M) (1 hours)\[FE\]
        
    *   Testing: Add unit/integration tests in \`tests/auth/login.test.ts\` - (M) (1 hours)\[FE\]\[QA\]
        
    *   Docs: Update auth docs in \`docs/auth.md\` and review checklist \`docs/review/checklist.md\` - (M) (1 hours)\[FE\]
        
*   **Email Signup:** As a: user, I want to: sign up with email and password, So that: I can create an account and access personalized features**(11 hours)** - User can successfully register with a valid email and password System validates email format and password strength Duplicate email registration is rejected with a clear message User receives confirmation after successful signup
    
    *   DB: Create users table migration in \`apps/api/prisma/migrations/20251110\_create\_users.sql\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Model: Create User model in \`apps/api/models/User.ts\` with email and password fields - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement signup(email,password) in \`apps/api/services/auth/AuthService.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Add POST /signup handler in \`apps/api/routes/auth.ts\` calling AuthService.signup - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Build SignupForm component in \`components/auth/SignupForm.tsx\` and integrate into \`route\_auth\_layout\` - (M) (1 hours)\[FE\]
        
    *   Validation: Add email/password validators in \`apps/api/services/auth/validators.ts\` and reuse in \`components/auth/SignupForm.tsx\` - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   DB: Add unique index on email in \`apps/api/prisma/migrations/20251110\_add\_unique\_email.sql\` to prevent duplicates - (M) (1 hours)\[FE\]\[BE\]
        
    *   Notification: Send signup confirmation via Cloud Function in \`apps/api/functions/sendConfirmation.ts\` or call Firebase Auth email verification - (M) (1 hours)\[FE\]\[BE\]
        
    *   Testing: Add integration tests for signup API in \`apps/api/tests/auth.signup.test.ts\` - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   Testing: Add frontend tests for SignupForm in \`apps/web/tests/SignupForm.test.tsx\` - (M) (1 hours)\[FE\]\[QA\]
        
    *   Docs: Document signup API and front-end usage in \`docs/auth/signup.md\` - (M) (1 hours)\[FE\]\[BE\]
        
*   **Reset Password:** As a: user, I want to: reset my password securely, So that: I can regain access to my account if I forget my credentials**(7 hours)** - User can initiate password reset with valid email Reset token is generated and emailed Password can be reset using valid token and strong new password Attempts with invalid tokens are rejected
    
    *   DB: Create password\_resets table migration in prisma/migrations/ - (S) (0.5 hours)\[FE\]
        
    *   API: Implement generateResetToken(email) in apps/api/services/auth/AuthService.ts - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Add POST /password-reset in apps/api/routes/auth.ts to call generateResetToken - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   API: Implement verifyAndConsumeResetToken(token,newPassword) in apps/api/services/auth/AuthService.ts - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Add POST /password-reset/confirm in apps/api/routes/auth.ts to call verifyAndConsumeResetToken - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   Service: Send reset email using Cloud Function in apps/api/functions/sendResetEmail.ts - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Build PasswordResetRequestForm in components/auth/PasswordResetRequestForm.tsx and route /auth/reset under route\_auth\_layout (route\_auth\_layout) - (S) (0.5 hours)\[FE\]
        
    *   Frontend: Build PasswordResetConfirmForm in components/auth/PasswordResetConfirmForm.tsx and integrate to route\_auth\_layout (route\_auth\_layout) - (S) (0.5 hours)\[FE\]
        
    *   Testing: Add integration tests for reset flow in tests/integration/passwordReset.test.ts - (M) (1 hours)\[FE\]\[QA\]
        
    *   Docs: Add API and frontend usage docs in docs/auth/password-reset.md - (XS) (0.5 hours)\[FE\]\[BE\]
        
*   **Token Refresh:** As a: user, I want to: refresh my authentication token, So that: I can maintain a seamless session without re-login**(10 hours)** - Refresh token is validated New access token issued when valid Refresh token rotation/expiry handled securely On invalid refresh, user is logged out or asked to re-authenticate
    
    *   DB: Add refresh\_token columns and sessions migration in \`prisma/migrations/\` representing table\_sessions -> \`apps/api/db/migrations/\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement validateRefreshToken(refreshToken) in \`apps/api/services/auth/AuthService.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement rotateRefreshToken(oldToken) in \`apps/api/services/auth/AuthService.ts\` to issue new refresh token and invalidate old one - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Create /auth/refresh HTTP handler in \`apps/api/routes/auth.ts\` calling AuthService methods - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Add auth middleware checkRefreshCookie in \`apps/api/middleware/auth.ts\` to read refresh cookie - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Update token refresh logic in \`components/auth/TokenProvider.tsx\` to call /auth/refresh and store tokens securely - (M) (1 hours)\[FE\]
        
    *   Frontend: Update \`route\_auth\_layout\` (\`/auth/layout\`) to trigger refresh on mount and handle logout to \`route\_loginPage\` - (M) (1 hours)\[FE\]
        
    *   Testing: Add unit tests for AuthService.validateRefreshToken and rotateRefreshToken in \`apps/api/services/auth/\_\_tests\_\_/AuthService.test.ts\` - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   Testing: Add integration test for /auth/refresh endpoint in \`apps/api/routes/\_\_tests\_\_/authRefresh.test.ts\` - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   Docs: Update authentication docs in \`docs/authentication.md\` describing refresh rotation and expiry policy - (M) (1 hours)\[FE\]
        
*   **Forgot Password:** As a: registered user, I want to: reset my password using a password reset link, So that: I can regain access when I forget credentials.**(12 hours)** - User requests password reset with valid registered email System sends password reset email with a valid link Link expires after a defined window and cannot be reused New password satisfies minimum strength requirements User can login after resetting password
    
    *   DB: Create password\_resets migration in \`prisma/migrations/20251110\_create\_password\_resets.sql\` - (M) (1 hours)\[FE\]
        
    *   API: Implement requestPasswordReset(email) in \`apps/api/services/auth/AuthService.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Add requestPasswordReset mutation handler in \`apps/api/routes/loginPage.ts\` (router\_route\_loginPage) - (M) (1 hours)\[FE\]\[BE\]
        
    *   Infra: Create sendResetEmail cloud function in \`apps/api/functions/sendResetEmail.ts\` and template \`apps/api/templates/resetEmail.html\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Build ForgotPasswordForm component in \`components/auth/ForgotPasswordForm.tsx\` (route\_loginPage, route\_auth\_layout) - (M) (1 hours)\[FE\]
        
    *   Frontend: Build ResetPasswordPage in \`routes/ResetPasswordPage.tsx\` to accept token and new password (route\_loginPage) - (M) (1 hours)\[FE\]
        
    *   API: Implement verifyResetToken(token) and resetPassword(token, newPassword) in \`apps/api/services/auth/AuthService.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Add resetPassword mutation handler in \`apps/api/routes/loginPage.ts\` (router\_route\_loginPage) - (M) (1 hours)\[FE\]\[BE\]
        
    *   DB: Add index and expiry trigger for token expiry in \`prisma/migrations/20251110\_password\_resets\_indexes.sql\` - (M) (1 hours)\[FE\]
        
    *   Infra: Create cleanupExpiredTokens Cloud Function in \`apps/api/functions/cleanupExpiredTokens.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Quality: Add integration tests in \`apps/api/\_\_tests\_\_/passwordReset.test.ts\` covering request, email, reset, and login - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   Quality: Add docs \`docs/auth/forgot\_password.md\` and code review checklist - (M) (1 hours)\[FE\]
        
*   **Login: (0 hours)**
    
*   **Logout:** As a: user, I want to: log out from the application, So that: I can end my session and protect access**(3.5 hours)** - User session is terminated Authentication cookie/token invalidated User is redirected to home page with sign-out message
    
    *   API: Add /logout route handler in apps/api/routes/auth.ts with proper authentication guard, HTTP POST/GET as appropriate, and token invalidation hook. - (S) (0.5 hours)\[FE\]\[BE\]\[QA\]
        
    *   Service: Implement logoutUser(userId, token) in apps/api/services/auth/AuthService.ts to invalidate token and terminate session, handle idempotency and error cases. - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   DB: Mark session terminated in apps/api/services/sessions/SessionRepository.ts (update table\_sessions record) - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   Middleware: Clear auth cookie in apps/api/middleware/auth.ts - (XS) (0.5 hours)\[FE\]\[BE\]
        
    *   Frontend: Add LogoutButton component in apps/web/components/auth/LogoutButton.tsx that calls /logout and redirects to route\_auth\_layout (/auth/layout) or home route - (M) (1 hours)\[FE\]
        
    *   Testing: Add integration test for logout flow in apps/api/tests/logout.test.ts - (S) (0.5 hours)\[FE\]\[BE\]\[QA\]
        
    *   Docs: Update README logout section in docs/auth.md - (XS) (0.5 hours)\[FE\]
        
*   **Link Google Calendar:** As a: user, I want to: link my Google Calendar, So that: I can synchronize events with the app for better scheduling**(8 hours)** - OAuth consent flow completes Access token stored securely Calendar events sync runs on schedule Error handling for token revocation or expiry
    
    *   Infra: Add Google OAuth config in \`apps/api/config/googleOAuth.ts\` - (M) (1 hours)\[FE\]\[BE\]\[DevOps\]
        
    *   API: Implement OAuth consent endpoint in \`apps/api/routes/auth.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement token exchange & refresh in \`apps/api/services/auth/AuthService.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement secure TokenStore writing to \`apps/api/services/auth/TokenStore.ts\` and Firestore (table\_auth\_profiles) - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Build ConnectCalendar component in \`components/auth/ConnectCalendar.tsx\` and integrate into \`route\_auth\_layout\` (route\_auth\_layout) - (M) (1 hours)\[FE\]
        
    *   Infra: Create Cloud Function for calendar sync in \`apps/api/functions/calendarSync.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Infra: Create scheduler Cloud Function in \`apps/api/functions/scheduleSync.ts\` and firebase.json cron config - (M) (1 hours)\[FE\]\[BE\]\[DevOps\]
        
    *   QA: Add error handling & token revocation logic in \`apps/api/services/auth/AuthService.ts\` and tests in \`tests/auth/calendar.test.ts\` - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
*   **View Profile:** As a: registered user, I want to: view my profile information, So that: I can verify and understand my current account details**(9 hours)** - User can access their profile page from the dashboard Profile shows correct and up-to-date name, email, and avatar No unauthorized access to others' profiles is allowed Profile data is loaded within 1 second under normal conditions
    
    *   DB: Create profiles index migration in \`apps/api/db/migrations/20251110\_create\_profiles\_index.sql\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement ProfileService.getProfile(userId) in \`apps/api/services/profile/ProfileService.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Add getProfile route in \`apps/api/routes/profile.ts\` mapping to router\_route\_profilePage - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Build ProfilePage component in \`apps/web/src/routes/ProfilePage.tsx\` referencing route\_profilePage and comp\_profilePage\_header - (M) (1 hours)\[FE\]
        
    *   Frontend: Create ProfileHeader in \`apps/web/src/components/ProfileHeader.tsx\` to show name, email, avatar - (M) (1 hours)\[FE\]
        
    *   Security: Add auth middleware check in \`apps/api/middleware/auth.ts\` to enforce no unauthorized access - (M) (1 hours)\[FE\]\[BE\]
        
    *   Performance: Add server-side caching for profile in \`apps/api/services/profile/cache.ts\` to meet <1s load - (M) (1 hours)\[FE\]\[BE\]
        
    *   Integration: Add dashboard link to \`apps/web/src/components/DashboardLink.tsx\` to access /profilePage route\_profilePage - (M) (1 hours)\[FE\]
        
    *   Testing: Add API and E2E tests in \`apps/api/tests/profile.test.ts\` and \`apps/web/tests/profile.e2e.ts\` - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
*   **Edit Profile:** As a: registered user, I want to: edit my profile information, So that: I can update my personal details**(11 hours)** - User can update name, email, and bio Changes persist to database within 2 seconds Validation prevents invalid emails and empty fields Unsaved changes warn user before navigation Edge case: duplicate email handled gracefully
    
    *   DB: Add email, name, bio columns in \`apps/api/migrations/202511\_add\_profile\_fields.sql\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement updateProfile mutation in \`apps/api/routes/profile.ts\` with 2s persistence guarantee - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Add validation and duplicate email check in \`apps/api/services/profile/ProfileService.ts\` - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   Frontend: Build ProfileEditor component in \`apps/web/components/profile/ProfileEditor.tsx\` to edit name, email, bio - (M) (1 hours)\[FE\]
        
    *   Frontend: Connect ProfileEditor to route \`/profilePage\` in \`apps/web/pages/profilePage.tsx\` referencing component \`comp\_profilePage\_editor\` and route \`route\_profilePage\` - (M) (1 hours)\[FE\]
        
    *   State: Add profile slice in \`apps/web/store/profileSlice.ts\` with optimistic updates and rollback on error - (M) (1 hours)\[FE\]
        
    *   UX: Implement unsaved changes warning in \`apps/web/components/profile/ProfileEditor.tsx\` using React Navigation guards and beforeunload - (M) (1 hours)\[FE\]
        
    *   Validation: Add client-side email and empty-field checks in \`apps/web/components/profile/ProfileEditor.tsx\` and mirror in \`apps/api/services/profile/ProfileService.ts\` - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   Testing: Add backend tests for updateProfile in \`apps/api/tests/profile.test.ts\` covering duplicate email and 2s persistence - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   Testing: Add frontend tests for ProfileEditor in \`apps/web/tests/ProfileEditor.test.tsx\` including unsaved changes warning and validation - (M) (1 hours)\[FE\]\[QA\]
        
    *   Docs: Update README and API docs in \`docs/profile.md\` and \`apps/api/openapi.yaml\` - (M) (1 hours)\[FE\]\[BE\]
        
*   **Upload Photo: (8 hours)**
    
    *   Frontend: Build PhotoPicker component in \`components/profile/PhotoPicker.tsx\` - (M) (1 hours)\[FE\]
        
    *   Frontend: Add uploadPhoto handler in \`pages/profile/ProfileEditor.tsx\` - (M) (1 hours)\[FE\]
        
    *   API: Implement uploadProfilePhoto mutation in \`apps/api/routes/profile/profileRouter.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Backend: Add storage helper in \`apps/api/services/storage/StorageService.ts\` to upload to Firebase Storage - (M) (1 hours)\[FE\]\[BE\]
        
    *   DB: Create photos record in \`apps/api/models/photoModel.ts\` and save to \`table\_photos\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Update ProfilePage UI to display uploaded photo in \`/ProfilePage\` (\`comp\_profilePage\_editor\`) in \`pages/profile/ProfileEditor.tsx\` - (M) (1 hours)\[FE\]
        
    *   Testing: Add integration test for upload flow in \`apps/api/tests/profile/uploadPhoto.test.ts\` - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   Documentation: Document API and frontend usage in \`docs/profile/upload\_photo.md\` - (M) (1 hours)\[FE\]\[BE\]
        
*   **Manage Favorites: (7 hours)**
    
    *   DB: Create favorites table migration in \`apps/api/prisma/migrations/20251110\_create\_favorites\_table.sql\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement getUserFavorites and getFavoritesCount in \`apps/api/routes/profile/router\_profilePage.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement addFavorite, removeFavorite, reorderFavorites in \`apps/api/routes/profile/router\_profilePage.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Service: Create FavoritesService with sync logic in \`apps/api/services/favorites/FavoritesService.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Build FavoritesSection component in \`apps/web/src/components/profile/FavoritesSection.tsx\` - (M) (1 hours)\[FE\]
        
    *   Frontend: Add favorites actions and reducers in \`apps/web/src/store/favoritesSlice.ts\` - (M) (1 hours)\[FE\]
        
    *   Test/QA: Add integration tests in \`apps/api/tests/favorites.integration.test.ts\` and E2E in \`apps/web/tests/favorites.e2e.ts\` - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
*   **Payment Methods: (12 hours)**
    
    *   DB: Create payment\_methods migration in \`apps/api/migrations/payment\_methods.sql\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement getPaymentMethods in \`apps/api/routes/profilePage/router\_profilePage.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement createPaymentMethod in \`apps/api/routes/profilePage/router\_profilePage.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement setDefaultPaymentMethod in \`apps/api/routes/profilePage/router\_profilePage.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement deletePaymentMethod in \`apps/api/routes/profilePage/router\_profilePage.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Service: Add Stripe helper in \`apps/api/services/stripe/StripeService.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Build PaymentMethods component in \`apps/web/components/profile/PaymentMethods.tsx\` (connect to route\_profilePage & comp\_profilePage\_payments) - (M) (1 hours)\[FE\]
        
    *   Frontend: Add state & actions in \`apps/web/store/paymentMethods.ts\` - (M) (1 hours)\[FE\]
        
    *   Integration: Wire frontend to API in \`apps/web/components/profile/PaymentMethods.tsx\` using \`apps/web/store/paymentMethods.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Tests: Add API tests in \`apps/api/tests/paymentMethods.test.ts\` - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   Tests: Add frontend tests in \`apps/web/components/profile/PaymentMethods.test.tsx\` - (M) (1 hours)\[FE\]\[QA\]
        
    *   Docs: Add payment methods docs in \`docs/payment\_methods.md\` - (M) (1 hours)\[FE\]
        
*   **Notification Preferences: (10 hours)**
    
    *   DB: Add notification preferences columns to \`apps/api/db/migrations/20251110\_add\_notification\_preferences.sql\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement getNotificationPreferences() in \`apps/api/services/notifications/NotificationService.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement updateNotificationPreferences() in \`apps/api/services/notifications/NotificationService.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API Router: Add routes in \`apps/api/routes/profile/profileRouter.ts\` for getNotificationPreferences/updateNotificationPreferences/onNotificationPreferencesChanged - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Build NotificationPreferences component in \`apps/web/src/components/profile/NotificationPreferences.tsx\` - (M) (1 hours)\[FE\]
        
    *   Frontend: Integrate component into ProfilePage at \`apps/web/src/routes/profile/ProfilePage.tsx\` (comp\_profilePage\_notifications) - (M) (1 hours)\[FE\]
        
    *   Realtime: Implement subscription onNotificationPreferencesChanged in \`apps/api/services/notifications/NotificationService.ts\` and export to \`apps/api/routes/profile/profileRouter.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Testing: Add unit tests for NotificationService in \`apps/api/tests/notifications/NotificationService.test.ts\` - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   Testing: Add integration tests for profileRouter in \`apps/api/tests/profile/profileRouter.test.ts\` - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   Docs: Add docs for Notification Preferences in \`docs/features/notification-preferences.md\` - (M) (1 hours)\[FE\]
        
*   **Favorite Item:** As a: casual user, I want to: favorite a specific item, So that: I can easily access it later from Favorites.**(12 hours)** - User can add an item to Favorites from its detail view Favorites list updates instantly when an item is favorited System prevents duplicate favorites for the same item Favorite state persists across sessions Backend stores user favorites securely
    
    *   DB: Create favorites table migration in \`apps/api/migrations/20251110\_create\_favorites.sql\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement addFavorite mutation in \`apps/api/routes/favorites.ts\` with dedup logic in \`apps/api/services/favoritesService.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement getFavorites query in \`apps/api/routes/favorites.ts\` and service \`apps/api/services/favoritesService.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Build FavoriteButton component in \`apps/web/components/FavoriteButton.tsx\` that calls \`apps/web/services/favoritesClient.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Update FavoritesPage list in \`apps/web/pages/FavoritesPage.tsx\` and component \`comp\_favorites\_list\` to subscribe to favorites updates - (M) (1 hours)\[FE\]
        
    *   Realtime: Add subscription onFavoriteUpdated in \`apps/api/routes/favorites.ts\` and client in \`apps/web/services/favoritesClient.ts\` for instant updates - (M) (1 hours)\[FE\]\[BE\]
        
    *   Auth: Enforce auth checks in \`apps/api/middleware/auth.ts\` for favorites endpoints referencing \`table\_users\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   DB-Security: Add DB constraint unique(user\_id, item\_id) in \`apps/api/migrations/20251110\_create\_favorites.sql\` to prevent duplicates referencing \`table\_favorites\` and \`table\_items\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   State: Implement optimistic update and Redux slice in \`apps/web/store/favoritesSlice.ts\` and client \`apps/web/services/favoritesClient.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Persist: Ensure favorites persist across sessions by storing server-fetched favorites in \`apps/web/store/favoritesSlice.ts\` and on auth in \`apps/web/services/session.ts\` referencing \`table\_users\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Tests: Add unit tests for favorites service in \`apps/api/tests/favorites.test.ts\` and frontend e2e in \`apps/web/tests/favorites.e2e.ts\` - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   Docs: Document Favorites API and usage in \`docs/favorites.md\` and update route doc for \`router\_route\_favoritesPage\` - (M) (1 hours)\[FE\]\[BE\]
        
*   **View Favorites:** As a: casual user, I want to: view my Favorites list, So that: I can access saved items quickly and manage them**(11 hours)** - Favorites page loads quickly and shows all saved items User can navigate to item detail from Favorites Favorites reflects removals immediately No items in Favorites shows friendly empty state Backend can fetch user favorites during page load
    
    *   Frontend: Build FavoritesPage component in \`apps/mobile/src/screens/FavoritesPage.tsx\` (uses route\_favoritesPage) - (M) (1 hours)\[FE\]
        
    *   Frontend: Create FavoritesList component in \`apps/mobile/src/components/favorites/FavoritesList.tsx\` (comp\_favorites\_list) - (M) (1 hours)\[FE\]
        
    *   Frontend: Create FavoritesEmptyState in \`apps/mobile/src/components/favorites/FavoritesEmptyState.tsx\` (comp\_favorites\_empty) - (M) (1 hours)\[FE\]
        
    *   API: Implement getFavorites query in \`apps/api/routes/favorites/FavoritesController.ts\` (router\_route\_favoritesPage) - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement onFavoritesChange subscription in \`apps/api/routes/favorites/FavoritesController.ts\` (router\_route\_favoritesPage) - (M) (1 hours)\[FE\]\[BE\]
        
    *   Backend: Add favorites fetch in \`apps/api/services/favorites/FavoritesService.ts\` referencing table\_favorites and table\_items (table\_favorites table\_items) - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Add favorites API client in \`apps/mobile/src/services/api/favorites.ts\` (router\_route\_favoritesPage) - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Wire navigation to item detail in \`apps/mobile/src/screens/FavoritesPage.tsx\` using route\_favoritesPage -> item detail route (comp\_favorites\_list) - (M) (1 hours)\[FE\]
        
    *   Frontend: Implement immediate removal UX in \`apps/mobile/src/components/favorites/FavoritesList.tsx\` calling \`apps/mobile/src/services/api/favorites.ts\` (router\_route\_favoritesPage) - (M) (1 hours)\[FE\]\[BE\]
        
    *   Testing: Add unit tests in \`apps/mobile/\_\_tests\_\_/FavoritesPage.test.tsx\` to verify empty state, list rendering, navigation (comp\_favorites\_empty comp\_favorites\_list) - (M) (1 hours)\[FE\]\[QA\]
        
    *   Docs: Add feature doc in \`docs/features/favorites.md\` describing behavior and API endpoints (router\_route\_favoritesPage) - (M) (1 hours)\[FE\]\[BE\]
        
*   **Remove Favorite:** As a: casual user, I want to: remove an item from Favorites, So that: I can curate my saved items**(8 hours)** - User can unfavorite an item from the item card or detail view Favorites list updates to remove item instantly System confirms removal or offers undo option Backend updates user favorites accordingly Edge case: removing non-existent item handled gracefully
    
    *   DB: Create favorites table migration in \`apps/api/prisma/migrations/20251110\_create\_favorites.sql\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement removeFavorite mutation in \`apps/api/routes/favorites.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Add cloud function handler in \`apps/api/functions/removeFavorite.ts\` to sync with Firestore - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Update \`components/FavoritesList.tsx\` to optimistically remove item and subscribe to \`router\_route\_favoritesPage\` updates - (M) (1 hours)\[FE\]
        
    *   Frontend: Add unfavorite action in \`components/ItemCard.tsx\` with undo snackbar in \`components/FavoritesFooterActions.tsx\` - (M) (1 hours)\[FE\]
        
    *   Frontend: Add unfavorite handler in \`components/ItemDetail.tsx\` to call \`apps/api/routes/favorites.ts\` removeFavorite - (M) (1 hours)\[FE\]\[BE\]
        
    *   Testing: Add unit tests in \`tests/favorites/removeFavorite.test.ts\` covering edge case removing non-existent item - (M) (1 hours)\[FE\]\[QA\]
        
    *   Docs: Update \`docs/features/favorites.md\` with remove behavior and undo API - (M) (1 hours)\[FE\]\[BE\]
        
*   **Favorite Popularity Badge:** As a: casual user, I want to: see a badge showing popularity of favorited items, So that: I can prioritize trending items**(8 hours)** - Badge appears on items with high popularity in Favorites Counts update as item popularity changes No badge for items with low popularity Accessible for screen readers Backend provides real-time or near-real-time popularity data
    
    *   DB: Add popularity column to items table migration in \`apps/api/db/migrations/20251110\_add\_item\_popularity.sql\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Add getFavoritesWithPopularity query in \`apps/api/routes/favorites.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement onFavoriteUpdated subscription with popularity payload in \`apps/api/routes/favorites.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Function: Create cloud function to compute/update popularity in \`apps/api/functions/updatePopularity.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Build PopularityBadge component in \`components/favorites/PopularityBadge.tsx\` (accessible, ARIA) - (M) (1 hours)\[FE\]
        
    *   Frontend: Integrate badge into FavoritesList at \`components/favorites/FavoritesList.tsx\` and route \`route\_favoritesPage\` - (M) (1 hours)\[FE\]
        
    *   Testing: Add unit tests for badge logic in \`apps/api/tests/popularity.test.ts\` and \`components/favorites/PopularityBadge.test.tsx\` - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   Docs: Document API and component usage in \`docs/features/favorite-popularity.md\` - (M) (1 hours)\[FE\]\[BE\]
        

### **Milestone 3: Catalog & Styles: categories, style cards, style details, favorites and provider selection**

_Estimated 307.5 hours_

*   **Style: Select style → open professional availability calendar:** As a: user, I want to: select a style and view professional availability calendar, So that: I can book an available slot**(7 hours)** - Selecting a style opens professional availability calendar Calendar shows available slots per professional Selecting a slot proceeds to booking flow Calendar handles time zone correctly No conflicting appointments shown
    
    *   Frontend: Add onPress in \`components/home/StyleCard.tsx\` to open calendar for selected style - (M) (1 hours)\[FE\]
        
    *   Frontend: Build \`components/calendar/ProfessionalCalendar.tsx\` to display slots per professional and handle slot selection - (M) (1 hours)\[FE\]
        
    *   API: Create Cloud Function \`apps/api/functions/getAvailability.ts\` to return availability per professional - (M) (1 hours)\[FE\]\[BE\]
        
    *   Service: Implement availability logic in \`apps/api/services/calendar/CalendarService.ts\` including timezone conversion and conflict filtering - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Add booking navigation in \`components/booking/BookingFlow.tsx\` to start booking on slot select using route \`route\_home\_cards\_flow\` - (M) (1 hours)\[FE\]
        
    *   DB: Add Firestore indexes/queries for \`table\_service\_styles\` and \`table\_users\` and ensure data shape - (M) (1 hours)\[FE\]\[BE\]
        
    *   Testing: Add \`tests/calendar/availability.test.ts\` covering timezone handling and conflict filtering - (M) (1 hours)\[FE\]\[QA\]
        
*   **Payment: Show prepay discount option before booking:** As a: user, I want to: see prepay discount option before booking, So that: I can decide to save by paying upfront**(7.5 hours)** - Prepay option displayed before final booking summary Discount calculation correct and applied Edge case: prepay availability by category or stylist Payment flow remains secure and compliant User can toggle prepay option and see updated total
    
    *   DB: Implement Prepay model at apps/api/models/Prepay.ts to store availability, discount, and rules per category/stylist. Create schema with fields: id, categoryId, styleId, available, discountRate, minHours, maxHours, rules. Ensure index on category/style to support lookups and a default/required constraints for availability. Trigger hooks if needed for cascading updates. - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   API: Implement prepay discount Cloud Function in apps/api/functions/prepayDiscount.ts to compute eligibility and discount amount given user, booking context, and Prepay entries. - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Implement PrepayOption component at apps/mobile/components/payment/PrepayOption.tsx and integrate into route\_home\_cards\_flow screen/HomeCards to present prepay option based on computed eligibility. - (M) (1 hours)\[FE\]
        
    *   API: Add Stripe integration config in apps/api/config/stripe.ts and update payment Cloud Function apps/api/functions/charge.ts to accept prepay flag and apply discount during charge. - (L) (2 hours)\[FE\]\[BE\]\[DevOps\]
        
    *   Frontend: Update booking summary in apps/mobile/screens/BookingSummary.tsx to show toggled total and discount breakdown from prepay. - (M) (1 hours)\[FE\]
        
    *   DB: Add Firestore rules & indexes in apps/api/firestore.rules to enforce prepay availability per table\_categories and table\_service\_styles. - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   Testing: Create unit & integration tests in apps/api/tests/prepay.test.ts and apps/mobile/tests/PrepayOption.test.tsx to cover model, function, and frontend behavior. - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   Docs: Add payment prepay docs in docs/payment/prepay.md and update acceptance criteria checklist to reflect prepay flow. - (XS) (0.5 hours)\[FE\]
        
*   **Account: Access cancel booking, profile edit, purchase history:** As a: user, I want to: access cancel booking, edit profile, and view purchase history, So that: I can manage bookings and personal data**(12 hours)** - Cancel booking option available for active bookings Profile edit saves changes Purchase history loads with details Sensitive data protected and compliant Actions persist across sessions
    
    *   API: Add cancelBooking endpoint in \`apps/api/functions/bookings/cancelBooking.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement getPurchaseHistory in \`apps/api/functions/purchases/getPurchaseHistory.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement updateUserProfile in \`apps/api/functions/users/updateUserProfile.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Build AccountScreen component in \`apps/mobile/src/screens/AccountScreen.tsx\` for \`route\_home\_cards\_flow\` - (M) (1 hours)\[FE\]
        
    *   Frontend: Add CancelBookingButton component in \`apps/mobile/src/components/CancelBookingButton.tsx\` - (M) (1 hours)\[FE\]
        
    *   Frontend: Build ProfileEditForm in \`apps/mobile/src/components/ProfileEditForm.tsx\` - (M) (1 hours)\[FE\]
        
    *   Frontend: Build PurchaseHistoryList in \`apps/mobile/src/components/PurchaseHistoryList.tsx\` - (M) (1 hours)\[FE\]
        
    *   Auth: Enforce auth middleware in \`apps/api/middleware/auth.ts\` for sensitive endpoints - (M) (1 hours)\[FE\]\[BE\]
        
    *   DB: Ensure users table fields updated in \`apps/api/migrations/20251110\_add\_profile\_fields.sql\` referencing \`table\_users\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Security: Add data encryption for sensitive fields in \`apps/api/utils/encryption.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Testing: Add E2E tests for account flows in \`apps/mobile/tests/e2e/account.test.ts\` - (M) (1 hours)\[FE\]\[QA\]
        
    *   Docs: Update README entry for Account features in \`docs/features/account.md\` - (M) (1 hours)\[FE\]
        
*   **Category: Browse styles list with image, price, likes:** As a: user, I want to: browse styles within a category showing image, price, and like count, So that: I can compare options quickly**(12 hours)** - Styles list loads with thumbnail image, price, and like count Tapping a style opens detail view Like/Unlike persists per user and updates UI Sorting/filtering options load and apply correctly No broken images or missing data in list view
    
    *   DB: Add fields (price,likes,thumbnailUrl) to \`service\_styles\` in \`apps/api/models/serviceStyles.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Create GET /styles list in \`apps/api/routes/stylesRoutes.ts\` returning thumbnail, price, likes (uses table\_service\_styles) - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Create POST /styles/:id/like in \`apps/api/routes/stylesRoutes.ts\` to toggle like and update likes count (uses table\_service\_styles, table\_users) - (M) (1 hours)\[FE\]\[BE\]
        
    *   CloudFunction: Implement like persistence in \`apps/api/functions/toggleLike.ts\` updating \`service\_styles\` and user likes (uses Cloud Functions, table\_service\_styles, table\_users) - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Build StylesList component in \`components/home/StylesList.tsx\` rendering thumbnail, price, likes and navigation to /HomeCards (route\_home\_cards\_flow) - (M) (1 hours)\[FE\]
        
    *   Frontend: Build StyleCard component in \`components/home/StyleCard.tsx\` with image loader, placeholder fallback and price/likes display (used by StylesList) - (M) (1 hours)\[FE\]
        
    *   Frontend: Implement StyleDetail navigation in \`navigation/Routes.tsx\` and open detail on tap (route\_home\_cards\_flow) - (M) (1 hours)\[FE\]
        
    *   Frontend: Add like/unlike action in \`components/home/StyleCard.tsx\` calling POST /styles/:id/like and updating UI optimistically (route\_home\_cards\_flow, table\_service\_styles) - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Implement sorting/filtering UI in \`components/home/StylesFilters.tsx\` and apply to GET /styles queries - (M) (1 hours)\[FE\]
        
    *   Storage: Validate thumbnails exist and set placeholder generation in \`apps/api/utils/imageUtils.ts\` using Firebase Cloud Storage (storage, table\_service\_styles) - (M) (1 hours)\[FE\]\[BE\]
        
    *   Testing: Add unit tests for styles API in \`apps/api/tests/styles.test.ts\` covering list, like, and sorting (table\_service\_styles) - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   Testing: Add UI tests in \`apps/mobile/tests/StylesList.test.tsx\` for image load, like button, navigation (route\_home\_cards\_flow) - (M) (1 hours)\[FE\]\[QA\]
        
*   **Style: Favorite/unfavorite style (heart):** As a: user, I want to: favorite or unfavorite a style using heart icon, So that: I can save preferred options for later**(8 hours)** - Heart icon toggles on tap Favorited styles persist in user profile UI reflects saved state across sessions Unauthenticated user prompted to login before favoriting Analytics event recorded on favorite action
    
    *   Frontend: Add Heart toggle UI in \`apps/mobile/components/home/HomeCard.tsx\` - (M) (1 hours)\[FE\]
        
    *   Frontend: Persist favorite state in local store \`apps/mobile/store/favoritesStore.ts\` and hydrate on \`route\_home\_cards\_flow\` - (M) (1 hours)\[FE\]
        
    *   API: Add favorite/unfavorite endpoints in \`apps/api/services/styles/StyleService.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Auth: Enforce auth check in \`apps/api/services/auth/AuthService.ts\` for favorite actions - (M) (1 hours)\[FE\]\[BE\]
        
    *   DB: Update service\_styles and users favorites fields in \`table\_service\_styles\` and \`table\_users\` via \`apps/api/services/styles/StyleService.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Analytics: Record favorite event in \`apps/api/services/analytics/AnalyticsService.ts\` and \`apps/mobile/services/analytics.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Prompt login modal in \`apps/mobile/components/auth/LoginPrompt.tsx\` when unauthenticated user taps heart on \`route\_home\_cards\_flow\` - (M) (1 hours)\[FE\]
        
    *   Testing: Add unit and integration tests in \`apps/mobile/\_\_tests\_\_/HomeCard.test.tsx\` and \`apps/api/\_\_tests\_\_/StyleService.test.ts\` - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
*   **Home Cards: View categories (unha/cabelo/sobrancelha/depilação):** As a: user, I want to: view categories from Home Cards, So that: I can select a category to explore styles available**(8 hours)** - User can see all categories on Home screen Selecting a category navigates to category detail page Categories load within - 5 seconds on initial view Categories display accurate counts for each category System handles empty category gracefully
    
    *   DB: Ensure service\_categories (table\_categories) seeded in Firestore via \`apps/api/db/seed/service\_categories\_seed.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement getCategories() in \`apps/api/services/categories/CategoriesService.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Add caching and count aggregation in \`apps/api/services/categories/CategoriesService.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Build HomeCards component in \`components/home/HomeCards.tsx\` and connect to \`route\_home\_cards\_flow\` - (M) (1 hours)\[FE\]
        
    *   Frontend: Implement navigation to CategoryDetail in \`components/home/HomeCards.tsx\` using \`route\_home\_cards\_flow\` - (M) (1 hours)\[FE\]
        
    *   Frontend: Add empty state UI in \`components/home/HomeCards.tsx\` - (M) (1 hours)\[FE\]
        
    *   Perf: Add metric and lazy-loading to \`components/home/HomeCards.tsx\` and \`apps/api/services/categories/CategoriesService.ts\` to ensure <1.5s load - (M) (1 hours)\[FE\]\[BE\]
        
    *   Tests: Create \`tests/home/Categories.test.tsx\` for rendering, navigation, counts, and empty state - (M) (1 hours)\[FE\]\[QA\]
        
*   **View Service Details:** As a: user, I want to: view detailed information about a service, So that: I can understand features, pricing, and availability before booking.**(8 hours)** - User can open a service detail page from the catalog Service detail page displays title, description, price, availability and rating System gracefully handles missing data fields by showing defaults User can navigate back to catalog without data loss Pricing information is up-to-date and cached for 5 minutes
    
    *   API: Ensure getServiceDetails in \`apps/api/routers/catalogPage.ts\` returns title, description, price, availability, rating - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Add service types in \`apps/shared/types/service.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Build ServiceDetails component in \`apps/web/src/components/catalog/ServiceDetails.tsx\` to display fields and defaults - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Update CatalogPage to open details and wire \`comp\_catalogPage\_detailsPanel\` in \`apps/web/src/pages/CatalogPage.tsx\` - (M) (1 hours)\[FE\]
        
    *   Frontend: Implement price caching hook in \`apps/web/src/hooks/usePriceCache.ts\` with 5-minute TTL - (M) (1 hours)\[FE\]
        
    *   Frontend: Add defaults util in \`apps/web/src/utils/serviceDefaults.ts\` to handle missing fields - (M) (1 hours)\[FE\]\[BE\]
        
    *   QA: Add unit/integration tests in \`apps/web/src/\_\_tests\_\_/ServiceDetails.test.tsx\` for rendering, defaults, navigation - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   Docs: Create feature doc \`docs/features/view-service-details.md\` - (M) (1 hours)\[FE\]\[BE\]
        
*   **Add to Booking:** As a: user, I want to: add a service to my booking from the catalog, So that: I can proceed to checkout with selected services.**(12 hours)** - User can select a service and click add to booking System updates cart with the selected service and shows quantity Added service reflects in booking summary on cart/checkout System prevents adding unavailable services and shows an indicative message User receives a confirmation toast or message after adding
    
    *   Frontend: Add 'Add to Booking' button in \`apps/web/components/catalog/FooterActions.tsx\` - (M) (1 hours)\[FE\]
        
    *   Frontend: Wire selection UI in \`apps/web/components/catalog/DetailsPanel.tsx\` to dispatch add action - (M) (1 hours)\[FE\]
        
    *   API: Implement addToBooking mutation handler in \`apps/api/routers/catalog.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Service: Implement addToBooking logic in \`apps/api/services/booking/BookingService.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   DB: Update bookings in \`apps/api/db/bookings.ts\` and migration in \`prisma/migrations/\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Show booking summary update in \`apps/web/components/cart/BookingSummary.tsx\` - (M) (1 hours)\[FE\]
        
    *   Frontend: Show confirmation toast in \`apps/web/components/ui/Toast.tsx\` upon success - (M) (1 hours)\[FE\]
        
    *   Frontend: Display unavailable service message in \`apps/web/components/catalog/DetailsPanel.tsx\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Add availability check getServiceDetails usage in \`apps/api/routers/catalog.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Test: Add frontend tests in \`apps/web/\_\_tests\_\_/addToBooking.test.tsx\` - (M) (1 hours)\[FE\]\[QA\]
        
    *   Test: Add backend tests in \`apps/api/\_\_tests\_\_/addToBooking.spec.ts\` - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   Docs: Document flow in \`docs/feature\_add\_to\_booking.md\` - (M) (1 hours)\[FE\]
        
*   **Price Display:** As a: user, I want to: see price information clearly on catalog cards and detail pages, So that: I can compare costs and decide which service to book.**(9 hours)** - Prices shown on catalog and detail pages are accurate and consistent Prices reflect discounts or promotions where applicable Price updates react to currency changes or regional settings Prices are formatted consistently (locale, decimal) System maintains price history with minimal storage impact
    
    *   DB: Add price and price\_history migration in \`apps/api/prisma/migrations/20251110\_add\_prices\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement fetchCatalogProducts price fields in \`apps/api/routes/catalog.ts\` (router\_route\_catalogPage) - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Create pricing service with discount & currency logic in \`apps/api/services/pricing/PricingService.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Build PriceTag component in \`apps/web/components/catalog/PriceTag.tsx\` (comp\_catalogPage\_mainGrid, route\_catalogPage) - (M) (1 hours)\[FE\]
        
    *   API: Add currency rates sync Cloud Function in \`apps/api/functions/syncCurrencyRates.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Update /catalogPage to consume formatted price in \`apps/web/pages/catalogPage.tsx\` (route\_catalogPage, comp\_catalogPage\_mainGrid) - (M) (1 hours)\[FE\]
        
    *   API: Implement price history retention job in \`apps/api/functions/priceHistoryRetention.ts\` (table\_services, table\_service\_images) - (M) (1 hours)\[FE\]\[BE\]
        
    *   Quality: Add unit tests for PricingService in \`apps/api/tests/pricing.test.ts\` - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   Quality: End-to-end test for catalog and detail price display in \`apps/web/tests/e2e/priceDisplay.spec.ts\` - (M) (1 hours)\[FE\]\[QA\]
        
*   **Prepayment Discount Option:** As a: user, I want to: apply a prepayment discount at checkout, So that: I can save money by paying upfront**(7 hours)** - Discount applied when prepayment option selected Discount percentage configurable in admin Checkout totals reflect discount accurately Edge case: discount not applied when payment deferred Security: discount data validated and securely processed
    
    *   DB: Add prepaymentDiscountPercent column to \`apps/api/models/service.ts\` and create migration in \`apps/api/prisma/migrations/\` - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   API: Implement DiscountController.validateDiscount() in \`apps/api/controllers/discounts/DiscountController.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Add discount calculation to \`apps/api/services/checkout/CheckoutService.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Add prepayment checkbox and totals update in \`apps/web/components/checkout/CheckoutSummary.tsx\` (route: route\_catalogPage) - (M) (1 hours)\[FE\]
        
    *   Frontend Admin: Create PaymentSettings page in \`apps/web/pages/admin/PaymentSettings.tsx\` to configure discount percentage (route: route\_app\_layout) - (M) (1 hours)\[FE\]\[DevOps\]
        
    *   DB/API: Store admin-configured default in env and \`apps/api/config/paymentConfig.ts\` and reference in \`apps/api/services/checkout/CheckoutService.ts\` - (M) (1 hours)\[FE\]\[BE\]\[DevOps\]
        
    *   Security: Validate and sanitize discount input in \`apps/api/controllers/discounts/DiscountController.ts\` and add tests in \`apps/api/tests/discounts.test.ts\` - (S) (0.5 hours)\[FE\]\[BE\]\[QA\]
        
    *   Testing: Add unit/integration tests in \`apps/api/tests/discounts.test.ts\` and frontend tests in \`apps/web/tests/CheckoutSummary.test.tsx\` - (S) (0.5 hours)\[FE\]\[BE\]\[QA\]
        
    *   Docs: Update \`apps/api/README.md\` and \`apps/web/README.md\` with prepayment discount behavior and admin config - (XS) (0.5 hours)\[FE\]\[BE\]\[DevOps\]
        
*   **Popularity Indicator & Favorite Action (bottom-left):** As a: user, I want to: see popularity indicator and be able to favorite items from the catalog, So that: I can discover popular services and save preferences**(10 hours)** - Popularity score displayed on each card Users can toggle favorite state and persist across sessions Favorites list accessible from user profile Indicator updates with real-time or periodic popularity data Accessible: indicators have aria-live regions for screen readers
    
    *   DB: Create service\_popularity\_metrics table migration in \`apps/api/prisma/migrations/20251110\_create\_service\_popularity.sql\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement fetchPopularitySnapshot() in \`apps/api/services/catalog/CatalogService.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement fetchUserFavorites() & toggleFavorite() in \`apps/api/services/catalog/CatalogService.ts\` and routes in \`apps/api/routes/catalog.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Backend: Add onItemPopularityUpdate & onFavoriteUpdate subscriptions to \`apps/api/routes/catalog.ts\` (router\_route\_catalogPage) - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Update CatalogCard component in \`apps/web/components/catalog/CatalogCard.tsx\` to display popularity score and favorite button (comp\_catalog\_grid, comp\_catalogPage\_mainGrid) - (M) (1 hours)\[FE\]
        
    *   Frontend: Persist favorite state locally and sync with API in \`apps/web/hooks/useFavorites.ts\` and \`apps/web/pages/catalogPage.tsx\` (route\_catalogPage) - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Add Favorites list page in \`apps/web/pages/profile/FavoritesPage.tsx\` and link from user profile (route\_app\_layout) - (M) (1 hours)\[FE\]
        
    *   Functions: Implement popularity updater Cloud Function in \`apps/api/functions/popularityUpdater/index.ts\` to recordPopularity (update service\_popularity\_metrics) - (M) (1 hours)\[FE\]\[BE\]
        
    *   Accessibility: Add aria-live regions to \`apps/web/components/catalog/CatalogCard.tsx\` and tests in \`apps/web/tests/accessibility.test.tsx\` - (M) (1 hours)\[FE\]\[QA\]
        
    *   Testing: Add integration tests for favorites and popularity in \`apps/api/tests/catalog.test.ts\` and \`apps/web/tests/catalog.integration.test.tsx\` - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
*   **Favorite Service:** As a: user, I want to: favorite a service, So that: I can quickly access preferred services later**(12 hours)** - Service can be marked as favorite with a toggle Favorites list persists across sessions UI reflects favorite state consistently across pages Favorite actions are debounced to prevent rapid toggling Backend stores user favorite relationships securely
    
    *   DB: Create favorites table migration in \`apps/api/db/migrations/20251110\_create\_favorites\_table.sql\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement FavoritesService.saveFavorite(userId, serviceId) in \`apps/api/services/favorites/FavoritesService.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Add POST /catalog/favorites toggle handler in \`apps/api/routes/catalog/favorites.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Add GET /catalog/favorites for user in \`apps/api/routes/catalog/favorites.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Build FavoriteToggle component in \`components/catalog/FavoriteToggle.tsx\` - (M) (1 hours)\[FE\]
        
    *   Frontend: Wire favorites state in \`route\_catalogPage\` and \`comp\_catalog\_grid\` to use \`components/catalog/FavoriteToggle.tsx\` - (M) (1 hours)\[FE\]
        
    *   Frontend: Persist favorites across sessions via Redux slice in \`store/slices/favoritesSlice.ts\` and hydrate in \`route\_app\_layout\` - (M) (1 hours)\[FE\]
        
    *   Frontend: Add debounce (300ms) to toggle calls in \`components/catalog/FavoriteToggle.tsx\` - (M) (1 hours)\[FE\]
        
    *   Security: Enforce auth checks in \`apps/api/services/favorites/FavoritesService.ts\` using \`apps/api/services/auth/AuthService.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Testing: Add unit tests for FavoritesService in \`apps/api/tests/favorites.test.ts\` - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   Testing: Add frontend integration tests for FavoriteToggle in \`apps/mobile/tests/FavoriteToggle.test.tsx\` - (M) (1 hours)\[FE\]\[QA\]
        
    *   Docs: Add API and component docs in \`docs/features/favorites.md\` - (M) (1 hours)\[FE\]\[BE\]
        
*   **Category Landing Cards:** As a: catalog user, I want to: view category landing cards, So that: I can quickly navigate to relevant service categories**(6 hours)** - Category cards display with image, title, and count of services Clicking a card filters services by category and updates URL state Non-ccatalog pages retain previous scroll position and no errors occur Edge case handled: missing category image shows placeholder Data loads within - 5s under normal conditions
    
    *   API: Add category aggregation endpoint in apps/api/routes/catalog.ts (returns image, title, service\_count) with a REST GET endpoint, using existing CatalogService to fetch and assemble data for categories including image URL, title, and number of services per category. - (M) (1 hours)\[FE\]\[BE\]
        
    *   Service: Implement getCategoryAggregates in apps/api/services/catalog/CatalogService.ts (query table\_services, table\_service\_images, table\_favorites) to return category aggregates used by the new endpoint. - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Build CategoryCard component in components/catalog/CategoryCard.tsx (image, title, count, placeholder handling) using React, with proper props and skeleton placeholder states. - (S) (0.5 hours)\[FE\]
        
    *   Page: Integrate CategoryCards on /catalogPage in pages/catalogPage/index.tsx (fetch from apps/api/routes/catalog.ts, update URL state on click) - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   UX: Preserve scroll position for non-catalog pages in pages/catalogPage/index.tsx using route\_app\_layout state handling - (M) (1 hours)\[FE\]
        
    *   Perf: Add caching and timing checks in apps/api/routes/catalog.ts and log in apps/api/services/catalog/CatalogService.ts (target <1.5s) - (M) (1 hours)\[FE\]\[BE\]
        
    *   Test: Create unit/integration tests in tests/catalog/categoryCards.test.tsx (display, filtering, placeholder, URL state, scroll retention) - (S) (0.5 hours)\[FE\]\[QA\]
        
    *   Docs: Update docs/features/catalog.md with API and component usage - (XS) (0.5 hours)\[FE\]\[BE\]
        
*   **Catalog View: (16 hours)** - Story functionality is implemented as specified User interface is responsive and accessible Data is properly validated and stored Error handling provides helpful feedback
    
    *   DB: Review/Update \`table\_services\` schema and add fields for display in \`apps/api/models/Service.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   DB: Add \`service\_images\` relations and storage paths in \`apps/api/models/ServiceImage.ts\` -> update \`table\_service\_images\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   DB: Ensure \`favorites\` table schema in \`apps/api/models/Favorite.ts\` maps to \`table\_favorites\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement CatalogService.getCatalog() in \`apps/api/services/catalog/CatalogService.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement image URL resolver in \`apps/api/services/storage/StorageService.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Build CatalogPage screen in \`apps/mobile/src/screens/CatalogPage.tsx\` and connect to \`route\_catalogPage\` - (M) (1 hours)\[FE\]
        
    *   Frontend: Create CatalogList component in \`apps/mobile/src/components/CatalogList.tsx\` - (M) (1 hours)\[FE\]
        
    *   Frontend: Create CatalogItemCard component in \`apps/mobile/src/components/CatalogItemCard.tsx\` with favorite button and image display - (M) (1 hours)\[FE\]
        
    *   Frontend: Add navigation to ItemDetail via \`apps/mobile/src/navigation/index.tsx\` linking \`CatalogItemCard\` to \`route\_app\_layout\`/detail route - (M) (1 hours)\[FE\]
        
    *   State: Implement useCatalog hook in \`apps/mobile/src/hooks/useCatalog.ts\` to fetch via \`apps/api/services/catalog/CatalogService.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   State: Implement favorites toggle in \`apps/mobile/src/services/favorites/FavoritesService.ts\` updating \`apps/api/models/Favorite.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Styling: Add responsive styles in \`apps/mobile/src/styles/Catalog.styles.ts\` using Tailwind RN - (M) (1 hours)\[FE\]
        
    *   Validation: Add input/data validation for service objects in \`apps/api/validators/serviceValidator.ts\` - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   ErrorHandling: Add error boundaries and Sentry reporting in \`apps/mobile/src/components/ErrorBoundary.tsx\` - (M) (1 hours)\[FE\]
        
    *   Testing: Write unit and integration tests in \`apps/mobile/\_\_tests\_\_/CatalogPage.test.tsx\` - (M) (1 hours)\[FE\]\[QA\]
        
    *   Docs: Create \`docs/CatalogView.md\` with usage, routes (\`route\_catalogPage\`) and file references - (M) (1 hours)\[FE\]
        
*   **Style Detail View: (14 hours)** - Story functionality is implemented as specified User interface is responsive and accessible Data is properly validated and stored Error handling provides helpful feedback
    
    *   DB: Add service detail fields in \`apps/api/models/Service.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   DB: Add service\_images relation migration in \`apps/api/prisma/migrations/\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement getServiceById(id) in \`apps/api/services/service/ServiceService.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Add /services/:id route handler in \`apps/api/routes/services.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Build StyleDetailView component in \`apps/web/components/catalog/StyleDetailView.tsx\` - (M) (1 hours)\[FE\]
        
    *   Frontend: Add route /CatalogPage -> StyleDetailView in \`apps/web/routes/route\_catalogPage.tsx\` - (M) (1 hours)\[FE\]
        
    *   Frontend: Create ServiceImageCarousel in \`apps/web/components/catalog/ServiceImageCarousel.tsx\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Implement Redux slice for currentService in \`apps/web/store/slices/serviceSlice.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Validation: Add form validation for booking in \`apps/web/components/catalog/BookingForm.tsx\` - (M) (1 hours)\[FE\]\[QA\]
        
    *   Accessibility: Ensure responsive & accessible styles in \`apps/web/styles/StyleDetail.styles.ts\` - (M) (1 hours)\[FE\]
        
    *   ErrorHandling: Add error boundaries and Sentry reporting in \`apps/web/components/common/ErrorBoundary.tsx\` - (M) (1 hours)\[FE\]
        
    *   Testing: Add unit tests for ServiceService in \`apps/api/tests/serviceService.test.ts\` - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   Testing: Add component tests for StyleDetailView in \`apps/web/tests/StyleDetailView.test.tsx\` - (M) (1 hours)\[FE\]\[QA\]
        
    *   Docs: Update README with Style Detail View usage in \`apps/web/README.md\` - (M) (1 hours)\[FE\]
        
*   **Booking Flow View: (10 hours)** - Story functionality is implemented as specified User interface is responsive and accessible Data is properly validated and stored Error handling provides helpful feedback
    
    *   DB: Create bookings table schema and indexes in \`apps/api/db/bookings.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement createBooking() in \`apps/api/services/bookings/BookingService.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Add Firestore rules and validation in \`apps/api/firebase/rules/bookings.rules\` - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   Frontend: Build BookingFlowView component in \`apps/web/components/booking/BookingFlowView.tsx\` and connect to route \`route\_catalogPage\` - (M) (1 hours)\[FE\]
        
    *   Frontend: Add booking UI to layout in \`apps/web/routes/app/layout/BookingSlot.tsx\` and integrate with \`route\_app\_layout\` - (M) (1 hours)\[FE\]
        
    *   Integration: Wire BookingFlowView to API calls in \`apps/web/services/bookingsClient.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Validation: Implement client-side form validation in \`apps/web/components/booking/BookingFlowView.tsx\` - (M) (1 hours)\[FE\]\[QA\]
        
    *   ErrorHandling: Add error reporting to Sentry in \`apps/web/config/sentry.ts\` and handle API errors in \`apps/web/services/bookingsClient.ts\` - (M) (1 hours)\[FE\]\[BE\]\[DevOps\]
        
    *   Testing: Add unit and integration tests in \`apps/web/\_\_tests\_\_/BookingFlowView.test.tsx\` and \`apps/api/\_\_tests\_\_/BookingService.test.ts\` - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   Docs: Document Booking Flow in \`docs/features/booking-flow.md\` and update acceptance criteria checklist - (M) (1 hours)\[FE\]
        
*   **Profile View: (9 hours)** - Story functionality is implemented as specified User interface is responsive and accessible Data is properly validated and stored Error handling provides helpful feedback
    
    *   Frontend: Build ProfileView component in \`components/profile/ProfileView.tsx\` - (M) (1 hours)\[FE\]
        
    *   API: Implement getUserProfile(uid) in \`apps/api/services/user/UserService.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement updateUserProfile(uid, data) in \`apps/api/services/user/UserService.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   DB: Add profile fields to \`table\_users\` and create migration in \`prisma/migrations/\` - (M) (1 hours)\[FE\]
        
    *   Frontend: Create ProfileEditForm in \`components/profile/ProfileEditForm.tsx\` - (M) (1 hours)\[FE\]
        
    *   Frontend: Add route \`/profile\` in \`routes/route\_catalogPage.tsx\` and include in \`route\_app\_layout\` - (M) (1 hours)\[FE\]
        
    *   Quality: Add unit tests for UserService in \`apps/api/services/user/\_\_tests\_\_/UserService.test.ts\` - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   Quality: Add component tests for ProfileView in \`components/profile/\_\_tests\_\_/ProfileView.test.tsx\` - (M) (1 hours)\[FE\]\[QA\]
        
    *   Infra: Configure Firestore rules for users collection in \`firebase/firestore.rules\` - (M) (1 hours)\[FE\]\[DevOps\]
        
*   **History View: (11 hours)** - Story functionality is implemented as specified User interface is responsive and accessible Data is properly validated and stored Error handling provides helpful feedback
    
    *   DB: Add history collection migration in \`apps/api/firestore/migrations/2025\_add\_history\_collection.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement getHistory(userId) in \`apps/api/services/history/HistoryService.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Add /history route handler in \`apps/api/routes/history.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Build HistoryView component in \`apps/mobile/components/history/HistoryView.tsx\` - (M) (1 hours)\[FE\]
        
    *   Frontend: Add route /catalogPage/history in \`apps/mobile/navigation/Routes.tsx\` referencing route\_catalogPage and route\_app\_layout - (M) (1 hours)\[FE\]
        
    *   State: Create history Redux slice in \`apps/mobile/store/slices/historySlice.ts\` - (M) (1 hours)\[FE\]
        
    *   Validation: Implement input and data validation in \`apps/api/services/history/HistoryService.ts\` and Firestore rules in \`apps/api/firestore/rules/history.rules\` - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   UI: Add responsive styles and accessibility attributes in \`apps/mobile/components/history/HistoryView.tsx\` using Tailwind RN - (M) (1 hours)\[FE\]
        
    *   Error Handling: Integrate Sentry and user-friendly errors in \`apps/mobile/components/history/HistoryView.tsx\` and \`apps/api/services/history/HistoryService.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Testing: Write unit tests for HistoryService in \`apps/api/services/history/\_\_tests\_\_/HistoryService.test.ts\` and component tests in \`apps/mobile/components/history/\_\_tests\_\_/HistoryView.test.tsx\` - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   Docs: Document History View API and component in \`docs/features/history.md\` and update README in \`apps/mobile/README.md\` - (M) (1 hours)\[FE\]\[BE\]
        
*   **View Professional Profile:** As a: user, I want to: view a professional profile in the service catalog, So that: I can evaluate expertise and suitability before selecting a service**(8 hours)** - Profile loads within - 5 seconds Profile displays key details: name, title, rating, reviews, and specialties Clicking profile opens a detailed bio section and contact option System handles missing profile data gracefully Data is fetched securely from backend API
    
    *   API: Implement REST GET /catalog/provider-details to fetch provider details from provider\_profiles and related sources, in apps/api/routes/catalog/getProviderDetails.ts, wiring to ORM/db, return proper contract, support caching layer. - (M) (1 hours)\[FE\]\[BE\]
        
    *   DB: Ensure provider\_profiles table has required fields in migration 202511\_add\_provider\_profile\_fields.sql (apps/api/migrations) to support getProviderDetails (name, avatar\_url, bio, specialties, rating, last\_updated). - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   Frontend: Implement ProviderProfilePreview component at components/provider/ProviderProfilePreview.tsx to render a compact card (name, avatar, rating, specialties) using React/TS and styling; consumes API endpoint from 8.1. - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Implement ProviderProfileDetail modal at components/provider/ProviderProfileDetail.tsx to display full profile in modal with tabs (Overview, Reviews) and actions; fetches details via 8.1 API and caches via 8.6 if possible. - (L) (2 hours)\[FE\]\[BE\]
        
    *   API: Add authentication and secure fetching middleware in apps/api/middleware/auth.ts for getProviderDetails, ensuring only authorized requests can access provider details. - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   Infra: Add server-side caching and TTL for provider details in apps/api/services/cache/ProviderCache.ts, to reduce DB/API load for frequent provider detail fetches. - (M) (1 hours)\[FE\]\[BE\]
        
    *   Quality: Create performance and missing-data tests in tests/integration/providerProfile.test.ts to cover API, DB, and frontend paths, with profiling and data completeness checks. - (L) (2 hours)\[FE\]\[BE\]\[QA\]
        
*   **Price Positioning (bottom-right):** As a: shopper, I want to: see price positioning badge at bottom-right of service cards, So that: I can compare prices at a glance**(9 hours)** - Price badge appears on all visible service cards Badge remains visible on hover and respects responsive layouts Prices are fetched and rendered from service catalog data source Badge does not obstruct primary actions Accessible: badge has aria-label with price information
    
    *   Frontend: Add price field rendering to \`apps/web/components/catalog/CardItem.tsx\` - (M) (1 hours)\[FE\]
        
    *   API: Ensure fetchCatalogItems returns price in \`apps/api/routers/catalogRouter.ts\` (fetchCatalogItems) - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Implement PriceBadge component in \`apps/web/components/catalog/PriceBadge.tsx\` (bottom-right positioning) - (M) (1 hours)\[FE\]
        
    *   Frontend: Update \`apps/web/pages/catalog/CatalogGrid.tsx\` to pass price prop to CardItem and PriceBadge - (M) (1 hours)\[FE\]
        
    *   Styling: Add responsive Tailwind classes in \`apps/web/components/catalog/PriceBadge.tsx\` and \`apps/web/components/catalog/CardItem.tsx\` to keep badge visible on hover and small screens - (M) (1 hours)\[FE\]
        
    *   Accessibility: Add aria-label with price in \`apps/web/components/catalog/PriceBadge.tsx\` - (M) (1 hours)\[FE\]
        
    *   Testing: Add unit tests for PriceBadge rendering and aria-label in \`apps/web/components/catalog/\_\_tests\_\_/PriceBadge.test.tsx\` - (M) (1 hours)\[FE\]\[QA\]
        
    *   Integration: Add end-to-end test for catalog page price badges in \`apps/web/e2e/catalog/priceBadge.spec.ts\` - (M) (1 hours)\[FE\]\[QA\]
        
    *   Docs: Update component docs in \`docs/components/catalog/PriceBadge.md\` and acceptance notes - (M) (1 hours)\[FE\]
        
*   **Browse Styles:** As a: casual visitor, I want to: browse available art styles presented as media cards, So that: I can discover styles I might like.**(6 hours)** - User can scroll through a list of styles with visual cards Each card shows style name and thumbnail System loads initial set of styles within 1 second No broken images or layout shifts when scrolling
    
    *   API: Implement getStyles query in \`apps/api/routes/styleList/getStyles.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   DB: Add indexes for style\_media and style\_variants in \`apps/api/db/indexes.ts\` - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   Frontend: Build StylesList container in \`apps/mobile/src/screens/StyleList/StylesList.tsx\` - (M) (1 hours)\[FE\]
        
    *   Frontend: Build MediaCard component in \`apps/mobile/src/components/MediaCard/MediaCard.tsx\` - (XS) (0.5 hours)\[FE\]
        
    *   Frontend: Implement ImageLoader with caching and placeholder in \`apps/mobile/src/utils/ImageLoader.ts\` - (M) (1 hours)\[FE\]
        
    *   Frontend: Add styles slice and caching in \`apps/mobile/src/store/stylesSlice.ts\` - (S) (0.5 hours)\[FE\]
        
    *   Infra: Add Firestore storage rules and performance config in \`apps/api/config/firestore.rules\` - (M) (1 hours)\[FE\]\[BE\]\[DevOps\]
        
    *   Quality: Add unit and e2e tests in \`apps/mobile/src/\_\_tests\_\_/StylesList.test.tsx\` and \`apps/mobile/e2e/styleList.spec.ts\` - (S) (0.5 hours)\[FE\]\[QA\]
        
*   **View Style Details:** As a: casual visitor, I want to: view details of a selected style, So that: I can understand its characteristics before choosing to like or save.**(7 hours)** - User taps a style card and sees a details panel/modal Details include description, key attributes, and related styles Back navigation returns to the list without loss of scroll position Data loads within 2 seconds and images render correctly
    
    *   Frontend: Build Style Detail Panel component in \`components/styles/StyleDetailPanel.tsx\` (shows description, attributes, related styles) - (M) (1 hours)\[FE\]
        
    *   Frontend: Implement /styleDetail route in \`routes/styleDetail/StyleDetailRoute.tsx\` and connect \`comp\_styleDetail\_header\` and \`comp\_styleDetail\_media\` - (M) (1 hours)\[FE\]
        
    *   API: Add fetchStyleById query in \`apps/api/routers/styleDetail/router.ts\` (router\_route\_styleDetail) to return description, attributes, related styles) - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Add fetchStyleMedia in \`apps/api/routers/styleDetail/media.ts\` (router\_route\_styleDetail) to serve images and metadata) - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Implement Media Carousel in \`components/styles/StyleMediaCarousel.tsx\` (comp\_styleDetail\_media) with progressive image loading and caching) - (M) (1 hours)\[FE\]
        
    *   Frontend: Preserve scroll position in \`components/styles/StyleList.tsx\` (route\_styles\_flow) using navigation params and storage) - (M) (1 hours)\[FE\]
        
    *   Testing: Add integration test in \`tests/features/styleDetail.test.ts\` to assert data loads <2s, images render, back navigation restores scroll - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
*   **Favorite Style:** As a: registered user, I want to: favorite a style, So that: I can curate a personalized list of preferred styles.**(9 hours)** - User can toggle favorite on a style from list or details view Favorites persist across sessions for the same user UI shows favorite state and count Backend stores user favorites securely with per-user associations
    
    *   DB: Create favorites table migration in apps/api/migrations/create\_favorites\_table.sql with schema to persist user\_id, style\_id, and timestamp; must be idempotent and compatible with existing migrations. - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   API: Implement toggleSave mutation in apps/api/routes/styleDetail/handler.ts to toggle a user's favorite for a given style (insert/delete or upsert) and return current favorite state; ensure authorization and input validation. - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   API: Add getFavoriteIds query in apps/api/routes/styleList/handler.ts to fetch array of styleIds favorited by the authenticated user for listing optimization. - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   Backend: Add Firestore security rules and Cloud Function in apps/api/functions/favorites/onToggleFavorite.ts to respond to toggle events and maintain cross-service consistency (Firestore rules to protect read/write; Cloud Function to sync with Firestore). - (L) (2 hours)\[FE\]\[BE\]
        
    *   Frontend: Update Actions Panel component in components/styleDetail/ActionsPanel.tsx to toggle favorite and show current state using backend API. - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Update Styles List container in components/styles/StylesListContainer.tsx to show favorite count and support toggling from list items. - (M) (1 hours)\[FE\]
        
    *   State: Add favorites slice in apps/mobile/src/store/slices/favoritesSlice.ts with persistence - (S) (0.5 hours)\[FE\]
        
    *   Testing: Add integration tests in apps/api/tests/favorites.test.ts and apps/mobile/tests/favorites.integration.test.tsx - (L) (2 hours)\[FE\]\[BE\]\[QA\]
        
    *   Docs: Update README and docs/favorites.md in docs/features/favorites.md to reflect MVP feature usage, API contracts, and UI flows - (XS) (0.5 hours)\[FE\]\[BE\]
        
*   **See Price & Likes:** As a: registered user, I want to: see price and like counts for each style, So that: I can compare value and popularity.**(10 hours)** - Prices and like counts render accurately for each style Prices update in real-time or on a refresh Like counts reflect user interactions and total counts Prices and counts are accessible with screen readers
    
    *   DB: Add likes count index and schema update for \`table\_style\_likes\` in database migrations (\`apps/api/db/migrations/\`) - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement fetchStyleById in \`apps/api/services/styleService.ts\` to return price and likeCount (router: router\_route\_styleDetail) - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Add onStyleLikesUpdate subscription in \`apps/api/subscriptions/styleSubscriptions.ts\` (router: router\_route\_styleDetail) - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement toggleLikeStyle mutation in \`apps/api/routers/styleRoutes.ts\` updating \`table\_style\_likes\` (router: router\_route\_styleDetail) - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Create useStyleSubscription hook in \`apps/web/src/hooks/useStyleSubscription.ts\` to subscribe to onStyleLikesUpdate and price changes (route: route\_styleDetail) - (M) (1 hours)\[FE\]
        
    *   Frontend: Update StyleCard to display price and likes in \`apps/web/src/components/styles/StyleCard.tsx\` (route: route\_styles\_flow, comp: comp\_styles\_flow\_detail) - (M) (1 hours)\[FE\]
        
    *   Frontend: Update StyleDetailInfo to render accessible price and like counts in \`apps/web/src/components/styles/StyleDetailInfo.tsx\` (route: route\_styleDetail, comp: comp\_styleDetail\_info) - (M) (1 hours)\[FE\]
        
    *   Frontend: Add toggle like handler calling toggleLikeStyle in \`apps/web/src/components/styles/StyleCard.tsx\` (router: router\_route\_styles\_flow) - (M) (1 hours)\[FE\]
        
    *   Utils: Add price formatter in \`apps/web/src/utils/formatters/price.ts\` and use in components (comp: comp\_styleDetail\_info) - (M) (1 hours)\[FE\]
        
    *   Testing: Add unit/integration tests in \`apps/web/src/\_\_tests\_\_/stylePriceLikes.test.tsx\` to assert rendering, updates, and accessibility - (M) (1 hours)\[FE\]\[QA\]
        
*   **Catalog: (0 hours)**
    
*   **StyleDetail: (0 hours)**
    
*   **BookingFlow: (0 hours)**
    
*   **Profile:** As a: registered user, I want to: view and edit my profile, So that: I can manage personal preferences and connected styles.**(7 hours)** - Profile loads with user info and favorites Editing profile saves changes to backend Validation of inputs (email, name) Logout functionality present and working
    
    *   Frontend: Build Profile screen component in \`components/profile/ProfileScreen.tsx\` (loads user info & favorites) - (M) (1 hours)\[FE\]
        
    *   API: Add fetchUserProfile() endpoint in \`apps/api/routes/styleDetail.ts\` to return user profile and favorites (router\_route\_styleDetail) - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Add updateUserProfile() mutation in \`apps/api/routes/styleDetail.ts\` to save profile edits (router\_route\_styleDetail) - (M) (1 hours)\[FE\]\[BE\]
        
    *   Auth: Implement logout() in \`apps/api/services/auth/AuthService.ts\` and expose client method in \`services/authClient.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Add ProfileEdit form in \`components/profile/ProfileEditForm.tsx\` with validation for email and name - (M) (1 hours)\[FE\]\[QA\]
        
    *   DB: Ensure users table has profile fields; add migration in \`prisma/migrations/\` referencing table\_users - (M) (1 hours)\[FE\]
        
    *   Testing: Add integration tests in \`tests/profile.test.ts\` covering load, edit, validation, and logout - (M) (1 hours)\[FE\]\[QA\]
        
*   **History: (0 hours)**
    
*   **View Profile (shows payment option & discount badge):** As a: provider user, I want to: view my provider profile including payment option and discount badge, So that: I can present clear pricing and accepted payments to clients.**(7 hours)** - Profile page loads with payment option visible Discount badge is shown when applicable Profile reflects current pricing including any discounts Clicking profile items navigates to correct sections No broken UI elements on mobile and desktop
    
    *   API: Add getProviderPaymentOptions and getProviderDiscounts handlers in \`apps/api/routes/providerProfile.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Add selectPaymentOption and applyDiscountCode mutations in \`apps/api/routes/providerProfile.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Update /ProviderProfile route component in \`apps/web/src/routes/ProviderProfile.tsx\` to fetch payment options and discounts - (M) (1 hours)\[FE\]
        
    *   Frontend: Build Provider Profile Header component in \`apps/web/src/components/provider/ProviderProfileHeader.tsx\` to display payment option and discount badge - (M) (1 hours)\[FE\]
        
    *   State: Add providerProfile slice in \`apps/web/src/store/slices/providerProfileSlice.ts\` with selectPaymentOption and applyDiscountCode thunks - (M) (1 hours)\[FE\]
        
    *   Testing: Add integration tests for ProviderProfile in \`apps/web/src/\_\_tests\_\_/ProviderProfile.test.tsx\` (mobile and desktop viewports) - (M) (1 hours)\[FE\]\[QA\]
        
    *   QA: Add E2E navigation tests in \`apps/web/e2e/providerProfile.spec.ts\` to verify profile item navigation and pricing updates - (M) (1 hours)\[FE\]\[QA\]
        
*   **Select Provider & Slots:** As a: user, I want to: select a provider and available slots, So that: I can book an appointment.**(7 hours)** - Provider list is populated Available slots are shown per provider Selecting provider/slot enables next step Conflicts and timezones handled correctly Data persists across steps
    
    *   API: Implement getProviders in apps/api/routes/CatalogPage.ts to return provider list preserving existing route structure and authentication semantics. - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   API: Implement getProviderSlots in apps/api/routes/CatalogPage.ts (operation getProviderSlots) with timezone support preserving existing payload shape. - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Build Availability & Slot Selector component in components/provider/ProfileAvailability.tsx (comp\_provider\_profile\_availability) to render providers, availability grid and slots, with timezone-aware formatting. - (M) (1 hours)\[FE\]
        
    *   Frontend: Add hook useProviders in hooks/useProviders.ts to call apps/api/routes/CatalogPage.ts getProviders (route\_provider\_profile) - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   Frontend: Add hook useProviderSlots in hooks/useProviderSlots.ts to call apps/api/routes/CatalogPage.ts getProviderSlots - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   API: Implement reserveSlots mutation in apps/api/routes/CatalogPage.ts with conflict checks (mutation reserveSlots) - (L) (2 hours)\[FE\]\[BE\]
        
    *   Frontend: Persist selection to Redux in store/slices/bookingSlice.ts when provider/slot selected - (S) (0.5 hours)\[FE\]
        
    *   Testing: Add unit/integration tests in apps/web/\_\_tests\_\_/ProfileAvailability.test.tsx covering list, slots, selection, timezone - (M) (1 hours)\[FE\]\[QA\]
        
*   **Choose Payment Option (Pay Now / Pay on Site):** As a: provider, I want to: choose a payment option for a service, So that: clients can complete payment via Pay Now or pay on site, increasing flexibility and conversion.**(11 hours)** - User can select either Pay Now or Pay on Site during checkout System stores selected payment option with the booking Payment option is visible on the confirmation summary Edge: If Pay Now is chosen, payment is processed securely or instruction provided for On-Site payments
    
    *   Frontend: Add PaymentOptionSelector component in \`components/provider/PaymentOptionSelector.tsx\` (shows Pay Now / Pay on Site) | cites route\_provider\_profile - (M) (1 hours)\[FE\]
        
    *   Frontend: Connect selector to provider profile page in \`pages/provider/profile/ProviderProfile.tsx\` and route \`route\_provider\_profile\` | cites route\_provider\_profile - (M) (1 hours)\[FE\]
        
    *   State: Add paymentOption field to Redux slice in \`store/provider/providerSlice.ts\` (api\_development) | cites table\_provider\_profiles - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Create endpoint POST \`/bookings/{id}/payment-option\` in \`apps/api/controllers/bookingsController.ts\` to store payment option | cites table\_provider\_profiles table\_provider\_profiles - (M) (1 hours)\[FE\]\[BE\]
        
    *   DB: Add payment\_option column migration for \`provider\_profiles\` in \`prisma/migrations/\` to update \`table\_provider\_profiles\` | cites table\_provider\_profiles - (M) (1 hours)\[FE\]
        
    *   Backend: Implement savePaymentOption(bookingId, option) in \`apps/api/services/bookings/BookingService.ts\` to update booking record | cites table\_provider\_profiles table\_users - (M) (1 hours)\[FE\]\[BE\]
        
    *   Payment: Integrate Stripe intent creation in \`apps/api/services/payments/StripeService.ts\` when Pay Now selected (secure processing) | cites Stripe - (M) (1 hours)\[FE\]\[BE\]
        
    *   Cloud Function: Add \`functions/processOnSiteInstructions\` in \`apps/functions/processOnSiteInstructions/index.ts\` to generate instructions for On-Site payments | cites Cloud Functions - (M) (1 hours)\[FE\]
        
    *   Frontend: Show payment option on confirmation summary in \`components/provider/ConfirmationSummary.tsx\` | cites route\_provider\_profile table\_provider\_profiles - (M) (1 hours)\[FE\]
        
    *   Testing: Add unit tests for \`components/provider/PaymentOptionSelector.tsx\` in \`tests/components/provider/PaymentOptionSelector.test.tsx\` and for \`BookingService.ts\` in \`tests/services/bookings/BookingService.test.ts\` | cites table\_provider\_profiles - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   Docs: Update README and API docs in \`docs/provider/payment-options.md\` describing flow and endpoints | cites route\_provider\_profile apps/api - (M) (1 hours)\[FE\]\[BE\]
        
*   **Open Google OAuth:** As a: user, I want to: initiate Google OAuth login, So that: I can authenticate quickly with my Google account.**(8 hours)** - Google OAuth flow starts on user action Redirect URI is registered and valid OAuth consent screen displayed Access token received and stored securely Error handling for OAuth failures includes user-friendly messaging
    
    *   Frontend: Add Open Google OAuth button in \`components/provider/OpenGoogleOAuthButton.tsx\` (route: route\_provider\_profile) - (M) (1 hours)\[FE\]
        
    *   Config: Register redirect URI in \`expo/app.json\` and Firebase Console (route: route\_provider\_profile) - (M) (1 hours)\[FE\]\[DevOps\]
        
    *   API: Implement OAuth token exchange in \`apps/api/services/auth/AuthService.ts\` (auth\_service) - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Create Cloud Function callback in \`apps/api/functions/oauthCallback.ts\` to handle redirect and call AuthService (auth\_service) - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Handle OAuth redirect and consent screen in \`components/provider/OpenGoogleOAuthWebView.tsx\` (route\_provider\_profile) - (M) (1 hours)\[FE\]
        
    *   Storage: Securely store access token in \`apps/api/services/auth/AuthService.ts\` using Firestore \`table\_users\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   UX: Implement user-friendly OAuth error messages in \`components/provider/OpenGoogleOAuthButton.tsx\` and \`components/provider/OpenGoogleOAuthWebView.tsx\` (route\_provider\_profile) - (M) (1 hours)\[FE\]
        
    *   Testing: Add integration tests for OAuth flow in \`tests/oauth.test.ts\` - (M) (1 hours)\[FE\]\[QA\]
        
*   **Start Booking Flow:** As a: user, I want to: initiate the booking flow, So that: I can reserve a provider slot.**(8 hours)** - Booking flow starts and displays initial step User can progress to next step Data is retained between steps Validation errors are surfaced clearly Booking flow can be canceled gracefully
    
    *   Frontend: Implement BookingFlowContainer component in React at components/provider/BookingFlowContainer.tsx to orchestrate booking steps within route\_provider\_profile, managing local UI state and communicating with bookingFlowSlice for persisted state. - (M) (1 hours)\[FE\]
        
    *   Frontend: Create BookingStep1 component in components/provider/BookingStep1.tsx for route\_provider\_profile to collect initial booking details (e.g., service, date, time). Integrates with BookingFlowContainer and uses shared validation utilities. - (S) (0.5 hours)\[FE\]\[BE\]\[QA\]
        
    *   Frontend: Create BookingStep2 component in components/provider/BookingStep2.tsx for route\_provider\_profile to collect follow-up details (e.g., location, notes) and finalize local validation. - (S) (0.5 hours)\[FE\]\[QA\]
        
    *   State: Add booking flow slice in store/slices/bookingFlowSlice.ts for route\_provider\_profile to hold interim booking data, step index, and validation errors. - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   Navigation: Wire flow into routes/ProviderProfileRoute.tsx to start booking flow when user initiates booking, ensuring route guards and redirects handle unfinished flows. - (S) (0.5 hours)\[FE\]
        
    *   Validation: Implement validation utils in utils/validation/bookingValidation.ts to validate booking fields across steps (e.g., dates, times, required fields) and expose reusable validators. - (S) (0.5 hours)\[FE\]\[QA\]
        
    *   Persistence: Save interim booking state to Firestore in services/booking/BookingService.ts and reference table\_provider\_profiles - (L) (2 hours)\[FE\]\[BE\]
        
    *   Cancel: Implement cancel flow & cleanup in components/provider/BookingFlowContainer.tsx and store/slices/bookingFlowSlice.ts (route\_provider\_profile) - (S) (0.5 hours)\[FE\]
        
    *   Testing: Add unit tests for booking flow slice in \_\_tests\_\_/bookingFlowSlice.test.ts and components in \_\_tests\_\_/BookingFlow.test.ts (testing) - (S) (0.5 hours)\[FE\]\[QA\]
        
    *   Docs: Add README for booking flow in docs/booking\_flow.md and update route docs for route\_provider\_profile (documentation) - (M) (1 hours)\[FE\]
        
*   **See Specialties, Ratings & Prices (show discounted price):** As a: provider user, I want to: see my specialties, ratings and prices including discounted price, So that: I can present value to clients and adjust offerings.**(11 hours)** - Specialties are listed with accurate ratings and prices Discounted price is displayed when applicable Prices reflect current promotions Ratings are updated from latest reviews UI handles empty states gracefully
    
    *   API: Implement getProviderSpecialties() in \`apps/api/routes/providerProfile/getProviderSpecialties.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement getProviderServices() and getServicePrices() aggregation in \`apps/api/routes/providerProfile/getProviderServices.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   DB: Add price and discount fields to provider\_specialties access layer in \`apps/api/models/providerSpecialtyModel.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Subscribe onServicePriceUpdate in \`apps/api/routes/providerProfile/subscriptions/onServicePriceUpdate.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement getProviderRatings() using provider\_reviews in \`apps/api/routes/providerProfile/getProviderRatings.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Build SpecialtiesList component in \`apps/web/components/provider/SpecialtiesList.tsx\` to show name, rating, price, discounted price - (M) (1 hours)\[FE\]
        
    *   Frontend: Update /ProviderProfile route to use new data in \`apps/web/routes/ProviderProfile.tsx\` (route\_provider\_profile) - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Add empty state UI for specialties in \`apps/web/components/provider/SpecialtiesEmptyState.tsx\` - (M) (1 hours)\[FE\]
        
    *   Frontend: Integrate real-time rating updates via onRatingUpdated in \`apps/web/services/subscriptions/providerSubscriptions.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Testing: Add unit tests for price & discount logic in \`apps/api/\_\_tests\_\_/priceUtils.test.ts\` and \`apps/web/\_\_tests\_\_/SpecialtiesList.test.tsx\` - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   Docs: Update README for ProviderProfile data contracts in \`apps/api/README.md\` and \`apps/web/README.md\` - (M) (1 hours)\[FE\]\[BE\]
        
*   **Show Provider Timezone: (0 hours)**
    
*   **Display Provider Services:** As a: user, I want to: see provider services on the profile, So that: I can understand offerings at a glance**(3.5 hours)** - Provider services are visible on profile Service icons or names are readable If available, brief descriptions shown No broken media or links
    
    *   API: Implement services field on provider\_profiles model and map to DB (table\_provider\_profiles) to store provider services metadata (icons, names, descriptions) per provider. Ensure migrations reflect new column structure and data type support for arrays/JSON. Maintain existing provider\_profile relations and migration rollback path. - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Add GET /providers/:id/services endpoint in apps/api/routes/providerRoutes.ts to fetch and return the provider’s services (icons, names, descriptions) as a structured payload aligned with the provider's services field. - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   Frontend: Implement ProviderServicesList.tsx component under components/provider to render service icons, names, and descriptions using data from API and ensure accessibility (alt text) and responsive layout. - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   Frontend: Integrate ProviderServicesList into /ProviderProfile route at pages/provider/ProviderProfile.tsx by fetching provider services (via existing API) and embedding ProviderServicesList in route UI under route\_provider\_profile context. - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   Frontend: Add asset handling and broken media fallback in ServiceIcon.tsx to gracefully handle missing or corrupted service icons with a fallback image and ARIA attributes. - (XS) (0.5 hours)\[FE\]\[BE\]
        
    *   Testing: Add unit tests for ProviderServicesList.tsx and API tests for /providers/:id/services to validate data rendering and API contract. - (S) (0.5 hours)\[FE\]\[BE\]\[QA\]
        
*   **Select Service Style:** As a: provider, I want to: select the style of service (in-person, virtual, hybrid), So that: users can choose delivery mode that fits their needs**(9 hours)** - Service style options available and clearly labeled User selection updates booking model Pricing or availability adjustments reflect chosen style Edge: Default style chosen if user doesn't select one
    
    *   Frontend (UI): Add ServiceStyleSelector component in \`components/provider/ServiceStyleSelector.tsx\` - show labeled options - (M) (1 hours)\[FE\]\[BE\]
        
    *   State (Redux): Add serviceStyle field to booking slice in \`store/booking/bookingSlice.ts\` and actions to update selection - (M) (1 hours)\[FE\]\[BE\]
        
    *   Integration: Wire ServiceStyleSelector into \`routes/ProviderProfile.tsx\` (route\_provider\_profile) and pass props - (M) (1 hours)\[FE\]\[BE\]
        
    *   Logic: Implement price/availability adjustment in \`utils/pricing/adjustPricing.ts\` to compute changes based on service style - (M) (1 hours)\[FE\]\[BE\]
        
    *   Default: Set default service style in \`store/booking/bookingSlice.ts\` and ensure fallback in \`components/provider/ServiceStyleSelector.tsx\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Persist booking serviceStyle on createBooking in \`apps/api/controllers/bookingController.ts\` and validate payload - (M) (1 hours)\[FE\]\[BE\]
        
    *   DB: Add service\_style column to \`provider\_profiles\` or bookings table migration in \`apps/api/migrations/\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Testing: Add unit tests for \`components/provider/ServiceStyleSelector.test.tsx\` and \`utils/pricing/adjustPricing.test.ts\` - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   Docs: Document usage in \`docs/features/provider\_profile/SelectServiceStyle.md\` - (M) (1 hours)\[FE\]\[BE\]
        
*   **Show Provider Services:** As a: user, I want to: view the list of services offered by the provider, So that: I can decide what to book.**(5.5 hours)** - All provider services are displayed Service names are accurate Prices if shown are correct No.services loaded error handled gracefully Sorting/filtering existing services is functional if applicable
    
    *   API: Add getProviderServices endpoint in apps/api/services/provider/ProviderService.ts. Implement GET /providers/{providerId}/services to return list of services for a provider with fields id, name, price, duration, and availability. Ensure authentication middleware is applied and route registered in Express app. - (M) (1 hours)\[FE\]\[BE\]
        
    *   DB: Ensure provider\_services data accessible in table\_provider\_profiles query layer in apps/api/db/providerQueries.ts. Extend query to join provider\_services with provider\_profiles so that services data can be retrieved in a single fetch for the frontend. - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   Frontend: Build ServicesList component in components/provider/ServicesList.tsx to render services. Fetch from API, render list with ServiceItem components, handle loading, errors, and empty state. - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Connect /ProviderProfile route in routes/route\_provider\_profile.tsx to fetch from apps/api/services/provider/ProviderService.ts. Ensure route renders ProvidersServices within ProviderProfile page. - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Implement ServiceItem with accurate name/price in components/provider/ServiceItem.tsx. - (XS) (0.5 hours)\[FE\]\[BE\]
        
    *   Frontend: Add loading/error handling in components/provider/ServicesList.tsx for 'No.services loaded' errors - (XS) (0.5 hours)\[FE\]\[BE\]
        
    *   Frontend: Add sorting/filtering UI and logic in components/provider/ServicesList.tsx (api\_development, frontend\_component) - (M) (1 hours)\[FE\]\[BE\]
        
    *   Testing: Add unit tests for service rendering in \_\_tests\_\_/components/provider/ServicesList.test.tsx - (XS) (0.5 hours)\[FE\]\[BE\]\[QA\]
        
*   **Select Service Style:** As a: user, I want to: choose a service style (e.g., in-person, virtual), So that: I can pick the delivery method that suits me.**(1 hours)** - Service style options are displayed User can select one style without errors Selected style persists across steps Visual confirmation of chosen style Fallback to default style if none selected
    
    *   Frontend: Implement ServiceStyleSelector component at components/provider/ServiceStyleSelector.tsx using React and TypeScript. The component renders available service style options, shows visual confirmation for the selected option, and notifies the parent via onChange callback. Integrate with existing provider flow styling conventions (CSS modules or styled-components) and ensure keyboard accessibility (aria-selected, ARIA roles) and responsive layout. The component should be self-contained, with props: options: string\[\]; value?: string; onChange?: (value:string)=>void; and internal state for local selection if uncontrolled. Persist selection state to the parent context when available. - (M) (1 hours)\[FE\]\[BE\]
        
*   **Show Provider Timezone Label:** As a: user, I want to: see the provider's timezone label on their profile, So that: I can schedule calls in the correct local time.**(4 hours)** - Timezone label is visible on provider profile Label matches provider's configured timezone Timezone label updates when provider changes timezone Label is accessible (screen reader) No layout shift when timezone loads
    
    *   DB: Add timezone column to provider\_profiles in migrations/20251110\_add\_timezone.sql, update schema and roll forward migration to store provider timezone as string (e.g., IANA TZ) with NOT NULL default or migration backfill. - (XS) (0.5 hours)\[FE\]
        
    *   API: Expose timezone in ProviderService.getProfile in apps/api/services/providers/ProviderService.ts, returning timezone as part of provider profile payload with proper DTO shape. - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Fetch timezone in /ProviderProfile route in apps/web/routes/ProviderProfile.tsx, propagate through data layer for rendering. - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   Frontend: Render timezone label in apps/web/components/provider/ProviderProfileHeader.tsx with aria-label and visually-hidden fallback, ensuring accessible labeling. - (S) (0.5 hours)\[FE\]
        
    *   Frontend: Add loading placeholder to avoid layout shift in apps/web/components/provider/ProviderProfileHeader.tsx, reserve space for timezone label during load. - (S) (0.5 hours)\[FE\]
        
    *   Testing: Add unit test asserting timezone matches provider in apps/web/\_\_tests\_\_/ProviderProfile.test.tsx, mocking API response timezone field. - (S) (0.5 hours)\[FE\]\[BE\]\[QA\]
        
    *   Testing: Add accessibility test for timezone label in apps/web/\_\_tests\_\_/ProviderProfile.a11y.test.tsx, ensuring proper aria-label and focus management. - (S) (0.5 hours)\[FE\]\[QA\]
        

### **Milestone 4: Booking Flow & Scheduling: select service/style, provider availability, booking screen, timezone handling**

_Estimated 879 hours_

*   **Confirm & Pay (choose pay\_now or pay\_on\_site; show 10% prepay discount when selected):** As a: user, I want to: Confirm a booking and choose between paying now or paying on-site, So that: I can secure the appointment with the preferred payment method and receive a 10% prepay discount if I opt to pay now.**(9 hours)** - User can select payment method at confirmation: pay\_now or pay\_on\_site When pay\_now is selected, system applies 10% prepay discount and shows updated total Payment is processed successfully for pay\_now option or securely captured for pay\_on\_site with invoice/QR System prevents proceeding without selecting a valid payment option Discount visibility and final price reflect in booking summary
    
    *   Frontend: Update ConfirmationPanel in \`components/booking/ConfirmationPanel.tsx\` to display 10% prepay discount and updated total - (M) (1 hours)\[FE\]
        
    *   API: Add applyEarlyPaymentDiscount mutation handler in \`apps/api/routes/booking/bookingRouter.ts\` to calculate 10% discount - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement createPaymentIntent in \`apps/api/routes/booking/bookingRouter.ts\` to call Stripe for pay\_now - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement confirmPaymentOnSite mutation in \`apps/api/routes/booking/bookingRouter.ts\` to create pending payment and invoice/QR - (M) (1 hours)\[FE\]\[BE\]
        
    *   Backend: Add processPrepayment Cloud Function in \`apps/api/functions/processPrepayment.ts\` to finalize Stripe webhook processing - (M) (1 hours)\[FE\]\[BE\]
        
    *   DB: Add payment\_discounts row for 10% prepay in \`apps/api/migrations/2025\_add\_prepay\_discount.sql\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend/API: Prevent proceed without selection by validating in \`components/booking/ConfirmationPanel.tsx\` and \`apps/api/routes/booking/bookingRouter.ts\` confirmBooking mutation - (M) (1 hours)\[FE\]\[BE\]
        
    *   Testing: Add unit tests for discount calc in \`apps/api/tests/booking/discount.test.ts\` and UI tests in \`apps/web/tests/ConfirmationPanel.test.tsx\` - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   Documentation: Update booking flow docs in \`docs/features/booking/confirm\_and\_pay.md\` - (M) (1 hours)\[FE\]
        
*   **Provider Selection:** As a: service seeker, I want to: select a provider for my booking, So that: I can confirm the appointment with the preferred professional**(6.5 hours)** - User can view a list of providers User can filter providers by rating or availability System stores selected provider with the booking Provider selection persists across navigation within the booking flow
    
    *   Frontend: Build ProviderList component in \`components/booking/ProviderList.tsx\` (shows providers list) -> cites route\_bookingFlow & comp\_bookingFlow\_mainPanel - (S) (0.5 hours)\[FE\]
        
    *   Frontend: Add ProviderFilter component in \`components/booking/ProviderFilter.tsx\` (rating & availability filters) -> cites route\_bookingFlow & comp\_bookingFlow\_mainPanel - (S) (0.5 hours)\[FE\]
        
    *   API: Implement getProviders query in \`apps/api/routers/bookingFlow.ts\` (support filter params) -> cites router\_route\_bookingFlow & table\_providers - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement refreshProviderAvailability mutation in \`apps/api/routers/bookingFlow.ts\` (update availability) -> cites router\_route\_bookingFlow & table\_providers - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Persist selected provider in Redux and BookingContext in \`store/booking/bookingSlice.ts\` and \`components/booking/BookingContext.tsx\` (persist across navigation) -> cites comp\_bookingFlow\_mainPanel & route\_bookingFlow & table\_appointments - (M) (1 hours)\[FE\]
        
    *   Backend: Store selected provider on booking in \`apps/api/routers/bookingFlow.ts\` bookAppointment mutation (save provider\_id into appointments row) -> cites router\_route\_bookingFlow & table\_appointments & table\_providers - (L) (2 hours)\[FE\]\[BE\]
        
    *   Testing/Docs: Add tests in \`\_\_tests\_\_/booking/providerSelection.test.ts\` and update docs \`docs/booking/provider-selection.md\` (tests for viewing, filtering, persistence) -> cites route\_bookingFlow & router\_route\_bookingFlow & table\_providers - (S) (0.5 hours)\[FE\]\[QA\]
        
*   **DateTime Picker:** As a: user, I want to: pick a date and time for the booking, So that: I can schedule the appointment according to my availability**(10 hours)** - User can select date from calendar User can select time slots based on provider availability Selected date/time are shown in booking summary Invalid dates/time? prevented with validation
    
    *   Frontend: Create DateTimePicker component in \`apps/mobile/components/booking/DateTimePicker.tsx\` - (M) (1 hours)\[FE\]
        
    *   Frontend: Integrate DateTimePicker into BookingFlowScreen in \`apps/mobile/screens/BookingFlowScreen.tsx\` (route\_bookingFlow, comp\_bookingFlow\_schedulePanel) - (M) (1 hours)\[FE\]
        
    *   API: Implement slot fetch endpoint in \`apps/api/routes/bookingFlow/slots.ts\` (router\_route\_bookingFlow) - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Add onSlotUpdates subscription in \`apps/api/routes/bookingFlow/index.ts\` (router\_route\_bookingFlow) - (M) (1 hours)\[FE\]\[BE\]
        
    *   DB: Ensure provider availability queries reference \`table\_providers\` and \`table\_appointments\` in \`apps/api/services/booking/BookingService.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   State: Add booking datetime slice in \`apps/mobile/store/slices/bookingSlice.ts\` (used by route\_bookingPage) - (M) (1 hours)\[FE\]
        
    *   Validation: Implement date/time validation in \`apps/mobile/utils/validation/bookingValidation.ts\` - (M) (1 hours)\[FE\]\[QA\]
        
    *   UI: Display selected date/time in booking summary in \`apps/mobile/components/booking/BookingSummary.tsx\` (route\_bookingPage) - (M) (1 hours)\[FE\]
        
    *   Tests: Add unit tests for DateTimePicker in \`apps/mobile/\_\_tests\_\_/DateTimePicker.test.tsx\` - (M) (1 hours)\[FE\]\[QA\]
        
    *   Docs: Add usage docs in \`docs/booking/DateTimePicker.md\` - (M) (1 hours)\[FE\]
        
*   **Payment Options:** As a: user, I want to: view and choose payment options for the booking, So that: I can complete the transaction securely**(7 hours)** - Available payment methods displayed User can select a method and see fees if any Payment method persists to confirmation Fallback when a method is unavailable
    
    *   Frontend: Implement Payment Panel UI in React at components/booking/PaymentPanel.tsx to render available payment methods, show fees when provided, and integrate with local booking state for updates. - (S) (0.5 hours)\[FE\]
        
    *   API: Implement fetchPaymentMethods in apps/api/routes/bookingFlow.ts to return available payment methods and associated fees for the current booking. - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Add method selection persistence to components/booking/BookingConfirmation.tsx by saving the selected method into the booking state slice at store/bookingSlice.ts, ensuring persistence across navigation. - (M) (1 hours)\[FE\]
        
    *   API: Implement confirmPayment mutation in apps/api/routes/bookingFlow.ts to persist chosen payment method to table\_appointments record and return confirmation payload. - (L) (2 hours)\[FE\]\[BE\]
        
    *   Backend: Add payment method availability fallback logic in apps/api/routes/bookingFlow.ts using router\_route\_bookingFlow query fetchPaymentOptions to ensure a method is offered when primary source fails. - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   Frontend: Show fees and unavailable state in components/booking/PaymentPanel.tsx with UX fallback message when fees are missing or methods unavailable. - (S) (0.5 hours)\[FE\]
        
    *   Testing: Add unit tests for components/booking/PaymentPanel.test.tsx and API tests for apps/api/routes/bookingFlow.test.ts. - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   Documentation: Update booking flow docs in docs/booking/payment-options.md to reflect new payment flow, methods, and fallbacks. - (XS) (0.5 hours)\[FE\]
        
*   **Payment Method Select:** As a: user, I want to: select a payment method for the booking, So that: I can complete the transaction with chosen method**(8 hours)** - User can choose from stored and new methods Selected method displayed in summary Method details validated (card number, expiry) Error handling on invalid payment details
    
    *   Frontend: Build PaymentPanel component in \`components/bookingFlow/PaymentPanel.tsx\` (uses comp\_bookingFlow\_paymentPanel) - (M) (1 hours)\[FE\]
        
    *   Frontend: Implement PaymentMethodList in \`components/bookingFlow/PaymentMethodList.tsx\` (show stored & add new; update route\_bookingFlow state) - (M) (1 hours)\[FE\]
        
    *   Frontend: Add PaymentSummary display in \`components/bookingFlow/PaymentSummary.tsx\` (show selected method on route\_bookingPage) - (M) (1 hours)\[FE\]
        
    *   API: Add fetchPaymentMethods handler to \`apps/api/routes/bookingFlow.ts\` (router\_route\_bookingFlow) to return stored methods - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement confirmPayment validation in \`apps/api/routes/bookingFlow.ts\` (router\_route\_bookingFlow) validating card number & expiry - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   Backend: Store new payment method in \`table\_users\` payment\_methods field via \`apps/api/services/payments/PaymentService.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Validation: Create card validation util in \`apps/api/utils/validation/cardValidator.ts\` and \`components/bookingFlow/validators.ts\` for frontend/backend consistency - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   QA: Add tests in \`apps/api/tests/bookingFlow.payment.spec.ts\` and \`components/bookingFlow/\_\_tests\_\_/PaymentPanel.test.tsx\` for selection, validation, and error handling - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
*   **Confirm Booking:** As a: user, I want to: confirm the booking, So that: the appointment is finalized and stored**(7.5 hours)** - Booking created in system Confirmation displayed to user Booking details stored with all selections Retry mechanism on failure
    
    *   DB: Create appointments migration in \`apps/api/migrations/202511\_create\_appointments.sql\` to store booking details and selections (table\_appointments) - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   API: Implement BookingService.createBooking in \`apps/api/services/booking/BookingService.ts\` to validate, persist booking and reference \`table\_services\` & \`table\_users\` (table\_appointments, table\_services, table\_users) - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Add Cloud Function createBooking in \`apps/api/functions/createBooking.ts\` with retry/backoff and idempotency logic (table\_appointments) - (L) (2 hours)\[FE\]\[BE\]
        
    *   Frontend: Build ConfirmButton component in \`components/booking/ConfirmButton.tsx\` to call createBooking and implement client retry UX (route\_bookingPage, route\_bookingFlow) - (M) (1 hours)\[FE\]
        
    *   Frontend: Create Confirmation component in \`components/booking/Confirmation.tsx\` to display booking confirmation and details (route\_bookingPage) - (S) (0.5 hours)\[FE\]
        
    *   Testing: Add unit tests for BookingService in \`apps/api/services/booking/\_\_tests\_\_/BookingService.test.ts\` and e2e test \`e2e/confirmBooking.spec.ts\` for retry and confirmation display (testing) - (L) (2 hours)\[FE\]\[BE\]\[QA\]
        
    *   Docs: Update \`docs/booking.md\` describing API, frontend flow, and retry behavior (documentation) - (XS) (0.5 hours)\[FE\]\[BE\]
        
*   **Manage Booking Actions:** As a: user, I want to: manage booking actions (reschedule/cancel), So that: I can adjust or cancel bookings as needed**(10 hours)** - User can reschedule from booking screen User can cancel booking with confirmation Updated booking reflects in system and calendar Conflict handling with existing bookings
    
    *   DB: Create appointments migration in \`apps/api/db/migrations/appointments\_migration.sql\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement reschedule endpoint in \`apps/api/functions/booking.ts\` and \`apps/api/services/appointments/AppointmentService.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement cancel endpoint with confirmation logic in \`apps/api/functions/booking.ts\` and \`apps/api/services/appointments/AppointmentService.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Backend: Add conflict detection in \`apps/api/services/appointments/ConflictChecker.ts\` using \`table\_appointments\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Build BookingActions component in \`apps/mobile/components/booking/BookingActions.tsx\` and wire into \`route\_bookingPage\` (\`/BookingPage\`) and \`route\_bookingFlow\` (\`/BookingFlow\`) - (M) (1 hours)\[FE\]
        
    *   Frontend: Add CancelModal in \`apps/mobile/components/booking/CancelModal.tsx\` and integrate in \`apps/mobile/screens/BookingPage.tsx\` - (M) (1 hours)\[FE\]
        
    *   Integration: Sync updates to Google Calendar in \`apps/api/services/calendar/CalendarSync.ts\` using Google Calendar API and \`apps/api/functions/booking.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Infra: Configure calendar credentials in \`apps/api/config/calendar.ts\` and deploy to \`firebase/functions\` - (M) (1 hours)\[FE\]\[BE\]\[DevOps\]
        
    *   Quality: Add unit & integration tests in \`tests/booking/appointment.test.ts\` covering reschedule, cancel, conflict cases - (M) (1 hours)\[FE\]\[QA\]
        
    *   Docs: Update \`docs/booking\_actions.md\` and add API docs for endpoints in \`apps/api/docs/booking.md\` - (M) (1 hours)\[FE\]\[BE\]
        
*   **Select Service: (6 hours)** - Story functionality is implemented as specified User interface is responsive and accessible Data is properly validated and stored Error handling provides helpful feedback
    
    *   API: Implement getServicesForBookingPage() in apps/api/routes/bookingPage/getServicesForBookingPage.ts using existing service catalog cache and provider linkage to return services for the booking page with pagination and optional provider filtering. Integrates with providers table via foreign key, returns 200 with JSON payload or 500 on error. - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement selectServiceForBooking() mutation in apps/api/routes/bookingPage/selectServiceForBooking.ts to update the booking context with chosen service, perform validation, and emit success state. Uses GraphQL/REST mutation depending on stack and updates session or booking draft in DB. - (S) (0.5 hours)\[FE\]\[BE\]\[QA\]
        
    *   DB: Add services seed/migration referencing providers in apps/api/db/migrations/20251110\_create\_services.sql to seed services table with foreign keys to providers for MVP scenario. - (XS) (0.5 hours)\[FE\]\[BE\]
        
    *   Frontend: Build ServiceSelector component in apps/mobile/components/booking/ServiceSelector.tsx using React/React Native, consuming API getServicesForBookingPage and allowing user to choose a service with provider context display. - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Add route /BookingPage and wire Service Selector in apps/mobile/screens/BookingPage.tsx to present booking flow step for service selection. - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   Frontend: Implement selection state and persistence in apps/mobile/state/booking/bookingSlice.ts to store selected\_service\_id and persist to local storage or cross-session scope. - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   Validation: Add client-side validation for service selection in apps/mobile/components/booking/ServiceSelector.tsx - (S) (0.5 hours)\[FE\]\[BE\]\[QA\]
        
    *   ErrorHandling: Add user-friendly error UI and logging for service load/select in apps/mobile/components/booking/ServiceSelector.tsx - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   Testing: Add unit tests for API endpoints in apps/api/tests/bookingPage.spec.ts - (S) (0.5 hours)\[FE\]\[BE\]\[QA\]
        
    *   Testing: Add component tests for ServiceSelector in apps/mobile/tests/ServiceSelector.test.tsx - (S) (0.5 hours)\[FE\]\[BE\]\[QA\]
        
    *   Docs: Document Select Service behavior in docs/features/booking/select-service.md - (XS) (0.5 hours)\[FE\]\[BE\]
        
*   **Choose Provider (by professional): (8.5 hours)** - Story functionality is implemented as specified User interface is responsive and accessible Data is properly validated and stored Error handling provides helpful feedback
    
    *   API: Implement fetchProviders query in apps/api/routes/bookingPage.ts - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   API: Implement fetchProviderById query in apps/api/routes/bookingPage.ts - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   API: Implement updatePreferredProvider mutation in apps/api/routes/bookingPage.ts - (M) (1 hours)\[FE\]\[BE\]
        
    *   Service: Add providers queries in apps/api/services/providersService.ts (query table\_providers) - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Build ProviderSelector component in apps/web/components/ProviderSelector.tsx (uses comp\_bookingPage\_providerSelector) - (M) (1 hours)\[FE\]
        
    *   Frontend: Build ProviderSelector component in apps/mobile/components/ProviderSelector.tsx (uses comp\_bookingPage\_providerSelector) - (M) (1 hours)\[FE\]
        
    *   Frontend: Integrate ProviderSelector into /BookingPage at apps/web/pages/bookingPage.tsx and apps/mobile/screens/BookingPage.tsx (route\_bookingPage) - (M) (1 hours)\[FE\]
        
    *   DB: Ensure providers table indexes and relationships for table\_providers in apps/api/db/migrations/ - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   Test: Add unit tests for providersService in apps/api/tests/providers.test.ts - (S) (0.5 hours)\[FE\]\[BE\]\[QA\]
        
    *   Test: Add integration tests for ProviderSelector in apps/web/tests/ProviderSelector.test.tsx and apps/mobile/tests/ProviderSelector.test.tsx - (M) (1 hours)\[FE\]\[QA\]
        
    *   Docs: Update choose-provider docs in docs/booking/choose-provider.md - (XS) (0.5 hours)\[FE\]
        
*   **Pick Date & Time (provider availability): (6 hours)** - Story functionality is implemented as specified User interface is responsive and accessible Data is properly validated and stored Error handling provides helpful feedback
    
    *   Frontend: Build SchedulePicker component in components/booking/SchedulePicker.tsx (uses comp\_bookingPage\_schedulePicker) - (XS) (0.5 hours)\[FE\]
        
    *   API: Add fetchAvailableSlots & fetchProviderTimeZone endpoints in apps/api/routes/bookingPage.ts (maps to router\_route\_bookingPage) - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   Service: Implement AvailabilityService.fetchProviderAvailability in apps/api/services/availability/AvailabilityService.ts (uses router\_route\_bookingPage) - (M) (1 hours)\[FE\]\[BE\]
        
    *   Function: Implement holdTimeSlot & reserveTimeSlot Cloud Functions in apps/api/functions/booking/holdTimeSlot.ts and apps/api/functions/booking/reserveTimeSlot.ts (maps to router\_route\_bookingPage) - (L) (2 hours)\[FE\]\[BE\]
        
    *   Frontend: Integrate SchedulePicker with API calls in components/booking/SchedulePicker.tsx (uses comp\_bookingPage\_schedulePicker and router\_route\_bookingPage) - (M) (1 hours)\[FE\]\[BE\]
        
    *   UX: Implement responsive & accessible styles in components/booking/SchedulePicker.tsx and styles/tailwind.config.js (references comp\_bookingPage\_schedulePicker) - (S) (0.5 hours)\[FE\]\[DevOps\]
        
    *   Validation: Add client-side validation and timezone conversion in components/booking/SchedulePicker.tsx (uses fetchProviderTimeZone) - (S) (0.5 hours)\[FE\]\[QA\]
        
*   **Manage Booking (reschedule/cancel): (9 hours)** - Story functionality is implemented as specified User interface is responsive and accessible Data is properly validated and stored Error handling provides helpful feedback
    
    *   DB: Add reschedule/cancel fields to \`apps/api/models/appointments.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement rescheduleAppointment() in \`apps/api/services/appointments/AppointmentService.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Add /appointments/:id/reschedule route in \`apps/api/routes/appointments.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement cancelAppointment() in \`apps/api/services/appointments/AppointmentService.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Build RescheduleModal component in \`apps/mobile/components/booking/RescheduleModal.tsx\` - (M) (1 hours)\[FE\]
        
    *   Frontend: Add Cancel button and handler in \`apps/mobile/screens/BookingPage.tsx\` (route\_bookingPage) - (M) (1 hours)\[FE\]
        
    *   Frontend: Update BookingPage to call reschedule/cancel APIs in \`apps/mobile/screens/BookingPage.tsx\` (route\_bookingPage) - (M) (1 hours)\[FE\]\[BE\]
        
    *   Testing: Add integration tests for reschedule/cancel in \`apps/api/tests/appointments.test.ts\` and \`apps/mobile/tests/BookingPage.test.tsx\` - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   Docs: Document API endpoints and UI behavior in \`docs/features/manage-booking.md\` - (M) (1 hours)\[FE\]\[BE\]
        
*   **Show Discount Info & Payment Options:** As a: registered user, I want to: view discount information and available payment options, so that: I understand savings and can choose a suitable payment method.**(9 hours)** - Discount details are displayed prominently with accuracy All supported payment methods are listed and selectable Selecting a payment method shows corresponding UI and requirements Discount eligibility and amount are recalculated based on booking data No navigation away from the booking screen unless requested by user
    
    *   DB: Create payment\_discounts migration in \`apps/api/db/migrations/payment\_discounts.sql\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement recalculateDiscount Cloud Function in \`apps/api/functions/recalculateDiscount.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Add DiscountInfo component in \`apps/mobile/components/booking/DiscountInfo.tsx\` - (M) (1 hours)\[FE\]
        
    *   Frontend: Update BookingPage to display discounts and payment options in \`apps/mobile/screens/BookingPage.tsx\` - (M) (1 hours)\[FE\]
        
    *   Frontend: Build PaymentOptions component with selectable methods in \`apps/mobile/components/booking/PaymentOptions.tsx\` - (M) (1 hours)\[FE\]
        
    *   API: Add payment\_discounts table reference in \`apps/api/services/discounts/DiscountService.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Integration: Integrate Stripe payment UI in \`apps/mobile/components/booking/StripePayment.tsx\` - (M) (1 hours)\[FE\]
        
    *   Testing: Add unit/integration tests in \`apps/mobile/\_\_tests\_\_/booking/discount.test.tsx\` - (M) (1 hours)\[FE\]\[QA\]
        
    *   Docs: Update booking docs in \`docs/booking.md\` - (M) (1 hours)\[FE\]
        
*   **Provider Calendar Invite (Google Calendar sync): (40 hours)** - Event is created in provider's Google Calendar upon booking confirmation Event contains correct date, time, and participant details Calendar invite link is shared with provider Sync respects time zones and updates if booking changes No duplicate calendar events on reruns or updates
    
    *   Infra: Add Google API keys & service account to \`apps/api/.env\` and Firebase functions config\` (4 hours)\[FE\]\[BE\]\[DevOps\]
        
    *   API: Implement CalendarService.createEvent() in \`apps/api/services/calendar/CalendarService.ts\` (4 hours)\[FE\]\[BE\]
        
    *   CloudFunction: Create \`apps/api/functions/createCalendarEvent.ts\` to trigger on booking confirmation in \`table\_appointments\` (4 hours)\[FE\]\[BE\]
        
    *   DB: Add \`calendarEventId\` and \`calendarSync\` fields to \`table\_appointments\` migration in \`apps/api/db/migrations/\` (4 hours)\[FE\]\[BE\]
        
    *   Frontend: Call booking confirmation handler in \`route\_bookingPage\` to invoke Cloud Function via \`apps/api/services/booking/BookingService.ts\` (4 hours)\[FE\]\[BE\]
        
    *   API: Implement idempotent upsert in \`apps/api/services/calendar/CalendarService.ts\` to prevent duplicate events (4 hours)\[FE\]\[BE\]
        
    *   API: Implement CalendarService.updateEvent() in \`apps/api/services/calendar/CalendarService.ts\` to handle booking updates (4 hours)\[FE\]\[BE\]
        
    *   Frontend: Display provider calendar invite link in \`route\_bookingPage\` UI component \`components/booking/InviteLink.tsx\` (4 hours)\[FE\]
        
    *   Testing: Add integration tests for Calendar sync in \`apps/api/tests/calendarSync.test.ts\` (4 hours)\[FE\]\[BE\]\[QA\]
        
    *   Quality: Add docs for Google Calendar setup in \`docs/integrations/google-calendar.md\` (4 hours)\[FE\]\[DevOps\]
        
*   **Client Calendar Invite (Google Calendar sync): (40 hours)** - Event is created in client's Google Calendar upon booking confirmation Event contains correct date, time, and participant details Calendar invite link is shared with client Timezone handling is correct and updates on booking changes No duplicate calendar events on reruns or updates
    
    *   API: Add calendarEventId field to appointments table in \`apps/api/models/appointments.ts\` (link to table\_appointments) (4 hours)\[FE\]\[BE\]
        
    *   API: Implement CalendarService.createEvent() in \`apps/api/services/calendar/CalendarService.ts\` (uses Google Calendar API) (4 hours)\[FE\]\[BE\]
        
    *   API: Implement CalendarService.updateEvent() in \`apps/api/services/calendar/CalendarService.ts\` (4 hours)\[FE\]\[BE\]
        
    *   API: Implement CalendarService.deleteEvent() in \`apps/api/services/calendar/CalendarService.ts\` (4 hours)\[FE\]\[BE\]
        
    *   Infra: Add Cloud Function trigger \`apps/api/functions/onBookingConfirmed.ts\` to create/update calendar event from appointment (uses table\_appointments) (4 hours)\[FE\]\[BE\]
        
    *   API: Store OAuth tokens in \`apps/api/services/auth/TokenStore.ts\` and link to user in table\_users (4 hours)\[FE\]\[BE\]
        
    *   Frontend: Update BookingPage component in \`apps/web/pages/booking/BookingPage.tsx\` to display calendar invite link (route\_bookingPage) (4 hours)\[FE\]
        
    *   API: Add idempotency check in \`apps/api/functions/onBookingConfirmed.ts\` using appointments.calendarEventId to prevent duplicates (references table\_appointments) (4 hours)\[FE\]\[BE\]
        
    *   API: Handle timezone: convert appointment times in \`apps/api/services/calendar/CalendarService.ts\` using IANA TZ from appointment record (references table\_appointments) (4 hours)\[FE\]\[BE\]
        
    *   Testing: Add integration tests in \`apps/api/tests/calendar/onBookingConfirmed.test.ts\` for create/update/delete events (4 hours)\[FE\]\[BE\]\[QA\]
        
*   **Display Discounted Price: (36 hours)** - Story functionality is implemented as specified User interface is responsive and accessible Data is properly validated and stored Error handling provides helpful feedback
    
    *   DB: Verify/payment\_discounts table indexes and sample data in \`apps/api/db/payment\_discounts.sql\` (4 hours)\[FE\]\[BE\]
        
    *   API: Add Cloud Function endpoint getDiscountsForService(serviceId) in \`apps/api/functions/discounts/getDiscountsForService.ts\` (4 hours)\[FE\]\[BE\]
        
    *   API: Add Firestore read helper in \`apps/api/services/discounts/DiscountService.ts\` to query table\_payment\_discounts (ID: \`table\_payment\_discounts\`) entry (4 hours)\[FE\]\[BE\]
        
    *   Frontend: Create discount util calculateDiscountedPrice(originalPrice:number, discountRules) in \`apps/mobile/src/utils/price/discount.ts\` (4 hours)\[FE\]
        
    *   Frontend: Fetch discounts on /BookingPage component \`apps/mobile/src/screens/BookingPage/BookingPage.tsx\` and reference route\_bookingPage (ID: \`route\_bookingPage\`) to display price (4 hours)\[FE\]
        
    *   Frontend: Build DiscountPrice component in \`apps/mobile/src/components/booking/DiscountPrice.tsx\` (accessible, responsive) to show original, discount, final price (4 hours)\[FE\]
        
    *   Frontend: Add validation and error handling in \`apps/mobile/src/screens/BookingPage/BookingPage.tsx\` when discounts API fails (4 hours)\[FE\]\[BE\]\[QA\]
        
    *   Testing: Add unit tests for discount util in \`apps/mobile/src/utils/price/\_\_tests\_\_/discount.test.ts\` and integration tests for BookingPage in \`apps/mobile/\_\_tests\_\_/BookingPage.integration.test.tsx\` (4 hours)\[FE\]\[QA\]
        
    *   Documentation: Update README and component doc in \`apps/mobile/src/components/booking/README.md\` describing discount behavior and acceptance criteria (4 hours)\[FE\]
        
*   **Select Payment Method (save methods): (36 hours)** - Story functionality is implemented as specified User interface is responsive and accessible Data is properly validated and stored Error handling provides helpful feedback
    
    *   Frontend: Build PaymentMethodSelector component in \`components/payment/PaymentMethodSelector.tsx\` (4 hours)\[FE\]
        
    *   Frontend: Add UI route integration in \`/BookingPage\` file \`pages/booking/BookingPage.tsx\` to include PaymentMethodSelector (route\_bookingPage) (4 hours)\[FE\]
        
    *   API: Implement savePaymentMethod endpoint in \`apps/api/functions/payment/savePaymentMethod.ts\` (4 hours)\[FE\]\[BE\]
        
    *   DB: Add payment\_methods subcollection write in \`apps/api/services/payment/PaymentService.ts\` for \`table\_users\` and \`table\_payment\_discounts\` (4 hours)\[FE\]\[BE\]
        
    *   Integration: Connect PaymentMethodSelector to save endpoint in \`components/payment/PaymentMethodSelector.tsx\` -> \`apps/api/functions/payment/savePaymentMethod.ts\` (4 hours)\[FE\]\[BE\]
        
    *   Testing: Add unit tests for \`components/payment/PaymentMethodSelector.test.tsx\` and \`apps/api/functions/payment/savePaymentMethod.test.ts\` (testing) (4 hours)\[FE\]\[BE\]\[QA\]
        
    *   Accessibility: Ensure PaymentMethodSelector is accessible in \`components/payment/PaymentMethodSelector.tsx\` (route\_bookingPage) (4 hours)\[FE\]
        
    *   Validation: Implement client-side validation in \`components/payment/PaymentMethodSelector.tsx\` and server-side validation in \`apps/api/functions/payment/savePaymentMethod.ts\` (4 hours)\[FE\]\[BE\]\[QA\]
        
    *   ErrorHandling: Add user-friendly error messages in \`components/payment/PaymentMethodSelector.tsx\` and log errors to Sentry in \`apps/api/functions/payment/savePaymentMethod.ts\` (4 hours)\[FE\]\[BE\]
        
*   **Show Payment Receipt & Booking Summary: (32 hours)** - Story functionality is implemented as specified User interface is responsive and accessible Data is properly validated and stored Error handling provides helpful feedback
    
    *   DB: Add receipt and summary fields to \`table\_appointments\` in migration \`migrations/202511\_add\_receipt\_fields.sql\` (4 hours)\[FE\]
        
    *   API: Create Cloud Function saveBookingReceipt in \`apps/api/functions/saveBookingReceipt/index.ts\` to store receipt data to \`table\_appointments\` (4 hours)\[FE\]\[BE\]
        
    *   Frontend: Build BookingSummary component in \`components/booking/BookingSummary.tsx\` to display receipt & booking details on \`route\_bookingPage\` (4 hours)\[FE\]
        
    *   Frontend: Add ReceiptView modal in \`components/booking/ReceiptView.tsx\` with responsive layout and accessibility attributes for \`route\_bookingPage\` (4 hours)\[FE\]
        
    *   API: Add validation and error handling in \`apps/api/services/booking/BookingService.ts\` for receipt data and Firestore writes (4 hours)\[FE\]\[BE\]\[QA\]
        
    *   Frontend: Integrate BookingSummary with Redux in \`store/booking/bookingSlice.ts\` and fetch via \`apps/api/functions/getBooking.ts\` (4 hours)\[FE\]\[BE\]
        
    *   Testing: Add unit tests for BookingSummary and ReceiptView in \`\_\_tests\_\_/components/booking/BookingSummary.test.tsx\` (4 hours)\[FE\]\[QA\]
        
    *   Documentation: Update README on \`route\_bookingPage\` usage and receipts in \`docs/booking/receipt.md\` (4 hours)\[FE\]
        
*   **View Style Options (images, price, likes): (0 hours)**
    
*   **Select Style & Quantity: (0 hours)**
    
*   **Apply 10% Prepay Discount Opt-in: (0 hours)**
    
*   **Choose Payment Method (prepay or pay on-site): (0 hours)**
    
*   **Confirm Booking & Notify (client + provider): (40 hours)**
    
    *   DB: Add appointment status column and confirmed\_at in \`apps/api/db/migrations/20251110\_add\_appointment\_status.sql\` (4 hours)\[FE\]\[BE\]
        
    *   API: Implement confirmAppointment(appointmentId) in \`apps/api/services/booking/BookingService.ts\` (4 hours)\[FE\]\[BE\]
        
    *   API: Add POST /bookings/:id/confirm route in \`apps/api/routes/booking.ts\` to call BookingService.confirmAppointment (4 hours)\[FE\]\[BE\]
        
    *   CloudFunction: Create notifyBooking in \`apps/api/functions/notify/NotifyBooking.ts\` to send Firebase notifications and Google Calendar invites (4 hours)\[FE\]\[BE\]
        
    *   Frontend: Add Confirm button and call POST /bookings/:id/confirm from \`pages/booking/BookingPage.tsx\` (route\_bookingPage) (4 hours)\[FE\]
        
    *   Frontend: Update booking state and UI in \`pages/booking/BookingPage.tsx\` to show confirmed status and time (4 hours)\[FE\]
        
    *   Testing: Add unit tests for BookingService.confirmAppointment in \`apps/api/tests/booking.test.ts\` (4 hours)\[FE\]\[BE\]\[QA\]
        
    *   Testing: Add integration test for POST /bookings/:id/confirm in \`apps/api/tests/booking\_integration.test.ts\` (4 hours)\[FE\]\[BE\]\[QA\]
        
    *   Frontend Testing: Add E2E test for BookingPage confirmation flow in \`apps/mobile/\_\_tests\_\_/BookingPage.test.ts\` (4 hours)\[FE\]\[QA\]
        
    *   Docs: Update API docs for POST /bookings/:id/confirm in \`docs/api/bookings.md\` (4 hours)\[FE\]\[BE\]
        
*   **Send Calendar Invites (Google Calendar integration): (40 hours)**
    
    *   INFRA: Add Google API config in \`apps/api/config/googleCalendar.ts\` (4 hours)\[FE\]\[BE\]\[DevOps\]
        
    *   DEV: Add token storage methods in \`apps/api/services/auth/TokenService.ts\` (4 hours)\[FE\]\[BE\]
        
    *   DEV: Implement CalendarService in \`apps/api/services/calendar/CalendarService.ts\` to create/update events (4 hours)\[FE\]\[BE\]
        
    *   DEV: Create Cloud Function \`apps/api/functions/sendCalendarInvite.ts\` to send invites on appointment create/update (4 hours)\[FE\]\[BE\]
        
    *   DEV: Add appointment model fields in \`apps/api/models/Appointment.ts\` (gcalEventId, gcalSyncStatus) (4 hours)\[FE\]\[BE\]
        
    *   DEV: Add booking route hook in \`apps/api/routes/booking.ts\` to call CalendarService/Cloud Function (4 hours)\[FE\]\[BE\]
        
    *   FRONTEND: Integrate invite toggle and trigger in \`apps/mobile/screens/BookingPage.tsx\` (route\_bookingPage) (4 hours)\[FE\]
        
    *   FRONTEND: Add GoogleSignInButton in \`apps/mobile/components/GoogleSignInButton.tsx\` to obtain consent tokens (4 hours)\[FE\]
        
    *   QUALITY: Add unit/integration tests in \`apps/api/tests/calendar.test.ts\` (4 hours)\[FE\]\[BE\]\[QA\]
        
    *   QUALITY: Document integration in \`docs/calendar-integration.md\` (4 hours)\[FE\]
        
*   **Include Booking Timezone Selection: (9 hours)** - Story functionality is implemented as specified User interface is responsive and accessible Data is properly validated and stored Error handling provides helpful feedback
    
    *   Frontend: Implement a TimezoneSelector component at components/booking/TimezoneSelector.tsx with props from route\_bookingPage context, wired to BookingPage via route\_bookingPage data flow. - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Extend BookingPage props in pages/booking/BookingPage.tsx to include timezone information supplied by route\_bookingPage, ensuring type-safe access. - (M) (1 hours)\[FE\]
        
    *   API: Extend create appointment handler in apps/api/functions/createAppointment.ts to accept and persist timezone field from frontend. - (M) (1 hours)\[FE\]\[BE\]
        
    *   DB: Update table\_appointments schema in apps/api/models/appointment.ts to include timezone column and default handling. - (L) (2 hours)\[FE\]\[BE\]
        
    *   CloudFunction: Validate timezone and convert to UTC in apps/api/functions/validateTimezone.ts (route\_bookingPage, table\_appointments) - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Update BookingSummary UI in components/booking/BookingSummary.tsx to display timezone-aware times based on selected timezone. - (S) (0.5 hours)\[FE\]
        
    *   Testing: Add unit tests for TimezoneSelector in tests/components/TimezoneSelector.test.tsx - (S) (0.5 hours)\[FE\]\[QA\]
        
    *   Testing: Add integration tests for appointment creation with timezone in tests/integration/createAppointment.test.ts (table\_appointments) - (M) (1 hours)\[FE\]\[QA\]
        
    *   Docs: Update BookingPage docs in docs/booking/timezone.md and component README - (M) (1 hours)\[FE\]
        
*   **Display Provider Timezone Info: (10 hours)** - Story functionality is implemented as specified User interface is responsive and accessible Data is properly validated and stored Error handling provides helpful feedback
    
    *   DB: Add timezone field to providers table record in \`apps/api/db/migrations/add\_provider\_timezone.sql\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Create provider timezone getter in \`apps/api/services/providers/ProviderService.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Add timezone endpoint in \`apps/api/routes/providers.ts\` (GET /providers/:id/timezone) - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Display ProviderTimezoneBadge component in \`apps/web/components/booking/ProviderTimezoneBadge.tsx\` - (M) (1 hours)\[FE\]
        
    *   Frontend: Fetch timezone in \`apps/web/pages/booking/BookingPage.tsx\` using \`services/api/providers.ts\` and show in UI - (M) (1 hours)\[FE\]\[BE\]
        
    *   Validation: Add timezone validation when saving provider in \`apps/api/services/providers/ProviderService.ts\` (validate IANA tz) - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   ErrorHandling: Add user-friendly error messages in \`apps/web/components/booking/ProviderTimezoneBadge.tsx\` and \`apps/web/pages/booking/BookingPage.tsx\` - (M) (1 hours)\[FE\]
        
    *   Testing: Add unit tests for ProviderService timezone getter in \`apps/api/services/providers/\_\_tests\_\_/ProviderService.test.ts\` - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   Testing: Add integration test for BookingPage timezone display in \`apps/web/pages/booking/\_\_tests\_\_/BookingPage.test.tsx\` - (M) (1 hours)\[FE\]\[QA\]
        
    *   Docs: Update README in \`apps/web/components/booking/README.md\` documenting timezone display and accessibility notes - (M) (1 hours)\[FE\]
        
*   **Validate Availability Across Timezones: (12 hours)** - Story functionality is implemented as specified User interface is responsive and accessible Data is properly validated and stored Error handling provides helpful feedback
    
    *   DB: Add timezone column to providers table migration in \`apps/api/migrations/202511\_add\_provider\_timezone.sql\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   DB: Add timezone field to appointments schema in \`apps/api/migrations/202511\_add\_appointment\_timezone.sql\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement timezone utils in \`apps/shared/utils/timezone.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement AvailabilityService.checkAvailability() in \`apps/api/services/availability/AvailabilityService.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Create Cloud Function availabilityValidator in \`apps/api/functions/availabilityValidator.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Add Google Calendar sync in \`apps/api/services/calendar/GoogleCalendarSync.ts\` to respect timezones - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Build TimeSelector component in \`apps/web/components/booking/TimeSelector.tsx\` and connect to \`route\_bookingPage\` - (M) (1 hours)\[FE\]
        
    *   Frontend: Update /BookingPage in \`apps/web/pages/bookingPage.tsx\` to display timezone-aware slots - (M) (1 hours)\[FE\]
        
    *   Testing: Add unit tests for timezone utils in \`apps/api/tests/timezone.test.ts\` - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   Testing: Add integration tests for AvailabilityService in \`apps/api/tests/availability.test.ts\` - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   Testing: Add UI tests for TimeSelector in \`apps/web/tests/booking.availability.test.tsx\` - (M) (1 hours)\[FE\]\[QA\]
        
    *   Docs: Create availability docs in \`docs/availability.md\` and update PR template in \`.github/PULL\_REQUEST\_TEMPLATE.md\` - (M) (1 hours)\[FE\]
        
*   **Map Booking to Provider Calendar using providerTimezone:** As a: user, I want to: Map the booking to the provider's calendar using the provider’s timezone, So that: the appointment appears at the correct local time for the provider and avoids scheduling conflicts.**(8.5 hours)** - Booking is created with providerTimezone context Calendar event time aligns to provider's local time No timezone drift between booking time and provider calendar Fallback defaults if provider timezone is unavailable Audit log entries show timezone used for mapping
    
    *   DB: Add providerTimezone column to appointments model in apps/api/models/Appointment.ts with default timezone handling and non-null constraint where appropriate, including migration script and backward-compatible read path in existing queries. - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   API: Update booking route handler in apps/api/routes/booking.ts to accept providerTimezone in request payload and persist to apps/api/models/Appointment.ts, ensuring validation and backward compatibility. - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   API: Implement CalendarSync.mapBookingToProviderCalendar(booking) in apps/api/services/calendar/CalendarSync.ts to map Booking to provider calendar using providerTimezone and Google Calendar API, including timezone-aware event creation. - (L) (2 hours)\[FE\]\[BE\]
        
    *   Infra: Add GOOGLE\_CALENDAR\_ envs to apps/api/config/env.ts and deploy cloud function apps/api/functions/calendarSync/index.ts, ensuring runtime has access to Google Calendar credentials and calendarId. - (M) (1 hours)\[FE\]\[BE\]\[DevOps\]
        
    *   Frontend: Send providerTimezone from route\_bookingPage component /bookingPage when creating booking, ensuring it's included in payload to API. - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   API: Implement fallback timezone logic in apps/api/services/calendar/CalendarSync.ts and tests in apps/api/services/calendar/\_\_tests\_\_/CalendarSync.test.ts to handle missing providerTimezone by deducing based on provider or default TZ. - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   API: Add audit log entry with timezone used in apps/api/services/audit/AuditService.ts when mapping booking to calendar, including recorded providerTimezone used for event creation. - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   Testing: Add integration test to verify no timezone drift in apps/api/\_\_tests\_\_/booking\_calendar\_integration.test.ts - (L) (2 hours)\[FE\]\[BE\]\[QA\]
        
*   **Timezone Display:** As a: user, I want to: see the timezone of the booking, So that: I understand the correct local time for the appointment**(2 hours)** - Timezone shown in booking header Times adjust to user locale No mismatch between selected date/time and displayed timezone
    
*   **Prepay Discount Opt-in:** As a: user, I want to: opt-in to prepay discount for the booking, So that: I can save money if eligible**(10 hours)** - User can opt-in/out of prepay discount Discount eligibility checked Discount applied to total if eligible No impact on non-prepay bookings
    
    *   Frontend: Add Prepay opt-in toggle UI in \`apps/mobile/src/screens/booking/BookingFlow/PaymentPanel.tsx\` - (M) (1 hours)\[FE\]
        
    *   API: Add fetchPrepayEligibility query handler in \`apps/api/routes/bookingFlow/handlers/prepayEligibility.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Add updatePrepayPreference mutation in \`apps/api/routes/bookingFlow/handlers/updatePrepayPreference.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   DB: Create migration to add prepay\_opt\_in bool to \`apps/api/db/migrations/add\_prepay\_opt\_in.sql\` referencing table\_appointments and table\_users - (M) (1 hours)\[FE\]\[BE\]
        
    *   Backend: Implement discount application in \`apps/api/services/booking/BookingService.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Wire toggle to API in \`apps/mobile/src/screens/booking/BookingFlow/PaymentPanel.tsx\` using router\_route\_bookingFlow operations - (M) (1 hours)\[FE\]\[BE\]
        
    *   Backend: Add prepay discount eligibility logic in \`apps/api/services/discounts/DiscountService.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   DB: Insert sample payment\_discounts entry for prepay in \`apps/api/db/seeds/payment\_discounts\_seed.sql\` referencing table\_payment\_discounts - (M) (1 hours)\[FE\]\[BE\]
        
    *   Testing: Add unit tests for DiscountService in \`apps/api/tests/discounts/DiscountService.test.ts\` - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   Testing: Add e2e test for opt-in flow in \`apps/mobile/tests/e2e/prepayOptIn.test.ts\` - (M) (1 hours)\[FE\]\[QA\]
        
*   **Calendar Sync Opt:** As a: user, I want to: opt in to calendar sync, So that: my booking is added to my calendar**(10 hours)** - User can enable calendar sync Calendar event created with correct details Sync status visible in booking Error handling for sync failures
    
    *   DB: Add calendar\_sync fields to \`apps/api/models/appointments.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Add toggleCalendarSync resolver in \`apps/api/routers/bookingFlow/bookingFlowRouter.ts\` (router\_route\_bookingFlow) - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Add getCalendarSyncStatus query in \`apps/api/routers/bookingFlow/bookingFlowRouter.ts\` (router\_route\_bookingFlow) - (M) (1 hours)\[FE\]\[BE\]
        
    *   Backend: Implement Cloud Function to create Google Calendar event in \`apps/api/functions/calendar/createCalendarEvent.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Build CalendarSyncToggle component in \`apps/mobile/components/booking/CalendarSyncToggle.tsx\` (route\_bookingPage, comp\_bookingFlow\_mainPanel) - (M) (1 hours)\[FE\]
        
    *   Frontend: Show sync status in \`apps/mobile/screens/BookingPage.tsx\` (route\_bookingPage) - (M) (1 hours)\[FE\]
        
    *   API: Add onCalendarSyncChanged subscription in \`apps/api/routers/bookingFlow/bookingFlowRouter.ts\` (router\_route\_bookingFlow) - (M) (1 hours)\[FE\]\[BE\]
        
    *   Backend: Store calendar event IDs and errors in \`apps/api/services/calendar/CalendarService.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Testing: Add unit tests for toggleCalendarSync in \`apps/api/routers/bookingFlow/\_\_tests\_\_/bookingFlowRouter.test.ts\` - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   Testing: Add E2E test for UI toggle and calendar event creation in \`apps/mobile/e2e/booking/calendarSync.spec.ts\` - (M) (1 hours)\[FE\]\[QA\]
        
*   **Provider Calendar Sync: (56 hours)** - Provider calendar sync successfully adds available slots to the platform System handles time zone differences between provider calendar and platform Sync runs automatically on a schedule and can be triggered manually Conflict resolution when overlapping events occurs in either calendar Data integrity: synced events remain consistent across platforms
    
    *   DB: Add google\_calendars schema migration in \`apps/api/db/migrations/20251110\_add\_google\_calendars.sql\` (4 hours)\[FE\]\[BE\]
        
    *   DB: Add google\_calendar\_events migration in \`apps/api/db/migrations/20251110\_add\_google\_calendar\_events.sql\` (4 hours)\[FE\]\[BE\]
        
    *   API: Implement Google OAuth sync endpoint in \`apps/api/services/google/GoogleCalendarSyncService.ts\` (4 hours)\[FE\]\[BE\]
        
    *   API: Implement event normalization & timezone conversion in \`apps/api/services/google/GoogleCalendarSyncService.ts\` (4 hours)\[FE\]\[BE\]
        
    *   API: Implement conflict resolution logic in \`apps/api/services/sync/CalendarConflictResolver.ts\` (4 hours)\[FE\]\[BE\]
        
    *   API: Create Cloud Function scheduler trigger in \`apps/api/functions/scheduler/SyncTriggerFunction.ts\` (4 hours)\[FE\]\[BE\]
        
    *   API: Add manual sync REST endpoint in \`apps/api/routes/booking/calendar.ts\` (4 hours)\[FE\]\[BE\]
        
    *   Frontend: Add Sync button on /BookingCalendar in \`apps/web/components/booking/BookingCalendarHeader.tsx\` (4 hours)\[FE\]
        
    *   API: Persist synced events to google\_calendar\_events in \`apps/api/services/google/GoogleCalendarSyncService.ts\` (4 hours)\[FE\]\[BE\]
        
    *   API: Update google\_calendars table entries in \`apps/api/services/google/GoogleCalendarService.ts\` (4 hours)\[FE\]\[BE\]
        
    *   Frontend: Display provider availability on route\_booking\_calendar\_flow in \`apps/web/pages/booking/CalendarFlow.tsx\` (4 hours)\[FE\]
        
    *   Testing: Add unit tests for timezone logic in \`apps/api/services/google/\_\_tests\_\_/timezone.test.ts\` (4 hours)\[FE\]\[BE\]\[QA\]
        
    *   Testing: Add integration tests for sync workflow in \`apps/api/\_\_tests\_\_/google\_sync.integration.test.ts\` (4 hours)\[FE\]\[BE\]\[QA\]
        
    *   Documentation: Add API docs for sync endpoints in \`docs/api/calendar\_sync.md\` (4 hours)\[FE\]\[BE\]
        
*   **Customer Calendar Sync:** As a: customer, I want to: sync my calendar with the platform, So that: my bookings are reflected and reminded**(48 hours)** - Customer calendar sync successfully pulls booked events into the platform Reminders and notifications are aligned with calendar events Time zone handling for customer events Conflict resolution when conflicts arise between platform bookings and personal calendar Data integrity: events remain in sync across systems
    
    *   Infra: Add google\_calendars table migration in \`apps/api/migrations/202511\_add\_google\_calendars.sql\` (4 hours)\[FE\]\[BE\]
        
    *   DB: Add google\_calendar\_events table migration in \`apps/api/migrations/202511\_add\_google\_calendar\_events.sql\` (4 hours)\[FE\]\[BE\]
        
    *   API: Implement Google OAuth handler in \`apps/api/services/auth/GoogleAuthService.ts\` (4 hours)\[FE\]\[BE\]
        
    *   API: Create Calendar sync Cloud Function in \`apps/api/functions/sync/googleCalendarSync.ts\` (4 hours)\[FE\]\[BE\]
        
    *   API: Implement event upsert in \`apps/api/services/calendar/CalendarService.ts\` (4 hours)\[FE\]\[BE\]
        
    *   Frontend: Add Calendar Connect button in \`apps/web/components/booking/CalendarConnectButton.tsx\` (route\_booking\_calendar\_flow) (4 hours)\[FE\]
        
    *   Frontend: Display synced events in \`apps/web/pages/booking/BookingCalendar.tsx\` (route\_booking\_calendar\_flow) (4 hours)\[FE\]
        
    *   API: Implement timezone normalization in \`apps/api/services/calendar/TimezoneUtil.ts\` (4 hours)\[FE\]\[BE\]
        
    *   API: Implement conflict resolution logic in \`apps/api/services/calendar/ConflictResolver.ts\` (4 hours)\[FE\]\[BE\]
        
    *   API: Add reminders/notifications scheduler in \`apps/api/functions/scheduler/reminderScheduler.ts\` (4 hours)\[FE\]\[BE\]
        
    *   Testing: Add integration tests for sync in \`apps/api/tests/integration/googleCalendarSync.test.ts\` (4 hours)\[FE\]\[BE\]\[QA\]
        
    *   Docs: Document Calendar Sync setup in \`docs/features/calendar-sync.md\` (4 hours)\[FE\]\[DevOps\]
        
*   **Booking Notifications:** As a: user, I want to: receive timely notifications for bookings and changes, So that: I stay informed about my schedule**(40 hours)** - Push/email/SMS notifications sent for new bookings Notifications include accurate date/time and participant details Resend mechanism for failed deliveries Notification settings persisted per user System respects user preferences and opt-outs
    
    *   DB: Add notifications and preferences fields to users in \`apps/api/models/User.ts\` (4 hours)\[FE\]\[BE\]
        
    *   DB: Create google\_calendar\_events migration to store notification\_status in \`apps/api/migrations/202511\_create\_event\_notifications.ts\` (4 hours)\[FE\]\[BE\]
        
    *   API: Implement NotificationService.sendNotification() in \`apps/api/services/notifications/NotificationService.ts\` (push/email/sms) (4 hours)\[FE\]\[BE\]
        
    *   CloudFunction: Create \`apps/api/functions/notifyOnBooking.ts\` to trigger on event create/update and call NotificationService (4 hours)\[FE\]\[BE\]
        
    *   API: Implement resend mechanism endpoint POST \`/notifications/resend\` in \`apps/api/routes/notifications.ts\` calling \`NotificationService.resendFailed()\` (4 hours)\[FE\]\[BE\]
        
    *   Frontend: Build NotificationSettings component in \`apps/web/components/booking/NotificationSettings.tsx\` under route \`route\_booking\_calendar\_flow\` to persist preferences (4 hours)\[FE\]
        
    *   API: Add endpoints to save/get user preferences in \`apps/api/routes/users.ts\` and persist to \`table\_users\` (4 hours)\[FE\]\[BE\]
        
    *   Integration: Add event notification fields to calendar event creation in \`apps/web/pages/BookingCalendar.tsx\` (route\_booking\_calendar\_flow) to include participant details (4 hours)\[FE\]
        
    *   Testing: Add unit tests for \`NotificationService\` in \`apps/api/services/notifications/\_\_tests\_\_/NotificationService.test.ts\` (4 hours)\[FE\]\[BE\]\[QA\]
        
    *   Testing: Add E2E test for notification delivery flow in \`apps/web/\_\_tests\_\_/bookingNotifications.e2e.ts\` (4 hours)\[FE\]\[QA\]
        
*   **Cancel/Edit Sync:** As a: user, I want to: cancel or edit existing bookings and have changes reflected across calendars, So that: all parties stay synchronized**(44 hours)** - Cancel/edit actions propagate to provider and customer calendars Notifications updated for all stakeholders Conflict handling when cancelation affects other bookings Audit trail of changes maintained Latency between changes and calendar updates kept within acceptable limits
    
    *   DB: Add cancel/edit fields and indices in \`apps/api/prisma/migrations/20251110\_add\_booking\_sync\_fields/\` (4 hours)\[FE\]\[BE\]
        
    *   API: Implement calendar sync Cloud Function in \`apps/api/functions/calendarSync.ts\` (4 hours)\[FE\]\[BE\]
        
    *   API: Implement updateEventInGoogle() in \`apps/api/services/calendar/CalendarService.ts\` (4 hours)\[FE\]\[BE\]
        
    *   API: Implement ConflictResolver logic in \`apps/api/services/calendar/ConflictResolver.ts\` (4 hours)\[FE\]\[BE\]
        
    *   API: Add audit logging in \`apps/api/services/audit/AuditService.ts\` (4 hours)\[FE\]\[BE\]
        
    *   API: Update NotificationService to propagate updates in \`apps/api/services/notifications/NotificationService.ts\` (4 hours)\[FE\]\[BE\]
        
    *   Frontend: Build EditBookingModal component in \`apps/mobile/components/BookingCalendar/EditBookingModal.tsx\` (4 hours)\[FE\]
        
    *   Frontend: Connect route /BookingCalendar to edit flow in \`apps/web/pages/booking/calendar/flow/index.tsx\` (route\_booking\_calendar\_flow) (4 hours)\[FE\]
        
    *   DB: Map google\_calendar\_events updates to table \`table\_google\_calendar\_events\` in migration and seed \`apps/api/prisma/\` (4 hours)\[FE\]\[BE\]
        
    *   Testing: Add unit tests for calendar sync in \`apps/api/tests/calendarSync.test.ts\` (4 hours)\[FE\]\[BE\]\[QA\]
        
    *   Testing: Add E2E tests for edit/cancel flow in \`apps/web/tests/EditBooking.test.tsx\` (4 hours)\[FE\]\[QA\]
        
*   **Customer Calendar Sync: (0 hours)**
    
*   **Booking Notifications: (0 hours)**
    
*   **Cancel/Edit Sync: (0 hours)**
    
*   **Provider OAuth Connect: (32 hours)**
    
    *   API: Implement initiateOAuth(provider) in \`apps/api/services/auth/AuthService.ts\` (4 hours)\[FE\]\[BE\]
        
    *   CloudFunc: Create OAuth callback handler in \`apps/api/functions/googleOAuthCallback.ts\` (4 hours)\[FE\]\[BE\]
        
    *   DB: Create google\_calendars model and Firestore rules in \`apps/api/models/googleCalendar.ts\` (4 hours)\[FE\]\[BE\]
        
    *   Frontend: Add Connect Google button and flow in \`components/booking/BookingCalendar.tsx\` (route: route\_booking\_calendar\_flow) (4 hours)\[FE\]
        
    *   API: Store OAuth tokens in \`apps/api/services/auth/AuthService.ts\` and link to users table (table\_users) (4 hours)\[FE\]\[BE\]
        
    *   Sync: Create calendar events sync job in \`apps/api/functions/syncGoogleEvents.ts\` writing to \`apps/api/models/googleCalendarEvent.ts\` (4 hours)\[FE\]\[BE\]
        
    *   Testing: Add integration tests in \`tests/booking/googleOAuth.test.ts\` (4 hours)\[FE\]\[QA\]
        
    *   Docs: Add setup and env instructions in \`docs/integration/google\_oauth.md\` (4 hours)\[FE\]\[DevOps\]
        
*   **Customer OAuth Connect: (32 hours)**
    
    *   DB: Create google\_calendars migration in \`prisma/migrations/\` to add columns for oauth\_tokens, refresh\_token, google\_calendar\_id (4 hours)\[FE\]
        
    *   API: Implement saveOAuthTokens() in \`apps/api/services/auth/AuthService.ts\` to persist tokens to google\_calendars (4 hours)\[FE\]\[BE\]
        
    *   API: Add OAuth callback handler in \`apps/api/functions/oauth.ts\` to exchange code for tokens (4 hours)\[FE\]\[BE\]
        
    *   Frontend: Build GoogleConnectButton component in \`components/booking/GoogleConnectButton.tsx\` hooking into \`route\_booking\_calendar\_flow\` (4 hours)\[FE\]
        
    *   Frontend: Integrate connect status UI in \`/BookingCalendar\` route \`route\_booking\_calendar\_flow\` to show connected calendar info from \`table\_google\_calendars\` (4 hours)\[FE\]
        
    *   API: Implement token refresh logic in \`apps/api/services/auth/AuthService.ts\` and Cloud Function \`apps/api/functions/oauth.ts\` (4 hours)\[FE\]\[BE\]
        
    *   Testing: Add integration tests in \`tests/oauth\_connect.test.ts\` for OAuth flow and token persistence (4 hours)\[FE\]\[QA\]
        
    *   Docs: Add docs in \`docs/oauth\_connect.md\` and update README for \`route\_booking\_calendar\_flow\` (4 hours)\[FE\]
        
*   **Prepaid Discount Tag: (36 hours)**
    
    *   DB: Add 'prepaidDiscount' field to google\_calendar\_events in \`apps/api/migrations/add\_prepaid\_discount\_to\_google\_calendar\_events.sql\` (4 hours)\[FE\]\[BE\]
        
    *   API: Update Cloud Function to persist prepaid tag in \`apps/api/functions/events/handleCalendarEvent.ts\` (4 hours)\[FE\]\[BE\]
        
    *   API: Add Firestore mapping for prepaidDiscount in \`apps/api/services/events/GoogleCalendarEventService.ts\` (4 hours)\[FE\]\[BE\]
        
    *   Frontend: Add prepaid tag prop to /BookingCalendar component in \`apps/web/src/routes/booking/calendar/BookingCalendar.tsx\` (4 hours)\[FE\]
        
    *   Frontend: Render PrepaidBadge component in \`apps/web/src/components/calendar/PrepaidBadge.tsx\` (4 hours)\[FE\]
        
    *   State: Add prepaidDiscount to Redux slice in \`apps/web/src/store/slices/calendarSlice.ts\` (4 hours)\[FE\]
        
    *   Integration: Wire event fetch to include prepaidDiscount in \`apps/web/src/services/calendar/CalendarService.ts\` (4 hours)\[FE\]\[BE\]
        
    *   Testing: Add unit tests for PrepaidBadge in \`apps/web/\_\_tests\_\_/components/PrepaidBadge.test.tsx\` (4 hours)\[FE\]\[QA\]
        
    *   Docs: Update /BookingCalendar docs in \`docs/booking\_calendar/prepaid\_discount.md\` (4 hours)\[FE\]
        
*   **Conflict Detection: (24 hours)**
    
    *   DB: Add conflict\_index and fields to \`apps/api/prisma/migrations/20251101\_add\_conflict\_fields.sql\` (4 hours)\[FE\]\[BE\]
        
    *   API: Implement conflict detection Cloud Function in \`apps/api/functions/conflictDetection.ts\` (4 hours)\[FE\]\[BE\]
        
    *   API: Add endpoint GET /conflicts in \`apps/api/routes/calendarRoutes.ts\` to call \`functions/conflictDetection.ts\` (4 hours)\[FE\]\[BE\]
        
    *   Frontend: Build ConflictBanner component in \`components/booking/ConflictBanner.tsx\` and integrate into \`route\_booking\_calendar\_flow\` (4 hours)\[FE\]
        
    *   Sync: Update Google Calendar sync in \`apps/api/services/calendar/CalendarService.ts\` to mark events for conflict check (4 hours)\[FE\]\[BE\]
        
    *   Testing: Create unit tests in \`tests/conflictDetection.test.ts\` for \`apps/api/functions/conflictDetection.ts\` (4 hours)\[FE\]\[BE\]\[QA\]
        
*   **Sync Error Alerts: (32 hours)**
    
    *   Frontend: Add SyncErrorBanner component in \`apps/web/components/booking/SyncErrorBanner.tsx\` (shows alerts on /BookingCalendar) (4 hours)\[FE\]
        
    *   Frontend: Integrate SyncErrorBanner into \`/BookingCalendar\` route in \`apps/web/pages/booking/calendar/flow/index.tsx\` (route\_booking\_calendar\_flow) (4 hours)\[FE\]
        
    *   Backend: Add error flag field to \`table\_google\_calendar\_events\` entries via migration in \`apps/api/migrations/\` (4 hours)\[FE\]\[BE\]
        
    *   Backend: Update Cloud Function to write sync errors to Firestore in \`apps/functions/src/sync/syncHandler.ts\` (4 hours)\[FE\]\[BE\]
        
    *   API: Expose GET /sync-errors in \`apps/api/routes/sync.ts\` to fetch errors for user calendars (4 hours)\[FE\]\[BE\]
        
    *   Frontend: Fetch and display sync errors in \`apps/web/hooks/useSyncErrors.ts\` and connect to \`apps/web/components/booking/SyncErrorBanner.tsx\` (4 hours)\[FE\]
        
    *   Testing: Add integration tests for sync error flow in \`apps/web/tests/booking/syncErrors.test.tsx\` (4 hours)\[FE\]\[QA\]
        
    *   Documentation: Document sync error alerts behavior in \`docs/booking/calendar/syncErrors.md\` (4 hours)\[FE\]
        
*   **Manual Resync: (36 hours)**
    
    *   DB: Add last\_synced column migration in \`apps/api/src/db/migrations/20251110\_add\_last\_synced.sql\` (4 hours)\[FE\]\[BE\]
        
    *   API: Implement manual resync Cloud Function in \`apps/api/functions/resyncManual.ts\` (4 hours)\[FE\]\[BE\]
        
    *   API: Add /calendar/resync route in \`apps/api/src/routes/calendar.ts\` to invoke resyncManual (4 hours)\[FE\]\[BE\]
        
    *   Frontend: Add ResyncButton component in \`apps/web/src/routes/BookingCalendar/ResyncButton.tsx\` (4 hours)\[FE\]
        
    *   Frontend: Wire ResyncButton into \`/BookingCalendar\` in \`apps/web/src/routes/BookingCalendar/index.tsx\` (route\_booking\_calendar\_flow) (4 hours)\[FE\]
        
    *   API: Implement sync logic to upsert events into \`table\_google\_calendar\_events\` inside \`apps/api/functions/resyncManual.ts\` (4 hours)\[FE\]\[BE\]
        
    *   Infra: Add GOOGLE\_API credentials to \`apps/api/.env\` and update \`apps/api/firebase.json\` for function deployment (4 hours)\[FE\]\[BE\]\[DevOps\]
        
    *   Quality: Add unit/integration tests in \`apps/api/tests/resync.test.ts\` (4 hours)\[FE\]\[BE\]\[QA\]
        
    *   Docs: Create manual resync docs in \`docs/booking\_calendar/manual\_resync.md\` (4 hours)\[FE\]
        
*   **Cancel Notification: (32 hours)**
    
    *   DB: Add 'canceled' field to google\_calendar\_events in \`apps/api/models/GoogleCalendarEvent.ts\` (4 hours)\[FE\]\[BE\]
        
    *   API: Implement cancelEvent() Cloud Function in \`apps/api/functions/cancelNotification.ts\` (4 hours)\[FE\]\[BE\]
        
    *   API: Update Firestore write in \`apps/api/services/calendar/CalendarService.ts\` to set canceled flag and notify\` (4 hours)\[FE\]\[BE\]
        
    *   Frontend: Add Cancel button to \`apps/web/src/routes/BookingCalendar/BookingCalendar.tsx\` and call cancel API (4 hours)\[FE\]\[BE\]
        
    *   Integration: Call Google Calendar API cancel in \`apps/api/services/google/GoogleCalendarClient.ts\` from cancelEvent() (4 hours)\[FE\]\[BE\]
        
    *   Notification: Send cancellation notification via Cloud Function using \`apps/api/services/notifications/NotificationService.ts\` (4 hours)\[FE\]\[BE\]
        
    *   Testing: Add unit tests for cancel logic in \`apps/api/tests/cancelNotification.test.ts\` and UI test in \`apps/web/tests/BookingCalendar.test.tsx\` (4 hours)\[FE\]\[BE\]\[QA\]
        
    *   Docs: Document cancel flow in \`docs/booking\_calendar/cancel\_notification.md\` (4 hours)\[FE\]
        
*   **Reschedule Notification: (28 hours)**
    
    *   DB: Add rescheduled\_at and notify\_sent fields to google\_calendar\_events model in \`apps/api/models/GoogleCalendarEvent.ts\` (4 hours)\[FE\]\[BE\]
        
    *   DB: Create migration in \`apps/api/migrations/\` to alter google\_calendar\_events table (4 hours)\[FE\]\[BE\]
        
    *   API: Implement updateEventReschedule() in \`apps/api/services/calendar/CalendarService.ts\` (4 hours)\[FE\]\[BE\]
        
    *   CloudFunction: Add Firestore trigger in \`firebase/functions/rescheduleTrigger.ts\` to call NotificationService on reschedule (4 hours)\[FE\]\[BE\]
        
    *   API: Implement sendRescheduleNotification() in \`apps/api/services/notifications/NotificationService.ts\` (4 hours)\[FE\]\[BE\]
        
    *   Frontend: Add RescheduleModal component in \`apps/mobile/components/booking/RescheduleModal.tsx\` and call CalendarService API (4 hours)\[FE\]\[BE\]
        
    *   QA: Add unit test reschedule.spec.ts in \`apps/api/tests/reschedule.spec.ts\` and integration test in \`apps/mobile/tests/RescheduleModal.test.tsx\` (4 hours)\[FE\]\[BE\]\[QA\]
        
*   **Add Provider Timezone:** As a: provider administrator, I want to: set and persist the providerTimezone for each provider, So that: appointments and availability respect the provider's local time.**(6.5 hours)** - Provider creation/edit API accepts providerTimezone in valid IANA format Timezone is stored in provider profile Timezone affects availability calculations and display in UI OpenAPI spec updated to include providerTimezone property No regression for existing providers without timezone
    
    *   DB: Add providerTimezone column to providers table migration in apps/api/prisma/migrations/ preserving architecture references to the providers table and Prisma migrations; ensure typing and default handling are prepared for null-safe migration in later steps - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   API: Accept providerTimezone in createProviderTimezone operation and validate IANA timezone names in apps/api/routes/openapi/tz/router.ts; integrates with request validation middleware and service layer - (S) (0.5 hours)\[FE\]\[BE\]\[QA\]
        
    *   API: Persist providerTimezone in apps/api/services/provider/ProviderService.ts during create/update, ensuring atomicity and consistency with existing provider data - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   Logic: Update availability calculation to apply providerTimezone in apps/api/services/availability/AvailabilityService.ts - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Add providerTimezone field to Provider Timezone Section component components/openapi/tz/ProviderTimezoneForm.tsx - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   Frontend: Display providerTimezone in provider profile at components/provider/ProfileTimezoneDisplay.tsx - (S) (0.5 hours)\[FE\]
        
    *   OpenAPI: Update spec to include providerTimezone property in apps/api/openapi/schema.yaml and route router\_route\_openapi\_tz docs - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   Migration: Backfill existing providers with null-safe defaults in apps/api/scripts/backfillProviderTimezone.ts - (M) (1 hours)\[FE\]\[BE\]
        
    *   Tests: Add unit tests for validation in apps/api/tests/providerTimezone.validation.spec.ts - (S) (0.5 hours)\[FE\]\[BE\]\[QA\]
        
    *   Tests: Add integration tests for availability with timezone in apps/api/tests/availability.timezone.spec.ts - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
*   **Add Booking Timezone:** As a: system administrator or API consumer, I want to: add a timezone field to Booking records via API and UI, So that: bookings are correctly stored with provider's local time context.**(6.5 hours)** - Booking creation API accepts providerTimezone field in valid IANA timezone format Backend stores timezone with booking and defaults to UTC if missing Frontend form validates timezone using valid IANA time zones and shows error for invalid values OpenAPI spec updated to include bookingTimezone property with description Existing bookings without timezone are migrated or defaulted without data loss
    
    *   DB: Add booking\_timezone column migration in apps/api/migrations/2025\_add\_booking\_timezone.sql preserving existing schema and enabling default UTC handling. - (XS) (0.5 hours)\[FE\]\[BE\]
        
    *   API: Update router /openapi/tz in apps/api/routes/openapi/tz.ts to accept providerTimezone and validate IANA format, wiring into BookingService if valid. - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   API: Add createBookingTimezone operation in apps/api/services/booking/BookingService.ts to store providerTimezone defaulting to UTC, exposing through API contract. - (M) (1 hours)\[FE\]\[BE\]
        
    *   OpenAPI: Update openapi/specs/booking.yaml to include bookingTimezone property with description - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   Frontend: Add BookingTimezoneField component in apps/web/components/openapi/tz/BookingTimezoneField.tsx validating IANA timezones and showing errors - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   Frontend: Integrate providerTimezone into /openapi/tz page in apps/web/pages/openapi/tz.tsx using comp\_openapi\_tz\_booking - (M) (1 hours)\[FE\]\[BE\]
        
    *   Data: Create migration script scripts/migrate/bookings-default-timezone.ts to backfill existing bookings to UTC without data loss - (L) (2 hours)\[FE\]\[BE\]
        
    *   Tests: Add API and frontend tests in tests/api/bookingTimezone.test.ts and tests/frontend/bookingTimezone.test.tsx validating acceptance criteria - (S) (0.5 hours)\[FE\]\[BE\]\[QA\]
        
*   **Update OpenAPI Examples:** As a: API consumer, I want to: see updated OpenAPI examples that include timezone fields, So that: developers understand new fields and usage.**(5.5 hours)** - OpenAPI examples show Booking and Provider timezone fields with sample values Examples validate IANA format in samples Documentation page updated synchronously with schema changes No breaking changes in existing example blocks Examples render correctly in Swagger UI
    
    *   API: Extend OpenAPI examples schema in apps/api/routes/openapi/tz/examples.ts to include Booking.providerTimezone and Provider.providerTimezone with IANA time zone samples, preserving existing example blocks and schema structure. - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Update router handlers in apps/api/routers/openapiRouter.ts to serve the updated examples and add IANA format validation for timezone fields during request/response handling, while maintaining existing routing behavior. - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   Infra: Update Swagger config in apps/api/swagger/config.ts to ensure updated examples render in Swagger UI and avoid breaking changes, including potential type generation updates. - (S) (0.5 hours)\[FE\]\[BE\]\[DevOps\]
        
    *   Frontend: Update OpenAPI Overview component in apps/web/src/components/openapi/Overview.tsx to display updated examples and align with the updated OpenAPI schema, ensuring UI reflects IANA timezone samples. - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   Docs: Update documentation page in apps/web/src/pages/openapi/tz.tsx to reflect schema changes and example samples, ensuring consistency with API docs and frontend displays. - (XS) (0.5 hours)\[FE\]\[BE\]
        
    *   Quality: Add tests in apps/api/tests/openapiExamples.test.ts to validate examples include timezone fields and IANA format, ensuring no existing example blocks break - (L) (2 hours)\[FE\]\[BE\]\[QA\]
        

### **Milestone 5: Integrations: Google Calendar OAuth sync, Payments (prepay/on-site) and prepay discount handling**

_Estimated 312 hours_

*   **Payment Charge on Pay Now:** As a: paying customer, I want to: be charged automatically when I select Pay Now, So that: my booking is confirmed and payment is processed**(8 hours)** - Payment is charged on Pay Now action Payment status updates in UI within 5 seconds Refunds/chargebacks workflow available Secure handling of payment data with tokenization
    
    *   API: Add Stripe config & init in \`apps/api/services/payments/StripeService.ts\` - (M) (1 hours)\[FE\]\[BE\]\[DevOps\]
        
    *   API: Implement createCharge(paymentIntent) in \`apps/api/services/payments/StripeService.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Create Cloud Function webhook handler in \`apps/api/functions/paymentWebhook.ts\` to update Firestore on payment events - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Add Pay Now action in \`apps/mobile/components/integrations/PayNowButton.tsx\` to call \`/api/payments/charge\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Poll and realtime update UI in \`apps/mobile/screens/IntegrationsScreen.tsx\` to reflect payment status within 5s - (M) (1 hours)\[FE\]
        
    *   API: Implement refund endpoint in \`apps/api/controllers/paymentsController.ts\` for refunds/chargebacks - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Store tokenized payment method in \`apps/api/models/PaymentMethod.ts\` and use tokenization in \`apps/api/services/payments/StripeService.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Infra: Add Sentry error reporting in \`apps/api/functions/paymentWebhook.ts\` and \`apps/mobile/components/integrations/PayNowButton.tsx\` - (M) (1 hours)\[FE\]\[BE\]
        
*   **Calendar Sync on Booking:** As a: product user, I want to: sync calendar events automatically when a new booking is created, So that: calendars stay up-to-date with booking activities without manual effort**(11 hours)** - Calendar sync triggers on booking creation Calendar reflects status (synced/failed) within 2 minutes Resolves conflicts and avoids duplicate events System logs provide audit trail for sync actions
    
    *   API: Add booking model and Firestore schema in \`apps/api/models/booking.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement Cloud Function trigger on booking create in \`apps/api/functions/calendarSync/index.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement Google Calendar sync logic in \`apps/api/functions/calendarSync/syncService.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Add retry & conflict resolution in \`apps/api/functions/calendarSync/syncService.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   DB: Add booking status field 'calendarSyncStatus' in \`apps/api/models/booking.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Build CalendarSyncStatus component in \`apps/web/components/integrations/CalendarSyncStatus.tsx\` - (M) (1 hours)\[FE\]
        
    *   Frontend: Update /Integrations route to show sync status in \`apps/web/routes/integrations/IntegrationsPage.tsx\` - (M) (1 hours)\[FE\]
        
    *   Infra: Configure Google API credentials in \`apps/api/config/googleCalendar.ts\` - (M) (1 hours)\[FE\]\[BE\]\[DevOps\]
        
    *   Infra: Add Sentry logging for sync in \`apps/api/sentry.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   QA: Create integration tests in \`apps/api/functions/\_\_tests\_\_/calendarSync.test.ts\` - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   Docs: Add audit logging docs in \`docs/integrations/calendar\_sync.md\` - (M) (1 hours)\[FE\]
        
*   **Manual Sync Trigger:** As a: system administrator, I want to: manually trigger a calendar/payment sync from the dashboard, So that: I can repair/force reconciliation when automated sync fails**(10.5 hours)** - Manual trigger initiates sync process Status/progress visible in UI Retry limits and backoff strategy implemented Audit log of manual sync actions
    
    *   Frontend: Implement Manual Sync button in Integrations header to trigger client-side API call and reflect sync state in UI. Uses React in apps/web, IntegrationsHeader.tsx, and UX state management. - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   Frontend: Implement sync status UI and progress in Integrations.tsx to display real-time status received via onSyncStatusUpdate subscription and reflect progress bars/percent. Uses React, WebSocket/GraphQL subscription. - (M) (1 hours)\[FE\]
        
    *   API: Add triggerManualSync mutation in apps/api/routes/integrations/router.ts implementing triggerManualSync handler that queues a manual sync job and returns initial status. - (M) (1 hours)\[FE\]\[BE\]
        
    *   Backend: Create Cloud Function worker apps/api/functions/sync/manualSyncWorker.ts with retry/backoff logic for retries on transient failures and hooks for status updates. - (L) (2 hours)\[FE\]\[BE\]
        
    *   DB: Add audit log collection schema in apps/api/models/ManualSyncLog.ts and migration in prisma/migrations/. - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement onSyncStatusUpdate subscription in apps/api/routes/integrations/router.ts to push status updates to subscribed clients. - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Update triggerManualSync to write audit entry to apps/api/models/ManualSyncLog.ts and record to table\_users when relevant - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Subscribe to onSyncStatusUpdate in apps/web/src/routes/Integrations/Integrations.tsx and display real-time progress - (M) (1 hours)\[FE\]
        
    *   Infra: Add monitoring and Sentry instrumentation in apps/api/functions/sync/manualSyncWorker.ts - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   Testing: Add integration tests for triggerManualSync in apps/api/tests/integrations/manualSync.test.ts - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   Documentation: Document Manual Sync usage and API in docs/integrations/manual-sync.md - (XS) (0.5 hours)\[FE\]\[BE\]
        
*   **Choose Payment Method (Prepay / Onsite):** As a: customer, I want to: choose a payment method (Prepay or Onsite), So that: I can complete the booking with my preferred payment option**(32 hours)** - User can select either Prepay or Onsite as payment method on the booking flow System remembers selected option for the session and propagates to checkout Invalid or missing selection prompts a clear error message Payment method choice is visible on the booking summary and receipt
    
    *   Frontend: Build PaymentMethodSelector component in \`components/booking/PaymentMethodSelector.tsx\` (shows Prepay/Onsite, error UI) (4 hours)\[FE\]
        
    *   State: Add paymentMethod slice in \`store/slices/paymentMethodSlice.ts\` (session persistence via Redux Persist) (4 hours)\[FE\]
        
    *   API: Create Cloud Function endpoint setPaymentMethod in \`functions/src/payments/setPaymentMethod.ts\` (persist to session) (4 hours)\[FE\]\[BE\]
        
    *   DB: Add payment\_method field to session doc in \`apps/api/firestore/sessions\` (update session schema) - reference \`table\_sessions\` (4 hours)\[FE\]\[BE\]
        
    *   Checkout: Read paymentMethod in \`components/checkout/CheckoutSummary.tsx\` and propagate to \`services/payments/PaymentService.ts\` (4 hours)\[FE\]\[BE\]
        
    *   Summary: Show payment method on booking summary in \`components/booking/BookingSummary.tsx\` and receipt generation in \`services/receipt/ReceiptService.ts\` (4 hours)\[FE\]\[BE\]
        
    *   Validation: Add client-side validation in \`components/booking/PaymentMethodSelector.tsx\` and server-side check in \`functions/src/payments/validatePaymentMethod.ts\` (error messages) (4 hours)\[FE\]\[BE\]\[QA\]
        
    *   Testing: Add unit tests for \`components/booking/PaymentMethodSelector.test.tsx\` and integration tests for \`functions/src/payments/setPaymentMethod.test.ts\` (4 hours)\[FE\]\[QA\]
        
*   **Allow Save Payment Method:** As a: customer, I want to: save my payment method for future bookings, So that: I can checkout faster and with one-click payments**(1 hours)** - User can opt-in to save payment method during checkout Payment tokenization occurs and is stored securely Saved methods are available for future bookings in the user's profile Checkout supports using a saved method without re-entering details
    
    *   DB: Add payment\_methods collection in Firestore via \`apps/api/functions/migrations/addPaymentMethods.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
*   **Booking Receipt & Webhook Handling:** As a: customer, I want to: receive a booking receipt and ensure webhook events are processed, So that: I have confirmation and downstream systems are updated**(6 hours)** - Booking receipt is generated and sent via email/SMS Webhook endpoint receives and acknowledges events for successful bookings Idempotent handling to prevent duplicate processing Error handling and retry mechanism for webhook failures
    
    *   DB: Create Firestore collections for receipts and webhook\_events in apps/api/functions/firestoreSetup.ts with proper security rules, indexes, and names matching the project Firestore instance, ensuring collections are created if not existing during deployment. - (S) (0.5 hours)\[FE\]\[BE\]\[DevOps\]
        
    *   API: Implement booking webhook Cloud Function in apps/api/functions/webhooks/bookingWebhook.ts to parse incoming webhook payloads, verify id, store events to Firestore and trigger downstream flows (receipt generation and notifications) via services, using Express/Cloud Functions style as per project stack. - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Add idempotency checks in apps/api/services/idempotency/IdempotencyService.ts to deduplicate webhook processing by tracking processed event IDs and source, with retry-safe storage and expiration policy. - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement ReceiptService.generateAndStore() in apps/api/services/receipt/ReceiptService.ts to create a receipt record in Firestore using data from webhook events, linking to booking, payment and user context, and exposing a retrievable receipt\_id. - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Integrate NotificationService.sendEmailAndSMS() in apps/api/services/notification/NotificationService.ts to notify customer on receipt creation and webhook outcomes, using templated content and proper delivery channels, with retry handling. - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   Infra: Add retry and error handling config in apps/api/functions/deploy.sh and .env to support resilient webhook processing and receipt generation (retry intervals, max attempts, backoff, and error routing). - (S) (0.5 hours)\[FE\]\[BE\]\[DevOps\]
        
    *   Quality: Add unit/integration tests in apps/api/functions/\_\_tests\_\_/bookingWebhook.test.ts to cover webhook parsing, idempotency checks, receipt creation and notification triggers, including error paths and retries. - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   Quality: Add docs docs/booking\_receipt\_webhook.md with failure/retry flows and observability notes for webhook processing, receipts, and notifications. - (XS) (0.5 hours)\[FE\]
        
*   **Show Discounted Price:** As a: customer, I want to: see the discounted price for the booking, So that: I understand the value and decide to proceed**(8 hours)** - Discounted price is displayed prominently on the booking summary Discounted price reflects current promotions and applies before tax Original price is shown as struck-through where applicable Price updates instantly when discount criteria change Discount eligibility is validated before checkout
    
    *   Frontend: Update BookingSummary component in \`components/booking/BookingSummary.tsx\` to display discounted and struck-through original price - (M) (1 hours)\[FE\]
        
    *   State: Add price and discount logic in \`store/slices/priceSlice.ts\` (Redux Toolkit) with selectors for pre-tax discounted price - (M) (1 hours)\[FE\]
        
    *   Realtime: Add listener in \`components/booking/BookingSummary.tsx\` to Firestore promotions collection in \`apps/api/services/promotions/PromotionsListener.ts\` for instant updates - (M) (1 hours)\[FE\]\[BE\]
        
    *   Backend: Implement Cloud Function calculateDiscount in \`apps/functions/src/promotions/calculateDiscount.ts\` to compute applicable discount before tax - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Add promotion model in \`apps/api/models/promotion.ts\` and migration referencing promotion rules - (M) (1 hours)\[FE\]\[BE\]
        
    *   Service: Validate discount eligibility in \`apps/api/services/checkout/CheckoutService.ts\` before checkout - (M) (1 hours)\[FE\]\[BE\]
        
    *   Testing: Add unit tests for discount calc in \`apps/functions/src/promotions/\_\_tests\_\_/calculateDiscount.test.ts\` and UI tests for \`components/booking/BookingSummary.test.tsx\` - (M) (1 hours)\[FE\]\[QA\]
        
    *   Docs: Update docs in \`docs/payments/discounts.md\` describing discount behavior and file references - (M) (1 hours)\[FE\]
        
*   **Choose Payment Method (Prepay / Onsite): (0 hours)**
    
*   **Apply Global Prepay Discount (10%): (36 hours)**
    
    *   INFRA: Add global discount config in \`apps/api/config/discounts.ts\` (10% prepay) (4 hours)\[FE\]\[BE\]\[DevOps\]
        
    *   API: Implement applyPrepayDiscount() in \`apps/api/services/payments/PaymentService.ts\` (4 hours)\[FE\]\[BE\]
        
    *   API: Update Cloud Function checkout in \`apps/api/functions/checkout/checkout.ts\` to use applyPrepayDiscount() and set Stripe invoice metadata (4 hours)\[FE\]\[BE\]
        
    *   FRONTEND: Update PaymentOptions component in \`components/payments/PaymentOptions.tsx\` to show discounted price and badge (4 hours)\[FE\]
        
    *   FRONTEND: Update CheckoutScreen in \`screens/CheckoutScreen.tsx\` to reflect discount on totals (4 hours)\[FE\]
        
    *   DB: Add migration for global discount flag in \`apps/api/migrations/202511\_add\_global\_discount.sql\` (4 hours)\[FE\]\[BE\]
        
    *   TESTING: Add unit tests in \`tests/payments/paymentService.test.ts\` for 10% discount (4 hours)\[FE\]\[BE\]\[QA\]
        
    *   TESTING: Add frontend tests in \`tests/frontend/paymentOptions.test.tsx\` to assert UI shows discounted price (4 hours)\[FE\]\[QA\]
        
    *   DOCS: Document discount behavior in \`docs/payments.md\` and update \`README.md\` (4 hours)\[FE\]
        
*   **Payment Confirmation & Calendar Sync: (28 hours)**
    
    *   DB: Add payments collection and schema in \`apps/api/models/payments/Payment.ts\` (4 hours)\[FE\]\[BE\]
        
    *   API: Implement confirmPayment() in \`apps/api/services/payments/PaymentService.ts\` (4 hours)\[FE\]\[BE\]
        
    *   CloudFunction: Create calendarEventOnPayment in \`apps/api/functions/calendar/calendarEventOnPayment.ts\` (4 hours)\[FE\]\[BE\]
        
    *   API: Add Stripe webhook handler in \`apps/api/functions/payments/stripeWebhook.ts\` (4 hours)\[FE\]\[BE\]
        
    *   Frontend: Build PaymentConfirmation screen in \`apps/mobile/components/payments/PaymentConfirmation.tsx\` (4 hours)\[FE\]
        
    *   Frontend: Add Redux action confirmPayment in \`apps/mobile/store/actions/paymentActions.ts\` (4 hours)\[FE\]
        
    *   Testing: Create integration tests for payment flow in \`apps/api/tests/paymentFlow.test.ts\` and \`apps/mobile/tests/paymentFlow.e2e.ts\` (4 hours)\[FE\]\[BE\]\[QA\]
        
*   **Apply 10% Prepay Discount: (36 hours)** - Discount is applied automatically to eligible orders at checkout Total price reflects 10% prepayment discount for prepay eligible orders Discount percentage is displayed clearly in checkout summary System logs discount application for auditing Edge case: applying discount to already discounted price results in correct final amount
    
    *   DB: Create prepay\_policies migration in \`apps/api/prisma/migrations/\` to add table\_prepay\_policies (4 hours)\[FE\]\[BE\]
        
    *   API: Implement applyPrepayDiscount(order) in \`apps/api/services/payments/PrepayService.ts\` to apply 10% discount (4 hours)\[FE\]\[BE\]
        
    *   Cloud Function: Add Cloud Function in \`apps/api/functions/prepay/handlePrepay.ts\` to auto-apply discount at checkout (4 hours)\[FE\]\[BE\]
        
    *   Frontend: Update CheckoutSummary component in \`apps/mobile/components/checkout/CheckoutSummary.tsx\` to display discount percent and discounted totals (4 hours)\[FE\]
        
    *   Logging: Implement audit log entry in \`apps/api/services/logging/AuditService.ts\` when discount applied (4 hours)\[FE\]\[BE\]
        
    *   Edge Case Test: Add unit tests in \`apps/api/tests/prepay/edgeCases.test.ts\` for applying discount to already-discounted orders (4 hours)\[FE\]\[BE\]\[QA\]
        
    *   Integration Test: Create integration tests in \`apps/api/tests/integration/prepay.integration.test.ts\` covering checkout flow (4 hours)\[FE\]\[BE\]\[QA\]
        
    *   Config: Add global prepay percentage in \`apps/api/config/prepayConfig.ts\` (10%) (4 hours)\[FE\]\[BE\]\[DevOps\]
        
    *   DB Seed: Seed prepay policy in \`apps/api/prisma/seed.ts\` for table\_prepay\_policies (4 hours)\[FE\]\[BE\]
        
*   **Show Prepay Discount Option:** As a: shopper, I want to: see a Prepay Discount option during checkout, So that: I can choose to prepay to save 10%**(36 hours)** - Discount option is visible on checkout when eligible Selecting option updates estimated total Option states clearly whether active/inactive Accessibility compliant for screen readers No option available if customer not eligible
    
    *   DB: Add prepay\_policies table migration in \`apps/api/migrations/20251110\_add\_prepay\_policies.sql\` (4 hours)\[FE\]\[BE\]
        
    *   API: Create Cloud Function endpoint in \`apps/api/functions/prepayPolicy.ts\` to fetch policy and eligibility (4 hours)\[FE\]\[BE\]
        
    *   Service: Implement eligibility logic in \`apps/api/services/prepay/PrepayService.ts\` (uses \`table\_prepay\_policies\` and \`table\_users\`) (4 hours)\[FE\]\[BE\]
        
    *   Frontend: Build CheckoutPrepayOption component in \`apps/web/components/checkout/CheckoutPrepayOption.tsx\` (4 hours)\[FE\]
        
    *   Frontend: Update CheckoutSummary to apply discount in \`apps/web/components/checkout/CheckoutSummary.tsx\` (4 hours)\[FE\]
        
    *   State: Add Redux slice in \`apps/web/store/prepaySlice.ts\` to manage selection and eligibility (4 hours)\[FE\]
        
    *   Accessibility: Add a11y attributes and screen reader labels in \`apps/web/components/checkout/CheckoutPrepayOption.tsx\` and tests in \`apps/web/tests/prepay.a11y.test.tsx\` (4 hours)\[FE\]\[QA\]
        
    *   Tests: Add unit tests for PrepayService in \`apps/api/tests/prepayService.test.ts\` and frontend tests in \`apps/web/tests/prepay.test.tsx\` (4 hours)\[FE\]\[BE\]\[QA\]
        
    *   Docs: Add feature docs in \`docs/prepay.md\` and update changelog in \`apps/web/CHANGELOG.md\` (4 hours)\[FE\]
        
*   **Reflect Discount in Price:** As a: shopper, I want to: see the discount reflected in the final price after applying prepay, So that: I am aware of the savings before payment**(32 hours)** - Final price includes 10% discount Discount applied only if prepay selected and eligible Totals update in real-time during checkout Receipt shows discount amount and new total Edge case: correct rounding of discount currency precision
    
    *   DB: Create prepay\_policies migration in \`apps/api/migrations/20251110\_add\_prepay\_policies.sql\` (4 hours)\[FE\]\[BE\]
        
    *   API: Add prepay eligibility endpoint in \`apps/api/functions/prepay.ts\` (4 hours)\[FE\]\[BE\]
        
    *   Service: Implement applyPrepayDiscount(amount:number) in \`apps/api/services/price/PriceService.ts\` (4 hours)\[FE\]\[BE\]
        
    *   Frontend: Update CheckoutScreen to show discounted total in \`apps/mobile/components/checkout/CheckoutScreen.tsx\` (4 hours)\[FE\]
        
    *   Frontend: Update Receipt to display discount and new total in \`apps/mobile/components/checkout/Receipt.tsx\` (4 hours)\[FE\]
        
    *   State: Add prepay flag and discount fields in \`apps/mobile/state/checkoutSlice.ts\` (4 hours)\[FE\]
        
    *   Test: Add unit and integration tests in \`tests/checkout/discount.test.ts\` for rounding and realtime updates (4 hours)\[FE\]\[QA\]
        
    *   Docs: Document prepay discount behavior in \`docs/prepay\_discount.md\` (4 hours)\[FE\]
        
*   **Show Prepay Discount Option: (0 hours)**
    
*   **Reflect Discount in Price: (0 hours)**
    
*   **Offer Pay-on-Arrival Option: (24 hours)**
    
    *   DB: Add pay\_on\_arrival field to prepay\_policies document schema in \`apps/api/models/prepayPolicy.ts\` (4 hours)\[FE\]\[BE\]
        
    *   API: Create updatePayOnArrival Cloud Function in \`apps/api/functions/prepay/updatePayOnArrival.ts\` to set policy flag (4 hours)\[FE\]\[BE\]
        
    *   API: Add endpoint in \`apps/api/routes/prepayRoutes.ts\` to call updatePayOnArrival (4 hours)\[FE\]\[BE\]
        
    *   Frontend: Add PayOnArrival toggle in \`apps/mobile/components/prepay/PrepayOptions.tsx\` (4 hours)\[FE\]
        
    *   Frontend: Persist selection in \`apps/mobile/services/prepay/PrepayService.ts\` calling prepayRoutes endpoint (4 hours)\[FE\]\[BE\]
        
    *   Testing: Add unit tests in \`apps/api/tests/prepay/updatePayOnArrival.test.ts\` and \`apps/mobile/tests/prepay/PrepayOptions.test.tsx\` (4 hours)\[FE\]\[BE\]\[QA\]
        
*   **Display Discount Badge: (44 hours)**
    
    *   DB: Create prepay\_policies seed in \`apps/api/db/seeds/prepayPolicies.seed.ts\` (4 hours)\[FE\]\[BE\]
        
    *   API: Implement getPrepayPolicy() in \`apps/api/services/prepay/PrepayService.ts\` (4 hours)\[FE\]\[BE\]
        
    *   API: Add /prepay-policy route in \`apps/api/routes/prepayRoutes.ts\` (4 hours)\[FE\]\[BE\]
        
    *   Service: Add applyPrepayDiscount(product) in \`apps/api/services/pricing/PricingService.ts\` (4 hours)\[FE\]\[BE\]
        
    *   Frontend: Build DiscountBadge component in \`apps/mobile/components/DiscountBadge.tsx\` (4 hours)\[FE\]
        
    *   Frontend: Integrate DiscountBadge into ProductCard in \`apps/mobile/components/ProductCard.tsx\` (4 hours)\[FE\]
        
    *   Frontend Web: Build DiscountBadge in \`apps/web/components/DiscountBadge.tsx\` (4 hours)\[FE\]
        
    *   Frontend Web: Integrate DiscountBadge into PricingPage in \`apps/web/pages/PricingPage.tsx\` (4 hours)\[FE\]
        
    *   Testing: Add unit tests for PrepayService in \`apps/api/services/prepay/\_\_tests\_\_/PrepayService.test.ts\` (4 hours)\[FE\]\[BE\]\[QA\]
        
    *   Testing: Add component tests for DiscountBadge in \`apps/mobile/components/\_\_tests\_\_/DiscountBadge.test.tsx\` (4 hours)\[FE\]\[QA\]
        
    *   Docs: Update feature docs in \`docs/features/prepay-discount.md\` (4 hours)\[FE\]
        

### **Milestone 6: User Profile, History & Management: booking history, cancel/reschedule, payment methods, notifications**

_Estimated 101.5 hours_

*   **Cancel Booking:** As a: user, I want to: cancel a booking from the history view, So that: I can free up slots and avoid charges for unused services**(12 hours)** - User can initiate cancel from a booking detail or history item Cancellation is reflected in booking status and history Cancellation policy is applied (fees/free window) User receives cancellation confirmation System updates availability where applicable
    
    *   API: Add cancelBooking mutation in \`apps/api/routes/history/HistoryRouter.ts\` (router\_route\_history\_flow) - (M) (1 hours)\[FE\]\[BE\]
        
    *   CloudFunc: Implement cancellation handler in \`apps/api/functions/cancelBooking/index.ts\` referencing policy and availability (router\_route\_history\_flow) - (M) (1 hours)\[FE\]\[BE\]
        
    *   DB: Add cancellation fields & status update in \`apps/api/models/appointments\_history.ts\` (table\_appointments\_history) - (M) (1 hours)\[FE\]\[BE\]
        
    *   DB: Record refund/fee in \`apps/api/models/payments\_history.ts\` (table\_payments\_history) - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Add Cancel button and flow in \`apps/mobile/components/history/ActionsPanel.tsx\` (comp\_history\_actions, route\_history\_flow) - (M) (1 hours)\[FE\]
        
    *   Frontend: Build CancelConfirmation modal in \`apps/mobile/components/history/CancelConfirmation.tsx\` (comp\_history\_actions, route\_history\_flow) - (M) (1 hours)\[FE\]
        
    *   State: Update Redux cancelBooking action in \`apps/mobile/store/actions/bookingActions.ts\` (route\_history\_flow) - (M) (1 hours)\[FE\]
        
    *   Sync: Subscribe to onBookingStatusChange in \`apps/mobile/services/booking/BookingService.ts\` (router\_route\_history\_flow) - (M) (1 hours)\[FE\]\[BE\]
        
    *   Integration: Update availability via \`apps/api/services/availability/AvailabilityService.ts\` and Calendar API (table\_appointments\_history) - (M) (1 hours)\[FE\]\[BE\]
        
    *   Notification: Send cancellation confirmation via \`apps/api/services/notifications/NotificationService.ts\` and update UI badge (route\_history\_flow) - (M) (1 hours)\[FE\]\[BE\]
        
    *   Testing: Add unit tests for cancel logic in \`apps/api/functions/cancelBooking/\_\_tests\_\_/cancel.test.ts\` (router\_route\_history\_flow, table\_appointments\_history) - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   Testing: Add E2E test for user cancel flow in \`apps/mobile/\_\_tests\_\_/cancelBooking.e2e.ts\` (route\_history\_flow, comp\_history\_actions) - (M) (1 hours)\[FE\]\[QA\]
        
*   **History: Booking Detail:** As a: user, I want to: view details of a specific past booking, So that: I can review services, dates, and payments**(11 hours)** - Detail view shows all service, date, status, payments Back navigation to list works Print/export option available Related bookings shown if applicable Data consistent with booking record
    
    *   API: Add getBookingDetail(bookingId) in \`apps/api/services/bookings/BookingService.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   DB: Ensure appointments\_history query mapping in \`apps/api/models/appointments\_history.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   DB: Add payments join in \`apps/api/services/payments/PaymentsService.ts\` to query \`table\_payments\` and \`table\_payments\_history\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Create bookings detail route \`/history/:id\` handler in \`apps/api/routes/history/bookingDetail.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Build BookingDetail screen component in \`apps/web/src/pages/history/BookingDetail.tsx\` (route: route\_history\_flow) - (M) (1 hours)\[FE\]
        
    *   Frontend: Implement Back navigation using React Navigation in \`apps/web/src/pages/history/BookingDetail.tsx\` (route\_history\_flow) - (M) (1 hours)\[FE\]
        
    *   Frontend: Add Print/Export button using \`apps/web/src/components/print/PrintExportButton.tsx\` and integrate Cloud Storage export \`apps/api/services/storage/StorageService.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Show related bookings list in \`apps/web/src/components/history/RelatedBookings.tsx\` querying \`/history/related\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Map booking fields to UI, display service, date, status, payments in \`apps/web/src/pages/history/BookingDetail.tsx\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Quality: Add unit tests for BookingService.getBookingDetail in \`apps/api/tests/services/bookings/BookingService.spec.ts\` - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   Quality: Add E2E test for BookingDetail page in \`apps/web/tests/e2e/BookingDetail.test.ts\` - (M) (1 hours)\[FE\]\[QA\]
        
*   **History: Cancel:** As a: user, I want to: cancel a past booking from history, So that: I can free up slots and manage changes**(8 hours)** - Cancellation option exists in history-detail Policy and refunds applied Status updated and reflected in history Confirmation sent to user System updates availability if needed
    
    *   Frontend: Add Cancel button in history-detail component components/history/HistoryDetail.tsx (route\_history\_flow) preserved architecture: route\_history\_flow, HistoryDetail.tsx, frontend flow. Enhance by adding Cancel action wired to API and state updates. - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   Frontend: Implement Cancel confirmation modal in components/history/CancelModal.tsx (route\_history\_flow) using React/TS with accessible modal pattern, props from HistoryDetail, and integration to trigger API call on confirm. - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   API: Add cancelAppointment endpoint in apps/api/routes/appointments.ts to validate and initiate cancellation - (M) (1 hours)\[FE\]\[BE\]
        
    *   Function: Create Cloud Function functions/cancelAppointment/index.ts to handle policy, refunds (Stripe), and availability updates - (L) (2 hours)\[FE\]
        
    *   DB: Update appointment status in apps/api/models/appointments\_history.ts to 'cancelled' and record timestamp (table\_appointments\_history) - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   DB: Create payment refund record in apps/api/models/payments\_history.ts and update apps/api/models/payments.ts (table\_payments\_history, table\_payments) - (M) (1 hours)\[FE\]\[BE\]
        
    *   Backend: Update provider availability in apps/api/services/availability/AvailabilityService.ts (references table\_appointments\_history) - (M) (1 hours)\[FE\]\[BE\]
        
    *   Notification: Send confirmation email in apps/api/services/notifications/NotificationService.ts and push via Cloud Functions (table\_users) - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   Test: Add integration tests for cancel flow in apps/api/tests/cancelAppointment.test.ts (api\_development, testing) - (S) (0.5 hours)\[FE\]\[BE\]\[QA\]
        
    *   Docs: Document cancel flow and API in docs/features/history-cancel.md (documentation) - (XS) (0.5 hours)\[FE\]\[BE\]
        
*   **Booking History:** As a: user, I want to: view my past bookings in a chronological list, So that: I can review my booking activity and re-access details quickly**(10 hours)** - User can access Booking History from History & Bookings section History list loads within 2 seconds Each entry shows date, service, status, and total amount System handles empty history gracefully Data is paginated for large histories
    
    *   DB: Add appointments\_history migration in \`prisma/migrations/\` to include date, service, status, total\_amount - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement getBookingHistory in \`apps/api/routes/history/HistoryRouter.ts\` to query \`table\_appointments\_history\` with pagination - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement getBookingCount in \`apps/api/routes/history/HistoryRouter.ts\` for pagination totals - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Build HistoryList component in \`apps/web/components/history/HistoryList.tsx\` wired to \`route\_history\_flow\` and \`comp\_history\_list\` with pagination UI - (M) (1 hours)\[FE\]
        
    *   Frontend: Add route /history in \`apps/web/routes/HistoryRoute.tsx\` to access History & Bookings (\`route\_history\_flow\`) and link \`comp\_history\_list\` - (M) (1 hours)\[FE\]
        
    *   API: Add caching and limit logic in \`apps/api/routes/history/HistoryRouter.ts\` to ensure list loads within 2s - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Implement empty state UI in \`apps/web/components/history/HistoryEmpty.tsx\` and integrate into \`apps/web/components/history/HistoryList.tsx\` - (M) (1 hours)\[FE\]
        
    *   Testing: Add integration tests in \`apps/api/tests/history.test.ts\` for getBookingHistory and pagination - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   Testing: Add frontend tests in \`apps/web/tests/HistoryList.test.tsx\` to verify entries show date, service, status, amount and empty state - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   Documentation: Update README in \`apps/web/README.md\` with usage of /history (\`route\_history\_flow\`) and component \`comp\_history\_list\` - (M) (1 hours)\[FE\]
        
*   **Rebook Service:** As a: user, I want to: rebook a past service from history, So that: I can quickly book the same service again**(10.5 hours)** - User can select past booking and choose rebook Pre-filled service details are applied User can modify date/time and confirm System creates a new booking linked to past record Receipt or confirmation is provided
    
    *   Frontend: Implement Rebook button in history ActionsPanel and wire action handler to open RebookForm with prefilled context. - (S) (0.5 hours)\[FE\]
        
    *   Frontend: Pre-fill RebookForm.tsx using props from ActionsPanel.tsx to pass past booking context (date, service, provider) into the form on navigation. - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   API: Add rebookFromPast mutation handler in router.ts implementing rebookFromPast operation; validates input and delegates to RebookService. - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement rebookService logic in RebookService.ts to create new booking\_record linked to past record and return booking overview. - (M) (1 hours)\[FE\]\[BE\]
        
    *   DB: Add booking creation and linkage write to appointments\_history table via appointments\_history.ts updating relevant records. - (M) (1 hours)\[FE\]
        
    *   API: Integrate payment/receipt creation in PaymentService and write to payments\_history table via PaymentsHistory; ensure correlation to new booking. - (L) (2 hours)\[FE\]\[BE\]
        
    *   CloudFunction: Create Cloud Function createBooking.ts to trigger notifications and confirmation generation after successful rebooking. - (L) (2 hours)\[FE\]
        
    *   Frontend: Update /History route route\_history\_flow to include navigation to RebookForm and display confirmation upon successful rebook. - (S) (0.5 hours)\[FE\]
        
    *   Testing: Add integration tests in apps/api/tests/rebook.test.ts covering rebookFromPast -> ensures new booking linked to past record. - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   Testing: Add E2E test in apps/mobile/e2e/rebook.spec.ts exercising selection from ActionsPanel.tsx to confirmation - (M) (1 hours)\[FE\]\[QA\]
        
*   **Edit Booking:** As a: user, I want to: edit an existing booking from history, So that: I can make changes without creating a new booking**(9 hours)** - User can modify date, time, or service Validation of available slots Updated booking reflects in history and calendar Notification of changes sent to user Audit trail entry created
    
    *   Frontend: Add EditBooking modal in \`components/history/BookingEditModal.tsx\` - (M) (1 hours)\[FE\]
        
    *   Frontend: Wire Edit action on /history/flow in \`pages/history/flow/BookingDetail.tsx\` to open \`components/history/BookingEditModal.tsx\` - (M) (1 hours)\[FE\]
        
    *   API: Implement updateBooking mutation handler in \`apps/api/routes/history/updateBooking.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Add availability check in \`apps/api/services/booking/AvailabilityService.ts\` used by \`apps/api/routes/history/updateBooking.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   DB: Add audit entry creation in \`apps/api/services/audit/AuditService.ts\` to write to \`table\_appointments\_history\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   System: Send change notification via Cloud Function in \`apps/api/functions/notifications/sendBookingUpdate.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Update booking in Redux store in \`store/bookings/bookingsSlice.ts\` upon successful update - (M) (1 hours)\[FE\]
        
    *   Frontend: Refresh calendar view on /history/flow in \`components/calendar/CalendarView.tsx\` after edit - (M) (1 hours)\[FE\]
        
    *   Testing: Add integration test for edit flow in \`apps/api/tests/history/editBooking.test.ts\` - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
*   **History: Rebook:** As a: user, I want to: rebook a past booking from history, So that: I can repeat a service quickly**(11 hours)** - Rebook action pre-fills details Date/time can be adjusted New booking created with references to past booking Payment flow initiated if required Confirmation delivered
    
    *   Frontend: Build RebookModal component in \`apps/mobile/components/history/RebookModal.tsx\` -> route\_history\_flow - (M) (1 hours)\[FE\]
        
    *   Frontend: Add Rebook button to /History route in \`apps/mobile/screens/HistoryScreen.tsx\` -> route\_history\_flow - (M) (1 hours)\[FE\]
        
    *   API: Implement createRebookBooking in \`apps/api/services/booking/BookingService.ts\` -> table\_appointments\_history, table\_payments - (M) (1 hours)\[FE\]\[BE\]
        
    *   Function: Add rebook Cloud Function in \`apps/api/functions/rebookHandler.ts\` to create booking and reference past booking -> table\_appointments\_history, payments\_history - (M) (1 hours)\[FE\]\[BE\]
        
    *   Payment: Integrate Stripe payment initiation in \`apps/api/config/stripe.ts\` and call from \`apps/api/functions/rebookHandler.ts\` -> table\_payments, payments\_history - (M) (1 hours)\[FE\]\[BE\]\[DevOps\]
        
    *   Frontend: Prefill RebookModal fields from \`apps/mobile/services/history/HistoryService.ts\` -> route\_history\_flow, table\_appointments\_history - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Allow date/time adjustments in \`apps/mobile/components/history/RebookModal.tsx\` and validate in \`apps/mobile/utils/validation.ts\` -> route\_history\_flow - (M) (1 hours)\[FE\]\[QA\]
        
    *   API: Store new booking with reference to past booking in \`apps/api/services/booking/BookingService.ts\` -> table\_appointments\_history - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Create payment record in \`apps/api/services/payments/PaymentsService.ts\` when required -> table\_payments, payments\_history - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Show confirmation screen and push notification in \`apps/mobile/screens/ConfirmationScreen.tsx\` and \`apps/api/functions/notificationSender.ts\` -> route\_history\_flow, table\_appointments\_history - (M) (1 hours)\[FE\]\[BE\]
        
    *   Tests: Add unit and e2e tests for rebook flow in \`apps/mobile/\_\_tests\_\_/RebookModal.test.tsx\` and \`apps/api/\_\_tests\_\_/rebookHandler.test.ts\` - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
*   **Payment Records:** As a: user, I want to: view payment records associated with bookings, So that: I can track payments and receipts**(16 hours)** - Payment records are visible in History & Bookings Each record shows amount, method, date, and status Filters for date range and status Export or downloadable receipts option Data reconciles with bookings
    
    *   DB: Add payments table migration in \`apps/api/db/migrations/202511\_add\_payments\_table.sql\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   DB: Add payments\_history migration in \`apps/api/db/migrations/202511\_add\_payments\_history\_table.sql\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement getPaymentRecords() in \`apps/api/routes/history/getPaymentRecords.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement getBookingPayments() in \`apps/api/routes/history/getBookingPayments.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement addPaymentRecord() mutation in \`apps/api/routes/history/addPaymentRecord.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement exportReceipt() in \`apps/api/routes/history/exportReceipt.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Service: Create PaymentsService with reconcilePayments() in \`apps/api/services/payments/PaymentsService.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Build PaymentList component in \`apps/web/components/history/PaymentList.tsx\` - (M) (1 hours)\[FE\]
        
    *   Frontend: Update /History page in \`apps/web/pages/history/HistoryPage.tsx\` to show payments - (M) (1 hours)\[FE\]
        
    *   Frontend: Update Booking Detail component in \`apps/web/components/history/BookingDetail.tsx\` to list booking payments - (M) (1 hours)\[FE\]
        
    *   Frontend: Add filters (date range & status) in \`apps/web/components/history/PaymentFilters.tsx\` - (M) (1 hours)\[FE\]
        
    *   Frontend: Implement export/download button in \`apps/web/components/history/ExportReceiptButton.tsx\` - (M) (1 hours)\[FE\]
        
    *   Storage: Save generated receipts to Firebase Storage in \`apps/api/services/payments/ExportService.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Testing: Add API tests for payment endpoints in \`apps/api/tests/history/payments.test.ts\` - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   Testing: Add frontend integration tests for History page in \`apps/web/tests/history/HistoryPage.test.tsx\` - (M) (1 hours)\[FE\]\[QA\]
        
    *   Docs: Update README and API docs in \`docs/history/payments.md\` - (M) (1 hours)\[FE\]\[BE\]
        
*   **History: List View:** As a: user, I want to: see a list view of my booking history, So that: I can scan and locate bookings quickly**(8 hours)** - List loads with at least 20 items Infinite scroll or pagination works Each item shows key fields (date, service, status) Search within history is functional No performance degradation on large histories
    
    *   DB: Add Firestore index & seed 50 records in \`apps/api/firestore/index.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement fetchHistory(pageSize, cursor, query) in \`apps/api/services/history/HistoryService.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Build HistoryList component with infinite scroll in \`components/history/HistoryList.tsx\` (route: route\_history\_flow) - (M) (1 hours)\[FE\]
        
    *   Frontend: Build HistoryItem component showing date, service, status in \`components/history/HistoryItem.tsx\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Build HistorySearch component and wire to service in \`components/history/HistorySearch.tsx\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Performance: Add virtualization and caching in \`components/history/HistoryList.tsx\` and \`apps/api/services/history/HistoryService.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Testing: Add unit and integration tests in \`tests/history/\` for pagination, search, and item rendering - (M) (1 hours)\[FE\]\[QA\]
        
    *   Docs: Update \`docs/history.md\` and code review checklist in \`docs/review\_history.md\` - (M) (1 hours)\[FE\]
        
*   **History: Payments:** As a: user, I want to: view all payments linked to history, So that: I can reconcile payments**(6 hours)** - Payments linked to bookings are visible Total paid and outstanding displayed Filters by status/date Receipts downloadable Data aligns with bookings and payments
    
    *   DB: Add payments query view for bookings in apps/api/services/payments/PaymentsService.ts using existing DB layer to expose a query that joins bookings with payments for history endpoints. - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement GET /payments for history in apps/api/functions/payments/getPayments.ts leveraging the PaymentsService query to fetch historical payments for bookings. - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement receipts download in apps/api/functions/payments/getReceipt.ts to generate or retrieve receipt files for a given payment and return as downloadable asset. - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   Frontend: Build PaymentsList component in apps/web/components/history/PaymentsList.tsx to render payments table with totals and filters using existing frontend framework. - (M) (1 hours)\[FE\]
        
    *   Frontend: Add /history/flow page logic in apps/web/pages/history/flow.tsx to integrate PaymentsList - (S) (0.5 hours)\[FE\]
        
    *   Frontend: Create payments Redux slice in apps/web/store/slices/paymentsSlice.ts with filters and totals - (M) (1 hours)\[FE\]
        
    *   Utils: Implement receipt generation/download in apps/web/utils/receipts.ts - (S) (0.5 hours)\[FE\]
        
    *   Quality: Add tests for payments history in apps/web/\_\_tests\_\_/payments.test.tsx and docs in docs/history/payments.md - (S) (0.5 hours)\[FE\]\[QA\]
        

### **Milestone 7: Documentation & Deployment: API docs, OpenAPI YAML, deployment guides and runbook**

_Estimated 358.5 hours_

*   **Generate OpenAPI YAML: (24 hours)** - OpenAPI YAML is generated without syntax errors YAML includes all defined endpoints with methods, paths, and parameters Schemas for request/response bodies are defined and referenced correctly Authentication and error responses are documented File validates against OpenAPI - 0+ schema
    
    *   API: Add fetchOpenApiTemplate() query in \`apps/api/routes/openapi/router.ts\` (4 hours)\[FE\]\[BE\]
        
    *   API: Implement generateOpenApiYaml(input) mutation in \`apps/api/services/openapi/OpenApiService.ts\` (4 hours)\[FE\]\[BE\]
        
    *   API: Implement getGeneratedYaml() query in \`apps/api/routes/openapi/router.ts\` (4 hours)\[FE\]\[BE\]
        
    *   API: Add YAML validation util in \`apps/api/utils/openapi/validateYaml.ts\` (4 hours)\[FE\]\[BE\]\[QA\]
        
    *   Frontend: Wire Spec Viewer to fetch generated YAML in \`apps/web/components/openapi/SpecViewer.tsx\` (4 hours)\[FE\]\[BE\]
        
    *   Quality: Add integration tests for generation and validation in \`apps/api/tests/openapi/generate.spec.ts\` (4 hours)\[FE\]\[BE\]\[QA\]
        
*   **Add Timezone Fields:** As a: API consumer, I want to: have timezone-aware fields added to relevant models in the OpenAPI YAML, So that: clients can handle time-related data correctly across regions**(7 hours)** - Timezone fields are present on all datetime-related schemas Default timezone behavior is documented Serialization and parsing examples show timezone handling OpenAPI YAML remains valid after additions No breaking changes to existing endpoints or schemas
    
    *   API: Update OpenAPI YAML - add timezone fields to datetime schemas in \`apps/api/openapi/spec.yaml\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Add serialization/parsing examples in \`apps/api/openapi/spec.yaml\` for timezone handling - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Ensure OpenAPI YAML validity by running validator in \`scripts/validate-openapi.sh\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Backend: Add updateTimezone mutation handler in \`apps/api/routes/openapi.ts\` to preserve backward compatibility - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Update SpecViewer to show timezone defaults in \`apps/web/components/openapi/SpecViewer.tsx\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Docs: Document default timezone behavior in \`docs/openapi\_timezone.md\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Tests: Add serialization and parsing tests in \`apps/api/tests/openapi\_timezone.test.ts\` - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
*   **Add Auth Examples: (24 hours)**
    
    *   API: Backup current OpenAPI spec to \`openapi/openapi.yaml.bak\` (4 hours)\[FE\]\[BE\]
        
    *   API: Add auth examples to \`openapi/openapi.yaml\` for OAuth2 and API Key under route\_openapi (4 hours)\[FE\]\[BE\]
        
    *   API: Implement exampleAuth() stub in \`apps/api/services/auth/AuthService.ts\` returning sample tokens (api\_development) (4 hours)\[FE\]\[BE\]
        
    *   Frontend: Create AuthExamples component in \`components/auth/AuthExamples.tsx\` showing usage of OpenAPI auth examples (frontend\_component) (4 hours)\[FE\]\[BE\]
        
    *   Docs: Add auth examples documentation in \`docs/auth-examples.md\` (documentation) (4 hours)\[FE\]
        
    *   Tests: Add OpenAPI examples validation test in \`tests/openapi/authExamples.test.ts\` (testing) (4 hours)\[FE\]\[BE\]\[QA\]
        
*   **Add Booking Examples: (24 hours)**
    
    *   Setup: Create branch \`feature/add-booking-examples\` and backup \`openapi/openapi.yaml\` in \`/openapi/openapi.yaml\` (4 hours)\[FE\]\[BE\]\[DevOps\]
        
    *   API: Add Booking examples to \`openapi/openapi.yaml\` under /bookings POST and GET paths (4 hours)\[FE\]\[BE\]
        
    *   Frontend: Implement BookingExample component in \`components/openapi/BookingExample.tsx\` showing sample request/response (4 hours)\[FE\]\[BE\]
        
    *   Docs: Add booking examples doc in \`docs/openapi/booking.md\` with YAML snippets and usage (4 hours)\[FE\]\[BE\]
        
    *   Tests: Add validation test \`tests/openapi/bookingExamples.test.ts\` to assert examples match schema in \`/openapi/openapi.yaml\` (4 hours)\[FE\]\[BE\]\[QA\]
        
    *   CI: Add workflow check in \`.github/workflows/openapi-examples.yml\` to validate OpenAPI examples (4 hours)\[FE\]\[BE\]
        
*   **Add Services Examples: (20 hours)**
    
    *   API: Add example operations to \`openapi/service-examples.yaml\` referencing operations in \`route\_openapi\` (4 hours)\[FE\]\[BE\]
        
    *   API: Create example service payloads in \`apps/api/services/examples/ServiceExamples.ts\` (4 hours)\[FE\]\[BE\]
        
    *   Frontend: Build ExamplesPage component in \`apps/web/components/examples/ExamplesPage.tsx\` showing examples from \`openapi/service-examples.yaml\` (4 hours)\[FE\]\[BE\]
        
    *   Docs: Update OpenAPI docs in \`docs/openapi/README.md\` with examples and usage\` (4 hours)\[FE\]\[BE\]
        
    *   Testing: Add integration tests in \`apps/api/tests/serviceExamples.test.ts\` validating example payloads against \`openapi/service-examples.yaml\` (4 hours)\[FE\]\[BE\]\[QA\]
        
*   **Add Payments Examples: (20 hours)**
    
    *   API: Add Payments examples to \`openapi/payments.yaml\` with request/response samples (4 hours)\[FE\]\[BE\]
        
    *   API: Reference payment schemas in \`openapi/components/schemas.yaml\` and add example objects (4 hours)\[FE\]\[BE\]
        
    *   Docs: Update OpenAPI rendered page at \`/openapi/index.html\` and include Payments examples from \`openapi/payments.yaml\` (4 hours)\[FE\]\[BE\]
        
    *   Test: Create validation test in \`tests/openapi/validatePaymentsExamples.test.ts\` to validate examples against schemas (4 hours)\[FE\]\[BE\]\[QA\]
        
    *   CI: Add step in \`ci/workflows/validate-openapi.yml\` to run \`tests/openapi/validatePaymentsExamples.test.ts\` (4 hours)\[FE\]\[BE\]\[QA\]
        
*   **Add Google OAuth Examples: (32 hours)**
    
    *   API: Add Google OAuth examples to OpenAPI YAML in \`/openapi/openapi.yaml\` (examples: auth/google, auth/oauth2Callback) (4 hours)\[FE\]\[BE\]
        
    *   API: Add OAuth client config in \`apps/api/config/oauth.ts\` with Google client IDs and redirect URIs (4 hours)\[FE\]\[BE\]\[DevOps\]
        
    *   API: Implement exchange code helper in \`apps/api/services/auth/AuthService.ts\` for Google OAuth token exchange (4 hours)\[FE\]\[BE\]
        
    *   CloudFunction: Create \`functions/googleOAuth.ts\` to handle server-side callback and user upsert into Firestore (4 hours)\[FE\]\[BE\]
        
    *   Frontend: Build GoogleSignInExample component in \`components/auth/GoogleSignInExample.tsx\` using Expo Google Sign-In (4 hours)\[FE\]
        
    *   Frontend: Add demo screen \`screens/GoogleOAuthDemoScreen.tsx\` wiring example to OpenAPI auth paths (4 hours)\[FE\]\[BE\]
        
    *   Testing: Add integration test \`tests/google\_oauth.spec.ts\` validating OpenAPI examples and token exchange mock (4 hours)\[FE\]\[BE\]\[QA\]
        
    *   Docs: Create \`docs/google\_oauth\_examples.md\` with usage and redirect URI steps (4 hours)\[FE\]
        
*   📥 **Include Key Endpoint Examples: (32 hours)** - The YAML download includes a section with at least 3 key endpoint examples Each example lists endpoint, HTTP method, parameters, and a sample response Examples are validated against the OpenAPI schema and render correctly in the downloaded file Edge case handling: when endpoints change, examples update accordingly Acceptance criteria can be automated in CI for YAML artifact validation
    
    *   API: Add fetchOpenAPISpec query handler in \`apps/api/routes/openapi/download.ts\` (4 hours)\[FE\]\[BE\]
        
    *   API: Implement fetchKeyEndpoints & fetchEndpointExamples in \`apps/api/routes/openapi/download.ts\` (4 hours)\[FE\]\[BE\]
        
    *   API: Create generateExamples() in \`apps/api/services/openapi/ExampleGenerator.ts\` (4 hours)\[FE\]\[BE\]
        
    *   API: Implement generateDownload(keyExamples) mutation in \`apps/api/routes/openapi/download.ts\` (4 hours)\[FE\]\[BE\]
        
    *   Frontend: Update YamlPreview component in \`apps/web/components/openapi/YamlPreview.tsx\` to render examples (4 hours)\[FE\]\[BE\]
        
    *   Frontend: Update YamlDownloadPanel in \`apps/web/components/openapi/YamlDownloadPanel.tsx\` to include example selection UI (4 hours)\[FE\]\[BE\]
        
    *   Quality: Add validation tests in \`apps/api/tests/openapi\_examples.test.ts\` to validate examples against schema (4 hours)\[FE\]\[BE\]\[QA\]
        
    *   Infra: Add CI workflow \`.github/workflows/validate\_openapi.yml\` to validate YAML artifact in CI (4 hours)\[FE\]\[BE\]
        
*   🔁 **Update YAML Download Node:** As a: API consumer, I want to: Update the YAML download node to reflect latest OpenAPI spec, So that: The downloaded artifact stays current and accurate**(4 hours)** - Downloaded YAML reflects the latest OpenAPI paths and components Validation confirms the YAML parses without errors CI passes checks on OpenAPI linting and schema validation No breaking changes introduced to existing consumers or download mechanism
    
*   📥 **Prepare YAML Download: (24 hours)**
    
    *   API: Create OpenApi YAML generator in \`apps/api/services/openapi/OpenApiService.ts\` (4 hours)\[FE\]\[BE\]
        
    *   API: Add backend route \`/openapi/download\` handler in \`apps/api/routes/openapi/download.ts\` (4 hours)\[FE\]\[BE\]
        
    *   Frontend: Build DownloadButton component in \`components/openapi/DownloadButton.tsx\` (4 hours)\[FE\]\[BE\]
        
    *   Frontend: Add page at \`/openapi/download\` in \`pages/openapi/download.tsx\` using route\_openapi\_download (4 hours)\[FE\]\[BE\]
        
    *   Testing: Add integration test \`\_\_tests\_\_/openapi/download.test.ts\` to verify YAML content and download (4 hours)\[FE\]\[BE\]\[QA\]
        
    *   Docs: Update OpenAPI route docs in \`docs/openapi.md\` referencing \`route\_openapi\` and \`route\_openapi\_download\` (4 hours)\[FE\]\[BE\]
        
*   📂 **Include Key Examples: (20 hours)**
    
    *   API: Add example generation to OpenApiBuilder in \`apps/api/services/openapi/OpenApiBuilder.ts\` (4 hours)\[FE\]\[BE\]
        
    *   API: Update /openapi YAML file with examples in \`apps/api/specs/openapi.yaml\` (4 hours)\[FE\]\[BE\]
        
    *   API: Implement download route to serve YAML with examples in \`apps/api/routes/openapi/download.ts\` (4 hours)\[FE\]\[BE\]
        
    *   Testing: Add unit test for download route in \`apps/api/tests/openapi/download.test.ts\` (4 hours)\[FE\]\[BE\]\[QA\]
        
    *   Documentation: Update route docs in \`docs/openapi/README.md\` to include example usage for route\_openapi\_download (4 hours)\[FE\]\[BE\]
        
*   🔁 **Enable YAML Export: (24 hours)**
    
    *   API: Implement YAML generator in \`apps/api/services/openapi/OpenApiService.ts\` (4 hours)\[FE\]\[BE\]
        
    *   API: Add download route handler in \`apps/api/routes/openapi/download.ts\` (4 hours)\[FE\]\[BE\]
        
    *   Frontend: Build OpenApiDownload component in \`apps/web/components/openapi/OpenApiDownload.tsx\` (4 hours)\[FE\]\[BE\]
        
    *   Frontend: Add page \`/openapi/download\` in \`apps/web/pages/openapi/download.tsx\` (4 hours)\[FE\]\[BE\]
        
    *   Testing: Add integration tests in \`apps/api/tests/openapi\_download.test.ts\` (4 hours)\[FE\]\[BE\]\[QA\]
        
    *   Docs: Create export guide in \`docs/openapi/export.md\` (4 hours)\[FE\]\[BE\]
        
*   **Add Auth Examples:** As a: developer, I want to: add authentication example endpoints and samples, So that: developers can understand and test auth flows against the OpenAPI spec**(4.5 hours)** - Endpoint for login example returns valid JWT tokens OpenAPI schema includes /auth/login with 200 response Sample request/response payloads are provided and validated against schema Error cases for invalid credentials are handled with proper status codes Security requirements are documented and demonstrated in examples
    
    *   API: Implement loginExample handler in apps/api/routes/openapiExamples.ts to return JWT on valid creds. Implement REST/HAL style response with 200 and 401 handling, using existing login flow and AuthService for JWT generation. Ensure route integrates with OpenAPIExamples namespace and uses authentication middleware as needed. - (M) (1 hours)\[FE\]\[BE\]
        
    *   Service: Add generateJwt(email) in apps/api/services/auth/AuthService.ts and verifyCredentials(email,password). Implement token generation using existing JWT library and verify credentials against seeded user store. Ensure token includes standard claims (sub, email, iat, exp). - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   DB: Ensure users seed/migration for example user in prisma/migrations/ and apps/api/prisma/seed.ts. Add migration to create example user and seed script to insert credentials (hashed). Ensure idempotent seed and compatibility with existing Prisma setup. - (S) (0.5 hours)\[FE\]\[BE\]\[DevOps\]
        
    *   Spec: Add /auth/login path with 200/401 responses and examples in apps/api/openapi/openapi.yaml. Update OpenAPI spec to reflect login flow and response payload structure, including example requests/responses. - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   Frontend: Add AuthExample component in apps/web/components/openapi/examples/AuthExample.tsx showing sample request/response. Create UI element mocking login flow using fetch to /auth/login and displaying JWT or error. - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   Tests: Create auth examples tests in apps/api/tests/authExample.test.ts validating schema and error cases. Tests HTTP 200 and 401 paths, schema validation for login payload and response. - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   Docs: Document security requirements and example usage in apps/api/docs/openapi\_auth\_examples.md - (S) (0.5 hours)\[FE\]\[BE\]
        
*   **Add Payments Examples:** As a: developer, I want to: provide payments examples, So that: users can see how to charge and capture payments via OpenAPI**(5.5 hours)** - POST /payments creates a payment with amount and currency GET /payments/{id} returns payment status Webhook example for payment events Error handling for declined payments
    
    *   DB: Create payments table migration in apps/api/migrations/ and model in apps/api/models/Payment.ts - (XS) (0.5 hours)\[FE\]\[BE\]
        
    *   API: Implement POST /payments handler in apps/api/routes/openapiExamples/payments.ts to create payment - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   API: Implement GET /payments/{id} handler in apps/api/routes/openapiExamples/payments.ts to return payment status - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   API: Implement webhook endpoint in apps/api/routes/webhooks/paymentsWebhook.ts with example payload - (M) (1 hours)\[FE\]\[BE\]
        
    *   Service: Add declined payment handling in apps/api/services/payments/PaymentService.ts and map error responses - (M) (1 hours)\[FE\]\[BE\]
        
    *   OpenAPI: Add payments examples to apps/api/openapi/examples/payments.yaml and reference in apps/api/openapi/openapi.yaml - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   Frontend: Add Payments example component in apps/web/components/openapi/examples/PaymentsExample.tsx and detail pane apps/web/components/openapi/ExamplesPanel/PaymentsExampleDetail.tsx - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   Tests: Add unit/integration tests in apps/api/tests/payments.test.ts covering create, retrieve, webhook, and declined flow - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
*   **Add Booking Examples:** As a: developer, I want to: add booking endpoints examples, So that: users can see how to create, retrieve, and cancel bookings via OpenAPI**(7 hours)** - POST /bookings creates a booking with valid customer and service IDs GET /bookings/{id} returns booking details DELETE /bookings/{id} cancels a booking and updates status Sample requests include time, service, and customer fields Responses include appropriate status codes and error handling
    
    *   API: Add POST /bookings example handler in \`apps/api/routes/openapi/examples.ts\` (create booking example with customerId, serviceId, time) - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Add GET /bookings/{id} example response in \`apps/api/routes/openapi/examples.ts\` (return booking details) - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Add DELETE /bookings/{id} example in \`apps/api/routes/openapi/examples.ts\` (cancel booking, update status) - (M) (1 hours)\[FE\]\[BE\]
        
    *   Spec: Update OpenAPI YAML with booking examples in \`apps/api/openapi/openapi.yaml\` (include sample requests/responses and error cases) - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Build ExamplesPanel bookings tab in \`apps/web/components/openapi/ExamplesPanel.tsx\` to show POST/GET/DELETE examples - (M) (1 hours)\[FE\]\[BE\]
        
    *   Page: Add Examples list page entry in \`apps/web/pages/openapi/examples.tsx\` linking to route \`/openapi/examples\` and comp\_openapi\_examples\_examples\_list - (M) (1 hours)\[FE\]\[BE\]
        
    *   Tests: Add integration tests for booking examples in \`apps/api/tests/bookingsExamples.test.ts\` covering POST/GET/DELETE and error handling - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
*   **Add Services/Styles Examples:** As a: developer, I want to: include services and styles endpoints examples, So that: consumers can explore available services and styling options**(10 hours)** - GET /services returns list with id, name, duration GET /services/{id} returns service details GET /styles returns list of styles with metadata GET /styles/{id} returns style details
    
    *   API: Add GET /services handler in \`apps/api/routes/openapi/examples/services.ts\` returning id,name,duration - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Add GET /services/{id} handler in \`apps/api/routes/openapi/examples/services.ts\` returning service details - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Add GET /styles handler in \`apps/api/routes/openapi/examples/styles.ts\` returning list with metadata - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Add GET /styles/{id} handler in \`apps/api/routes/openapi/examples/styles.ts\` returning style details - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Register routes in \`apps/api/routes/openapi/examples/index.ts\` and router\_route\_openapi\_examples - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Add Services examples component in \`apps/web/components/openapi/examples/ServicesExamples.tsx\` using route\_openapi\_examples and comp\_openapi\_examples\_examples\_list - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Add Styles examples component in \`apps/web/components/openapi/examples/StylesExamples.tsx\` using route\_openapi\_examples and comp\_openapi\_examples\_examples\_list - (M) (1 hours)\[FE\]\[BE\]
        
    *   Docs: Update OpenAPI YAML examples in \`apps/api/openapi/examples.yaml\` for services and styles - (M) (1 hours)\[FE\]\[BE\]
        
    *   Tests: Add API tests for services endpoints in \`apps/api/tests/openapi/services.test.ts\` - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   Tests: Add API tests for styles endpoints in \`apps/api/tests/openapi/styles.test.ts\` - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
*   **Add Google OAuth Examples:** As a: developer, I want to: show Google OAuth flow examples, So that: developers understand how to authenticate via Google**(9 hours)** - GET /oauth/google/start redirects to Google consent screen GET /oauth/google/callback handles authorization code Token exchange and user info retrieval simulated Error handling for invalid codes
    
    *   API: Add GET /oauth/google/start handler in \`apps/api/routes/openapi/examples/oauth/googleStart.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Add GET /oauth/google/callback handler in \`apps/api/routes/openapi/examples/oauth/googleCallback.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Service: Implement token exchange simulation in \`apps/api/services/auth/GoogleOAuthService.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Service: Implement user info retrieval simulation in \`apps/api/services/auth/GoogleOAuthService.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Wire examples router fetchOAuthExamples in \`apps/api/routers/openapiExamplesRouter.ts\` to include google\_oauth samples - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Add Google OAuth example panel in \`apps/web/components/openapi/ExamplesGoogleOAuth.tsx\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Testing: Add integration tests for /oauth/google/start and /oauth/google/callback in \`apps/api/tests/oauth/google.test.ts\` - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   Testing: Add error handling tests for invalid codes in \`apps/api/tests/oauth/google\_error.test.ts\` - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   Docs: Update OpenAPI examples YAML in \`apps/api/openapi/examples/google\_oauth.yaml\` - (M) (1 hours)\[FE\]\[BE\]
        
*   **REST: Auth Endpoints:** As a: API consumer, I want to: authenticate via OAuth2 and token refresh, So that: I can securely access protected resources.**(7 hours)** - Consumer can obtain an access token using valid credentials Token expires and can be refreshed using a refresh token Invalid credentials are rejected with appropriate error Access to protected endpoints requires a valid token Security best practices (hashing, TLS) enforced
    
    *   DB: Create users migration in \`prisma/migrations/20251110\_create\_users.ts\` preserving Prisma context; implement initial schema for users with fields such as id (UUID), email (unique), password\_hash, created\_at, updated\_at, and roles as an enum/string array as needed. Ensure compatibility with Prisma client and migration history. - (XS) (0.5 hours)\[FE\]
        
    *   Model: Create User model in \`models/User.ts\` with fields id, email, password\_hash, roles; ensure Prisma/User types align with migration and include input types for create/select/where as needed; add index on email for lookup and enum/string representation for roles. - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   API: Implement login(email,password) in \`apps/api/services/auth/AuthService.ts\` to return access and refresh tokens using JWTs; validate credentials by querying user by email, compare password\_hash with bcrypt, issue tokens with appropriate expiry and include refresh token handling; ensure integration with auth middleware and route layer. - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement refreshToken(refreshToken) in \`apps/api/services/auth/AuthService.ts\` to rotate or validate refresh tokens, issue new access token and possibly new refresh token; ensure blacklisting/rotation per security policy and error handling for invalid/expired tokens. - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Add auth routes in \`apps/api/routes/auth.ts\` (POST /auth/login, POST /auth/refresh) wiring to AuthService login and refreshToken; include basic request validation and error handling. - (S) (0.5 hours)\[FE\]\[BE\]\[QA\]
        
    *   Middleware: Add authentication middleware in \`apps/api/middleware/auth.ts\` to verify JWT and attach user to request; handle missing/invalid tokens with 401; ensure compatibility with protected routes. - (M) (1 hours)\[FE\]\[BE\]
        
    *   Router Update: Register auth routes in \`apps/api/router/index.ts\` and document in router\_route\_api\_docs; ensure proper ordering and export of router modules for /auth endpoints and ensure route docs exposure. - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   Security: Integrate password hashing using bcrypt in \`apps/api/services/auth/AuthService.ts\` and enforce TLS config in \`apps/api/config/server.ts\` - (M) (1 hours)\[FE\]\[BE\]\[DevOps\]
        
    *   Testing: Add integration tests for auth endpoints in \`tests/auth/auth.test.ts\` covering token expiry and invalid credentials - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   Docs: Add endpoint docs in \`components/api/endpointAuth.md\` and expose in \`route\_api\_docs\` via comp\_api\_docs\_endpoint\_detail - (XS) (0.5 hours)\[FE\]\[BE\]
        
*   **REST: Users Endpoints:** As a: API consumer, I want to: manage user profiles (create/read/update/delete), So that: I can handle user data lifecycle.**(8 hours)** - Create user records with valid data Fetch user profile by ID Update user fields with proper validation Delete user and cascade effects handled Validation for unique email and data constraints
    
    *   DB: Create users migration in \`apps/api/prisma/migrations/\` to define table\_users with email unique - (M) (1 hours)\[FE\]\[BE\]
        
    *   Model: Add User model in \`apps/api/models/User.ts\` with email,name,createdAt,deletedAt - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Add users router endpoints in \`apps/api/routes/users.ts\` for POST /users, GET /users/:id, PATCH /users/:id, DELETE /users/:id - (M) (1 hours)\[FE\]\[BE\]
        
    *   Service: Implement createUser() in \`apps/api/services/user/UserService.ts\` with unique email check and validation - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   Service: Implement getUserById() in \`apps/api/services/user/UserService.ts\` handling soft-deleted users - (M) (1 hours)\[FE\]\[BE\]
        
    *   Service: Implement updateUser() in \`apps/api/services/user/UserService.ts\` with field validation and email uniqueness - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   Service: Implement deleteUser() in \`apps/api/services/user/UserService.ts\` cascading to \`table\_sessions\` and \`table\_user\_roles\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Tests: Add integration tests in \`apps/api/tests/users.test.ts\` for create, fetch, update, delete, and validation cases - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
*   **REST: Bookings Flow:** As a: API consumer, I want to: create, view, and cancel bookings, So that: I can manage appointments end-to-end.**(10 hours)** - Create booking with valid user, provider, and time Retrieve booking details Cancel booking with status update and refund handling Conflict detection for overlapping bookings Audit log entry on changes
    
    *   DB: Create bookings model in \`apps/api/models/Booking.ts\` and migration in \`prisma/migrations/\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   DB: Add foreign key relations to \`apps/api/models/Booking.ts\` referencing users in \`table\_users\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement createBooking handler in \`apps/api/routes/bookings.ts\` using router\_route\_api\_docs to validate user/provider/time and write to \`apps/api/models/Booking.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement getBookingById in \`apps/api/routes/bookings.ts\` and expose via route in router\_route\_api\_docs - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement cancelBooking in \`apps/api/routes/bookings.ts\` with status update and refund call to \`apps/api/services/payments/PaymentService.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement conflict detection in \`apps/api/services/bookings/BookingService.ts\` to prevent overlapping bookings - (M) (1 hours)\[FE\]\[BE\]
        
    *   System: Add audit log entries on create/update/cancel in \`apps/api/services/audit/AuditService.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Infra: Configure Stripe refund integration in \`apps/api/config/payments.ts\` and \`apps/api/services/payments/PaymentService.ts\` - (M) (1 hours)\[FE\]\[BE\]\[DevOps\]
        
    *   Docs: Add endpoint docs in \`apps/api/docs/bookings.md\` and expose in route\_api\_docs via comp\_api\_docs\_endpoint\_detail - (M) (1 hours)\[FE\]\[BE\]
        
    *   Tests: Add unit/integration tests in \`apps/api/tests/bookings.test.ts\` covering create/retrieve/cancel/conflict/audit - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
*   **REST: Payments & Discounts:** As a: API consumer, I want to: process payments and apply discounts, So that: I can complete transactions with promotions.**(10 hours)** - Apply discount codes with validation Process payment intents and capture funds Handle failed payments gracefully Record payment and discount in ledger Security compliance for payment data
    
    *   DB: Create payments and discounts tables migration in \`apps/api/db/migrations/20251110\_create\_payments\_tables.sql\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Infra: Add Stripe config and env vars in \`apps/api/config/stripe.ts\` and \`apps/api/config/env.ts\` - (M) (1 hours)\[FE\]\[BE\]\[DevOps\]
        
    *   API: Implement DiscountService.validateCode() in \`apps/api/services/payments/DiscountService.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement createPaymentIntent() in \`apps/api/services/payments/PaymentService.ts\` to call Stripe and store intent\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement capturePayment() and handle failures in \`apps/api/services/payments/PaymentService.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API Router: Add endpoints in \`apps/api/routers/paymentsRouter.ts\` (apply-discount, create-intent, capture-intent) - (M) (1 hours)\[FE\]\[BE\]
        
    *   DB: Record payment and discount in ledger in \`apps/api/services/payments/LedgerService.ts\` and \`apps/api/db/migrations/20251110\_create\_payments\_tables.sql\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Security: Add payment data encryption and compliance checks in \`apps/api/middleware/security.ts\` and \`apps/api/config/stripe.ts\` - (M) (1 hours)\[FE\]\[BE\]\[DevOps\]
        
    *   Docs: Update API docs component in \`apps/api/components/apiDocs/Payments.md\` and route \`route\_api\_docs\` via \`comp\_api\_docs\_endpoints\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Testing: Create unit and integration tests in \`apps/api/tests/payments/\` covering discount validation, payment intents, failures\` - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
*   **REST: Admin & Webhooks:** As a: Admin, I want to: manage webhooks and monitor system events, So that: I can integrate with external systems and observe platform health.**(12 hours)** - Create and manage webhooks Test webhook delivery with retries View event logs and delivery status Security validation for webhook payloads Rate limiting and retry strategies
    
    *   DB: Add webhook\_events table migration in \`apps/api/prisma/migrations/\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement saveWebhookSettings mutation in \`apps/api/routes/webhooks/webhookController.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement sendTestWebhook mutation in \`apps/api/routes/webhooks/testWebhookController.ts\` - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   API: Build WebhookDeliveryService in \`apps/api/services/webhooks/WebhookDeliveryService.ts\` with retries and backoff - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Add rate-limiting middleware in \`apps/api/middleware/rateLimit.ts\` and apply to \`apps/api/routes/webhooks/index.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement onWebhookEvent subscription in \`apps/api/routes/webhooks/subscriptions.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Build WebhooksSettings component in \`apps/web/components/apiDocs/IntegrationsWebhooks.tsx\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Add route /api/docs Integrations & Webhooks in \`apps/web/routes/apiDocs.tsx\` referencing comp\_api\_docs\_integrations - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement event logging to webhook\_events in \`apps/api/services/webhooks/EventLogger.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Add payload signature validation middleware in \`apps/api/middleware/verifyWebhookSignature.ts\` - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   Testing: Create integration tests for webhook delivery and retries in \`apps/api/tests/webhooks.test.ts\` - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   Docs: Update /REST API Spec page content in \`apps/web/components/apiDocs/IntegrationsWebhooks.mdx\` - (M) (1 hours)\[FE\]\[BE\]
        
*   **REST: Providers & Availability:** As a: API consumer, I want to: check provider availability and schedule slots, So that: I can book services efficiently.**(9.5 hours)** - List providers with availability status Query available slots for a provider Reserve a timeslot and return confirmation Handle slot conflicts gracefully Data consistency across bookings and provider calendars
    
    *   DB: Create providers and bookings tables migration in apps/api/prisma/migrations/20251110\_create\_providers\_bookings/ preserving existing Prisma schema and migration conventions to support providers list, availability checks, and bookings/reservations persistence - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   API: Implement getProvidersWithAvailability() in apps/api/services/availability/AvailabilityService.ts to return providers with current availability windows leveraging Prisma queries and in-memory caching for performance - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Add /providers endpoint handler in apps/api/routes/providers.ts and register in apps/api/routers/router\_route\_api\_docs.ts to expose provider listings and their availability - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   API: Implement queryAvailableSlots(providerId) in apps/api/services/availability/AvailabilityService.ts to fetch available time slots for a provider using existing availability data and slot granularity - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement reserveSlot() in apps/api/services/availability/AvailabilityService.ts with optimistic locking in apps/api/db/bookingRepository.ts to prevent double bookings - (L) (2 hours)\[FE\]\[BE\]
        
    *   API: Add booking mutation /providers/:id/reserve in apps/api/routes/providers.ts and update apps/api/routers/router\_route\_api\_docs.ts - (L) (2 hours)\[FE\]\[BE\]
        
    *   Frontend: Document Providers & Availability endpoint in apps/api/pages/api/docs/route\_api\_docs.md and update component components/comp\_api\_docs\_endpoints - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   Quality: Add integration tests in apps/api/tests/providers\_availability.test.ts for list, query, reserve, conflict handling and consistency - (L) (2 hours)\[FE\]\[BE\]\[QA\]
        
*   **REST: Services & Styles:** As a: API consumer, I want to: retrieve and filter services and styles, So that: I can present options to users.**(4.5 hours)** - List services with filters (type, duration) Retrieve associated styles and pricing Filter results by category Respect pagination and sorting Data integrity for service/style relationships
    
    *   DB migration: create services and styles tables in apps/api/prisma/migrations/20251110\_add\_services\_styles/ with proper columns (services: id PK, name, category\_id, pricing, created\_at; styles: id PK, service\_id FK, name, price, attributes JSON), and seed-safe rollback. Ensure Prisma migration generates SQL for PostgreSQL, includes indices on foreign keys and pricing fields, and adheres to existing Prisma schema. - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   DB seed: add scripts in apps/api/prisma/seed/servicesSeed.ts to populate initial services and styles data, including relationships. Script should be idempotent on re-run, insert sample services with categories and related styles, and be consumable by a seed runner in MVP environment. Ensure it can be re-run after migrations and uses Prisma client. - (S) (0.5 hours)\[FE\]\[BE\]\[DevOps\]
        
    *   API: Add getServices endpoint in apps/api/routes/apiDocs/services.ts implementing filters, pagination, sorting; expose GET /api/docs/services with query params: filter by category, search by name, page, limit, sortBy, sortDir. Return structured DTO with total, page, pageSize, data (services with fields: id, name, category, pricing). Integrate with existing Prisma client and guard against invalid inputs. - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement service/style retrieval logic in apps/api/services/service/ServiceService.ts returning styles and pricing for a given service. Expose method getServiceWithStyles(serviceId) that fetches service info, related styles, and pricing, handling missing service gracefully and returning normalized data structure. - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Add category filter and integrity checks in apps/api/middleware/validateRelation.ts to validate relationships between services, categories, and styles. Ensure category filter is valid, and that requested relations exist before querying API docs services, returning 400 for invalid references. - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   Frontend: Add Services endpoint doc in apps/web/components/apiDocs/Endpoints/ServicesEndpoint.tsx documenting the getServices endpoint, including filters, pagination, and sorting, with example requests and response shapes. Ensure consistency with backend API docs. - (XS) (0.5 hours)\[FE\]\[BE\]
        
    *   Testing: Create integration tests for services endpoint in apps/api/tests/integration/services.test.ts covering: successful retrieval with defaults, filtering, pagination, sorting, and error on invalid inputs. - (S) (0.5 hours)\[FE\]\[BE\]\[QA\]
        
*   **REST: Google Calendar Integration:** As a: API consumer, I want to: sync bookings with Google Calendar, So that: users have up-to-date schedules across platforms.**(7 hours)** - Create calendar events from bookings Handle calendar updates and conflicts OAuth scope management for calendar access Error handling for sync failures Data consistency between bookings and calendar events
    
    *   DB: Add calendar\_events collection schema in \`apps/api/models/calendar/CalendarEvent.ts\` preserving architecture references and adding type-safe schema for calendar events with indexes for fast querying. - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   API: Implement OAuth scopes and token storage in \`apps/api/services/auth/GoogleAuthService.ts\` including refresh token handling and secure storage. - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Add calendar connect endpoints in \`apps/api/routes/integrations/calendar.ts\` (enableCalendarSync, connectIntegration, disableCalendarSync) - (M) (1 hours)\[FE\]\[BE\]
        
    *   Backend: Implement CalendarService.syncEventFromBooking in \`apps/api/services/calendar/CalendarService.ts\` to create/update Google Calendar events - (M) (1 hours)\[FE\]\[BE\]
        
    *   Backend: Add Cloud Function \`apps/api/functions/syncCalendarOnBooking.ts\` to trigger on booking create/update - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Implement fetchCalendarAuthStatus query in \`apps/api/routes/integrations/calendar.ts\` - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   Frontend: Build CalendarSyncToggle component in \`apps/web/components/integrations/CalendarSyncToggle.tsx\` and route link in \`apps/web/routes/api/docs/Integrations.tsx\` - (S) (0.5 hours)\[FE\]\[BE\]
        
    *   Testing: Add integration tests for calendar sync in \`apps/api/tests/calendar\_sync.test.ts\` covering create, update, conflict - (M) (1 hours)\[FE\]\[BE\]\[QA\]
        
    *   Quality: Add docs for OAuth scopes and failure modes in \`docs/integrations/google\_calendar.md\` - (XS) (0.5 hours)\[FE\]
        

### **Milestone 8: Maintenance & Support: monitoring, backups, security updates, ongoing support**

_Estimated 26 hours_

*   **Security Updates:** As a: security engineer, I want to: apply and verify security patches across the system, So that: the platform remains protected against known vulnerabilities and compliant with security policies**(9 hours)** - Security patches are applied to all affected components without failures Vulnerabilities are scanned and show 0 critical issues post-update Access control and authentication flows function without regression Affected services remain available with no degradation in performance during patch rollout Audit logs show patch deployment events and rollback options available
    
    *   Infra: Update npm deps and apply security patches in \`apps/api/package.json\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Patch Cloud Functions code in \`apps/api/functions/index.ts\` and update dependencies - (M) (1 hours)\[FE\]\[BE\]
        
    *   Auth: Update Firebase Authentication rules in \`apps/api/services/auth/AuthService.ts\` and \`apps/api/config/firebase.rules.json\` - (M) (1 hours)\[FE\]\[BE\]\[DevOps\]
        
    *   Frontend: Update React Native Expo deps in \`apps/mobile/package.json\` and \`apps/web/package.json\` - (M) (1 hours)\[FE\]
        
    *   Security: Run vulnerability scan and generate report using \`scripts/scan/run\_vuln\_scan.sh\` - (M) (1 hours)\[FE\]
        
    *   Testing: Implement authentication regression tests in \`tests/auth/auth.spec.ts\` - (M) (1 hours)\[FE\]\[QA\]
        
    *   Infra: Add health-check endpoint in \`apps/api/routes/health.ts\` and \`apps/api/functions/healthCheck.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Logging: Add patch deployment audit logs in \`apps/api/middleware/audit.ts\` and \`apps/api/services/deploy/DeployService.ts\` - (M) (1 hours)\[FE\]\[BE\]\[DevOps\]
        
    *   Rollback: Create rollback script in \`scripts/deploy/rollback\_patch.sh\` and document steps in \`docs/rollback.md\` - (M) (1 hours)\[FE\]\[DevOps\]
        
*   **Performance Optimization:** As a: operations engineer, I want to: optimize system performance and resource utilization, So that: the application remains responsive under load and cost-efficient**(9 hours)** - Performance baselines before and after optimization show measurable improvements Critical paths reduced latency by X% under load Resource utilization (CPU/m memory) reduced by Y% No regression in functionality and error rates after changes Monitoring dashboards reflect updated performance metrics
    
    *   Measurement: Establish performance baselines in \`apps/api/services/metrics/BaselineCollector.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Profiling: Add CPU/memory profiling hooks in \`apps/api/utils/profiling/Profiler.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Critical Path: Optimize DB queries in \`apps/api/services/db/QueryService.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   API: Cache hot endpoints in \`apps/api/middleware/cache.ts\` - (M) (1 hours)\[FE\]\[BE\]
        
    *   Frontend: Lazy-load heavy components in \`apps/web/components/Dashboard/HeavyWidget.tsx\` - (M) (1 hours)\[FE\]
        
    *   Infra: Update Cloud Functions memory/CPU config in \`firebase/functions/index.ts\` - (M) (1 hours)\[FE\]\[DevOps\]
        
    *   Monitoring: Add dashboards & alerts in \`infra/monitoring/dashboards/performance.json\` - (M) (1 hours)\[FE\]
        
    *   Testing: Run load tests and compare baselines using \`tools/loadtest/run\_load\_test.sh\` - (M) (1 hours)\[FE\]\[QA\]
        
    *   Doc: Document performance changes in \`docs/performance/CHANGELOG.md\` - (M) (1 hours)\[FE\]
        
*   **Update Documentation:** As a: technical writer, I want to: update user and developer documentation to reflect latest maintenance changes, So that: users and developers have accurate guidance and onboarding material**(8 hours)** - Documentation pages updated for security patches, performance improvements, and process changes Change logs reflect new maintenance activities Documentation is searchable and indexed No broken links after publish Stakeholders review confirms accuracy and completeness
    
    *   Docs: Update security patch notes in \`docs/maintenance/security.md\` - (M) (1 hours)\[FE\]
        
    *   Docs: Document performance improvements in \`docs/maintenance/performance.md\` - (M) (1 hours)\[FE\]
        
    *   Docs: Update process changes in \`docs/processes/maintenance.md\` - (M) (1 hours)\[FE\]
        
    *   Changelog: Append maintenance activities to \`docs/CHANGELOG.md\` - (M) (1 hours)\[FE\]
        
    *   Search: Add indexing config in \`docs/search/config.ts\` - (M) (1 hours)\[FE\]\[DevOps\]
        
    *   QA: Implement link-checker script \`scripts/link-checker.js\` and CI job\` - (M) (1 hours)\[FE\]\[QA\]
        
    *   Publish: Update publish workflow in \`.github/workflows/publish-docs.yml\` - (M) (1 hours)\[FE\]
        
    *   Review: Prepare stakeholder review checklist in \`docs/reviews/stakeholder-checklist.md\` - (M) (1 hours)\[FE\]
        

### **Total Hours: 2267.5**