import { notFound } from "next/navigation";
import { RoomForm } from "@/components/forms/room-form";
import { connectDb } from "@/lib/db";
import Room from "@/models/Room";

export default async function EditRoomPage({ params }: { params: Promise<{ id: string }> }) {
  await connectDb();
  const { id } = await params;
  const room = await Room.findById(id).lean();
  if (!room) notFound();
  return <section><h1 className="font-serif text-4xl font-bold">Edit room</h1><div className="mt-6"><RoomForm room={room} /></div></section>;
}
