import { CalendarCheck, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useAuth } from '../contexts/auth-context';

export function LandingPage() {
  const { usuario } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center gap-2 px-6 py-5 md:px-10">
        <span className="w-8 h-8 rounded-full bg-accent" />
        <span className="font-heading text-lg">Agenda</span>
        <div className="ml-auto flex gap-2">
          {usuario ? (
            <Link to="/agenda" className="btn btn-primary">
              Ir para a agenda
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary">
                Entrar
              </Link>
              <Link to="/cadastro" className="btn btn-primary">
                Criar conta
              </Link>
            </>
          )}
        </div>
      </header>

      <main className="flex-1 flex items-center px-6 md:px-10">
        <div className="max-w-2xl flex flex-col gap-6 py-16">
          <h1 className="text-4xl md:text-5xl leading-tight">
            Sua prática,
            <br />
            em um só lugar
          </h1>
          <p className="text-content-muted text-lg max-w-md">
            Cadastre clientes e marque consultas em minutos — feito para médicos, psicólogos,
            advogados e qualquer profissional que atende por horário marcado.
          </p>
          <div className="flex gap-3 flex-wrap">
            {usuario ? (
              <Link to="/agenda" className="btn btn-primary">
                Ir para a agenda
              </Link>
            ) : (
              <>
                <Link to="/cadastro" className="btn btn-primary">
                  Começar agora
                </Link>
                <Link to="/login" className="btn btn-secondary">
                  Já tenho conta
                </Link>
              </>
            )}
          </div>

          <div className="flex gap-6 mt-6 flex-wrap">
            <div className="flex items-center gap-2 text-sm text-content-muted">
              <Users size={18} strokeWidth={2.75} className="text-accent" />
              Cadastro de clientes
            </div>
            <div className="flex items-center gap-2 text-sm text-content-muted">
              <CalendarCheck size={18} strokeWidth={2.75} className="text-accent" />
              Agenda diária simples
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
