export const DONATION_STATUSES = ["pending", "contacted", "paid"] as const;
export type DonationStatus = (typeof DONATION_STATUSES)[number];

/** Normalizes any stored status (including older records) to one of the three manual follow-up statuses. */
export function normalizeStatus(status: string | undefined | null): DonationStatus {
  const s = String(status ?? "").toLowerCase();
  if (s === "paid" || s === "confirmed" || s === "completed") return "paid";
  if (s === "contacted") return "contacted";
  return "pending";
}

export function isPaid(status: string): boolean {
  return normalizeStatus(status) === "paid";
}

export function statusLabel(status: string): string {
  const s = normalizeStatus(status);
  return s === "paid" ? "Paid" : s === "contacted" ? "Contacted" : "Pending";
}

/** Turns a MoMo code like *182*8*1*123456# into a dialer link (# must be encoded as %23). */
export function momoTelHref(code: string): string {
  return "tel:" + code.replace(/\s+/g, "").replace(/#/g, "%23");
}
