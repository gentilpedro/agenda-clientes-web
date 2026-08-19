import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { NewAppointmentDialog } from '../components/NewAppointmentDialog';
import { StatusPill } from '../components/StatusPill';
import { agendamentosService } from '../services/agendamentos';
import { clientesService } from '../services/clientes';
import type { Agendamento, Cliente } from '../types/api';

export function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [historico, setHistorico] = useState<Agendamento[]>([]);
  const [dialogAberto, setDialogAberto] = useState(false);

  useEffect(() => {
    if (!id) return;
    clientesService.buscarPorId(id).then(setCliente);
    agendamentosService.listar().then((todos) =>
      setHistorico(
        todos
          .filter((a) => a.clienteId === id)
          .sort((a, b) => b.dataHora.localeCompare(a.dataHora)),
      ),
    );
  }, [id]);

  async function excluirCliente() {
    if (!id) return;
    if (!window.confirm(`Remover ${cliente?.nome}? Isso não pode ser desfeito.`)) return;
    await clientesService.remover(id);
    navigate('/clientes');
  }

  if (!id || !cliente) {
    return <p className="text-content-muted text-sm">Carregando…</p>;
  }

  return (
    <div className="flex flex-col gap-5 max-w-xl">
      <div className="flex items-start gap-3">
        <span className="w-11 h-11 rounded-full bg-accent-2-200 dark:bg-accent-2-800 flex-none" />
        <div className="flex-1 min-w-0">
          <h1 className="text-xl md:text-2xl truncate">{cliente.nome}</h1>
          <p className="text-xs text-content-muted">
            Cliente desde {new Date(cliente.criadoEm).toLocaleDateString('pt-BR')}
          </p>
        </div>
        <Link to={`/clientes/${id}/editar`} className="btn btn-ghost">
          Editar
        </Link>
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
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button className="btn btn-primary flex-1" onClick={() => setDialogAberto(true)}>
          Agendar próxima sessão
        </button>
        <button className="btn btn-secondary" onClick={excluirCliente}>
          Remover
        </button>
      </div>

      {dialogAberto && (
        <NewAppointmentDialog
          clientes={[cliente]}
          initialClienteId={cliente.id}
          onClose={() => setDialogAberto(false)}
          onCreated={(criado) => {
            setHistorico((lista) => [criado, ...lista]);
            setDialogAberto(false);
          }}
        />
      )}
    </div>
  );
}
