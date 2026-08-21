/**
 * Formata dígitos de telefone BR progressivamente: (XX) XXXX-XXXX (fixo) ou
 * (XX) XXXXX-XXXX (celular). Um "+" no início indica número estrangeiro —
 * nesse caso não força o padrão brasileiro, só limita a caracteres válidos.
 */
export function formatTelefone(value: string): string {
  if (value.trimStart().startsWith('+')) {
    return value.replace(/[^\d+()\-\s]/g, '').slice(0, 20);
  }

  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length === 0) return '';

  const ddd = digits.slice(0, 2);
  if (digits.length <= 2) return `(${ddd}`;

  const resto = digits.slice(2);
  const celular = digits.length > 10;
  const meio = celular ? resto.slice(0, 5) : resto.slice(0, 4);
  const fim = celular ? resto.slice(5) : resto.slice(4);

  return fim ? `(${ddd}) ${meio}-${fim}` : `(${ddd}) ${meio}`;
}
