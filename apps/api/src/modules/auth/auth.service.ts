import bcrypt from 'bcryptjs';
import { prisma } from '../../lib/prisma.js';
import { HttpError } from '../../lib/http.js';
import { signAccessToken, type AuthenticatedUser } from '../../middleware/auth.js';

export async function loginWithPassword(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    include: { roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } } }
  });

  if (!user || !user.passwordHash || !user.isActive) {
    throw new HttpError(401, 'Invalid email or password');
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new HttpError(401, 'Invalid email or password');

  const authUser: AuthenticatedUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    roles: user.roles.map((item) => item.role.name),
    permissions: Array.from(new Set(user.roles.flatMap((item) => item.role.permissions.map((rp) => rp.permission.code))))
  };

  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  return { token: signAccessToken(authUser), user: authUser };
}
