import { useEffect, useId, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface DialogProps {
  titulo: string;
  onClose: () => void;
  children: ReactNode;
}

/**
 * Modal sobre o <dialog> nativo aberto com showModal(): o navegador prende o
 * foco, fecha no Esc e deixa o resto da página inerte. Ao desmontar, devolve o
 * foco para quem abriu. No celular vira folha presa ao rodapé (ver .dialog).
 */
export function Dialog({ titulo, onClose, children }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const tituloId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const anterior = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialog.showModal();
    return () => {
      dialog.close();
      anterior?.focus();
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="dialog"
      aria-labelledby={tituloId}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        // O padding fica no .dialog-body: clique no próprio <dialog> é clique no véu.
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="dialog-body">
        <div className="flex items-center">
          <h2 id={tituloId} className="dialog-title">
            {titulo}
          </h2>
          <button type="button" onClick={onClose} aria-label="Fechar" className="ml-auto btn btn-icon btn-ghost">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
