"use server";

import { consultationRequestSchema } from "@/features/artists/schemas";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type ConsultationActionState = {
  status: "idle" | "error" | "success";
  message?: string;
};

export async function submitConsultationAction(
  _prev: ConsultationActionState,
  formData: FormData,
): Promise<ConsultationActionState> {
  const parsed = consultationRequestSchema.safeParse({
    artistId: formData.get("artistId"),
    requesterName: formData.get("requesterName"),
    requesterEmail: formData.get("requesterEmail"),
    message: formData.get("message"),
    preferredPlacement: formData.get("preferredPlacement") || "",
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please complete the form with a valid email and message.",
    };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("consultation_requests").insert({
    artist_id: parsed.data.artistId,
    requester_user_id: user?.id ?? null,
    requester_name: parsed.data.requesterName,
    requester_email: parsed.data.requesterEmail,
    message: parsed.data.message,
    preferred_placement: parsed.data.preferredPlacement || null,
  });

  if (error) {
    return { status: "error", message: error.message };
  }

  return {
    status: "success",
    message:
      "Request stored. This demo does not send messages or confirm bookings.",
  };
}
