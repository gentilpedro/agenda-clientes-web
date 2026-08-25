import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LegalPageLayoutProps {
  titulo: string;
  atualizadoEm: string;
  children: ReactNode;
}

export function LegalPageLayout({ titulo, atualizadoEm, children }: LegalPageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center gap-3 px-6 py-4 md:px-10 border-b border-line">
        <Link to="/" className="flex items-center gap-2">
          <img src="/favicon.png" alt="Agenda" className="w-8 h-8 shrink-0" />
          <span className="font-heading text-base">Agenda</span>
        </Link>
        <Link to="/" className="ml-auto btn btn-ghost text-sm">
          <ArrowLeft size={15} /> Voltar
        </Link>
      </header>

      <main className="flex-1 px-6 py-10 md:px-10 md:py-14">
        <div className="max-w-2xl mx-auto flex flex-col gap-8">
          <div>
            <h1 className="text-3xl md:text-4xl">{titulo}</h1>
            <p className="text-xs text-content-muted mt-2">Última atualização em {atualizadoEm}</p>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
