import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../contexts/auth-context';
import { ApiRequestError } from '../services/api';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setEnviando(true);
    setErro(null);
    try {
      await login(email, senha);
      navigate('/agenda');
    } catch (err) {
      setErro(err instanceof ApiRequestError ? err.message : 'Não foi possível entrar');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-[340px] flex flex-col gap-5">
        <span className="w-11 h-11 rounded-full bg-accent" />
        <h1 className="text-2xl leading-tight">
          Sua agenda,
          <br />
          em um só lugar
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="field">
            <label>Senha</label>
            <input
              type="password"
              className="input"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          {erro && <p className="text-sm text-accent-700 dark:text-accent-300">{erro}</p>}

          <button type="submit" className="btn btn-primary btn-block" disabled={enviando}>
            {enviando ? 'Entrando…' : 'Entrar'}
          </button>
        </form>

        <div className="flex flex-col gap-1 text-sm text-center">
          <Link to="/esqueci-senha" className="text-content-muted hover:text-accent">
            Esqueci minha senha
          </Link>
          <span className="text-content-muted">
            Não tem conta?{' '}
            <Link to="/cadastro" className="text-accent-700 dark:text-accent-300 font-semibold">
              Cadastre-se
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
