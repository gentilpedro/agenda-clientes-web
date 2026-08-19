import { useEffect, useMemo, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { clientesService } from '../services/clientes';
import type { Cliente } from '../types/api';

export function ClientsPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    clientesService
      .listar()
      .then(setClientes)
      .finally(() => setCarregando(false));
  }, []);

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return clientes;
    return clientes.filter(
      (c) =>
        c.nome.toLowerCase().includes(termo) ||
        c.email?.toLowerCase().includes(termo) ||
        c.telefone.includes(termo),
    );
  }, [busca, clientes]);

  return (
    <div className="flex flex-col gap-5 min-h-[calc(100vh-8rem)] md:min-h-[calc(100vh-9rem)]">
      <div className="flex items-center gap-3 flex-wrap">
        <h1 className="text-2xl md:text-3xl">Clientes</h1>
        <span className="text-sm text-content-muted">{clientes.length} ao todo</span>
        <Link to="/clientes/novo" className="btn btn-primary ml-auto">
          <Plus size={16} /> Novo cliente
        </Link>
      </div>

      <div className="field max-w-md">
        <div className="relative">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-content-muted" />
          <input
            className="input pl-10"
            placeholder="Buscar nome, email ou telefone"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
      </div>

      {carregando && <p className="text-content-muted text-sm">Carregando…</p>}

      {!carregando && filtrados.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <div className="card items-center text-center py-10 gap-2 border-dashed max-w-md w-full">
            <p className="font-semibold">{clientes.length === 0 ? 'Nenhum cliente ainda' : 'Nada encontrado'}</p>
            {clientes.length === 0 && (
              <>
                <p className="text-sm text-content-muted">Cadastre o primeiro cliente pra começar.</p>
                <Link to="/clientes/novo" className="btn btn-primary mt-2">
                  <Plus size={16} /> Novo cliente
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {filtrados.length > 0 && (
        <>
          <table className="ds-table hidden md:table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Telefone</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((c) => (
                <tr key={c.id} onClick={() => navigate(`/clientes/${c.id}`)}>
                  <td className="font-semibold">{c.nome}</td>
                  <td className="text-content-muted">{c.email || '—'}</td>
                  <td className="text-content-muted">{c.telefone}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex flex-col gap-2 md:hidden">
            {filtrados.map((c) => (
              <button
                key={c.id}
                onClick={() => navigate(`/clientes/${c.id}`)}
                className="card flex-row items-center gap-3 text-left"
              >
                <span className="w-9 h-9 rounded-full bg-accent-2-200 dark:bg-accent-2-800 flex-none" />
                <span className="flex-1 min-w-0">
                  <span className="block font-semibold text-sm truncate">{c.nome}</span>
                  <span className="block text-xs text-content-muted truncate">{c.telefone}</span>
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
