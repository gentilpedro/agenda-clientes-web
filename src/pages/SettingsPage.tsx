import { useEffect, useRef, useState } from 'react';
import { MessageCircle } from 'lucide-react';

import { ErrorState } from '../components/ErrorState';
import { mensagemDoErro } from '../services/api';
import { whatsappService } from '../services/whatsapp';
import type { WhatsappStatus, WhatsappTemplateStatus } from '../types/api';

const FACEBOOK_APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID as string | undefined;
const FACEBOOK_CONFIG_ID = import.meta.env.VITE_FACEBOOK_CONFIG_ID as string | undefined;
const FACEBOOK_SDK_URL = 'https://connect.facebook.net/en_US/sdk.js';

const TEMPLATE_STATUS_CONFIG: Record<WhatsappTemplateStatus, { label: string; className: string }> = {
  PENDENTE: { label: 'Modelo em análise', className: 'tag-outline' },
  APROVADO: { label: 'Modelo aprovado', className: 'tag-accent-2' },
  REJEITADO: { label: 'Modelo rejeitado', className: 'tag-neutral' },
};

interface FacebookLoginResponse {
  authResponse?: {
    code?: string;
  };
}

interface FacebookLoginOptions {
  config_id: string;
  response_type: string;
  override_default_response_type: boolean;
  extras: { featureType: string; sessionInfoVersion: string };
}

interface FacebookSdk {
  init: (params: { appId: string; version: string; xfbml: boolean }) => void;
  login: (callback: (response: FacebookLoginResponse) => void, options: FacebookLoginOptions) => void;
}

declare global {
  interface Window {
    FB?: FacebookSdk;
    fbAsyncInit?: () => void;
  }
}

interface DadosEmbeddedSignup {
  wabaId: string;
  phoneNumberId: string;
}

/**
 * O evento `WA_EMBEDDED_SIGNUP` chega via `postMessage` do iframe da Meta —
 * dado externo, não confiamos no formato sem checar antes de usar.
 */
function extrairDadosEmbeddedSignup(data: unknown): DadosEmbeddedSignup | null {
  if (typeof data !== 'object' || data === null) return null;
  const evento = data as Record<string, unknown>;
  if (evento.type !== 'WA_EMBEDDED_SIGNUP') return null;

  const payload = evento.data;
  if (typeof payload !== 'object' || payload === null) return null;
  const info = payload as Record<string, unknown>;

  const wabaId = info.waba_id;
  const phoneNumberId = info.phone_number_id;
  if (typeof wabaId !== 'string' || typeof phoneNumberId !== 'string') return null;

  return { wabaId, phoneNumberId };
}

/**
 * Resultado da busca do status. A chave é o número da tentativa: enquanto não
 * bate com a atual, a tela está carregando — loading derivado, sem setState
 * no efeito (mesmo padrão de ClientDetailPage/ClientsPage).
 */
interface StatusCarregado {
  chave: number;
  status: WhatsappStatus | null;
  erro: string | null;
}

const PODE_CONECTAR = Boolean(FACEBOOK_APP_ID && FACEBOOK_CONFIG_ID);

export function SettingsPage() {
  const [tentativa, setTentativa] = useState(0);
  const [resultado, setResultado] = useState<StatusCarregado | null>(null);
  const [sdkPronto, setSdkPronto] = useState(() => Boolean(PODE_CONECTAR && window.FB));
  const [conectando, setConectando] = useState(false);
  const [erroConexao, setErroConexao] = useState<string | null>(null);
  // Código (callback do FB.login) e ids da WABA (postMessage) chegam de forma
  // assíncrona e em qualquer ordem — refs porque só interessam pra decidir
  // quando disparar a conexão, não pro que é renderizado.
  const codigoRef = useRef<string | null>(null);
  const dadosRef = useRef<DadosEmbeddedSignup | null>(null);

  useEffect(() => {
    let ignore = false;
    const chave = tentativa;
    whatsappService
      .status()
      .then((status) => {
        if (!ignore) setResultado({ chave, status, erro: null });
      })
      .catch((err: unknown) => {
        if (ignore) return;
        setResultado({
          chave,
          status: null,
          erro: mensagemDoErro(err, 'Não foi possível carregar o status do WhatsApp.'),
        });
      });
    return () => {
      ignore = true;
    };
  }, [tentativa]);

  // Carrega o SDK do Facebook só nesta página (não em index.html) — evita
  // baixar o script da Meta pra quem nunca visita Configurações.
  useEffect(() => {
    if (!PODE_CONECTAR || window.FB) return;

    window.fbAsyncInit = () => {
      window.FB?.init({ appId: FACEBOOK_APP_ID as string, version: 'v21.0', xfbml: false });
      setSdkPronto(true);
    };

    const script = document.createElement('script');
    script.src = FACEBOOK_SDK_URL;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  function tentarFinalizarConexao() {
    const code = codigoRef.current;
    const dados = dadosRef.current;
    if (!code || !dados) return;

    setConectando(true);
    setErroConexao(null);
    whatsappService
      .conectar({ code, wabaId: dados.wabaId, phoneNumberId: dados.phoneNumberId })
      .then((status) => {
        setResultado((atual) => (atual ? { ...atual, status } : atual));
      })
      .catch((err: unknown) => {
        setErroConexao(mensagemDoErro(err, 'Não foi possível concluir a conexão com o WhatsApp.'));
      })
      .finally(() => {
        codigoRef.current = null;
        dadosRef.current = null;
        setConectando(false);
      });
  }

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.origin !== 'https://www.facebook.com') return;
      const dados = extrairDadosEmbeddedSignup(event.data);
      if (dados) {
        dadosRef.current = dados;
        tentarFinalizarConexao();
      }
    }
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  function iniciarConexao() {
    if (!PODE_CONECTAR) return;
    if (!window.FB) {
      setErroConexao('O componente de conexão ainda está carregando — tenta de novo em alguns segundos.');
      return;
    }
    setErroConexao(null);
    window.FB.login(
      (response) => {
        const code = response.authResponse?.code;
        if (code) {
          codigoRef.current = code;
          tentarFinalizarConexao();
        }
      },
      {
        config_id: FACEBOOK_CONFIG_ID as string,
        response_type: 'code',
        override_default_response_type: true,
        extras: { featureType: 'whatsapp_business_app_onboarding', sessionInfoVersion: '3' },
      },
    );
  }

  async function desconectar() {
    if (!window.confirm('Desconectar o WhatsApp deste consultório? Os lembretes automáticos param de ser enviados.')) {
      return;
    }
    setErroConexao(null);
    try {
      await whatsappService.desconectar();
      setResultado((atual) =>
        atual && atual.status
          ? { ...atual, status: { conectado: false, numeroExibicao: null, conectadoEm: null, templateStatus: null } }
          : atual,
      );
    } catch (err) {
      setErroConexao(mensagemDoErro(err, 'Não foi possível desconectar o WhatsApp.'));
    }
  }

  const carregando = resultado?.chave !== tentativa;
  const status = carregando ? null : resultado?.status ?? null;
  const erroCarga = carregando ? null : resultado?.erro ?? null;

  return (
    <div className="flex flex-col gap-5 max-w-xl">
      <h1 className="text-2xl md:text-3xl">Configurações</h1>

      {carregando && <p className="text-content-muted text-sm">Carregando…</p>}

      {erroCarga && <ErrorState mensagem={erroCarga} onTentarDeNovo={() => setTentativa((n) => n + 1)} />}

      {status && (
        <div className="card gap-4">
          <div className="flex items-center gap-2">
            <MessageCircle size={18} className="text-accent" aria-hidden="true" />
            <p className="card-title text-base">WhatsApp Business</p>
          </div>

          {status.conectado ? (
            <>
              <div className="flex flex-col gap-1 text-sm">
                <span className="font-semibold">{status.numeroExibicao}</span>
                {status.conectadoEm && (
                  <span className="text-content-muted">
                    Conectado desde {new Date(status.conectadoEm).toLocaleDateString('pt-BR')}
                  </span>
                )}
              </div>
              {status.templateStatus && (
                <span className={`tag ${TEMPLATE_STATUS_CONFIG[status.templateStatus].className} self-start`}>
                  {TEMPLATE_STATUS_CONFIG[status.templateStatus].label}
                </span>
              )}
              {erroConexao && (
                <p role="alert" className="text-sm text-accent-700 dark:text-accent-300">
                  {erroConexao}
                </p>
              )}
              <button type="button" className="btn btn-secondary self-start" onClick={desconectar}>
                Desconectar
              </button>
            </>
          ) : (
            <>
              <p className="text-sm text-content-muted">
                Conecte o WhatsApp Business deste consultório pra mandar lembrete automático de agendamento e deixar
                o cliente confirmar ou cancelar direto pelo WhatsApp.
              </p>
              {erroConexao && (
                <p role="alert" className="text-sm text-accent-700 dark:text-accent-300">
                  {erroConexao}
                </p>
              )}
              <button
                type="button"
                className="btn btn-primary self-start"
                onClick={iniciarConexao}
                disabled={!PODE_CONECTAR || conectando || !sdkPronto}
              >
                {conectando ? 'Conectando…' : 'Conectar WhatsApp'}
              </button>
              {!PODE_CONECTAR && (
                <p className="text-xs text-content-muted">
                  Configuração pendente — conecte um App da Meta primeiro para habilitar esta conexão.
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
