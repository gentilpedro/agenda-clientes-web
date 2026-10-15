import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { Field } from '../components/Field';
import { mensagemDoErro } from '../services/api';
import { authService } from '../services/auth';

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
    if (enviando) return;
    setEnviando(true);
    setErro(null);
    try {
      await authService.redefinirSenha(email, token, novaSenha);
      navigate('/login');
    } catch (err) {
      setErro(mensagemDoErro(err, 'Não foi possível redefinir a senha. Tente de novo.'));
    } finally {
      setEnviando(false);
    }
  }

  if (!email || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <main className="w-full max-w-[340px] flex flex-col gap-4 text-center">
          <h1 className="text-2xl leading-tight">Link inválido</h1>
          <p className="text-sm text-content-muted">Este link de redefinição está incompleto. Peça um novo para continuar.</p>
          <Link to="/esqueci-senha" className="btn btn-primary">
            Pedir novo link
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <main className="w-full max-w-[340px] flex flex-col gap-5">
        <img src="/favicon.svg" alt="" className="w-11 h-11" />
        <div>
          <h1 className="text-2xl leading-tight">Nova senha</h1>
          <p className="text-sm text-content-muted mt-2 [overflow-wrap:anywhere]">para {email}</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Field label="Nova senha" hint="Pelo menos 6 caracteres.">
            {(control) => (
              <input
                {...control}
                type="password"
                className="input"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                autoComplete="new-password"
                required
                minLength={6}
                autoFocus
              />
            )}
          </Field>

          {erro && (
            <p role="alert" className="form-error">
              {erro}
            </p>
          )}

          <button type="submit" className="btn btn-primary btn-block" disabled={enviando}>
            {enviando ? 'Salvando…' : 'Redefinir senha'}
          </button>
        </form>
      </main>
    </div>
  );
}
