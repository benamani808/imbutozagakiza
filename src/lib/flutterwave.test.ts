import { afterEach, expect, test } from "bun:test";
import { payWithFlutterwave } from "./flutterwave";

const payload = { publicKey: "test", name: "Test", email: "test@example.org", amount: 5000, currency: "RWF", title: "Ministry" };
afterEach(() => { Reflect.deleteProperty(globalThis, "window"); });

test("missing payment status must not be reported as completed", async () => {
  let options: Record<string, unknown> = {};
  Object.defineProperty(globalThis, "window", { configurable: true, value: {
    FlutterwaveCheckout: (value: Record<string, unknown>) => {
      options = value;
      return { close() {} };
    },
  } });
  const result = payWithFlutterwave(payload);
  await Promise.resolve();
  const callback = options["callback"];
  if (typeof callback !== "function") throw new Error("Checkout callback missing");
  callback({});
  expect((await result)?.status).toBe("unknown");
});