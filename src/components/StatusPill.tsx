import type { AgendamentoStatus } from '../types/api';

const CONFIG: Record<AgendamentoStatus, { label: string; className: string }> = {
  AGENDADO: { label: 'Agendado', className: 'tag-outline' },
  CONCLUIDO: { label: 'Concluído', className: 'tag-accent-2' },
  CANCELADO: { label: 'Cancelado', className: 'tag-neutral' },
};

export function StatusPill({ status }: { status: AgendamentoStatus }) {
  const { label, className } = CONFIG[status];
  return <span className={`tag ${className}`}>{label}</span>;
}
