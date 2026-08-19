import { useState, type ReactNode } from 'react';

import { api } from '../services/api';
import { authService } from '../services/auth';
import type { AuthResponse, Usuario } from '../types/api';
import { AuthContext, USUARIO_STORAGE_KEY } from './auth-context';

function readStoredUsuario(): Usuario | null {
  try {
    const raw = localStorage.getItem(USUARIO_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Usuario) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(readStoredUsuario);

  function persistirSessao(resposta: AuthResponse) {
    api.setToken(resposta.token);
    const logado: Usuario = { id: resposta.id, nome: resposta.nome, email: resposta.email };
    localStorage.setItem(USUARIO_STORAGE_KEY, JSON.stringify(logado));
    setUsuario(logado);
  }

  async function login(email: string, senha: string) {
    persistirSessao(await authService.login(email, senha));
  }

  async function registrar(nome: string, email: string, senha: string) {
    persistirSessao(await authService.registrar(nome, email, senha));
  }

  function logout() {
    api.clearToken();
    localStorage.removeItem(USUARIO_STORAGE_KEY);
    setUsuario(null);
  }

  return <AuthContext value={{ usuario, login, registrar, logout }}>{children}</AuthContext>;
}
