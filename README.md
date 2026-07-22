# Restaurant Management System

A complete frontend-only restaurant operations application built with React 19, Vite, Material UI, React Router, React Hook Form, Zod, Context API, and a versioned localStorage database.

The application does not require an API server. Staff and public consumer workflows share the same browser database, making it suitable for demonstrations, prototypes, offline evaluation, and future migration to REST APIs.

## Features

### Staff workspaces

- Admin dashboard, employees, roles and permissions, menu, categories, recipes, inventory, suppliers, purchasing, tables, orders, customers, expenses, reports, audit logs, and restaurant settings.
- Cashier dashboard, modern POS, served-order settlement, cash/card/mobile payments, payment history, and printable receipts.
- Waiter floor selection, menu/cart, kitchen notes, table ordering, active orders, serving, and bill requests.
- Chef kitchen display with pending, preparing, and ready lanes, ticket timers, item progression, and inventory alerts.

### Public website

- Responsive Home, About, Menu, Food Detail, Cart, Contact, and Order Tracking pages.
- Searchable and category-filtered live menu.
- Pickup and dine-in-request checkout connected to the kitchen queue.
- Privacy-safe tracking requiring both an order reference and matching checkout phone number.
- A real scannable QR menu and copyable sharing link.

### Platform behavior

- Route and navigation access enforced by role and permission.
- Context-managed authentication, theme, notifications, staff orders, waiter cart, and consumer cart.
- Versioned localStorage schema with non-destructive migrations and malformed-data recovery backups.
- Transactional purchase receiving and checkout inventory movements.
- Searchable, sortable, paginated data tables and validated forms.
- Lazy-loaded routes, responsive Material UI layouts, dark mode, audit history, and settings-driven branding/currency/tax.

## Requirements

- Node.js 20 or newer
- npm 10 or newer
- A modern browser with localStorage enabled

## Setup

```bash
npm install
npm run dev
```

Vite prints the local URL, normally `http://localhost:5173`.

The application is frontend-only. Do not start the legacy API server; it is not used by the application.

## Default staff accounts

| Workspace | Email | Password |
| --- | --- | --- |
| Admin | `admin@restaurant.com` | `123456` |
| Cashier | `cashier@restaurant.com` | `123456` |
| Waiter | `waiter@restaurant.com` | `123456` |
| Chef | `chef@restaurant.com` | `123456` |

Public consumer routes do not require authentication.

## Commands

```bash
npm run dev       # Start the development server
npm run lint      # Run ESLint
npm run build     # Create the production build in dist/
npm run preview   # Preview the production build locally
npm run check     # Run lint and production build together
```

## Application structure

```text
src/
  app/           Application providers and Material UI theme
  assets/        Local visual assets
  components/    Shared enterprise UI components
  contexts/      Context API state providers
  features/      Operational feature pages
  hooks/         Reusable context and domain hooks
  layouts/       Public and role-specific shells
  pages/         Dashboards, authentication, and public pages
  routes/        Guards, permissions, and role metadata
  services/      Database-backed domain services
  utils/         Formatting and lazy-loading helpers
```

Permanent state belongs in services and the localStorage database rather than in page components. The main database key is `restaurant-management-db`. The consumer cart uses `restaurant-consumer-cart`; authentication and theme have their own focused keys.

## Database and reset

The database is initialized automatically with seed records on first load. Schema migrations preserve existing collections and add required records or fields.

To reset the application safely:

1. Open browser developer tools for the application origin.
2. Open Application/Storage, then Local Storage.
3. Delete `restaurant-management-db`.
4. Optionally delete `restaurant-consumer-cart` and the saved session/theme keys.
5. Reload the page to recreate seed data.

If the main database value contains malformed JSON, the adapter stores the original value under a timestamped `restaurant-management-db:recovery:*` key before creating a clean database.

Do not use real passwords, payment-card details, or sensitive customer information. localStorage is a temporary frontend database and is not a secure replacement for a production backend.

## Core workflow verification

1. Sign in as Waiter, select an available table, add menu items, and send the order.
2. Sign in as Chef and move the ticket from pending to preparing and ready.
3. Sign in as Waiter, mark the order served, and request the bill.
4. Sign in as Cashier, settle the served order, then open its receipt.
5. Sign in as Admin and verify the order, payment, receipt, stock movement, audit record, and report totals.
6. From the public menu, place an order and confirm it appears in the kitchen queue; track it using the generated code and checkout phone number.

## Deployment

Run `npm run build` and deploy the generated `dist/` directory to any static host.

Because React Router uses browser history, configure the host to rewrite unknown paths to `/index.html`. Examples include an SPA fallback on Netlify, Vercel, Cloudflare Pages, Nginx, or Apache. HTTPS is recommended, especially for clipboard sharing and QR-menu use.

All localStorage data is scoped to the deployment origin. Moving to a different domain or port creates a separate browser database.

## Future backend migration

Pages communicate through focused services such as `orderService`, `paymentService`, and `inventoryService`. A future REST implementation can replace these service internals while keeping route, form, and component contracts largely unchanged. Production deployment should add server authentication, password hashing, a transactional database, authorization enforcement, secure payment processing, backups, and centralized observability.
