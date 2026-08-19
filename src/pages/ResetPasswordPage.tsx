import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { authService } from '../services/auth';
import { ApiRequestError } from '../services/api';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get('email') ?? '';
  const token = searchParams.get('token') ?? '';

  const [novaSenha, setNovaSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setEnviando(true);
    setErro(null);
    try {
      await authService.redefinirSenha(email, token, novaSenha);
      navigate('/login');
    } catch (err) {
      setErro(err instanceof ApiRequestError ? err.message : 'Não foi possível redefinir a senha');
    } finally {
      setEnviando(false);
    }
  }

  if (!email || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-[340px] flex flex-col gap-4 text-center">
          <p className="text-sm text-content-muted">Link de redefinição inválido.</p>
          <Link to="/esqueci-senha" className="btn btn-primary">
            Pedir novo link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-[340px] flex flex-col gap-5">
        <span className="w-11 h-11 rounded-full bg-accent" />
        <div>
          <h1 className="text-2xl leading-tight">Nova senha</h1>
          <p className="text-sm text-content-muted mt-2">para {email}</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="field">
            <label>Nova senha</label>
            <input
              type="password"
              className="input"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              required
              minLength={6}
              autoFocus
            />
          </div>

          {erro && <p className="text-sm text-accent-700 dark:text-accent-300">{erro}</p>}

          <button type="submit" className="btn btn-primary btn-block" disabled={enviando}>
            {enviando ? 'Salvando…' : 'Redefinir senha'}
          </button>
        </form>
      </div>
    </div>
  );
}
