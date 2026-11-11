import { test } from "node:test";
import { strict as assert } from "node:assert";
import { isPaid, momoTelHref, normalizeStatus } from "./donation-status";

test("new donations default to pending", () => {
  assert.equal(normalizeStatus(undefined), "pending");
  assert.equal(normalizeStatus("something-else"), "pending");
});
test("admin statuses are kept", () => {
  assert.equal(normalizeStatus("contacted"), "contacted");
  assert.equal(normalizeStatus("paid"), "paid");
});
test("only paid counts as money received", () => {
  assert.equal(isPaid("pending"), false);
  assert.equal(isPaid("contacted"), false);
  assert.equal(isPaid("paid"), true);
});
test("MoMo dialer link encodes the hash", () => {
  assert.equal(momoTelHref("*182*8*1*123456#"), "tel:*182*8*1*123456%23");
});
