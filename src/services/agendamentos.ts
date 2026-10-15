import { api } from './api';
import type { Agendamento, AgendamentoInput } from '../types/api';

export const agendamentosService = {
  listar: () => api.get<Agendamento[]>('/agendamentos'),
  listarPorData: (data: string) => api.get<Agendamento[]>('/agendamentos', { params: { data } }),
  // A API ainda ignora `clienteId` e devolve tudo; o filtro local mantém o
  // resultado correto até ela passar a filtrar no servidor.
  listarPorCliente: async (clienteId: string) =>
    (await api.get<Agendamento[]>('/agendamentos', { params: { clienteId } })).filter((a) => a.clienteId === clienteId),
  buscarPorId: (id: string) => api.get<Agendamento>(`/agendamentos/${id}`),
  criar: (input: AgendamentoInput) => api.post<Agendamento>('/agendamentos', input),
  atualizar: (id: string, input: AgendamentoInput) => api.put<Agendamento>(`/agendamentos/${id}`, input),
  cancelar: (id: string) => api.patch<Agendamento>(`/agendamentos/${id}/cancelar`),
  concluir: (id: string) => api.patch<Agendamento>(`/agendamentos/${id}/concluir`),
  remover: (id: string) => api.delete<void>(`/agendamentos/${id}`),
};
