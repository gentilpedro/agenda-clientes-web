function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return '?';
  const primeira = partes[0][0];
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : '';
  return (primeira + ultima).toLocaleUpperCase('pt-BR');
}

const TAMANHOS = {
  sm: 'w-6 h-6 text-[10px]',
  md: 'w-9 h-9 text-xs',
  lg: 'w-11 h-11 text-sm',
};

/** Círculo sálvia com as iniciais do cliente; decorativo, o nome vem ao lado. */
export function Avatar({ nome, tamanho = 'md' }: { nome: string; tamanho?: keyof typeof TAMANHOS }) {
  return (
    <span
      aria-hidden="true"
      className={`${TAMANHOS[tamanho]} flex-none inline-flex items-center justify-center rounded-full font-semibold bg-accent-2-200 text-accent-2-800 dark:bg-accent-2-800 dark:text-accent-2-100`}
    >
      {iniciais(nome)}
    </span>
  );
}
