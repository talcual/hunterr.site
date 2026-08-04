import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md py-24 text-center">
      <p className="text-7xl">🛸</p>
      <h1 className="mt-4 text-3xl font-extrabold text-slate-900">404</h1>
      <p className="mt-2 text-slate-500">No encontramos esta página.</p>
      <Link to="/" className="btn-primary mt-6">Volver al inicio</Link>
    </div>
  );
}
