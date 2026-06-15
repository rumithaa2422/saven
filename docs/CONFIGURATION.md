# Configuration Center

The product supports two configuration layers.

## 1. Startup configuration

These values are read before the API starts. They must be stored in `.env.local` and require an API restart after change.

- `DATABASE_URL`
- `JWT_SECRET`
- `MICROSOFT_CLIENT_SECRET`
- `OPENAI_API_KEY`
- `CLAUDE_API_KEY`
- `PRIVATE_MODEL_API_KEY`
- `SMTP_PASSWORD`
- `TEAMS_WEBHOOK_URL`

## 2. Admin UI configuration

These values can be managed from the portal under **Settings > Configuration Center**.

- Database mode note, local MySQL, Docker MySQL, or remote MySQL
- Custom login enabled
- Microsoft login enabled
- Microsoft allowed domains
- Active AI provider, mock, OpenAI, Claude, or private model
- AI model names
- Private model base URL
- Email notification enabled
- Teams notification enabled
- Excel upload rules
- SLA response and resolution targets
- Audit logging
- Always-on AI command bar

## Database mode

Database mode is configurable as a product setting, but the actual database connection still uses `DATABASE_URL` at API startup.

### Windows local MySQL

```env
DB_MODE=local-mysql
DATABASE_URL=mysql://root:YourPassword@localhost:3306/saven_infraops
```

### Docker MySQL

```env
DB_MODE=docker-mysql
DATABASE_URL=mysql://infraops:infraops123@localhost:3306/saven_infraops
```

Then run:

```powershell
docker compose up -d
npm run prisma:generate
npm run db:migrate
npm run db:seed
```

### Remote MySQL

```env
DB_MODE=remote-mysql
DATABASE_URL=mysql://infraops_user:StrongPassword@db-host.saven.in:3306/saven_infraops
```

## AI provider switch

Set default provider in `.env.local`:

```env
AI_ACTIVE_PROVIDER=mock
```

Then switch from Admin UI using:

- `mock`
- `openai`
- `claude`
- `private`

API keys remain in env files for security.

## Notification switch

Email and Teams can be enabled or disabled in Admin UI. Credentials remain in env files.

## Security note

Do not store secrets directly in UI settings. Store secrets in `.env.local`, vault, cloud secret manager, or deployment-level secure variables.
