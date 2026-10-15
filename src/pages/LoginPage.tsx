import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { Field } from '../components/Field';
import { useAuth } from '../contexts/auth-context';
import { mensagemDoErro } from '../services/api';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (enviando) return;
    setEnviando(true);
    setErro(null);
    try {
      await login(email.trim(), senha);
      navigate('/agenda');
    } catch (err) {
      setErro(mensagemDoErro(err, 'Não foi possível entrar. Tente de novo.'));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <main className="w-full max-w-[340px] flex flex-col gap-5">
        <Link to="/" className="btn btn-ghost btn-icon -ml-2 self-start" aria-label="Voltar pro início">
          <ArrowLeft size={18} />
        </Link>
        <img src="/favicon.svg" alt="" className="w-11 h-11" />
        <h1 className="text-2xl leading-tight">
          Sua agenda,
          <br />
          em um só lugar
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Field label="Email">
            {(control) => (
              <input
                {...control}
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                autoFocus
              />
            )}
          </Field>
          <Field label="Senha">
            {(control) => (
              <input
                {...control}
                type="password"
                className="input"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                autoComplete="current-password"
                required
              />
            )}
          </Field>

          {erro && (
            <p role="alert" className="form-error">
              {erro}
            </p>
          )}

          <button type="submit" className="btn btn-primary btn-block" disabled={enviando}>
            {enviando ? 'Entrando…' : 'Entrar'}
          </button>
        </form>

        <div className="flex flex-col gap-1 text-sm text-center">
          <Link to="/esqueci-senha" className="text-content-muted hover:text-accent-ink">
            Esqueci minha senha
          </Link>
          <span className="text-content-muted">
            Não tem conta?{' '}
            <Link to="/cadastro" className="text-accent-ink font-semibold underline-offset-4 hover:underline">
              Cadastre-se
            </Link>
          </span>
        </div>
      </main>
    </div>
  );
}
