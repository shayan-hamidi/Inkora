"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  submitConsultationAction,
  type ConsultationActionState,
} from "@/features/artists/server/actions";

const initialState: ConsultationActionState = { status: "idle" };

type ConsultationFormProps = {
  artistId: string;
  artistName: string;
};

export function ConsultationForm({
  artistId,
  artistName,
}: ConsultationFormProps) {
  const [state, formAction, pending] = useActionState(
    submitConsultationAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="artistId" value={artistId} />
      <div className="space-y-2">
        <p className="text-meta">Consultation request</p>
        <h2 className="font-heading text-2xl text-ink">
          Contact {artistName}
        </h2>
        <p className="text-sm text-muted-foreground">
          Requests are stored only — no chat, email relay, or booking confirmation
          in this portfolio build.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="requesterName">Your name</Label>
          <Input id="requesterName" name="requesterName" required maxLength={80} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="requesterEmail">Email</Label>
          <Input
            id="requesterEmail"
            name="requesterEmail"
            type="email"
            required
            maxLength={254}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="preferredPlacement">Preferred placement</Label>
          <Input
            id="preferredPlacement"
            name="preferredPlacement"
            placeholder="Forearm, ribs…"
            maxLength={80}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="message">Message</Label>
          <textarea
            id="message"
            name="message"
            required
            minLength={10}
            maxLength={2000}
            rows={5}
            className="border-input bg-background w-full rounded-lg border px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            placeholder="Share style references, size, and timing. Do not send payment details."
          />
        </div>
      </div>

      {state.status === "error" ? (
        <p className="text-sm text-destructive" role="alert">
          {state.message}
        </p>
      ) : null}
      {state.status === "success" ? (
        <p className="text-sm text-muted-foreground" role="status">
          {state.message}
        </p>
      ) : null}

      <Button type="submit" disabled={pending}>
        Store request
      </Button>
    </form>
  );
}
