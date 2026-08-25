import { CalendarDays, LogOut, Settings, Users } from 'lucide-react';
import { Link, NavLink, Outlet } from 'react-router-dom';

import { useAuth } from '../contexts/auth-context';
import { ThemeToggle } from './ThemeToggle';

const NAV_ITEMS = [
  { to: '/agenda', label: 'Agenda', icon: CalendarDays, end: true },
  { to: '/clientes', label: 'Clientes', icon: Users, end: false },
  { to: '/configuracoes', label: 'Configurações', icon: Settings, end: false },
];

function navItemClass(isActive: boolean) {
  return [
    'flex items-center justify-center rounded-2xl transition-colors',
    isActive
      ? 'bg-accent-200 text-accent-800 dark:bg-accent-800 dark:text-accent-200'
      : 'text-content-muted hover:bg-accent-100 dark:hover:bg-accent-900',
  ].join(' ');
}

export function Layout() {
  const { logout } = useAuth();

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <header className="flex items-center gap-3 border-b border-line px-4 py-3 md:hidden">
        <Link to="/" className="flex-none">
          <img src="/favicon.png" alt="Agenda" className="w-8 h-8" />
        </Link>
        <span className="font-heading text-lg">Agenda</span>
        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle />
          <button
            type="button"
            onClick={logout}
            aria-label="Sair"
            className="cursor-pointer rounded-full p-2 text-content-muted transition-colors hover:bg-accent-100 dark:hover:bg-accent-900"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <nav className="hidden md:flex w-[72px] flex-none flex-col items-center gap-4 border-r border-line bg-accent-100/40 dark:bg-accent-900/20 py-5">
        <Link to="/" title="Ir para a página inicial">
          <img src="/favicon.png" alt="Agenda" className="w-9 h-9" />
        </Link>
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            title={label}
            className={({ isActive }) => `${navItemClass(isActive)} w-9 h-9`}
          >
            <Icon size={18} strokeWidth={2.75} />
          </NavLink>
        ))}
        <div className="mt-auto flex flex-col items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={logout}
            title="Sair"
            aria-label="Sair"
            className="cursor-pointer rounded-full p-2 text-content-muted transition-colors hover:bg-accent-100 dark:hover:bg-accent-900"
          >
            <LogOut size={18} />
          </button>
        </div>
      </nav>

      <main className="flex-1 min-w-0 p-4 pb-20 md:p-8 md:pb-8">
        <Outlet />
      </main>

      <nav className="md:hidden fixed bottom-0 inset-x-0 flex border-t border-line bg-surface-raised px-2 py-2 gap-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `${navItemClass(isActive)} flex-1 flex-col gap-0.5 py-2 text-[11px] font-medium`
            }
          >
            <Icon size={18} strokeWidth={2.75} />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
