"use client";

import Image from "next/image";
import { ChangeEvent, useMemo, useState } from "react";
import { ImagePlus, Loader2, Trash2, UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

type UploadState = {
  urls: string[];
  uploading: boolean;
  error: string;
};

export function ImageUploader({ initialImages = [] }: { initialImages?: string[] }) {
  const [state, setState] = useState<UploadState>({ urls: initialImages, uploading: false, error: "" });
  const serialized = useMemo(() => state.urls.join("\n"), [state.urls]);

  async function uploadFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;
    setState((current) => ({ ...current, uploading: true, error: "" }));

    try {
      const uploadedUrls: string[] = [];
      for (const file of files) {
        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
          throw new Error("Only JPG, PNG, and WebP images are allowed.");
        }
        if (file.size > 5 * 1024 * 1024) {
          throw new Error("Each image must be 5MB or smaller.");
        }
        const body = new FormData();
        body.append("file", file);
        const response = await fetch("/api/uploads", { method: "POST", body });
        const payload = (await response.json().catch(() => ({}))) as { url?: string; message?: string };
        if (!response.ok || !payload.url) {
          throw new Error(payload.message || "Image upload failed.");
        }
        uploadedUrls.push(payload.url);
      }
      setState((current) => ({ ...current, urls: [...current.urls, ...uploadedUrls], uploading: false }));
      event.target.value = "";
    } catch (error) {
      setState((current) => ({ ...current, uploading: false, error: (error as Error).message }));
    }
  }

  function removeImage(url: string) {
    setState((current) => ({ ...current, urls: current.urls.filter((item) => item !== url) }));
  }

  return (
    <div className="grid gap-3 md:col-span-2">
      <input type="hidden" name="images" value={serialized} />
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Room images</p>
          <p className="text-xs text-muted-foreground">Upload JPG, PNG, or WebP images from your device. Max 5MB each.</p>
        </div>
        <label
          className={cn(
            "inline-flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold transition hover:bg-muted",
            state.uploading && "pointer-events-none opacity-60"
          )}
        >
          {state.uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
          {state.uploading ? "Uploading" : "Choose files"}
          <input className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={uploadFiles} disabled={state.uploading} />
        </label>
      </div>

      {state.error ? <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm font-medium text-destructive">{state.error}</p> : null}

      {state.urls.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {state.urls.map((url) => (
            <div key={url} className="group overflow-hidden rounded-lg border bg-white">
              <div className="relative aspect-[4/3] bg-muted">
                <Image src={url} alt="Room preview" fill className="object-cover" />
              </div>
              <div className="flex items-center justify-between gap-2 p-2">
                <span className="truncate text-xs text-muted-foreground">{url}</span>
                <button type="button" onClick={() => removeImage(url)} className="rounded-md p-2 text-destructive hover:bg-destructive/10" aria-label="Remove image">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex min-h-40 items-center justify-center rounded-lg border border-dashed bg-muted/40 p-6 text-center">
          <div>
            <ImagePlus className="mx-auto h-8 w-8 text-gold" />
            <p className="mt-2 text-sm font-medium">No room images uploaded yet</p>
            <p className="text-xs text-muted-foreground">Choose files from your device to upload them.</p>
          </div>
        </div>
      )}
    </div>
  );
}
