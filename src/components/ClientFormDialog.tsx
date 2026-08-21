import { useState } from 'react';
import { X } from 'lucide-react';

import { clientesService } from '../services/clientes';
import { ApiRequestError } from '../services/api';
import type { Cliente } from '../types/api';
import { formatTelefone } from '../utils/phone';

interface ClientFormDialogProps {
  cliente?: Cliente;
  onClose: () => void;
  onSaved: (cliente: Cliente) => void;
}

export function ClientFormDialog({ cliente, onClose, onSaved }: ClientFormDialogProps) {
  const isEdit = Boolean(cliente);

  const [nome, setNome] = useState(cliente?.nome ?? '');
  const [email, setEmail] = useState(cliente?.email ?? '');
  const [telefone, setTelefone] = useState(formatTelefone(cliente?.telefone ?? ''));
  const [observacoes, setObservacoes] = useState(cliente?.observacoes ?? '');
  const [erros, setErros] = useState<Record<string, string>>({});
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSalvando(true);
    setErros({});
    setErroGeral(null);
    const input = {
      nome,
      email: email || undefined,
      telefone,
      observacoes: observacoes || undefined,
    };
    try {
      const salvo = cliente
        ? await clientesService.atualizar(cliente.id, input)
        : await clientesService.criar(input);
      onSaved(salvo);
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setErros(err.fieldErrors);
        setErroGeral(Object.keys(err.fieldErrors).length === 0 ? err.message : null);
      } else {
        setErroGeral('Não foi possível salvar o cliente');
      }
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="dialog-backdrop" onClick={onClose}>
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center">
          <h2 className="dialog-title">{isEdit ? 'Editar cliente' : 'Novo cliente'}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="ml-auto btn btn-icon btn-ghost"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="field">
            <label>Nome completo</label>
            <input className="input" value={nome} onChange={(e) => setNome(e.target.value)} required />
            {erros.nome && <p className="text-xs text-accent-700 dark:text-accent-300 mt-1">{erros.nome}</p>}
          </div>

          <div className="field">
            <label>Email</label>
            <input
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nome@exemplo.com"
            />
            {erros.email && <p className="text-xs text-accent-700 dark:text-accent-300 mt-1">{erros.email}</p>}
          </div>

          <div className="field">
            <label>Telefone</label>
            <input
              className="input"
              type="tel"
              inputMode="tel"
              value={telefone}
              onChange={(e) => setTelefone(formatTelefone(e.target.value))}
              placeholder="(11) 99999-9999"
              required
            />
            {erros.telefone && <p className="text-xs text-accent-700 dark:text-accent-300 mt-1">{erros.telefone}</p>}
          </div>

          <div className="field">
            <label>Notas</label>
            <textarea
              className="input"
              rows={4}
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
            />
          </div>

          {erroGeral && <p className="text-sm text-accent-700 dark:text-accent-300">{erroGeral}</p>}

          <button type="submit" className="btn btn-primary btn-block" disabled={salvando}>
            {salvando ? 'Salvando…' : 'Salvar cliente'}
          </button>
        </form>
      </div>
    </div>
  );
}
