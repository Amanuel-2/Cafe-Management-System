export function formatETB(value: number): string {
  let currency = 'ETB';
  try {
    currency = JSON.parse(globalThis.localStorage?.getItem('restaurant-management-db') ?? '{}')?.settings?.currency || 'ETB';
  } catch {
    currency = 'ETB';
  }
  return new Intl.NumberFormat('en-ET', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
