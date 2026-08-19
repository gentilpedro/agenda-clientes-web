import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="mx-auto max-w-2xl text-center py-16">
      <h1 className="text-3xl">404</h1>
      <p className="mt-2 text-content-muted">Página não encontrada.</p>
      <Link to="/" className="btn btn-primary mt-4 inline-flex">
        Voltar para a agenda
      </Link>
    </div>
  );
}
