export const roomTypes = ["Standard", "Deluxe", "Family", "Suite"] as const;
export const roomStatuses = ["Available", "Occupied", "Cleaning", "Maintenance", "Inactive"] as const;
export const bookingStatuses = ["Pending", "Confirmed", "Checked In", "Checked Out", "Cancelled", "No Show"] as const;
export const paymentStatuses = ["Unpaid", "Partially Paid", "Paid", "Refunded"] as const;
export const bookingSources = ["Website", "Walk-in", "Phone", "Admin"] as const;
export const extraCategories = ["Food", "Drinks", "Laundry", "Transport", "Room Service", "Damage Charge", "Other"] as const;
export const invoiceStatuses = ["Draft", "Finalized", "Paid", "Cancelled"] as const;

export const fallbackRoomImages = [
  "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80"
];
