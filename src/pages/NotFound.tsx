import { Link } from 'react-router-dom';

import { useAuth } from '../contexts/auth-context';

export function NotFound() {
  const { usuario } = useAuth();

  return (
    <main className="mx-auto max-w-2xl text-center px-6 py-16">
      <h1 className="text-3xl">Página não encontrada</h1>
      <p className="mt-2 text-content-muted">O endereço pode ter mudado ou estar digitado errado.</p>
      <Link to={usuario ? '/agenda' : '/'} className="btn btn-primary mt-4 inline-flex">
        {usuario ? 'Voltar para a agenda' : 'Ir para o início'}
      </Link>
    </main>
  );
}
