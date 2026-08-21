export function toLocalDateInput(date: Date): string {
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

export function formatDiaLabel(date: Date): string {
  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  });
}

export function formatHora(iso: string): string {
  return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

/** Hora local (0-23) do horário de um agendamento, pra agrupar na timeline. */
export function getLocalHour(iso: string): number {
  return new Date(iso).getHours();
}

export function isSameLocalDay(iso: string, date: Date): boolean {
  return toLocalDateInput(new Date(iso)) === toLocalDateInput(date);
}
