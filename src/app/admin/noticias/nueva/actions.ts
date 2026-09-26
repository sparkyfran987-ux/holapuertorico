"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

const categories = [
  "Noticias Locales",
  "Entretenimiento",
  "Cultura y Turismo",
  "Política y Gobierno",
  "Internacional",
  "Deportes",
  "Economía y Comercio",
  "Naturaleza y Medio Ambiente",
] as const;

const statuses = ["draft", "published"] as const;

export async function createNews(formData: FormData) {
  await requireAdmin();

  const supabase = await createClient();

  const title = String(formData.get("title") || "").trim();
  const slug = String(formData.get("slug") || "").trim();
  const excerpt = String(formData.get("excerpt") || "").trim();
  const content = String(formData.get("content") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const author = String(formData.get("author") || "").trim();
  const status = String(formData.get("status") || "").trim();

  const featured = String(formData.get("featured")) === "true";
  const breaking = String(formData.get("breaking")) === "true";

  const image = formData.get("image");

  if (!title) {
    return {
      success: false,
      message: "El título es obligatorio.",
    };
  }

  if (!slug) {
    return {
      success: false,
      message: "El slug es obligatorio.",
    };
  }

  if (!content) {
    return {
      success: false,
      message: "El contenido es obligatorio.",
    };
  }

  if (!author) {
    return {
      success: false,
      message: "El autor es obligatorio.",
    };
  }

  if (!categories.includes(category as (typeof categories)[number])) {
    return {
      success: false,
      message: "La categoría seleccionada no es válida.",
    };
  }

  if (!statuses.includes(status as (typeof statuses)[number])) {
    return {
      success: false,
      message: "El estado seleccionado no es válido.",
    };
  }

  if (image instanceof File && image.size > 0) {
    if (!image.type.startsWith("image/")) {
      return {
        success: false,
        message: "El archivo seleccionado no es una imagen.",
      };
    }

    if (image.size > 10 * 1024 * 1024) {
      return {
        success: false,
        message: "La imagen no puede superar los 10 MB.",
      };
    }
  }

  let imageUrl: string | null = null;

  if (image instanceof File && image.size > 0) {
    const extension =
      image.name.split(".").pop()?.toLowerCase() || "jpg";

    const filePath = `news/${new Date().getFullYear()}/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("news-images")
      .upload(filePath, image, {
        cacheControl: "3600",
        upsert: false,
        contentType: image.type,
      });

    if (uploadError) {
      return {
        success: false,
        message: `No se pudo subir la imagen: ${uploadError.message}`,
      };
    }

    const {
      data: { publicUrl },
    } = supabase.storage
      .from("news-images")
      .getPublicUrl(filePath);

    imageUrl = publicUrl;
  }

  const { error: insertError } = await supabase.from("news").insert({
    title,
    slug,
    excerpt: excerpt || null,
    content,
    image_url: imageUrl,
    category,
    author,
    status,
    featured,
    breaking,
    published_at:
      status === "published" ? new Date().toISOString() : null,
  });

  if (insertError) {
    return {
      success: false,
      message: `No se pudo guardar la noticia: ${insertError.message}`,
    };
  }

  revalidatePath("/");
  revalidatePath("/noticias");
  revalidatePath("/admin");
  revalidatePath("/admin/noticias");

  return {
    success: true,
    message:
      status === "published"
        ? "La noticia fue publicada correctamente."
        : "La noticia fue guardada como borrador.",
  };
}