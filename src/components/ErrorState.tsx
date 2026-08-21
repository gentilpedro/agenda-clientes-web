import { AlertTriangle } from 'lucide-react';

interface ErrorStateProps {
  mensagem: string;
  onTentarDeNovo?: () => void;
}

/** Estado de erro das telas que consomem a API: mensagem + ação de recuperação. */
export function ErrorState({ mensagem, onTentarDeNovo }: ErrorStateProps) {
  return (
    <div role="alert" className="card items-center text-center py-8 gap-2 border-dashed max-w-md w-full">
      <AlertTriangle size={20} className="text-accent-700 dark:text-accent-300" aria-hidden="true" />
      <p className="font-semibold">Algo deu errado</p>
      <p className="text-sm text-content-muted">{mensagem}</p>
      {onTentarDeNovo && (
        <button type="button" className="btn btn-secondary mt-2" onClick={onTentarDeNovo}>
          Tentar de novo
        </button>
      )}
    </div>
  );
}
