import { z } from "zod";
import { bookingSources, bookingStatuses, extraCategories, invoiceStatuses, paymentStatuses, roomStatuses, roomTypes } from "@/lib/constants";

const imagePathSchema = z.string().refine((value) => {
  if (value.startsWith("/uploads/")) return true;
  return z.string().url().safeParse(value).success;
}, "Image must be an uploaded file path or a valid URL.");

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().min(7),
  address: z.string().optional(),
  identityNumber: z.string().optional()
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const roomSchema = z.object({
  roomNumber: z.string().min(1),
  name: z.string().min(2),
  type: z.enum(roomTypes),
  ac: z.coerce.boolean(),
  pricePerNight: z.coerce.number().positive(),
  maxAdults: z.coerce.number().int().min(1),
  maxChildren: z.coerce.number().int().min(0),
  bedType: z.string().min(2),
  floorNumber: z.coerce.number().int(),
  roomSize: z.string().min(1),
  description: z.string().min(10),
  amenities: z.array(z.string()).default([]),
  images: z.array(imagePathSchema).default([]),
  status: z.enum(roomStatuses).default("Available"),
  isActive: z.coerce.boolean().default(true)
});

export const availabilitySchema = z.object({
  checkIn: z.coerce.date(),
  checkOut: z.coerce.date(),
  adults: z.coerce.number().int().min(1),
  children: z.coerce.number().int().min(0).default(0),
  type: z.enum(roomTypes).optional(),
  ac: z.enum(["AC", "Non-AC", "Any"]).default("Any"),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  roomNumber: z.string().optional()
}).refine((data) => data.checkOut > data.checkIn, {
  path: ["checkOut"],
  message: "Check-out must be later than check-in."
});

export const bookingSchema = z.object({
  source: z.enum(bookingSources).default("Website"),
  roomId: z.string().min(1),
  userId: z.string().optional(),
  customerName: z.string().min(2),
  customerEmail: z.string().email().optional().or(z.literal("")),
  customerPhone: z.string().min(7),
  customerAddress: z.string().min(3),
  identityNumber: z.string().min(3),
  checkIn: z.coerce.date(),
  checkOut: z.coerce.date(),
  adults: z.coerce.number().int().min(1),
  children: z.coerce.number().int().min(0),
  specialRequests: z.string().optional(),
  internalNotes: z.string().optional(),
  advancePayment: z.coerce.number().nonnegative().default(0),
  paymentMethod: z.string().optional()
}).refine((data) => data.checkOut > data.checkIn, {
  path: ["checkOut"],
  message: "Check-out must be later than check-in."
});

export const bookingStatusSchema = z.object({
  bookingId: z.string(),
  status: z.enum(bookingStatuses).optional(),
  paymentStatus: z.enum(paymentStatuses).optional(),
  internalNotes: z.string().optional()
});

export const extraChargeSchema = z.object({
  bookingId: z.string(),
  category: z.enum(extraCategories),
  description: z.string().min(2),
  quantity: z.coerce.number().positive(),
  unitPrice: z.coerce.number().nonnegative(),
  notes: z.string().optional()
});

export const invoiceSchema = z.object({
  bookingId: z.string(),
  discount: z.coerce.number().nonnegative().default(0),
  taxRate: z.coerce.number().nonnegative().default(0),
  serviceChargeRate: z.coerce.number().nonnegative().default(0),
  amountPaid: z.coerce.number().nonnegative().default(0),
  paymentMethod: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(invoiceStatuses).default("Draft")
});

export const settingsSchema = z.object({
  hotelName: z.string().min(2),
  logoUrl: z.string().url().optional().or(z.literal("")),
  address: z.string().min(5),
  phone: z.string().min(7),
  email: z.string().email(),
  currency: z.string().min(2).default("LKR"),
  taxPercentage: z.coerce.number().nonnegative().default(10),
  serviceChargePercentage: z.coerce.number().nonnegative().default(0),
  defaultCheckInTime: z.string().default("14:00"),
  defaultCheckOutTime: z.string().default("11:00"),
  invoicePrefix: z.string().default("INV"),
  bookingPrefix: z.string().default("BK"),
  timezone: z.string().default("Asia/Colombo"),
  cancellationPolicy: z.string().default("Free cancellation up to 48 hours before check-in."),
  invoiceFooterMessage: z.string().default("Thank you for choosing us.")
});
