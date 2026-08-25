import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Pencil, Plus, Trash2, X } from 'lucide-react';

import { AppointmentFormDialog } from '../components/AppointmentFormDialog';
import { ErrorState } from '../components/ErrorState';
import { MiniCalendar } from '../components/MiniCalendar';
import { StatusPill } from '../components/StatusPill';
import { agendamentosService } from '../services/agendamentos';
import { mensagemDoErro } from '../services/api';
import { clientesService } from '../services/clientes';
import type { Agendamento, AgendamentoStatus, Cliente } from '../types/api';
import { formatDiaLabel, formatHora, getLocalHour, isSameLocalDay, toLocalDateInput } from '../utils/date';

/** Janela padrão da timeline quando não há agendamento fora dela. */
const HORA_INICIO_PADRAO = 6;
const HORA_FIM_PADRAO = 22;

const BORDA_POR_STATUS: Record<AgendamentoStatus, string> = {
  AGENDADO: 'border-l-accent-500',
  CONCLUIDO: 'border-l-accent-2-500',
  CANCELADO: 'border-l-line',
};

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

function inicioDoMes(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function mesmoMes(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

const SEM_AGENDAMENTOS: Agendamento[] = [];

function formatHoraCheia(hora: number): string {
  return `${String(hora).padStart(2, '0')}:00`;
}

function formatLivre(minutos: number): string {
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  if (h === 0) return `${m}min livres`;
  if (m === 0) return `${h}h livres`;
  return `${h}h${m}min livres`;
}

export function AgendaPage() {
  const [dia, setDia] = useState(() => new Date());
  const [tentativa, setTentativa] = useState(0);
  const [resultado, setResultado] = useState<AgendaDoDia | null>(null);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [erroAcao, setErroAcao] = useState<string | null>(null);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [horaParaAgendar, setHoraParaAgendar] = useState<string | undefined>(undefined);
  const [agendamentoEditando, setAgendamentoEditando] = useState<Agendamento | null>(null);
  const [todosAgendamentos, setTodosAgendamentos] = useState<Agendamento[]>([]);
  const [mesVisivel, setMesVisivel] = useState(() => inicioDoMes(dia));
  const [mesSincronizadoCom, setMesSincronizadoCom] = useState(dia);
  const [calendarioAberto, setCalendarioAberto] = useState(false);

  // Ajusta o mês visível quando o dia muda de mês por fora do mini calendário
  // (setas de dia, "Hoje"). Padrão oficial do React pra "resetar" estado
  // derivado de uma prop durante o render, sem precisar de useEffect.
  if (!mesmoMes(mesSincronizadoCom, dia)) {
    setMesSincronizadoCom(dia);
    setMesVisivel(inicioDoMes(dia));
  }

  useEffect(() => {
    clientesService.listar().then(setClientes).catch(() => setClientes([]));
  }, [tentativa]);

  useEffect(() => {
    agendamentosService.listar().then(setTodosAgendamentos).catch(() => setTodosAgendamentos([]));
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
  const agendamentos = carregando ? SEM_AGENDAMENTOS : resultado.lista;
  const erroCarga = carregando ? null : resultado.erro;

  const horasComAgendamento = agendamentos.map((a) => getLocalHour(a.dataHora));
  const horaInicio = Math.min(HORA_INICIO_PADRAO, ...horasComAgendamento);
  const horaFim = Math.max(HORA_FIM_PADRAO, ...horasComAgendamento.map((h) => h + 1));
  const horas = useMemo(
    () => Array.from({ length: Math.max(0, horaFim - horaInicio) }, (_, i) => horaInicio + i),
    [horaInicio, horaFim],
  );

  const porHora = useMemo(() => {
    const map = new Map<number, Agendamento[]>();
    for (const a of agendamentos) {
      const h = getLocalHour(a.dataHora);
      map.set(h, [...(map.get(h) ?? []), a]);
    }
    return map;
  }, [agendamentos]);

  const resumo = useMemo(() => {
    const porStatus = (status: AgendamentoStatus) => agendamentos.filter((a) => a.status === status).length;
    const ocupadoMin = agendamentos
      .filter((a) => a.status !== 'CANCELADO')
      .reduce((soma, a) => soma + a.duracaoMinutos, 0);
    const janelaMin = (horaFim - horaInicio) * 60;
    return {
      agendados: porStatus('AGENDADO'),
      concluidos: porStatus('CONCLUIDO'),
      cancelados: porStatus('CANCELADO'),
      livreMin: Math.max(0, janelaMin - ocupadoMin),
    };
  }, [agendamentos, horaInicio, horaFim]);

  const diasComAgendamento = useMemo(() => {
    const set = new Set<string>();
    for (const a of todosAgendamentos) {
      if (a.status === 'CANCELADO') continue;
      set.add(toLocalDateInput(new Date(a.dataHora)));
    }
    return set;
  }, [todosAgendamentos]);

  function mudarMes(delta: number) {
    setMesVisivel((atual) => new Date(atual.getFullYear(), atual.getMonth() + delta, 1));
  }

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

  async function removerAgendamento(id: string) {
    if (!window.confirm('Excluir este agendamento? Isso não pode ser desfeito.')) return;
    setErroAcao(null);
    try {
      await agendamentosService.remover(id);
      removerDaLista(id);
    } catch (err) {
      setErroAcao(mensagemDoErro(err, 'Não foi possível excluir o agendamento.'));
    }
  }

  function abrirNovoAgendamento(hora?: string) {
    setAgendamentoEditando(null);
    setHoraParaAgendar(hora);
    setDialogAberto(true);
  }

  function abrirEdicao(agendamento: Agendamento) {
    setAgendamentoEditando(agendamento);
    setDialogAberto(true);
  }

  function removerDaLista(id: string) {
    substituirLista((lista) => lista.filter((a) => a.id !== id));
    setDialogAberto(false);
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
        <button
          type="button"
          className="btn btn-icon btn-secondary lg:hidden"
          onClick={() => setCalendarioAberto(true)}
          aria-label="Abrir calendário"
        >
          <CalendarDays size={16} />
        </button>
        <button className="btn btn-primary ml-auto" onClick={() => abrirNovoAgendamento()}>
          <Plus size={16} /> Agendamento
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start flex-1">
        <div className="flex flex-col gap-5 w-full min-w-0 lg:flex-none lg:max-w-3xl">
          {!carregando && !erroCarga && (
            <div className="flex gap-4 flex-wrap text-xs text-content-muted">
              <span>{resumo.agendados} agendado{resumo.agendados !== 1 ? 's' : ''}</span>
              <span>{resumo.concluidos} concluído{resumo.concluidos !== 1 ? 's' : ''}</span>
              <span>{resumo.cancelados} cancelado{resumo.cancelados !== 1 ? 's' : ''}</span>
              <span className="text-accent-2-700 dark:text-accent-2-300 font-semibold">
                {formatLivre(resumo.livreMin)}
              </span>
            </div>
          )}

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

          {!carregando && !erroCarga && (
            <div className="flex flex-col max-w-3xl w-full">
              {horas.map((h) => (
                <div key={h} className="grid grid-cols-[52px_1fr] gap-3 border-t border-line first:border-t-0 py-2">
                  <div className="text-xs text-content-muted pt-3">{formatHoraCheia(h)}</div>
                  <div className="flex flex-col gap-2 min-h-11 justify-center">
                    {(porHora.get(h) ?? []).length > 0 ? (
                      (porHora.get(h) ?? []).map((a) => (
                        <div
                          key={a.id}
                          className={`card flex-row items-center gap-4 border-l-4 ${BORDA_POR_STATUS[a.status]}`}
                        >
                          <div className="w-14 flex-none">
                            <div className="font-semibold text-sm">{formatHora(a.dataHora)}</div>
                            <div className="text-[11px] text-content-muted">{a.duracaoMinutos} min</div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm truncate">{nomeCliente(a.clienteId)}</div>
                            {a.observacoes && (
                              <div className="text-xs text-content-muted truncate">{a.observacoes}</div>
                            )}
                          </div>
                          <StatusPill status={a.status} />
                          {a.status === 'AGENDADO' && a.confirmado && (
                            <span className="tag tag-accent-2">Confirmado</span>
                          )}
                          {a.status === 'AGENDADO' && !a.confirmado && a.lembreteEnviadoEm && (
                            <span className="tag tag-outline">Lembrete enviado</span>
                          )}
                          <div className="flex gap-1 flex-none">
                            {a.status === 'AGENDADO' && (
                              <>
                                <button className="btn btn-ghost text-xs" onClick={() => marcar(a.id, 'concluir')}>
                                  Concluir
                                </button>
                                <button className="btn btn-ghost text-xs" onClick={() => marcar(a.id, 'cancelar')}>
                                  Cancelar
                                </button>
                              </>
                            )}
                            <button
                              type="button"
                              className="btn btn-icon btn-ghost"
                              onClick={() => abrirEdicao(a)}
                              aria-label="Editar agendamento"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              type="button"
                              className="btn btn-icon btn-ghost"
                              onClick={() => removerAgendamento(a.id)}
                              aria-label="Excluir agendamento"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <button
                        type="button"
                        onClick={() => abrirNovoAgendamento(formatHoraCheia(h))}
                        className="flex items-center justify-center rounded-2xl border border-dashed border-line text-content-muted text-xs py-3 cursor-pointer transition-colors hover:border-accent hover:text-accent"
                      >
                        livre · toque pra agendar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <aside className="hidden lg:block flex-1 max-w-2xl sticky top-4">
          <MiniCalendar
            mesVisivel={mesVisivel}
            diaSelecionado={dia}
            diasComAgendamento={diasComAgendamento}
            onSelecionarDia={setDia}
            onMudarMes={mudarMes}
          />
        </aside>
      </div>

      {calendarioAberto && (
        <div className="dialog-backdrop" onClick={() => setCalendarioAberto(false)}>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center">
              <h2 className="dialog-title">Calendário</h2>
              <button
                type="button"
                onClick={() => setCalendarioAberto(false)}
                aria-label="Fechar"
                className="ml-auto btn btn-icon btn-ghost"
              >
                <X size={18} />
              </button>
            </div>
            <MiniCalendar
              mesVisivel={mesVisivel}
              diaSelecionado={dia}
              diasComAgendamento={diasComAgendamento}
              onSelecionarDia={(d) => {
                setDia(d);
                setCalendarioAberto(false);
              }}
              onMudarMes={mudarMes}
            />
          </div>
        </div>
      )}

      {dialogAberto && (
        <AppointmentFormDialog
          clientes={clientes}
          agendamento={agendamentoEditando ?? undefined}
          initialDate={dia}
          initialHora={horaParaAgendar}
          onClose={() => setDialogAberto(false)}
          onSaved={(salvo) => {
            substituirLista((lista) => {
              const mesmoDia = isSameLocalDay(salvo.dataHora, dia);
              if (agendamentoEditando) {
                return mesmoDia
                  ? ordenarPorHora(lista.map((a) => (a.id === salvo.id ? salvo : a)))
                  : lista.filter((a) => a.id !== salvo.id);
              }
              return mesmoDia ? ordenarPorHora([...lista, salvo]) : lista;
            });
            setDialogAberto(false);
          }}
          onDeleted={removerDaLista}
        />
      )}
    </div>
  );
}
