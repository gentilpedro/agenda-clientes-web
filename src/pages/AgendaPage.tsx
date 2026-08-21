import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

import { ErrorState } from '../components/ErrorState';
import { NewAppointmentDialog } from '../components/NewAppointmentDialog';
import { StatusPill } from '../components/StatusPill';
import { agendamentosService } from '../services/agendamentos';
import { mensagemDoErro } from '../services/api';
import { clientesService } from '../services/clientes';
import type { Agendamento, Cliente } from '../types/api';
import { formatDiaLabel, formatHora, toLocalDateInput } from '../utils/date';

/**
 * Resultado da busca de um dia. A chave (dia + tentativa) identifica qual busca
 * produziu esta lista: enquanto ela não bate com a chave atual, a tela está
 * carregando — assim o estado de loading é derivado, sem setState no efeito.
 */
interface AgendaDoDia {
  chave: string;
  lista: Agendamento[];
  erro: string | null;
}

function ordenarPorHora(lista: Agendamento[]): Agendamento[] {
  return [...lista].sort((a, b) => a.dataHora.localeCompare(b.dataHora));
}

export function AgendaPage() {
  const [dia, setDia] = useState(() => new Date());
  const [tentativa, setTentativa] = useState(0);
  const [resultado, setResultado] = useState<AgendaDoDia | null>(null);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [erroAcao, setErroAcao] = useState<string | null>(null);
  const [dialogAberto, setDialogAberto] = useState(false);

  useEffect(() => {
    clientesService.listar().then(setClientes).catch(() => setClientes([]));
  }, [tentativa]);

  useEffect(() => {
    let ignore = false;
    const diaBuscado = toLocalDateInput(dia);
    const chave = `${diaBuscado}#${tentativa}`;
    agendamentosService
      .listarPorData(diaBuscado)
      .then((lista) => {
        if (!ignore) setResultado({ chave, lista: ordenarPorHora(lista), erro: null });
      })
      .catch((err: unknown) => {
        if (ignore) return;
        setResultado({
          chave,
          lista: [],
          erro: mensagemDoErro(err, 'Não foi possível carregar a agenda deste dia.'),
        });
      });
    return () => {
      ignore = true;
    };
  }, [dia, tentativa]);

  const chaveAtual = `${toLocalDateInput(dia)}#${tentativa}`;
  const carregando = resultado?.chave !== chaveAtual;
  const agendamentos = carregando ? [] : resultado.lista;
  const erroCarga = carregando ? null : resultado.erro;

  function nomeCliente(clienteId: string) {
    return clientes.find((c) => c.id === clienteId)?.nome ?? '—';
  }

  function mudarDia(delta: number) {
    setDia((atual) => {
      const proximo = new Date(atual);
      proximo.setDate(proximo.getDate() + delta);
      return proximo;
    });
  }

  function recarregar() {
    setTentativa((n) => n + 1);
  }

  function substituirLista(atualizar: (lista: Agendamento[]) => Agendamento[]) {
    setResultado((atual) => (atual ? { ...atual, lista: atualizar(atual.lista) } : atual));
  }

  async function marcar(id: string, acao: 'cancelar' | 'concluir') {
    setErroAcao(null);
    try {
      const atualizado = await (acao === 'cancelar'
        ? agendamentosService.cancelar(id)
        : agendamentosService.concluir(id));
      substituirLista((lista) => lista.map((a) => (a.id === id ? atualizado : a)));
    } catch (err) {
      setErroAcao(mensagemDoErro(err, 'Não foi possível atualizar o agendamento.'));
    }
  }

  const isHoje = toLocalDateInput(dia) === toLocalDateInput(new Date());

  return (
    <div className="flex flex-col gap-5 min-h-[calc(100vh-8rem)] md:min-h-[calc(100vh-9rem)]">
      <div className="flex items-center gap-3 flex-wrap">
        <h1 className="text-2xl md:text-3xl capitalize">{formatDiaLabel(dia)}</h1>
        <button className="btn btn-icon btn-secondary" onClick={() => mudarDia(-1)} aria-label="Dia anterior">
          <ChevronLeft size={16} />
        </button>
        <button className="btn btn-icon btn-secondary" onClick={() => mudarDia(1)} aria-label="Próximo dia">
          <ChevronRight size={16} />
        </button>
        {!isHoje && (
          <button className="btn btn-secondary" onClick={() => setDia(new Date())}>
            Hoje
          </button>
        )}
        <button className="btn btn-primary ml-auto" onClick={() => setDialogAberto(true)}>
          <Plus size={16} /> Agendamento
        </button>
      </div>

      {carregando && <p className="text-content-muted text-sm">Carregando…</p>}

      {erroCarga && (
        <div className="flex-1 flex items-center justify-center">
          <ErrorState mensagem={erroCarga} onTentarDeNovo={recarregar} />
        </div>
      )}

      {erroAcao && (
        <p role="alert" className="text-sm text-accent-700 dark:text-accent-300">
          {erroAcao}
        </p>
      )}

      {!carregando && !erroCarga && agendamentos.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <div className="card items-center text-center py-10 gap-2 border-dashed max-w-md w-full">
            <p className="font-semibold">Nenhum agendamento neste dia</p>
            <p className="text-sm text-content-muted">Use "+ Agendamento" para marcar um horário.</p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2 max-w-3xl w-full">
        {agendamentos.map((a) => (
          <div key={a.id} className="card flex-row items-center gap-4">
            <div className="w-14 flex-none">
              <div className="font-semibold text-sm">{formatHora(a.dataHora)}</div>
              <div className="text-[11px] text-content-muted">{a.duracaoMinutos} min</div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm truncate">{nomeCliente(a.clienteId)}</div>
              {a.observacoes && <div className="text-xs text-content-muted truncate">{a.observacoes}</div>}
            </div>
            <StatusPill status={a.status} />
            {a.status === 'AGENDADO' && (
              <div className="flex gap-1 flex-none">
                <button className="btn btn-ghost text-xs" onClick={() => marcar(a.id, 'concluir')}>
                  Concluir
                </button>
                <button className="btn btn-ghost text-xs" onClick={() => marcar(a.id, 'cancelar')}>
                  Cancelar
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {dialogAberto && (
        <NewAppointmentDialog
          clientes={clientes}
          initialDate={dia}
          onClose={() => setDialogAberto(false)}
          onCreated={(criado) => {
            substituirLista((lista) => ordenarPorHora([...lista, criado]));
            setDialogAberto(false);
          }}
        />
      )}
    </div>
  );
}
