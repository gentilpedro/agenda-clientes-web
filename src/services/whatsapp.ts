import { api } from './api';
import type { WhatsappConectarInput, WhatsappStatus } from '../types/api';

export const whatsappService = {
  status: () => api.get<WhatsappStatus>('/whatsapp/status'),
  conectar: (input: WhatsappConectarInput) => api.post<WhatsappStatus>('/whatsapp/conectar', input),
  desconectar: () => api.delete<void>('/whatsapp'),
};
