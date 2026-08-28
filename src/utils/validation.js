export function parseArrayInput(raw, { min = 2, max = 12, allowNegative = true, lang = 'tr' } = {}) {
  const parts = raw.split(',').map(s => s.trim()).filter(s => s.length > 0);

  if (parts.length === 0) {
    return { values: null, error: lang === 'tr' ? 'Lutfen en az bir sayi girin.' : 'Please enter at least one number.' };
  }

  const values = [];
  for (const part of parts) {
    const n = Number(part);
    if (!Number.isFinite(n) || !Number.isInteger(n)) {
      return { values: null, error: lang === 'tr' ? `Gecersiz sayi: "${part}"` : `Invalid number: "${part}"` };
    }
    values.push(n);
  }

  if (values.length < min || values.length > max) {
    return {
      values: null,
      error: lang === 'tr'
        ? `Dizi ${min}-${max} eleman icermeli (girilen: ${values.length}).`
        : `Array must have ${min}-${max} elements (got ${values.length}).`,
    };
  }

  if (!allowNegative && values.some(v => v < 0)) {
    return { values: null, error: lang === 'tr' ? 'Negatif sayilara izin verilmiyor.' : 'Negative numbers are not allowed.' };
  }

  return { values, error: null };
}
