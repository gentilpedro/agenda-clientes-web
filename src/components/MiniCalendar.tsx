import { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { toLocalDateInput } from '../utils/date';

const DIAS_SEMANA = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

interface MiniCalendarProps {
  mesVisivel: Date;
  diaSelecionado: Date;
  diasComAgendamento: Set<string>;
  onSelecionarDia: (dia: Date) => void;
  onMudarMes: (delta: number) => void;
}

/** Grade de semanas completas cobrindo o mês (inclui dias do mês anterior/seguinte pra fechar a semana). */
function gerarDiasDaGrade(mesVisivel: Date): Date[] {
  const primeiroDoMes = new Date(mesVisivel.getFullYear(), mesVisivel.getMonth(), 1);
  const ultimoDoMes = new Date(mesVisivel.getFullYear(), mesVisivel.getMonth() + 1, 0);
  const inicio = new Date(primeiroDoMes);
  inicio.setDate(inicio.getDate() - inicio.getDay());
  const fim = new Date(ultimoDoMes);
  fim.setDate(fim.getDate() + (6 - fim.getDay()));

  const dias: Date[] = [];
  for (const cursor = new Date(inicio); cursor <= fim; cursor.setDate(cursor.getDate() + 1)) {
    dias.push(new Date(cursor));
  }
  return dias;
}

export function MiniCalendar({
  mesVisivel,
  diaSelecionado,
  diasComAgendamento,
  onSelecionarDia,
  onMudarMes,
}: MiniCalendarProps) {
  const dias = useMemo(() => gerarDiasDaGrade(mesVisivel), [mesVisivel]);
  const hojeChave = toLocalDateInput(new Date());
  const selecionadoChave = toLocalDateInput(diaSelecionado);

  return (
    <div className="card gap-4 p-5">
      <div className="flex items-center">
        <p className="font-semibold text-base capitalize">
          {mesVisivel.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
        </p>
        <div className="ml-auto flex gap-1">
          <button
            type="button"
            className="btn btn-icon btn-ghost"
            onClick={() => onMudarMes(-1)}
            aria-label="Mês anterior"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            className="btn btn-icon btn-ghost"
            onClick={() => onMudarMes(1)}
            aria-label="Próximo mês"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs text-content-muted">
        {DIAS_SEMANA.map((letra, i) => (
          <span key={i}>{letra}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {dias.map((dia) => {
          const chave = toLocalDateInput(dia);
          const foraDoMes = dia.getMonth() !== mesVisivel.getMonth();
          const selecionado = chave === selecionadoChave;
          const hoje = chave === hojeChave;
          const temAgendamento = diasComAgendamento.has(chave);

          return (
            <button
              key={chave}
              type="button"
              onClick={() => onSelecionarDia(dia)}
              aria-current={hoje ? 'date' : undefined}
              aria-label={dia.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
              className={[
                'relative w-full aspect-square rounded-full text-sm flex items-center justify-center transition-colors cursor-pointer',
                selecionado
                  ? 'bg-accent text-surface font-semibold'
                  : hoje
                    ? 'border border-accent text-accent font-semibold'
                    : 'hover:bg-accent-100 dark:hover:bg-accent-900',
                foraDoMes && !selecionado ? 'text-content-muted/50' : '',
              ].join(' ')}
            >
              {dia.getDate()}
              {temAgendamento && !selecionado && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-accent" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
