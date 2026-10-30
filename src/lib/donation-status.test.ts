import { test } from "node:test";
import { strict as assert } from "node:assert";
import { classifyDonation, isConfirmed } from "./donation-status";

const base = { expectedAmount: 5000, expectedCurrency: "RWF" };

test("closed checkout is cancelled", () => {
  assert.equal(classifyDonation({ ...base, checkoutStatus: null, verification: null }), "cancelled");
});
test("verified matching payment is confirmed", () => {
  assert.equal(classifyDonation({ ...base, checkoutStatus: "successful", verification: { status: "successful", amount: 5000, currency: "RWF" } }), "confirmed");
});
test("verified underpayment is failed", () => {
  assert.equal(classifyDonation({ ...base, checkoutStatus: "successful", verification: { status: "successful", amount: 100, currency: "RWF" } }), "failed");
});
test("browser-only success is not confirmed", () => {
  assert.equal(classifyDonation({ ...base, checkoutStatus: "successful", verification: null }), "unverified");
});
test("failed checkout is failed", () => {
  assert.equal(classifyDonation({ ...base, checkoutStatus: "failed", verification: null }), "failed");
});
test("only confirmed statuses count as received", () => {
  assert.equal(isConfirmed("unverified"), false);
  assert.equal(isConfirmed("confirmed"), true);
});
