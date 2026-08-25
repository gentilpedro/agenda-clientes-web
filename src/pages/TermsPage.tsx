import { LegalPageLayout } from '../components/LegalPageLayout';

interface Secao {
  titulo: string;
  paragrafos: string[];
}

const SECOES: Secao[] = [
  {
    titulo: '1. Aceitação dos termos',
    paragrafos: [
      'Ao criar uma conta na Agenda Clientes, você concorda com estes Termos de Uso e com a nossa Política de Privacidade. Se não concordar com algum ponto, não utilize o serviço.',
    ],
  },
  {
    titulo: '2. Descrição do serviço',
    paragrafos: [
      'A Agenda Clientes é uma ferramenta para profissionais que atendem por horário marcado cadastrarem clientes e gerenciarem sua agenda de compromissos. O serviço é oferecido gratuitamente, sem garantia de disponibilidade ininterrupta.',
    ],
  },
  {
    titulo: '3. Cadastro e conta',
    paragrafos: [
      'Você é responsável por manter os dados da sua conta corretos e por proteger sua senha. Toda atividade realizada com a sua conta é de sua responsabilidade — avise-nos imediatamente se suspeitar de acesso não autorizado.',
    ],
  },
  {
    titulo: '4. Responsabilidade pelos dados cadastrados',
    paragrafos: [
      'Os dados de clientes que você cadastra na plataforma são de sua responsabilidade. Você declara ter base legal para tratar esses dados (ex.: relação de atendimento já estabelecida com a pessoa cadastrada) e se compromete a não usar o serviço para armazenar dados de pessoas sem essa relação.',
    ],
  },
  {
    titulo: '5. Uso permitido',
    paragrafos: [
      'O serviço deve ser usado apenas para os fins a que se destina — gestão de clientes e agendamentos de uma atividade profissional legítima. É proibido usar a plataforma para atividades ilegais, envio de spam, ou qualquer tentativa de comprometer a segurança do serviço.',
    ],
  },
  {
    titulo: '6. Propriedade intelectual',
    paragrafos: [
      'O software, a marca e o design da Agenda Clientes pertencem aos seus desenvolvedores. Os dados que você cadastra (clientes, agendamentos) continuam sendo seus — você pode solicitar a exportação ou exclusão a qualquer momento.',
    ],
  },
  {
    titulo: '7. Disponibilidade e isenção de garantias',
    paragrafos: [
      'O serviço é fornecido "como está". Fazemos o possível para mantê-lo no ar e funcionando corretamente, mas não garantimos disponibilidade ininterrupta nem ausência total de falhas.',
    ],
  },
  {
    titulo: '8. Limitação de responsabilidade',
    paragrafos: [
      'Na máxima extensão permitida por lei, não nos responsabilizamos por perdas indiretas decorrentes do uso ou da indisponibilidade do serviço. Recomendamos manter backups próprios de informações críticas para o seu negócio.',
    ],
  },
  {
    titulo: '9. Cancelamento',
    paragrafos: [
      'Você pode encerrar sua conta a qualquer momento pelos canais de contato. Reservamo-nos o direito de suspender contas que violem estes termos.',
    ],
  },
  {
    titulo: '10. Alterações nestes termos',
    paragrafos: [
      'Podemos atualizar estes termos conforme o serviço evolui. Mudanças relevantes serão comunicadas com razoável antecedência pelos canais disponíveis na plataforma.',
    ],
  },
  {
    titulo: '11. Lei aplicável',
    paragrafos: [
      'Estes termos são regidos pelas leis da República Federativa do Brasil, com foro eleito para dirimir eventuais controvérsias.',
    ],
  },
];

export function TermsPage() {
  return (
    <LegalPageLayout titulo="Termos de Uso" atualizadoEm="25 de agosto de 2026">
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
