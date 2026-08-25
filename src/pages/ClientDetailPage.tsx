import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { AppointmentFormDialog } from '../components/AppointmentFormDialog';
import { ClientFormDialog } from '../components/ClientFormDialog';
import { ErrorState } from '../components/ErrorState';
import { StatusPill } from '../components/StatusPill';
import { agendamentosService } from '../services/agendamentos';
import { mensagemDoErro } from '../services/api';
import { clientesService } from '../services/clientes';
import type { Agendamento, Cliente } from '../types/api';

/**
 * Cliente + histórico de uma tentativa de carga. A chave é o número da
 * tentativa: enquanto não bate com a atual, a tela está carregando — loading
 * derivado, sem setState no efeito.
 */
interface ClienteCarregado {
  chave: number;
  cliente: Cliente | null;
  historico: Agendamento[];
  erro: string | null;
}

export function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tentativa, setTentativa] = useState(0);
  const [resultado, setResultado] = useState<ClienteCarregado | null>(null);
  const [erroAcao, setErroAcao] = useState<string | null>(null);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [editDialogAberto, setEditDialogAberto] = useState(false);

  useEffect(() => {
    if (!id) return;
    let ignore = false;
    const chave = tentativa;
    Promise.all([clientesService.buscarPorId(id), agendamentosService.listar()])
      .then(([encontrado, todos]) => {
        if (ignore) return;
        setResultado({
          chave,
          cliente: encontrado,
          historico: todos
            .filter((a) => a.clienteId === id)
            .sort((a, b) => b.dataHora.localeCompare(a.dataHora)),
          erro: null,
        });
      })
      .catch((err: unknown) => {
        if (ignore) return;
        setResultado({
          chave,
          cliente: null,
          historico: [],
          erro: mensagemDoErro(err, 'Não foi possível carregar este cliente.'),
        });
      });
    return () => {
      ignore = true;
    };
  }, [id, tentativa]);

  const carregando = Boolean(id) && resultado?.chave !== tentativa;
  const cliente = carregando ? null : resultado?.cliente ?? null;
  const historico = carregando ? [] : resultado?.historico ?? [];
  const erroCarga = carregando ? null : resultado?.erro ?? null;

  async function excluirCliente() {
    if (!id) return;
    if (!window.confirm(`Remover ${cliente?.nome}? Isso não pode ser desfeito.`)) return;
    setErroAcao(null);
    try {
      await clientesService.remover(id);
      navigate('/clientes');
    } catch (err) {
      setErroAcao(mensagemDoErro(err, 'Não foi possível remover o cliente.'));
    }
  }

  if (carregando) {
    return <p className="text-content-muted text-sm">Carregando…</p>;
  }

  if (!id || !cliente) {
    return (
      <ErrorState
        mensagem={erroCarga ?? 'Cliente não encontrado.'}
        onTentarDeNovo={id ? () => setTentativa((n) => n + 1) : undefined}
      />
    );
  }

  return (
    <div className="flex flex-col gap-5 max-w-xl">
      <Link to="/clientes" className="btn btn-ghost btn-icon -ml-2 self-start">
        <ArrowLeft size={18} />
      </Link>

      <div className="flex items-start gap-3">
        <span className="w-11 h-11 rounded-full bg-accent-2-200 dark:bg-accent-2-800 flex-none" />
        <div className="flex-1 min-w-0">
          <h1 className="text-xl md:text-2xl truncate">{cliente.nome}</h1>
          <p className="text-xs text-content-muted">
            Cliente desde {new Date(cliente.criadoEm).toLocaleDateString('pt-BR')}
          </p>
        </div>
        <button className="btn btn-ghost" onClick={() => setEditDialogAberto(true)}>
          Editar
        </button>
      </div>

      <div className="flex flex-col gap-1 text-sm text-content-muted">
        <span>{cliente.email || 'Sem email cadastrado'}</span>
        <span>{cliente.telefone}</span>
      </div>

      {cliente.observacoes && (
        <div className="card">
          <p className="card-title text-sm">Notas</p>
          <p className="text-sm text-content-muted whitespace-pre-wrap">{cliente.observacoes}</p>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <p className="text-[11px] tracking-wide uppercase text-content-muted">Histórico</p>
        {historico.length === 0 && <p className="text-sm text-content-muted">Nenhum agendamento ainda.</p>}
        {historico.map((a) => (
          <div key={a.id} className="flex items-center gap-3 text-sm border-b border-line pb-2">
            <span className="text-content-muted w-24 flex-none">
              {new Date(a.dataHora).toLocaleDateString('pt-BR')}
            </span>
            <span className="flex-1 truncate">{a.observacoes || `${a.duracaoMinutos} min`}</span>
            <StatusPill status={a.status} />
            {a.status === 'AGENDADO' && a.confirmado && <span className="tag tag-accent-2">Confirmado</span>}
          </div>
        ))}
      </div>

      {erroAcao && (
        <p role="alert" className="text-sm text-accent-700 dark:text-accent-300">
          {erroAcao}
        </p>
      )}

      <div className="flex gap-2">
        <button className="btn btn-primary flex-1" onClick={() => setDialogAberto(true)}>
          Agendar próxima sessão
        </button>
        <button className="btn btn-secondary" onClick={excluirCliente}>
          Remover
        </button>
      </div>

      {dialogAberto && (
        <AppointmentFormDialog
          clientes={[cliente]}
          initialClienteId={cliente.id}
          onClose={() => setDialogAberto(false)}
          onSaved={(criado) => {
            setResultado((atual) =>
              atual ? { ...atual, historico: [criado, ...atual.historico] } : atual,
            );
            setDialogAberto(false);
          }}
        />
      )}

      {editDialogAberto && (
        <ClientFormDialog
          cliente={cliente}
          onClose={() => setEditDialogAberto(false)}
          onSaved={(salvo) => {
            setResultado((atual) => (atual ? { ...atual, cliente: salvo } : atual));
            setEditDialogAberto(false);
          }}
        />
      )}
    </div>
  );
}
