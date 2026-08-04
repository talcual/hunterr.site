import type { APIRoute } from 'astro';
import { setToken, clearToken } from '../../lib/auth';

export const prerender = false;

const API_BASE = import.meta.env.PUBLIC_API_BASE_URL || 'http://localhost:3001/api/v1';

export const POST: APIRoute = async (ctx) => {
  const form = await ctx.request.formData();
  const email = String(form.get('email') ?? '').trim();
  const password = String(form.get('password') ?? '');
  const next = String(form.get('next') ?? '/');

  if (!email || !password) {
    return ctx.redirect(`/login?error=${encodeURIComponent('Email y contraseña requeridos')}`);
  }

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const msg = body?.message ? (Array.isArray(body.message) ? body.message.join(', ') : body.message) : 'Credenciales inválidas';
      return ctx.redirect(`/login?error=${encodeURIComponent(msg)}`);
    }
    const data = await res.json();
    setToken(ctx, data.accessToken);
    return ctx.redirect(next.startsWith('/') ? next : '/');
  } catch {
    return ctx.redirect('/login?error=No_se_pudo_contactar_al_servidor');
  }
};

export const GET: APIRoute = async (ctx) => {
  clearToken(ctx);
  return ctx.redirect('/login');
};
