# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Dois públicos usam a agenda com o mesmo peso:

- **O profissional que atende por hora marcada** (psicólogas, advogados, dentistas, médicos e profissões afins). Consulta e ajusta a agenda entre um atendimento e outro, muitas vezes pelo celular.
- **A secretária ou recepção** que opera a agenda de um consultório ou escritório: cadastra clientes, marca, conclui e cancela horários ao longo do dia, normalmente no desktop.

O trabalho de ambos é o mesmo: saber quem vem e quando, registrar novos clientes rápido e manter o status de cada atendimento em dia.

## Product Purpose

Agenda web para profissionais de atendimento clínico ou por consulta: cadastro de clientes e agenda diária de atendimentos, sem a complexidade de um sistema de gestão de clínica. Funciona quando o dia de atendimentos fica legível de relance e marcar um horário leva poucos segundos.

## Positioning

Feita para quem atende por consulta (clínicas, consultórios, escritórios), e não uma agenda genérica como Google Agenda ou Calendly. O vocabulário e o fluxo são de atendimento: cliente/paciente, consulta, duração, status (agendado, concluído, cancelado), observações confidenciais.

## Operating Context

- Interface em pt-BR (`lang="pt-BR"`), datas e horários no formato brasileiro.
- Uso dividido entre desktop (recepção, durante o dia todo) e celular (profissional, entre atendimentos).
- Fluxo central: abrir a agenda do dia → navegar entre dias → marcar um atendimento para um cliente → concluir ou cancelar.
- Conta própria por usuário: cadastro, login, recuperação e redefinição de senha.

## Capabilities and Constraints

- **Clientes:** listar, criar, editar e ver detalhe (nome, telefone obrigatório, e-mail e observações opcionais).
- **Agendamentos:** listar por dia, criar (cliente, data/hora, duração em minutos, observações), concluir e cancelar. Status: `AGENDADO`, `CONCLUIDO`, `CANCELADO`.
- **Autenticação:** JWT Bearer contra uma API separada (`VITE_API_URL`). Rotas do app são protegidas.
- Stack: React 19 + TypeScript + Vite + Tailwind v4 (template create-gentilpedro-react), tema claro/escuro.
- **Em aberto:** suporte a vários profissionais por conta (recepção atendendo mais de um profissional) ainda não existe no modelo de dados.

## Brand Commitments

- O nome "Agenda" é **provisório**. Ainda não há marca, logo ou identidade definida, e o trabalho futuro não deve tratá-los como fixos.

## Evidence on Hand

- **Não existem** clientes reais, depoimentos, números de uso, logos de parceiros nem estudos de caso. Nada disso deve ser inventado e apresentado como real.
- A landing page pode ser preenchida com **dados fictícios apenas ilustrativos**, como uma agenda de exemplo com nomes e horários inventados, para mostrar o produto visualmente.
- **Em aberto:** confirmar se a landing também pode ter depoimentos e números de exemplo claramente fictícios. Até lá, esses dados ficam restritos a demonstrar a interface.

## Product Principles

1. **O dia de atendimentos em um olhar.** A agenda do dia é a tela principal e tem que ser legível imediatamente, em qualquer tela.
2. **Marcar é rápido.** Cadastrar cliente e marcar horário deve caber em poucos toques, tanto na recepção quanto no celular.
3. **Discrição por padrão.** Os dados são de pacientes e clientes, então informação sensível nunca fica exposta sem necessidade.
4. **Celular é tela de primeira classe**, não adaptação do desktop.
5. **Só o essencial.** Clientes e agenda; o produto resiste a virar sistema de gestão de clínica.

## Accessibility & Inclusion

- Os dados pessoais de clientes e pacientes estão sujeitos à **LGPD**. Observações podem conter informação de saúde ou jurídica confidencial, então trate isso como requisito de produto (exposição mínima em listas, telas compartilhadas e notificações).
- Uso intenso no celular: alvos de toque confortáveis e fluxos que funcionem com uma mão.
