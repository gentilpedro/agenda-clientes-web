import { useEffect, useMemo, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { Avatar } from '../components/Avatar';
import { ClientFormDialog } from '../components/ClientFormDialog';
import { ErrorState } from '../components/ErrorState';
import { Carregando, EstadoVazio } from '../components/Feedback';
import { agendamentosService } from '../services/agendamentos';
import { mensagemDoErro } from '../services/api';
import { clientesService } from '../services/clientes';
import type { Agendamento, Cliente } from '../types/api';
import { formatHora } from '../utils/date';

/**
 * Resultado da busca. A chave é o número da tentativa: enquanto não bate com a
 * atual, a tela está carregando — loading derivado, sem setState no efeito.
 */
const SEM_CLIENTES: Cliente[] = [];

interface ClientesCarregados {
  chave: number;
  lista: Cliente[];
  erro: string | null;
}

export function ClientsPage() {
  const [resultado, setResultado] = useState<ClientesCarregados | null>(null);
  const [busca, setBusca] = useState('');
  const [tentativa, setTentativa] = useState(0);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    let ignore = false;
    const chave = tentativa;
    clientesService
      .listar()
      .then((lista) => {
        if (!ignore) setResultado({ chave, lista, erro: null });
      })
      .catch((err: unknown) => {
        if (ignore) return;
        setResultado({
          chave,
          lista: [],
          erro: mensagemDoErro(err, 'Não foi possível carregar os clientes.'),
        });
      });
    return () => {
      ignore = true;
    };
  }, [tentativa]);

  useEffect(() => {
    agendamentosService.listar().then(setAgendamentos).catch(() => setAgendamentos([]));
  }, [tentativa]);

  const carregando = resultado?.chave !== tentativa;
  const clientes = carregando ? SEM_CLIENTES : resultado.lista;
  const erro = carregando ? null : resultado.erro;

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

  /** Próxima sessão agendada de cada cliente (a mais próxima), pra coluna da tabela. */
  const proximaSessaoPorCliente = useMemo(() => {
    const map = new Map<string, string>();
    for (const a of agendamentos) {
      if (a.status !== 'AGENDADO') continue;
      const atual = map.get(a.clienteId);
      if (!atual || a.dataHora < atual) map.set(a.clienteId, a.dataHora);
    }
    return map;
  }, [agendamentos]);

  function formatProximaSessao(clienteId: string) {
    const dataHora = proximaSessaoPorCliente.get(clienteId);
    if (!dataHora) return '—';
    const data = new Date(dataHora);
    return `${data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}, ${formatHora(dataHora)}`;
  }

  return (
    <div className="flex flex-col gap-5 min-h-[calc(100vh-8rem)] md:min-h-[calc(100vh-9rem)]">
      <div className="flex items-center gap-3 flex-wrap">
        <h1 className="text-2xl md:text-3xl">Clientes</h1>
        <span className="text-sm text-content-muted">{clientes.length} ao todo</span>
        <button className="btn btn-primary ml-auto" onClick={() => setDialogAberto(true)}>
          <Plus size={16} /> Novo cliente
        </button>
      </div>

      <div className="field max-w-md">
        <div className="relative">
          <Search size={15} aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 text-content-muted" />
          <input
            type="search"
            className="input pl-10"
            aria-label="Buscar clientes"
            autoComplete="off"
            placeholder="Buscar nome, email ou telefone"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
      </div>

      {carregando && <Carregando texto="Carregando clientes…" />}

      {erro && (
        <div className="flex-1 flex items-center justify-center">
          <ErrorState mensagem={erro} onTentarDeNovo={() => setTentativa((n) => n + 1)} />
        </div>
      )}

      {!carregando && !erro && filtrados.length === 0 && (
        <EstadoVazio titulo={clientes.length === 0 ? 'Nenhum cliente ainda' : 'Nada encontrado'}>
          {clientes.length === 0 ? (
            <>
              <p className="text-sm text-content-muted">Cadastre o primeiro cliente pra começar.</p>
              <button className="btn btn-primary mt-2" onClick={() => setDialogAberto(true)}>
                <Plus size={16} /> Novo cliente
              </button>
            </>
          ) : (
            <p className="text-sm text-content-muted [overflow-wrap:anywhere]">
              Nenhum cliente corresponde a “{busca.trim()}”.
            </p>
          )}
        </EstadoVazio>
      )}

      {filtrados.length > 0 && (
        <>
          <table className="ds-table hidden md:table max-w-5xl">
            <thead>
              <tr>
                <th scope="col">Nome</th>
                <th scope="col">Email</th>
                <th scope="col">Telefone</th>
                <th scope="col">Próxima sessão</th>
                <th aria-hidden="true"></th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((c) => (
                <tr key={c.id} onClick={() => navigate(`/clientes/${c.id}`)}>
                  <td>
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar nome={c.nome} tamanho="sm" />
                      <Link to={`/clientes/${c.id}`} className="font-semibold truncate hover:text-accent-ink">
                        {c.nome}
                      </Link>
                    </div>
                  </td>
                  <td className="text-content-muted [overflow-wrap:anywhere]">{c.email || '—'}</td>
                  <td className="text-content-muted whitespace-nowrap tabular-nums">{c.telefone}</td>
                  <td className="text-content-muted whitespace-nowrap tabular-nums">{formatProximaSessao(c.id)}</td>
                  <td className="text-content-muted" aria-hidden="true">›</td>
                </tr>
              ))}
            </tbody>
          </table>

          <ul className="flex flex-col gap-2 md:hidden">
            {filtrados.map((c) => (
              <li key={c.id}>
                <Link to={`/clientes/${c.id}`} className="card flex-row items-center gap-3 text-left">
                  <Avatar nome={c.nome} />
                  <span className="flex-1 min-w-0">
                    <span className="block font-semibold text-sm truncate">{c.nome}</span>
                    <span className="block text-xs text-content-muted truncate tabular-nums">{c.telefone}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      {dialogAberto && (
        <ClientFormDialog
          onClose={() => setDialogAberto(false)}
          onSaved={(salvo) => {
            setDialogAberto(false);
            navigate(`/clientes/${salvo.id}`);
          }}
        />
      )}
    </div>
  );
}
