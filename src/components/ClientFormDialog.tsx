import { useState } from 'react';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

import { clientesService } from '../services/clientes';
import { ApiRequestError, mensagemDoErro } from '../services/api';
import type { Cliente } from '../types/api';
import { Dialog } from './Dialog';
import { Field } from './Field';

/** Telefones antigos foram salvos sem "+" (formato local BR). Prefixa com +55
 * pra a lib reconhecer o país; números já internacionais passam direto. */
function paraFormatoInternacional(telefone: string): string {
  if (!telefone) return '';
  return telefone.startsWith('+') ? telefone : `+55${telefone.replace(/\D/g, '')}`;
}

interface ClientFormDialogProps {
  cliente?: Cliente;
  onClose: () => void;
  onSaved: (cliente: Cliente) => void;
}

export function ClientFormDialog({ cliente, onClose, onSaved }: ClientFormDialogProps) {
  const isEdit = Boolean(cliente);

  const [nome, setNome] = useState(cliente?.nome ?? '');
  const [email, setEmail] = useState(cliente?.email ?? '');
  const [telefone, setTelefone] = useState(paraFormatoInternacional(cliente?.telefone ?? ''));
  const [observacoes, setObservacoes] = useState(cliente?.observacoes ?? '');
  const [erros, setErros] = useState<Record<string, string>>({});
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (salvando) return;
    setSalvando(true);
    setErros({});
    setErroGeral(null);
    const input = {
      nome: nome.trim(),
      email: email.trim() || undefined,
      telefone,
      observacoes: observacoes.trim() || undefined,
    };
    try {
      const salvo = cliente
        ? await clientesService.atualizar(cliente.id, input)
        : await clientesService.criar(input);
      onSaved(salvo);
    } catch (err) {
      const fieldErrors = err instanceof ApiRequestError ? err.fieldErrors : {};
      setErros(fieldErrors);
      setErroGeral(
        Object.keys(fieldErrors).length > 0
          ? 'Revise os campos destacados.'
          : mensagemDoErro(err, 'Não foi possível salvar o cliente. Seus dados continuam aqui; tente de novo.'),
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Dialog titulo={isEdit ? 'Editar cliente' : 'Novo cliente'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Nome completo" error={erros.nome}>
          {(control) => (
            <input
              {...control}
              className="input"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              autoComplete="off"
              required
              autoFocus
            />
          )}
        </Field>

        <Field label="Email (opcional)" error={erros.email}>
          {(control) => (
            <input
              {...control}
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nome@exemplo.com"
              autoComplete="off"
            />
          )}
        </Field>

        <Field label="Telefone" error={erros.telefone}>
          {(control) => (
            <PhoneInput
              className="phone-input"
              inputClassName="input"
              defaultCountry="br"
              value={telefone}
              onChange={setTelefone}
              inputProps={{ ...control, required: true, name: 'telefone', autoComplete: 'off' }}
            />
          )}
        </Field>

        <Field label="Notas (opcional)" error={erros.observacoes}>
          {(control) => (
            <textarea
              {...control}
              className="input"
              rows={4}
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
            />
          )}
        </Field>

        {erroGeral && (
          <p role="alert" className="form-error">
            {erroGeral}
          </p>
        )}

        <button type="submit" className="btn btn-primary btn-block" disabled={salvando}>
          {salvando ? 'Salvando…' : 'Salvar cliente'}
        </button>
      </form>
    </Dialog>
  );
}
