import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ErrorState } from '../components/ErrorState';
import { clientesService } from '../services/clientes';
import { ApiRequestError, mensagemDoErro } from '../services/api';

export function ClientFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [erros, setErros] = useState<Record<string, string>>({});
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [tentativa, setTentativa] = useState(0);
  // Chave da tentativa que terminou de carregar; enquanto não bate com a atual,
  // o formulário está carregando — loading derivado, sem setState no efeito.
  const [carga, setCarga] = useState<{ chave: number; erro: string | null } | null>(null);

  useEffect(() => {
    if (!id) return;
    let ignore = false;
    const chave = tentativa;
    clientesService
      .buscarPorId(id)
      .then((cliente) => {
        if (ignore) return;
        setNome(cliente.nome);
        setEmail(cliente.email ?? '');
        setTelefone(cliente.telefone);
        setObservacoes(cliente.observacoes ?? '');
        setCarga({ chave, erro: null });
      })
      .catch((err: unknown) => {
        if (ignore) return;
        setCarga({ chave, erro: mensagemDoErro(err, 'Não foi possível carregar o cliente.') });
      });
    return () => {
      ignore = true;
    };
  }, [id, tentativa]);

  const carregando = isEdit && carga?.chave !== tentativa;
  const erroCarga = carregando ? null : carga?.erro ?? null;

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
      const salvo = id
        ? await clientesService.atualizar(id, input)
        : await clientesService.criar(input);
      navigate(`/clientes/${salvo.id}`);
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

  if (carregando) {
    return <p className="text-content-muted text-sm">Carregando…</p>;
  }

  if (erroCarga) {
    return <ErrorState mensagem={erroCarga} onTentarDeNovo={() => setTentativa((n) => n + 1)} />;
  }

  return (
    <div className="flex flex-col gap-5 max-w-xl">
      <div>
        <p className="text-xs text-content-muted mb-1">Clientes › {isEdit ? 'Editar' : 'Novo'}</p>
        <h1 className="text-2xl md:text-3xl">{isEdit ? 'Editar cliente' : 'Novo cliente'}</h1>
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
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            placeholder="+55 11 99999-9999"
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

        <div className="flex gap-2 justify-end">
          <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary" disabled={salvando}>
            {salvando ? 'Salvando…' : 'Salvar cliente'}
          </button>
        </div>
      </form>
    </div>
  );
}
