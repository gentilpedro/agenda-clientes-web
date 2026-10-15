import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Field } from '../components/Field';
import { mensagemDoErro } from '../services/api';
import { authService } from '../services/auth';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [linkDev, setLinkDev] = useState<string | null>(null);
  const [enviado, setEnviado] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (enviando) return;
    setEnviando(true);
    setErro(null);
    try {
      const resposta = await authService.esqueciSenha(email.trim());
      setEnviado(true);
      if (resposta.tokenDev) {
        const params = new URLSearchParams({ email, token: resposta.tokenDev });
        setLinkDev(`/redefinir-senha?${params.toString()}`);
      }
    } catch (err) {
      setErro(mensagemDoErro(err, 'Não foi possível processar o pedido. Tente de novo.'));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <main className="w-full max-w-[340px] flex flex-col gap-5">
        <img src="/favicon.svg" alt="" className="w-11 h-11" />
        <div>
          <h1 className="text-2xl leading-tight">Esqueci minha senha</h1>
          <p className="text-sm text-content-muted mt-2">
            Informe seu email — se existir uma conta, você recebe um link de redefinição.
          </p>
        </div>

        {!enviado && (
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
            {erro && (
              <p role="alert" className="form-error">
                {erro}
              </p>
            )}
            <button type="submit" className="btn btn-primary btn-block" disabled={enviando}>
              {enviando ? 'Enviando…' : 'Enviar link'}
            </button>
          </form>
        )}

        {enviado && (
          <div role="status" className="card gap-3">
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
          <Link to="/login" className="text-accent-ink font-semibold underline-offset-4 hover:underline">
            Voltar para o login
          </Link>
        </p>
      </main>
    </div>
  );
}
