# Saven InfraOps Command Center, Full Scope Product Build

AI-first enterprise operations portal for Saven Admin, Infra, DevOps, InfoSec, and Delivery teams.

## Technology decisions

- Frontend: React, Next.js, TypeScript, Tailwind CSS
- Backend: Node.js, Express, TypeScript
- Database: MySQL with Prisma ORM
- Login: Custom Saven login plus Microsoft login structure
- AI: Switchable providers, OpenAI, Claude, private model, mock
- Notifications: Email and Microsoft Teams
- Import: Excel upload and preview flow

## Run on Windows

Open PowerShell from the extracted project folder.

```powershell
copy .env.example .env.local
npm install
npm run dev:3001
```

Open another PowerShell tab for the API.

```powershell
npm run dev:api
```

Web URL:

```text
http://localhost:3001
```

API URL:

```text
http://localhost:4000/api/health
```

## Run MySQL locally

Docker Desktop must be running.

```powershell
docker compose up -d
npm run prisma:generate
npm run db:migrate
npm run db:seed
```

## Seed login

Default seed values are in `.env.example`.

```text
Email: admin@saven.in
Password: Admin@12345
```

Change this before any shared environment.

## Full scope modules included

- Command Center dashboard
- Service Requests
- Incidents
- Problems
- Change Management
- Inventory
- Access Management
- Compliance Management
- Project Environments
- Vendors and Licenses
- Knowledge Base
- Reports and Analytics
- Users, Teams, Roles, Permissions
- Settings
- AI Assistant and natural language command center
- Excel import
- Email and Teams notifications
- Audit logs

## Important production notes

This package gives a full product code foundation with screens, API contracts, database schema, adapters, and module structure. For production use, complete the following before go-live:

- Add real Saven branding assets.
- Configure Microsoft Entra app registration.
- Configure SMTP and Teams webhook.
- Configure the selected AI providers.
- Review RBAC permissions with InfoSec.
- Add production secrets in a secret manager.
- Run security testing and VAPT.
- Complete UAT with Admin, Infra, DevOps, and InfoSec teams.


## Configurable setup

The v4 build adds a Configuration Center under `/settings`. You can configure database mode notes, login switches, active AI provider, AI model names, notification switches, Excel import rules, SLA values, audit settings, and UI behavior.

Startup secrets and database connection strings still stay in `.env.local`. Change them there and restart the API. See `docs/CONFIGURATION.md`.
