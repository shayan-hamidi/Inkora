"use server";

import { revalidatePath } from "next/cache";
import { adminTattooSchema, adminTaxonomySchema } from "@/features/admin/schemas";
import { requireAdminProfile } from "@/lib/auth/admin";
import { slugify } from "@/lib/slugify";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type AdminActionState = {
  status: "idle" | "error" | "success" | "forbidden";
  message?: string;
};

function formBool(value: FormDataEntryValue | null) {
  return value === "on" || value === "true" || value === "1";
}

export async function createAdminTattooAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    await requireAdminProfile();
  } catch {
    return { status: "forbidden", message: "Admin access required." };
  }

  const parsed = adminTattooSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug") || slugify(String(formData.get("title") ?? "")),
    description: formData.get("description") || "",
    categoryId: formData.get("categoryId") || "",
    imagePath: formData.get("imagePath"),
    imageAlt: formData.get("imageAlt") || "",
    source: formData.get("source"),
    attribution: formData.get("attribution"),
    license: formData.get("license"),
    isDemo: formBool(formData.get("isDemo")),
    isPublished: formBool(formData.get("isPublished")),
    isFeatured: formBool(formData.get("isFeatured")),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message:
        "Title, image path, source, attribution, and license are required.",
    };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("tattoos").insert({
    title: parsed.data.title,
    slug: parsed.data.slug,
    description: parsed.data.description || null,
    category_id: parsed.data.categoryId || null,
    image_path: parsed.data.imagePath,
    image_alt: parsed.data.imageAlt || null,
    source: parsed.data.source,
    attribution: parsed.data.attribution,
    license: parsed.data.license,
    is_demo: parsed.data.isDemo,
    is_published: parsed.data.isPublished,
    is_featured: parsed.data.isFeatured,
  });

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/tattoos");
  revalidatePath("/tattoos");
  return { status: "success", message: "Tattoo created." };
}

export async function createAdminTaxonomyAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    await requireAdminProfile();
  } catch {
    return { status: "forbidden", message: "Admin access required." };
  }

  const parsed = adminTaxonomySchema.safeParse({
    table: formData.get("table"),
    name: formData.get("name"),
    slug: formData.get("slug") || slugify(String(formData.get("name") ?? "")),
    description: formData.get("description") || "",
  });

  if (!parsed.success) {
    return { status: "error", message: "Name and slug are required." };
  }

  const supabase = await createServerSupabaseClient();
  let errorMessage: string | null = null;

  if (parsed.data.table === "tags") {
    const { error } = await supabase.from("tags").insert({
      name: parsed.data.name,
      slug: parsed.data.slug,
    });
    errorMessage = error?.message ?? null;
  } else if (parsed.data.table === "categories") {
    const { error } = await supabase.from("categories").insert({
      name: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description || null,
    });
    errorMessage = error?.message ?? null;
  } else if (parsed.data.table === "styles") {
    const { error } = await supabase.from("styles").insert({
      name: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description || null,
    });
    errorMessage = error?.message ?? null;
  } else {
    const { error } = await supabase.from("placements").insert({
      name: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description || null,
    });
    errorMessage = error?.message ?? null;
  }

  const error = errorMessage ? { message: errorMessage } : null;

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath("/admin/taxonomies");
  revalidatePath("/tattoos");
  return { status: "success", message: `${parsed.data.table} item created.` };
}

export async function uploadTattooImageAction(
  formData: FormData,
): Promise<AdminActionState & { path?: string }> {
  try {
    await requireAdminProfile();
  } catch {
    return { status: "forbidden", message: "Admin access required." };
  }

  const file = formData.get("file");
  const license = String(formData.get("license") ?? "").trim();
  const attribution = String(formData.get("attribution") ?? "").trim();
  const source = String(formData.get("source") ?? "").trim();

  if (!(file instanceof File) || file.size === 0) {
    return { status: "error", message: "Choose an image file." };
  }

  if (!license || !attribution || !source) {
    return {
      status: "error",
      message: "Uploads require source, attribution, and license metadata.",
    };
  }

  if (file.size > 5 * 1024 * 1024) {
    return { status: "error", message: "Image must be 5MB or smaller." };
  }

  const allowed = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
  if (!allowed.includes(file.type)) {
    return { status: "error", message: "Unsupported image type." };
  }

  const supabase = await createServerSupabaseClient();
  const extension = file.name.split(".").pop()?.toLowerCase() || "bin";
  const objectPath = `uploads/${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/, ""))}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from("tattoo-images")
    .upload(objectPath, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    return { status: "error", message: error.message };
  }

  const { data } = supabase.storage.from("tattoo-images").getPublicUrl(objectPath);

  return {
    status: "success",
    message: "Upload complete. Paste the path into the tattoo form.",
    path: data.publicUrl,
  };
}
