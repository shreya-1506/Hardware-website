import { SignJWT, jwtVerify } from "jose";

/**
 * Edge-safe session helpers. Kept free of `node:*` imports so that
 * `middleware.ts` can verify the admin cookie without loading the database.
 */

export const SESSION_COOKIE = "ips_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

export type SessionPayload = {
  sub: string;
  email: string;
  name: string;
};

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 16) {
    // Dev fallback keeps `npm run dev` working out of the box; production
    // deployments must set AUTH_SECRET (see .env.example).
    return new TextEncoder().encode(
      "ips-vijay-enterprises-development-only-secret-key",
    );
  }
  return new TextEncoder().encode(value);
}

export async function signSession(payload: SessionPayload) {
  return new SignJWT({ email: payload.email, name: payload.name })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secret());
}

export async function verifySession(
  token: string | undefined,
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    if (!payload.sub) return null;
    return {
      sub: String(payload.sub),
      email: String(payload.email ?? ""),
      name: String(payload.name ?? "Administrator"),
    };
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_MAX_AGE,
  secure: process.env.NODE_ENV === "production",
};
