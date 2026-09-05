import { saveRoom } from "@/actions/room-actions";
import { roomStatuses, roomTypes } from "@/lib/constants";
import { ImageUploader } from "@/components/forms/image-uploader";
import { SubmitButton } from "@/components/forms/submit-button";

export function RoomForm({ room }: { room?: any }) {
  return (
    <form action={saveRoom} className="grid gap-4 rounded-lg border bg-white p-5 shadow-soft md:grid-cols-2">
      {room?._id ? <input type="hidden" name="id" defaultValue={String(room._id)} /> : null}
      <label className="grid gap-1 text-sm font-medium">Room number<input name="roomNumber" defaultValue={room?.roomNumber} required /></label>
      <label className="grid gap-1 text-sm font-medium">Room name<input name="name" defaultValue={room?.name} required /></label>
      <label className="grid gap-1 text-sm font-medium">Type<select name="type" defaultValue={room?.type}>{roomTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
      <label className="grid gap-1 text-sm font-medium">AC<select name="ac" defaultValue={String(room?.ac ?? true)}><option value="true">AC</option><option value="false">Non-AC</option></select></label>
      <label className="grid gap-1 text-sm font-medium">Price per night<input type="number" name="pricePerNight" defaultValue={room?.pricePerNight ?? 12500} min="0" required /></label>
      <label className="grid gap-1 text-sm font-medium">Max adults<input type="number" name="maxAdults" defaultValue={room?.maxAdults ?? 2} min="1" required /></label>
      <label className="grid gap-1 text-sm font-medium">Max children<input type="number" name="maxChildren" defaultValue={room?.maxChildren ?? 0} min="0" required /></label>
      <label className="grid gap-1 text-sm font-medium">Bed type<input name="bedType" defaultValue={room?.bedType ?? "King"} required /></label>
      <label className="grid gap-1 text-sm font-medium">Floor<input type="number" name="floorNumber" defaultValue={room?.floorNumber ?? 1} required /></label>
      <label className="grid gap-1 text-sm font-medium">Room size<input name="roomSize" defaultValue={room?.roomSize ?? "36 sqm"} required /></label>
      <label className="grid gap-1 text-sm font-medium">Status<select name="status" defaultValue={room?.status ?? "Available"}>{roomStatuses.map((status) => <option key={status}>{status}</option>)}</select></label>
      <label className="grid gap-1 text-sm font-medium">Active<select name="isActive" defaultValue={String(room?.isActive ?? true)}><option value="true">Active</option><option value="false">Inactive</option></select></label>
      <label className="grid gap-1 text-sm font-medium md:col-span-2">Amenities<input name="amenities" defaultValue={room?.amenities?.join(", ") ?? "Wi-Fi, Breakfast, Rain shower"} /></label>
      <ImageUploader initialImages={room?.images ?? []} />
      <label className="grid gap-1 text-sm font-medium md:col-span-2">Description<textarea name="description" rows={4} defaultValue={room?.description ?? "A calm, sunlit room with premium bedding, handcrafted details, and everything needed for a restful stay."} required /></label>
      <div className="md:col-span-2"><SubmitButton>Save room</SubmitButton></div>
    </form>
  );
}
