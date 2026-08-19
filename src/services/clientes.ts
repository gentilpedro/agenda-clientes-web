import { api } from './api';
import type { Cliente, ClienteInput } from '../types/api';

export const clientesService = {
  listar: () => api.get<Cliente[]>('/clientes'),
  buscarPorId: (id: string) => api.get<Cliente>(`/clientes/${id}`),
  criar: (input: ClienteInput) => api.post<Cliente>('/clientes', input),
  atualizar: (id: string, input: ClienteInput) => api.put<Cliente>(`/clientes/${id}`, input),
  remover: (id: string) => api.delete<void>(`/clientes/${id}`),
};
