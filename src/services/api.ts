// A API é a agenda-clientes-api (Spring Boot), que sobe em http://localhost:8080
// com os endpoints sob /api. Configure o endereço em VITE_API_URL (.env).
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

interface RequestOptions extends RequestInit {
  params?: Record<string, unknown>;
}

export class ApiRequestError extends Error {
  status: number;
  fieldErrors: Record<string, string>;

  constructor(message: string, status: number, fieldErrors: Record<string, string> = {}) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

/** Formato de erro padrão da API (`ApiError`). */
interface ApiErrorBody {
  message?: string;
  fieldErrors?: Record<string, string>;
}

/** Status usado quando a requisição nem chegou na API (API fora do ar, DNS, CORS). */
export const STATUS_SEM_CONEXAO = 0;

const MENSAGEM_SESSAO_EXPIRADA = 'Sua sessão expirou. Entre novamente.';

export function mensagemDoErro(erro: unknown, fallback: string): string {
  return erro instanceof ApiRequestError ? erro.message : fallback;
}

/**
 * Os endpoints de autenticação são públicos na API: um 401 vindo deles é
 * credencial errada (ou link de redefinição inválido), não sessão expirada —
 * quem trata é o formulário, sem derrubar a sessão.
 */
function ehEndpointDeAutenticacao(endpoint: string): boolean {
  return endpoint.startsWith('/auth/');
}

/**
 * A API usa Spring Security com o entry point padrão, que responde **403**
 * quando o token está ausente, expirado ou inválido — não 401. Os dois status
 * são tratados como sessão expirada nos endpoints protegidos.
 */
function ehSessaoExpirada(endpoint: string, status: number): boolean {
  return (status === 401 || status === 403) && !ehEndpointDeAutenticacao(endpoint);
}

class ApiService {
  private baseURL: string;
  private token: string | null = null;
  private onSessionExpired: (() => void) | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  hasToken(): boolean {
    return this.token !== null;
  }

  /**
   * Registrado pelo AuthProvider: quando a API recusa o token, a sessão é
   * encerrada no contexto e o redirecionamento fica a cargo do router
   * (ProtectedRoute), sem `window.location`.
   */
  setSessionExpiredHandler(handler: (() => void) | null) {
    this.onSessionExpired = handler;
  }

  private buildUrl(endpoint: string, params?: Record<string, unknown>): string {
    let url = `${this.baseURL}${endpoint}`;

    if (params) {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
      const queryString = queryParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    return url;
  }

  private buildHeaders(temCorpo: boolean, extras?: HeadersInit): Headers {
    const headers = new Headers(extras);

    if (temCorpo && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    if (this.token) {
      headers.set('Authorization', `Bearer ${this.token}`);
    }

    return headers;
  }

  private async lerErro(response: Response, sessaoExpirada: boolean): Promise<ApiRequestError> {
    // Respostas 403 do Spring Security vêm sem corpo; as demais seguem o ApiError.
    const corpo: ApiErrorBody = await response.json().catch(() => ({}));
    const mensagem =
      corpo.message ||
      (sessaoExpirada ? MENSAGEM_SESSAO_EXPIRADA : response.statusText) ||
      `Erro HTTP ${response.status}`;

    return new ApiRequestError(mensagem, response.status, corpo.fieldErrors || {});
  }

  async request<T = unknown>(endpoint: string, options?: RequestOptions): Promise<T> {
    const { params, headers, ...fetchOptions } = options || {};
    const url = this.buildUrl(endpoint, params);

    let response: Response;
    try {
      response = await fetch(url, {
        ...fetchOptions,
        headers: this.buildHeaders(fetchOptions.body != null, headers),
      });
    } catch {
      throw new ApiRequestError(
        `Não foi possível falar com a API em ${this.baseURL}. Verifique se ela está no ar.`,
        STATUS_SEM_CONEXAO,
      );
    }

    if (!response.ok) {
      const sessaoExpirada = ehSessaoExpirada(endpoint, response.status);
      if (sessaoExpirada) {
        this.clearToken();
        this.onSessionExpired?.();
      }

      throw await this.lerErro(response, sessaoExpirada);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    const text = await response.text();
    return (text ? JSON.parse(text) : undefined) as T;
  }

  get<T = unknown>(endpoint: string, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T = unknown>(endpoint: string, data?: unknown, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(data) });
  }

  put<T = unknown>(endpoint: string, data?: unknown, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(data) });
  }

  patch<T = unknown>(endpoint: string, data?: unknown, options?: RequestOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      ...(data === undefined ? {} : { body: JSON.stringify(data) }),
    });
  }

  delete<T = unknown>(endpoint: string, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const api = new ApiService();
