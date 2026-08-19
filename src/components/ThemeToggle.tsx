import { Moon, Sun } from 'lucide-react';

import { useTheme } from '../contexts/theme-context';

export function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const label = isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={label}
      aria-label={label}
      aria-pressed={isDark}
      className="cursor-pointer rounded-full p-2 text-content-muted transition-colors hover:bg-accent-100 dark:hover:bg-accent-900"
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
