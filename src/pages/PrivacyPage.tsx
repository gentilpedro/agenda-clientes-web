import { LegalPageLayout } from '../components/LegalPageLayout';

interface Secao {
  titulo: string;
  paragrafos: string[];
}

const SECOES: Secao[] = [
  {
    titulo: '1. Quem somos',
    paragrafos: [
      'A Agenda Clientes é uma ferramenta de agenda e cadastro de clientes voltada a profissionais que atendem por horário marcado. Dúvidas sobre esta política ou sobre os dados tratados podem ser enviadas pelos canais informados na página de Contato.',
    ],
  },
  {
    titulo: '2. Quais dados coletamos',
    paragrafos: [
      'Da conta do profissional: nome, email e senha (armazenada com hash, nunca em texto puro).',
      'Dos clientes cadastrados pelo profissional: nome, telefone, email (opcional) e observações que o próprio profissional decide registrar. Esses dados são inseridos e geridos pelo profissional — quem cadastra um cliente é responsável por ter uma base legal válida para tratar aquele dado (ex.: o cliente sabe que está sendo atendido e cadastrado).',
      'Dados técnicos: informações de acesso e logs de erro, usados apenas para manter o serviço no ar e investigar falhas.',
    ],
  },
  {
    titulo: '3. Para que usamos seus dados',
    paragrafos: [
      'Para autenticar o acesso à conta, manter o cadastro de clientes e a agenda de compromissos, e enviar comunicações operacionais estritamente necessárias (ex.: confirmação de cadastro, redefinição de senha).',
      'Não usamos os dados para publicidade, não fazemos perfilamento de comportamento e não vendemos dados a terceiros.',
    ],
  },
  {
    titulo: '4. Base legal',
    paragrafos: [
      'O tratamento de dados se apoia em três bases previstas na LGPD: execução de contrato (fornecer o serviço que você contratou), legítimo interesse (segurança e prevenção de fraude) e cumprimento de obrigação legal, quando aplicável.',
    ],
  },
  {
    titulo: '5. Com quem compartilhamos',
    paragrafos: [
      'Não vendemos nem alugamos dados pessoais. Compartilhamos dados apenas com operadores estritamente necessários para o funcionamento do serviço — provedor de hospedagem e banco de dados — sempre sob obrigação contratual de proteção dos dados.',
    ],
  },
  {
    titulo: '6. Seus direitos',
    paragrafos: [
      'Como titular de dados, você pode solicitar acesso, correção ou exclusão dos seus dados, e dos dados dos clientes que cadastrou, a qualquer momento. Hoje esse pedido é processado manualmente pelos canais de contato — ainda não existe um botão de autoatendimento para isso dentro do produto.',
    ],
  },
  {
    titulo: '7. Armazenamento local no navegador',
    paragrafos: [
      'Não usamos cookies de rastreamento. O único dado guardado no navegador é o token de autenticação (localStorage), usado para manter você conectado — ele não é compartilhado com terceiros e é apagado ao sair da conta.',
    ],
  },
  {
    titulo: '8. Retenção',
    paragrafos: [
      'Os dados permanecem armazenados enquanto a conta estiver ativa. Ao solicitar o encerramento da conta, os dados são removidos, exceto o mínimo exigido por obrigação legal, quando aplicável.',
    ],
  },
  {
    titulo: '9. Segurança',
    paragrafos: [
      'Senhas são armazenadas com hash (BCrypt), o acesso à API exige autenticação por token (JWT) e toda a comunicação em produção é feita via HTTPS. Nenhum sistema é infalível, mas essas práticas seguem o padrão esperado para um serviço deste porte.',
    ],
  },
];

export function PrivacyPage() {
  return (
    <LegalPageLayout titulo="Política de Privacidade" atualizadoEm="25 de agosto de 2026">
      {SECOES.map((secao) => (
        <section key={secao.titulo} className="flex flex-col gap-2">
          <h2 className="card-title">{secao.titulo}</h2>
          {secao.paragrafos.map((paragrafo, i) => (
            <p key={i} className="text-sm text-content-muted leading-relaxed">
              {paragrafo}
            </p>
          ))}
        </section>
      ))}
    </LegalPageLayout>
  );
}
