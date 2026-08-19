import { api } from './api';
import type { Agendamento, AgendamentoInput } from '../types/api';

export const agendamentosService = {
  listar: () => api.get<Agendamento[]>('/agendamentos'),
  listarPorData: (data: string) => api.get<Agendamento[]>('/agendamentos', { params: { data } }),
  buscarPorId: (id: string) => api.get<Agendamento>(`/agendamentos/${id}`),
  criar: (input: AgendamentoInput) => api.post<Agendamento>('/agendamentos', input),
  atualizar: (id: string, input: AgendamentoInput) => api.put<Agendamento>(`/agendamentos/${id}`, input),
  cancelar: (id: string) => api.request<Agendamento>(`/agendamentos/${id}/cancelar`, { method: 'PATCH' }),
  concluir: (id: string) => api.request<Agendamento>(`/agendamentos/${id}/concluir`, { method: 'PATCH' }),
  remover: (id: string) => api.delete<void>(`/agendamentos/${id}`),
};
