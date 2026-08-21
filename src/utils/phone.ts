/** Formata dígitos de telefone BR progressivamente: (XX) XXXX-XXXX (fixo) ou (XX) XXXXX-XXXX (celular). */
export function formatTelefone(value: string): string {
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
