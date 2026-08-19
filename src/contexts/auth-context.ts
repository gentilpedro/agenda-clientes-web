import { createContext, useContext } from 'react';

import type { Usuario } from '../types/api';

export interface AuthContextValue {
  usuario: Usuario | null;
  login: (email: string, senha: string) => Promise<void>;
  registrar: (nome: string, email: string, senha: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return ctx;
}

export const USUARIO_STORAGE_KEY = 'usuario';
