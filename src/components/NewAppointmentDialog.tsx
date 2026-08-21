import { useEffect, useMemo, useRef, useState } from 'react';
import { X } from 'lucide-react';

import { agendamentosService } from '../services/agendamentos';
import { ApiRequestError } from '../services/api';
import type { Agendamento, Cliente } from '../types/api';
import { toLocalDateInput } from '../utils/date';

const DURACOES = [30, 50, 60];

interface NewAppointmentDialogProps {
  clientes: Cliente[];
  initialClienteId?: string;
  initialDate?: Date;
  initialHora?: string;
  onClose: () => void;
  onCreated: (agendamento: Agendamento) => void;
}

export function NewAppointmentDialog({
  clientes,
  initialClienteId,
  initialDate,
  initialHora,
  onClose,
  onCreated,
}: NewAppointmentDialogProps) {
  const [busca, setBusca] = useState('');
  const [comboAberto, setComboAberto] = useState(false);
  const comboRef = useRef<HTMLDivElement>(null);
  const [clienteId, setClienteId] = useState(initialClienteId ?? '');
  const [data, setData] = useState(toLocalDateInput(initialDate ?? new Date()));
  const [hora, setHora] = useState(initialHora ?? '09:00');
  const [duracao, setDuracao] = useState(50);
  const [observacoes, setObservacoes] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const clientesFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return clientes.slice(0, 6);
    return clientes
      .filter((c) => c.nome.toLowerCase().includes(termo))
      .slice(0, 6);
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
    if (!clienteId) {
      setErro('Escolha um cliente');
      return;
    }
    setEnviando(true);
    setErro(null);
    try {
      const dataHora = new Date(`${data}T${hora}:00`).toISOString();
      const criado = await agendamentosService.criar({
        clienteId,
        dataHora,
        duracaoMinutos: duracao,
        observacoes: observacoes || undefined,
      });
      onCreated(criado);
    } catch (err) {
      setErro(err instanceof ApiRequestError ? err.message : 'Não foi possível agendar');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="dialog-backdrop" onClick={onClose}>
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center">
          <h2 className="dialog-title">Novo agendamento</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="ml-auto btn btn-icon btn-ghost"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="field relative" ref={comboRef}>
            <label>Cliente</label>
            {clienteSelecionado ? (
              <div className="flex items-center gap-2 input">
                <span className="flex-1 truncate">{clienteSelecionado.nome}</span>
                <button
                  type="button"
                  className="btn-ghost text-xs"
                  onClick={() => setClienteId('')}
                >
                  trocar
                </button>
              </div>
            ) : (
              <>
                <input
                  className="input"
                  placeholder="Digite para buscar…"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  onFocus={() => setComboAberto(true)}
                />
                {comboAberto && (
                  <div className="absolute top-full left-0 right-0 mt-1 z-10 flex flex-col gap-1 border border-line rounded-2xl p-1 max-h-48 overflow-y-auto bg-surface-raised elev-lg">
                    {clientesFiltrados.length === 0 && (
                      <p className="text-xs text-content-muted px-2 py-2">Nenhum cliente encontrado</p>
                    )}
                    {clientesFiltrados.map((c) => (
                      <button
                        type="button"
                        key={c.id}
                        onClick={() => {
                          setClienteId(c.id);
                          setBusca('');
                          setComboAberto(false);
                        }}
                        className="text-left text-sm px-3 py-2 rounded-xl hover:bg-accent-100 dark:hover:bg-accent-900"
                      >
                        {c.nome}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          <div className="flex gap-2">
            <div className="field flex-1">
              <label>Data</label>
              <input
                type="date"
                className="input"
                value={data}
                onChange={(e) => setData(e.target.value)}
                required
              />
            </div>
            <div className="field w-28">
              <label>Hora</label>
              <input
                type="time"
                className="input"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="field">
            <label>Duração</label>
            <div className="seg w-full">
              {DURACOES.map((min) => (
                <label key={min} className="seg-opt flex-1 justify-center">
                  <input
                    type="radio"
                    name="duracao"
                    checked={duracao === min}
                    onChange={() => setDuracao(min)}
                  />
                  {min}m
                </label>
              ))}
            </div>
          </div>

          <div className="field">
            <label>Notas (opcional)</label>
            <textarea
              className="input"
              rows={3}
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
            />
          </div>

          {erro && <p className="text-sm text-accent-700 dark:text-accent-300">{erro}</p>}

          <button type="submit" className="btn btn-primary btn-block" disabled={enviando}>
            {enviando ? 'Agendando…' : 'Agendar'}
          </button>
        </form>
      </div>
    </div>
  );
}
