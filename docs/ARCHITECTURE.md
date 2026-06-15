# Architecture

## Product pattern

The portal uses a menu plus an always-on AI command center.

- Menu navigation gives structured module screens.
- Right AI panel answers questions and shows cards.
- Bottom command bar accepts natural language from every screen.
- Tables and detail panels handle controlled actions.

## Applications

```text
apps/web  React, Next.js, Tailwind
apps/api  Node.js, Express, Prisma, MySQL
packages/shared  Shared TypeScript contracts
```

## Backend modules

- Auth
- AI command router
- Service requests
- Incidents
- Problems
- Changes
- Inventory
- Access requests
- Compliance controls and tasks
- Projects and environments
- Vendors and licenses
- Knowledge base
- Reports
- Users and teams
- Excel imports
- Notifications
- Audit logs

## AI provider switch

The active provider is read from database settings first, then from environment.

Supported values:

- mock
- openai
- claude
- private

Each provider implements the same interface. This prevents the application from being locked to one model.

## Security model

- JWT based API authentication
- Role and permission model
- Audit log for important actions
- Provider secrets stay server side
- AI responses should cite internal record sources
- Sensitive actions must require user approval
