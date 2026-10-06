import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

import { get, run } from "./db";
import {
  SESSION_COOKIE,
  sessionCookieOptions,
  signSession,
  verifySession,
  type SessionPayload,
} from "./session";
import type { AdminUser } from "./types";

export function hashPassword(password: string) {
  return bcrypt.hashSync(password, 10);
}

function findAdminByEmail(email: string) {
  return get<AdminUser>(
    "SELECT * FROM admin_users WHERE LOWER(email) = LOWER(?)",
    [email.trim()],
  );
}

/**
 * Ensures at least one admin exists so a fresh install is never locked out.
 * Credentials come from ADMIN_EMAIL / ADMIN_PASSWORD (see .env.example).
 */
export function ensureDefaultAdmin() {
  const existing = get<{ n: number }>("SELECT COUNT(*) AS n FROM admin_users");
  if (Number(existing?.n ?? 0) > 0) return;

  const email = process.env.ADMIN_EMAIL || "admin@industrialprime.in";
  const password = process.env.ADMIN_PASSWORD || "Admin@12345";
  run(
    "INSERT INTO admin_users (name, email, password_hash) VALUES (?, ?, ?)",
    ["Administrator", email, hashPassword(password)],
  );
}

export async function login(email: string, password: string) {
  ensureDefaultAdmin();

  const user = findAdminByEmail(email);
  if (!user) return { ok: false as const, error: "Invalid email or password." };

  const valid = bcrypt.compareSync(password, user.password_hash);
  if (!valid) return { ok: false as const, error: "Invalid email or password." };

  const token = await signSession({
    sub: String(user.id),
    email: user.email,
    name: user.name,
  });

  const store = await cookies();
  store.set(SESSION_COOKIE, token, sessionCookieOptions);

  return { ok: true as const };
}

export async function logout() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  return verifySession(store.get(SESSION_COOKIE)?.value);
}

/** Use at the top of every admin page / action. Redirects when unauthenticated. */
export async function requireAdmin(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}

export async function changePassword(
  email: string,
  currentPassword: string,
  nextPassword: string,
) {
  const user = findAdminByEmail(email);
  if (!user || !bcrypt.compareSync(currentPassword, user.password_hash)) {
    return { ok: false as const, error: "Current password is incorrect." };
  }
  run("UPDATE admin_users SET password_hash = ? WHERE id = ?", [
    hashPassword(nextPassword),
    user.id,
  ]);
  return { ok: true as const };
}
