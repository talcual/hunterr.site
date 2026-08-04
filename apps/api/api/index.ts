import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createApp } from '../dist/main';

let appPromise: ReturnType<typeof createApp> | null = null;
const getApp = () => (appPromise ??= createApp());

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const app = await getApp();
  const expressApp = app.getHttpAdapter().getInstance();
  return new Promise<void>((resolve) => {
    expressApp(req, res, () => resolve());
  });
}
