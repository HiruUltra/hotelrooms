import { nightsBetween } from "@/lib/utils";

export type ChargeLine = {
  description: string;
  quantity: number;
  unitPrice: number;
};

export function overlaps(newCheckIn: Date, newCheckOut: Date, existingCheckIn: Date, existingCheckOut: Date) {
  return newCheckIn < existingCheckOut && newCheckOut > existingCheckIn;
}

export function calculateInvoice(input: {
  checkIn: Date | string;
  checkOut: Date | string;
  roomRate: number;
  charges?: ChargeLine[];
  discount?: number;
  taxRate?: number;
  serviceChargeRate?: number;
  advancePayment?: number;
  amountPaid?: number;
}) {
  const nights = nightsBetween(input.checkIn, input.checkOut);
  const roomSubtotal = nights * input.roomRate;
  const extrasTotal = (input.charges ?? []).reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const discount = Math.min(input.discount ?? 0, roomSubtotal + extrasTotal);
  const taxable = Math.max(0, roomSubtotal + extrasTotal - discount);
  const tax = taxable * ((input.taxRate ?? 0) / 100);
  const serviceCharge = taxable * ((input.serviceChargeRate ?? 0) / 100);
  const total = Math.max(0, taxable + tax + serviceCharge);
  const paid = (input.advancePayment ?? 0) + (input.amountPaid ?? 0);
  return {
    nights,
    roomSubtotal,
    extrasTotal,
    discount,
    taxable,
    tax,
    serviceCharge,
    total,
    paid,
    balanceDue: Math.max(0, total - paid)
  };
}
