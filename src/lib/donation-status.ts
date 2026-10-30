export type DonationStatus = "confirmed" | "unverified" | "failed" | "cancelled";

export type Verification = { status?: string; amount?: number; currency?: string } | null;

/**
 * Decides a donation's status. Only a Flutterwave server-side verification that
 * matches the expected amount and currency counts as "confirmed".
 */
export function classifyDonation(input: {
  checkoutStatus: string | null;
  expectedAmount: number;
  expectedCurrency: string;
  verification: Verification;
}): DonationStatus {
  if (input.checkoutStatus === null) return "cancelled";
  const v = input.verification;
  if (v) {
    const ok =
      v.status === "successful" &&
      Number(v.amount) >= input.expectedAmount &&
      String(v.currency).toUpperCase() === input.expectedCurrency.toUpperCase();
    return ok ? "confirmed" : "failed";
  }
  const s = input.checkoutStatus.toLowerCase();
  if (s === "successful" || s === "completed") return "unverified";
  return "failed";
}

/** Statuses an admin can trust as money received (manual "completed" entries included). */
export function isConfirmed(status: string): boolean {
  return status === "confirmed" || status === "completed";
}

export function statusLabel(status: string): string {
  switch (status) {
    case "confirmed":
      return "Confirmed";
    case "completed":
      return "Confirmed (manual)";
    case "unverified":
    case "reported_successful":
      return "Awaiting verification";
    case "cancelled":
      return "Cancelled";
    default:
      return "Failed";
  }
}
