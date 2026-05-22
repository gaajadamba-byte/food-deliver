/** Formats a number as a price, e.g. 12.99 -> "$12.99". */
export function formatPrice(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

/** Formats an ISO date string as a readable local date-time. */
export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("mn-MN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
