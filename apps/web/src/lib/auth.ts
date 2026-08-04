import type { APIContext } from 'astro';

const COOKIE = 'hunterrd_token';

export function getToken(ctx: APIContext): string | undefined {
  return ctx.cookies.get(COOKIE)?.value;
}

export function setToken(ctx: APIContext, token: string) {
  ctx.cookies.set(COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: false,
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearToken(ctx: APIContext) {
  ctx.cookies.delete(COOKIE, { path: '/' });
}
