import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../contexts/auth-context';
import { ApiRequestError } from '../services/api';

export function RegisterPage() {
  const { registrar } = useAuth();
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erros, setErros] = useState<Record<string, string>>({});
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setEnviando(true);
    setErros({});
    setErroGeral(null);
    try {
      await registrar(nome, email, senha);
      navigate('/agenda');
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setErros(err.fieldErrors);
        setErroGeral(Object.keys(err.fieldErrors).length === 0 ? err.message : null);
      } else {
        setErroGeral('Não foi possível criar a conta');
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-[340px] flex flex-col gap-5">
        <Link to="/" className="btn btn-ghost btn-icon -ml-2 self-start" aria-label="Voltar pro início">
          <ArrowLeft size={18} />
        </Link>
        <img src="/favicon.png" alt="Agenda" className="w-11 h-11" />
        <h1 className="text-2xl leading-tight">Criar conta</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="field">
            <label>Nome completo</label>
            <input
              className="input"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              autoFocus
            />
            {erros.nome && <p className="text-xs text-accent-700 dark:text-accent-300 mt-1">{erros.nome}</p>}
          </div>
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {erros.email && <p className="text-xs text-accent-700 dark:text-accent-300 mt-1">{erros.email}</p>}
          </div>
          <div className="field">
            <label>Senha</label>
            <input
              type="password"
              className="input"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              minLength={6}
            />
            {erros.senha && <p className="text-xs text-accent-700 dark:text-accent-300 mt-1">{erros.senha}</p>}
          </div>

          {erroGeral && <p className="text-sm text-accent-700 dark:text-accent-300">{erroGeral}</p>}

          <button type="submit" className="btn btn-primary btn-block" disabled={enviando}>
            {enviando ? 'Criando conta…' : 'Criar conta'}
          </button>
        </form>

        <p className="text-sm text-center text-content-muted">
          Já tem conta?{' '}
          <Link to="/login" className="text-accent-700 dark:text-accent-300 font-semibold">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
