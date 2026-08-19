import { useState } from 'react';
import { Link } from 'react-router-dom';

import { authService } from '../services/auth';
import { ApiRequestError } from '../services/api';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [linkDev, setLinkDev] = useState<string | null>(null);
  const [enviado, setEnviado] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setEnviando(true);
    setErro(null);
    try {
      const resposta = await authService.esqueciSenha(email);
      setEnviado(true);
      if (resposta.tokenDev) {
        const params = new URLSearchParams({ email, token: resposta.tokenDev });
        setLinkDev(`/redefinir-senha?${params.toString()}`);
      }
    } catch (err) {
      setErro(err instanceof ApiRequestError ? err.message : 'Não foi possível processar o pedido');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-[340px] flex flex-col gap-5">
        <span className="w-11 h-11 rounded-full bg-accent" />
        <div>
          <h1 className="text-2xl leading-tight">Esqueci minha senha</h1>
          <p className="text-sm text-content-muted mt-2">
            Informe seu email — se existir uma conta, você recebe um link de redefinição.
          </p>
        </div>

        {!enviado && (
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
            {erro && <p className="text-sm text-accent-700 dark:text-accent-300">{erro}</p>}
            <button type="submit" className="btn btn-primary btn-block" disabled={enviando}>
              {enviando ? 'Enviando…' : 'Enviar link'}
            </button>
          </form>
        )}

        {enviado && (
          <div className="card gap-3">
            <p className="text-sm">Se o email existir, um link de redefinição foi gerado.</p>
            {linkDev && (
              <div className="flex flex-col gap-2 text-xs">
                <p className="text-content-muted">
                  Modo de desenvolvimento — ainda não há envio de email configurado, então o link
                  aparece aqui em vez de na sua caixa de entrada:
                </p>
                <Link to={linkDev} className="btn btn-secondary break-all">
                  Abrir link de redefinição
                </Link>
              </div>
            )}
          </div>
        )}

        <p className="text-sm text-center text-content-muted">
          <Link to="/login" className="text-accent-700 dark:text-accent-300 font-semibold">
            Voltar para o login
          </Link>
        </p>
      </div>
    </div>
  );
}
