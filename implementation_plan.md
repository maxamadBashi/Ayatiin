# Implementation Plan - Smart Estate Management System

## Goal
Upgrade the current codebase to a production-ready Smart Estate Management System with full Admin Panel, API, Database, Documentation, and Deployment configurations.

## User Review Required
> [!IMPORTANT]
> - **UI Reference**: I will align the dashboard layout with the described "Dark Sidebar, KPI Cards Left" style.
> - **Security**: JWT Secret is currently in `.env`. Ensure this is rotated in production.
> - **Database**: I will add an `AuditLog` model which will increase database usage.

## Proposed Changes

### Backend Core
#### [NEW] [AuditLog.js](file:///c:/Users/maxam/OneDrive/Desktop/AAyatiin/backend/src/models/AuditLog.js)
- Schema for tracking system actions (User, Action, Entity, Details, IP, Timestamp).

#### [MODIFY] [User.js](file:///c:/Users/maxam/OneDrive/Desktop/AAyatiin/backend/src/models/User.js)
- Ensure `role` field supports 'admin', 'manager', 'tenant'.

#### [NEW] [middleware/auth.js](file:///c:/Users/maxam/OneDrive/Desktop/AAyatiin/backend/src/middleware/auth.js)
- `authenticateJWT`: Verify token.
- `authorizeRoles(...roles)`: RBAC check.

#### [NEW] [utils/pdfGenerator.js](file:///c:/Users/maxam/OneDrive/Desktop/AAyatiin/backend/src/utils/pdfGenerator.js)
- Service to generate PDF receipts using `pdfkit`.

#### [NEW] [routes/docs.js](file:///c:/Users/maxam/OneDrive/Desktop/AAyatiin/backend/src/routes/docs.js)
- Swagger UI setup.

#### [NEW] [scripts/seed.js](file:///c:/Users/maxam/OneDrive/Desktop/AAyatiin/backend/scripts/seed.js)
- Database seeder for Properties, Units, Tenants, Payments.

### DevOps & Config
#### [NEW] [Dockerfile](file:///c:/Users/maxam/OneDrive/Desktop/AAyatiin/backend/Dockerfile)
#### [NEW] [docker-compose.yml](file:///c:/Users/maxam/OneDrive/Desktop/AAyatiin/docker-compose.yml)
#### [NEW] [.github/workflows/ci.yml](file:///c:/Users/maxam/OneDrive/Desktop/AAyatiin/.github/workflows/ci.yml)

### Frontend Core
#### [MODIFY] [Sidebar.jsx](file:///c:/Users/maxam/OneDrive/Desktop/AAyatiin/frontend/src/components/Sidebar.jsx)
- Update styling to match "Dark Vertical" reference.

#### [MODIFY] [Dashboard.jsx](file:///c:/Users/maxam/OneDrive/Desktop/AAyatiin/frontend/src/pages/Dashboard.jsx)
- Implement KPI Cards and Recent Activity Feed with real data.

## Verification Plan
### Automated Tests
- Run `npm test` in backend (Jest + Supertest).
- Verify Docker build: `docker-compose up --build`.

### Manual Verification
- Login as Admin.
- Create Property -> Unit -> Tenant -> Lease.
- Record Payment -> Download PDF Receipt.
- Check Audit Log in DB.
