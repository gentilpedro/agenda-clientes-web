import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { agendamentosService } from '../services/agendamentos';
import { mensagemDoErro } from '../services/api';
import type { Agendamento, Cliente } from '../types/api';
import { formatHora, toLocalDateInput } from '../utils/date';
import { Dialog } from './Dialog';
import { Field } from './Field';

const DURACOES = [30, 50, 60];

interface AppointmentFormDialogProps {
  clientes: Cliente[];
  agendamento?: Agendamento;
  initialClienteId?: string;
  initialDate?: Date;
  initialHora?: string;
  onClose: () => void;
  onSaved: (agendamento: Agendamento) => void;
  onDeleted?: (id: string) => void;
}

export function AppointmentFormDialog({
  clientes,
  agendamento,
  initialClienteId,
  initialDate,
  initialHora,
  onClose,
  onSaved,
  onDeleted,
}: AppointmentFormDialogProps) {
  const isEdit = Boolean(agendamento);
  const listaId = useId();

  const [busca, setBusca] = useState('');
  const [comboAberto, setComboAberto] = useState(false);
  const comboRef = useRef<HTMLDivElement>(null);
  const [clienteId, setClienteId] = useState(agendamento?.clienteId ?? initialClienteId ?? '');
  const [data, setData] = useState(
    toLocalDateInput(agendamento ? new Date(agendamento.dataHora) : initialDate ?? new Date()),
  );
  const [hora, setHora] = useState(agendamento ? formatHora(agendamento.dataHora) : initialHora ?? '09:00');
  const [duracao, setDuracao] = useState(agendamento?.duracaoMinutos ?? 50);
  const [observacoes, setObservacoes] = useState(agendamento?.observacoes ?? '');
  const [erroCliente, setErroCliente] = useState<string | undefined>();
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  const clientesFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return clientes.slice(0, 6);
    return clientes.filter((c) => c.nome.toLowerCase().includes(termo)).slice(0, 6);
  }, [busca, clientes]);

  const clienteSelecionado = clientes.find((c) => c.id === clienteId);

  useEffect(() => {
    if (!comboAberto) return;
    function handleClickFora(event: MouseEvent) {
      if (comboRef.current && !comboRef.current.contains(event.target as Node)) {
        setComboAberto(false);
      }
    }
    document.addEventListener('mousedown', handleClickFora);
    return () => document.removeEventListener('mousedown', handleClickFora);
  }, [comboAberto]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (enviando || excluindo) return;
    if (!clienteId) {
      setErroCliente('Escolha um cliente da lista');
      return;
    }
    setEnviando(true);
    setErro(null);
    try {
      const dataHora = new Date(`${data}T${hora}:00`).toISOString();
      const input = {
        clienteId,
        dataHora,
        duracaoMinutos: duracao,
        observacoes: observacoes.trim() || undefined,
      };
      const salvo = isEdit
        ? await agendamentosService.atualizar(agendamento!.id, input)
        : await agendamentosService.criar(input);
      onSaved(salvo);
    } catch (err) {
      setErro(mensagemDoErro(err, 'Não foi possível salvar o agendamento. Tente de novo.'));
    } finally {
      setEnviando(false);
    }
  }

  async function handleExcluir() {
    if (!agendamento || !onDeleted || excluindo) return;
    if (!window.confirm('Excluir este agendamento? Isso não pode ser desfeito.')) return;
    setExcluindo(true);
    setErro(null);
    try {
      await agendamentosService.remover(agendamento.id);
      onDeleted(agendamento.id);
    } catch (err) {
      setErro(mensagemDoErro(err, 'Não foi possível excluir o agendamento.'));
      setExcluindo(false);
    }
  }

  return (
    <Dialog titulo={isEdit ? 'Editar agendamento' : 'Novo agendamento'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="relative" ref={comboRef}>
          <Field label="Cliente" error={erroCliente}>
            {(control) =>
              clienteSelecionado ? (
                <div className="flex items-center gap-2 input">
                  <span className="flex-1 min-w-0 truncate">{clienteSelecionado.nome}</span>
                  {!isEdit && (
                    <button
                      type="button"
                      className="btn-ghost tap-target -my-2 -mr-2 rounded-full px-2 text-xs cursor-pointer"
                      aria-label={`Trocar cliente (${clienteSelecionado.nome})`}
                      onClick={() => setClienteId('')}
                    >
                      trocar
                    </button>
                  )}
                </div>
              ) : clientes.length === 0 ? (
                <div className="flex flex-col gap-2 border border-line rounded-2xl p-3 text-sm">
                  <p className="text-content-muted">Você ainda não tem clientes cadastrados.</p>
                  <Link to="/clientes" className="btn btn-secondary self-start">
                    Ir para clientes
                  </Link>
                </div>
              ) : (
                <input
                  {...control}
                  type="search"
                  className="input"
                  placeholder="Digite para buscar…"
                  autoComplete="off"
                  role="combobox"
                  aria-expanded={comboAberto}
                  aria-controls={listaId}
                  aria-autocomplete="list"
                  value={busca}
                  onChange={(e) => {
                    setBusca(e.target.value);
                    setComboAberto(true);
                  }}
                  onFocus={() => setComboAberto(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape' && comboAberto) {
                      // Fecha só a lista; o Esc não deve fechar o diálogo inteiro.
                      e.preventDefault();
                      e.stopPropagation();
                      setComboAberto(false);
                    }
                  }}
                />
              )
            }
          </Field>
          {!clienteSelecionado && clientes.length > 0 && comboAberto && (
            <div
              id={listaId}
              className="absolute top-full left-0 right-0 mt-1 z-10 flex flex-col gap-1 border border-line rounded-2xl p-1 max-h-48 pointer-coarse:max-h-56 overflow-y-auto overscroll-contain bg-surface-raised elev-lg"
            >
              {clientesFiltrados.length === 0 && (
                <p className="text-xs text-content-muted px-2 py-2">Nenhum cliente com esse nome</p>
              )}
              {clientesFiltrados.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => {
                    setClienteId(c.id);
                    setBusca('');
                    setComboAberto(false);
                    setErroCliente(undefined);
                  }}
                  className="text-left text-sm px-3 py-2 pointer-coarse:py-3 rounded-xl [overflow-wrap:anywhere] hover:bg-accent-100 dark:hover:bg-accent-900"
                >
                  {c.nome}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Field label="Data" className="flex-1 min-w-0">
            {(control) => (
              <input {...control} type="date" className="input" value={data} onChange={(e) => setData(e.target.value)} required />
            )}
          </Field>
          <Field label="Hora" className="w-36 flex-none">
            {(control) => (
              <input {...control} type="time" className="input" value={hora} onChange={(e) => setHora(e.target.value)} required />
            )}
          </Field>
        </div>

        <fieldset className="field">
          <legend>Duração</legend>
          <div className="seg w-full">
            {DURACOES.map((min) => (
              <label key={min} className="seg-opt flex-1 justify-center">
                <input
                  type="radio"
                  name="duracao"
                  value={min}
                  checked={duracao === min}
                  onChange={() => setDuracao(min)}
                />
                <span aria-hidden="true">{min}m</span>
                <span className="sr-only">{min} minutos</span>
              </label>
            ))}
          </div>
        </fieldset>

        <Field label="Notas (opcional)">
          {(control) => (
            <textarea
              {...control}
              className="input"
              rows={3}
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
            />
          )}
        </Field>

        {erro && (
          <p role="alert" className="form-error">
            {erro}
          </p>
        )}

        <div className="flex gap-2">
          <button type="submit" className="btn btn-primary btn-block" disabled={enviando || excluindo}>
            {enviando ? 'Salvando…' : isEdit ? 'Salvar' : 'Agendar'}
          </button>
          {isEdit && onDeleted && (
            <button type="button" className="btn btn-secondary" onClick={handleExcluir} disabled={enviando || excluindo}>
              {excluindo ? 'Excluindo…' : 'Excluir'}
            </button>
          )}
        </div>
      </form>
    </Dialog>
  );
}
