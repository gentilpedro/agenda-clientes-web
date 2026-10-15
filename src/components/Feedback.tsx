import type { ReactNode } from 'react';

export function Carregando({ texto = 'Carregando…' }: { texto?: string }) {
  return (
    <p role="status" className="text-content-muted text-sm">
      {texto}
    </p>
  );
}

/** Estado vazio: cartão tracejado centralizado no espaço restante da tela. */
export function EstadoVazio({ titulo, children }: { titulo: string; children?: ReactNode }) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div role="status" className="card items-center text-center py-10 gap-2 border-dashed max-w-md w-full">
        <p className="font-semibold">{titulo}</p>
        {children}
      </div>
    </div>
  );
}
