const formatter = new Intl.NumberFormat('es-BO', {
  style: 'currency',
  currency: 'BOB',
  minimumFractionDigits: 2,
});

export function formatPrice(value: number) {
  return formatter.format(value).replace(/^Bs(?!\s)/, 'Bs ');
}
