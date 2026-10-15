import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { Field } from '../components/Field';
import { useAuth } from '../contexts/auth-context';
import { ApiRequestError, mensagemDoErro } from '../services/api';

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
    if (enviando) return;
    setEnviando(true);
    setErros({});
    setErroGeral(null);
    try {
      await registrar(nome.trim(), email.trim(), senha);
      navigate('/agenda');
    } catch (err) {
      const fieldErrors = err instanceof ApiRequestError ? err.fieldErrors : {};
      setErros(fieldErrors);
      setErroGeral(
        Object.keys(fieldErrors).length > 0
          ? 'Revise os campos destacados.'
          : mensagemDoErro(err, 'Não foi possível criar a conta. Tente de novo.'),
      );
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
        <h1 className="text-2xl leading-tight">Criar conta</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Field label="Nome completo" error={erros.nome}>
            {(control) => (
              <input
                {...control}
                className="input"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                autoComplete="name"
                required
                autoFocus
              />
            )}
          </Field>
          <Field label="Email" error={erros.email}>
            {(control) => (
              <input
                {...control}
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            )}
          </Field>
          <Field label="Senha" hint="Pelo menos 6 caracteres." error={erros.senha}>
            {(control) => (
              <input
                {...control}
                type="password"
                className="input"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                autoComplete="new-password"
                required
                minLength={6}
              />
            )}
          </Field>

          {erroGeral && (
            <p role="alert" className="form-error">
              {erroGeral}
            </p>
          )}

          <button type="submit" className="btn btn-primary btn-block" disabled={enviando}>
            {enviando ? 'Criando conta…' : 'Criar conta'}
          </button>
        </form>

        <p className="text-sm text-center text-content-muted">
          Já tem conta?{' '}
          <Link to="/login" className="text-accent-ink font-semibold underline-offset-4 hover:underline">
            Entrar
          </Link>
        </p>
      </main>
    </div>
  );
}
