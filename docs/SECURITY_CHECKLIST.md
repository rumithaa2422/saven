# Security Checklist

Before production:

- Store secrets in a secret manager.
- Rotate JWT secret.
- Enforce strong password policy.
- Enable Microsoft login domain restriction.
- Add MFA through Microsoft login.
- Review RBAC permissions with InfoSec.
- Add request ID and trace ID logging.
- Mask sensitive fields in AI context.
- Block AI from performing delete, approve, revoke, or production change actions without explicit user approval.
- Add audit logs to every write action.
- Rate limit auth and AI endpoints.
- Run VAPT.
- Configure CSP headers at reverse proxy.
- Enable HTTPS only.
