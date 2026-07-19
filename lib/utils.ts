export function randomRange(min: number, max: number, float = false) {
  const v = Math.random() * (max - min) + min;
  return float ? Math.round(v * 100) / 100 : Math.round(v);
}

export function formatCurrency(n: number) {
  return "$" + n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatISODate(d: Date) {
  return d.toISOString();
}

export function relativeTime(iso: string | Date) {
  const date = typeof iso === "string" ? new Date(iso) : iso;
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}
