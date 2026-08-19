import { api } from './api';
import type { AuthResponse } from '../types/api';

export interface EsqueciSenhaResponse {
  mensagem: string;
  tokenDev: string | null;
}

export const authService = {
  registrar: (nome: string, email: string, senha: string) =>
    api.post<AuthResponse>('/auth/registrar', { nome, email, senha }),

  login: (email: string, senha: string) => api.post<AuthResponse>('/auth/login', { email, senha }),

  esqueciSenha: (email: string) => api.post<EsqueciSenhaResponse>('/auth/esqueci-senha', { email }),

  redefinirSenha: (email: string, token: string, novaSenha: string) =>
    api.post<void>('/auth/redefinir-senha', { email, token, novaSenha }),
};
