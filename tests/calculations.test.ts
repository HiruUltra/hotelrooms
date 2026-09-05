import { describe, expect, it } from "vitest";
import { calculateInvoice, overlaps } from "@/lib/calculations";

describe("booking overlap", () => {
  it("detects overlapping stays using the required rule", () => {
    expect(overlaps(new Date("2026-01-02"), new Date("2026-01-04"), new Date("2026-01-03"), new Date("2026-01-05"))).toBe(true);
    expect(overlaps(new Date("2026-01-05"), new Date("2026-01-06"), new Date("2026-01-03"), new Date("2026-01-05"))).toBe(false);
  });
});

describe("invoice totals", () => {
  it("calculates room, extras, tax, paid, and balance", () => {
    const totals = calculateInvoice({
      checkIn: "2026-01-01",
      checkOut: "2026-01-03",
      roomRate: 10000,
      charges: [{ description: "Dinner", quantity: 2, unitPrice: 1500 }],
      discount: 1000,
      taxRate: 10,
      advancePayment: 5000
    });
    expect(totals.roomSubtotal).toBe(20000);
    expect(totals.extrasTotal).toBe(3000);
    expect(totals.tax).toBe(2200);
    expect(totals.total).toBe(24200);
    expect(totals.balanceDue).toBe(19200);
  });
});
