export interface Cliente {
  id: string;
  nome: string;
  email: string | null;
  telefone: string;
  observacoes: string | null;
  criadoEm: string;
}

export interface ClienteInput {
  nome: string;
  email?: string;
  telefone: string;
  observacoes?: string;
}

export type AgendamentoStatus = 'AGENDADO' | 'CANCELADO' | 'CONCLUIDO';

export interface Agendamento {
  id: string;
  clienteId: string;
  dataHora: string;
  duracaoMinutos: number;
  status: AgendamentoStatus;
  observacoes: string | null;
  confirmado: boolean;
  lembreteEnviadoEm: string | null;
}

export interface AgendamentoInput {
  clienteId: string;
  dataHora: string;
  duracaoMinutos: number;
  observacoes?: string;
}

/**
 * Sessão local do usuário logado. Guarda só o id — nome e email não são
 * exibidos em lugar nenhum da UI hoje, e o e-mail já fica no payload do JWT
 * (que tampouco é criptografado); não há motivo pra duplicar essa
 * informação em texto plano no localStorage.
 */
export interface Usuario {
  id: string;
}

export interface AuthResponse {
  token: string;
  id: string;
  nome: string;
  email: string;
}

export interface ApiError {
  timestamp: string;
  status: number;
  message: string;
  fieldErrors: Record<string, string>;
}

export type WhatsappTemplateStatus = 'PENDENTE' | 'APROVADO' | 'REJEITADO';

export interface WhatsappStatus {
  conectado: boolean;
  numeroExibicao: string | null;
  conectadoEm: string | null;
  templateStatus: WhatsappTemplateStatus | null;
}

export interface WhatsappConectarInput {
  code: string;
  wabaId: string;
  phoneNumberId: string;
}
