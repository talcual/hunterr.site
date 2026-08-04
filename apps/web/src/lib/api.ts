const API_BASE = import.meta.env.PUBLIC_API_BASE_URL || 'http://localhost:3001/api/v1';

export interface AuthUser {
  id: string;
  email: string;
  username: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  _count?: { products: number };
}

export interface ProductListItem {
  id: string;
  name: string;
  tagline: string;
  description?: string | null;
  logoUrl?: string | null;
  url?: string | null;
  techStack?: string[];
  createdAt: string;
  hunter: { id: string; username: string; avatarUrl?: string | null };
  category?: { id: string; name: string; slug: string; color: string } | null;
  _count: { votes: number; comments: number };
}

export interface Comment {
  id: string;
  body: string;
  createdAt: string;
  user: { id: string; username: string; avatarUrl?: string | null };
}

export interface ProductDetail extends ProductListItem {
  comments: Comment[];
}

export interface ProductsListResponse {
  items: ProductListItem[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface UserProfile {
  id: string;
  username: string;
  bio?: string | null;
  avatarUrl?: string | null;
  institution?: string | null;
  createdAt: string;
  products?: any[];
}

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init: RequestInit = {}, token?: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers ?? {}),
    },
    ...init,
  });
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.message) message = Array.isArray(body.message) ? body.message.join(', ') : body.message;
    } catch {}
    throw new ApiError(message, res.status);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  register: (data: { email: string; username: string; password: string; institution?: string }) =>
    request<{ accessToken: string; user: AuthUser }>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: { email: string; password: string }) =>
    request<{ accessToken: string; user: AuthUser }>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  me: (token: string) => request<AuthUser>('/auth/me', {}, token),

  listProducts: (params: { sort?: 'new' | 'top' | 'trending'; category?: string; page?: number; search?: string } = {}) => {
    const qs = new URLSearchParams();
    if (params.sort) qs.set('sort', params.sort);
    if (params.category) qs.set('category', params.category);
    if (params.page) qs.set('page', String(params.page));
    if (params.search) qs.set('search', params.search);
    return request<ProductsListResponse>(`/products?${qs.toString()}`);
  },
  getProduct: (id: string) => request<ProductDetail>(`/products/${id}`),
  createProduct: (token: string, data: { name: string; tagline: string; description?: string; url?: string; logoUrl?: string; techStack?: string[]; categoryId?: string }) =>
    request<ProductDetail>('/products', { method: 'POST', body: JSON.stringify(data) }, token),
  deleteProduct: (token: string, id: string) =>
    request<{ deleted: boolean }>(`/products/${id}`, { method: 'DELETE' }, token),

  listCategories: () => request<Category[]>('/categories'),

  toggleVote: (token: string, productId: string) =>
    request<{ voted: boolean }>(`/votes/${productId}/toggle`, { method: 'POST' }, token),

  listComments: (productId: string) => request<Comment[]>(`/products/${productId}/comments`),
  createComment: (token: string, productId: string, body: string) =>
    request<Comment>(`/products/${productId}/comments`, { method: 'POST', body: JSON.stringify({ body }) }, token),
};

export { ApiError };
