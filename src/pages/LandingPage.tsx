import { CalendarCheck, MousePointerClick, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useAuth } from '../contexts/auth-context';

const screens = [
  {
    icon: CalendarCheck,
    title: 'Seu dia',
    description:
      'Os agendamentos de hoje com status em um relance — agendado, concluído, cancelado.',
  },
  {
    icon: Users,
    title: 'Seus clientes',
    description: 'Dados de contato, histórico e observações privadas. Busca em um campo só.',
  },
  {
    icon: MousePointerClick,
    title: 'Agendar em dois toques',
    description: 'Escolha o cliente, escolha um horário livre. Conflito de horário não existe.',
  },
];

export function LandingPage() {
  const { usuario } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center gap-6 px-6 py-4 md:px-10 border-b border-line">
        <div className="flex items-center gap-2">
          <img src="/favicon.png" alt="Agenda" className="w-9 h-9 shrink-0" />
          <span className="font-heading text-base">Agenda</span>
        </div>
        <div className="hidden md:flex gap-5 text-sm text-content-muted">
          <span>Como funciona</span>
          <span>Privacidade</span>
        </div>
        <div className="ml-auto flex gap-2 items-center">
          {usuario ? (
            <Link to="/agenda" className="btn btn-primary">
              Ir para a agenda
            </Link>
          ) : (
            <>
              <Link to="/login" className="hidden sm:inline text-sm text-content-muted">
                Entrar
              </Link>
              <Link to="/cadastro" className="btn btn-primary">
                Criar conta
              </Link>
            </>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        <div className="flex flex-col md:flex-row gap-8 items-center px-6 py-14 md:px-10 md:py-20">
          <div className="flex-1 flex flex-col gap-5 max-w-xl">
            <span className="tag tag-accent-2 self-start">Para quem atende sozinho</span>
            <h1 className="text-4xl md:text-5xl leading-tight">
              Sua prática,
              <br />
              em um só lugar
            </h1>
            <p className="text-content-muted text-lg max-w-md">
              Cadastre clientes e marque consultas em minutos — feito para médicos, psicólogos,
              advogados e qualquer profissional que atende por horário marcado.
            </p>
            <div className="flex gap-3 flex-wrap items-center">
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
            <p className="text-xs text-content-muted">
              Grátis, sem cartão. Exporte seus dados quando quiser.
            </p>
          </div>
          <div className="flex-1 w-full max-w-sm">
            <div className="h-56 md:h-64 rounded-3xl border border-dashed border-accent-2-300 bg-accent-2-100 grid place-items-center text-center text-xs text-[#201e1d]/60 px-4">
              captura de tela da agenda
            </div>
          </div>
        </div>

        {/* Fundo desta faixa vem da rampa accent, que é fixa nos dois temas — por
            isso o texto aqui é travado em tom escuro em vez dos tokens semânticos
            (que trocam de cor no escuro e ficariam ilegíveis sobre esse fundo). */}
        <div className="px-6 py-10 md:px-10 md:py-14 bg-accent-100 border-y border-line flex flex-col gap-6">
          <h2 className="text-2xl md:text-3xl" style={{ color: '#201e1d' }}>
            Três telas. É o produto inteiro.
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {screens.map(({ icon: Icon, title, description }) => (
              <div key={title} className="card">
                <div className="w-8 h-8 rounded-full bg-accent-200 grid place-items-center">
                  <Icon size={16} strokeWidth={2.75} className="text-accent-800" />
                </div>
                <div className="card-title">{title}</div>
                <p className="text-sm text-content-muted flex-1">{description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 items-center px-6 py-10 md:px-10">
          <div className="w-24 h-24 shrink-0 rounded-full bg-accent-2-200" />
          <div className="flex flex-col gap-2 text-center sm:text-left">
            <p className="font-heading text-lg leading-snug">
              &ldquo;Parei de usar agenda de papel na primeira semana.&rdquo;
            </p>
            <p className="text-sm text-content-muted">
              Depoimento de exemplo — trocar por um real antes de publicar.
            </p>
          </div>
        </div>

        {/* Mesmo caso da faixa "Três telas": fundo da rampa accent-2, fixo nos dois
            temas, então o texto também é travado em tom escuro aqui. */}
        <div className="px-6 py-10 md:px-10 md:py-14 bg-accent-2-100 flex flex-col md:flex-row gap-6 md:items-end">
          <div className="flex-1 flex flex-col gap-2">
            <h2 className="text-2xl md:text-3xl" style={{ color: '#201e1d' }}>
              Grátis. Sem pegadinha.
            </h2>
            <p className="text-[#201e1d]/60">
              Sem plano, sem assento por usuário, sem upsell. Seus dados são seus e podem ser
              exportados quando quiser.
            </p>
          </div>
          <Link to={usuario ? '/agenda' : '/cadastro'} className="btn btn-primary self-start">
            {usuario ? 'Ir para a agenda' : 'Criar conta grátis'}
          </Link>
        </div>

        <footer className="flex flex-wrap items-center gap-x-5 gap-y-2 px-6 py-5 md:px-10 text-xs text-content-muted border-t border-line">
          <div className="flex items-center gap-2">
            <img src="/favicon.png" alt="" className="w-5 h-5 shrink-0" />
            Agenda
          </div>
          <span>© {new Date().getFullYear()} Agenda Clientes. Todos os direitos reservados.</span>
          <div className="md:ml-auto flex gap-4">
            <Link to="/privacidade" className="hover:text-content transition-colors">
              Privacidade
            </Link>
            <Link to="/termos" className="hover:text-content transition-colors">
              Termos
            </Link>
            <span>Contato</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
