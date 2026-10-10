"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

const CATEGORIES = [
  "Noticias Locales",
  "Entretenimiento",
  "Cultura y Turismo",
  "Política y Gobierno",
  "Internacional",
  "Deportes",
  "Economía y Comercio",
  "Naturaleza y Medio Ambiente",
] as const;

const STATUSES = ["draft", "published"] as const;

export async function createNews(formData: FormData) {
  await requireAdmin();

  const supabase = await createClient();

  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const backlink = String(formData.get("backlink") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const author =
    String(formData.get("author") ?? "").trim() || "Hola Puerto Rico+";
  const status = String(formData.get("status") ?? "").trim();

  const featured = String(formData.get("featured")) === "true";
  const breaking = String(formData.get("breaking")) === "true";

  /*
   * Validaciones
   */

  if (!title) {
    return {
      success: false,
      error: "El título es obligatorio.",
    };
  }

  if (!slug) {
    return {
      success: false,
      error: "El slug es obligatorio.",
    };
  }

  if (!backlink) {
    return {
      success: false,
      error: "El backlink de la publicación es obligatorio.",
    };
  }

  let validBacklink: URL;

  try {
    validBacklink = new URL(backlink);
  } catch {
    return {
      success: false,
      error: "El backlink debe ser una URL válida.",
    };
  }

  if (!["http:", "https:"].includes(validBacklink.protocol)) {
    return {
      success: false,
      error: "El backlink debe comenzar con http:// o https://.",
    };
  }

  if (
    !CATEGORIES.includes(
      category as (typeof CATEGORIES)[number],
    )
  ) {
    return {
      success: false,
      error: "Selecciona una categoría válida.",
    };
  }

  if (!STATUSES.includes(status as (typeof STATUSES)[number])) {
    return {
      success: false,
      error: "Selecciona un estado válido.",
    };
  }

  /*
   * Imagen
   */

  const image = formData.get("image");

  let imageUrl: string | null = null;

  if (image instanceof File && image.size > 0) {
    if (!image.type.startsWith("image/")) {
      return {
        success: false,
        error: "El archivo seleccionado no es una imagen válida.",
      };
    }

    const MAX_FILE_SIZE = 10 * 1024 * 1024;

    if (image.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: "La imagen no puede superar los 10 MB.",
      };
    }

    const extension =
      image.name.split(".").pop()?.toLowerCase() || "jpg";

    const fileName = `news/${new Date().getFullYear()}/${Date.now()}-${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("news-images")
      .upload(fileName, image, {
        cacheControl: "3600",
        upsert: false,
        contentType: image.type,
      });

    if (uploadError) {
      console.error("Error subiendo imagen:", uploadError);

      return {
        success: false,
        error: `No se pudo subir la imagen: ${uploadError.message}`,
      };
    }

    const {
      data: { publicUrl },
    } = supabase.storage
      .from("news-images")
      .getPublicUrl(fileName);

    imageUrl = publicUrl;
  }

  /*
   * Fecha de publicación
   */

  const publishedAt =
    status === "published" ? new Date().toISOString() : null;

  /*
   * Crear noticia
   */

  const { data, error } = await supabase
    .from("news")
    .insert({
      title,
      slug,
      excerpt: excerpt || null,
      backlink: validBacklink.toString(),
      image_url: imageUrl,
      category,
      author,
      status,
      featured,
      breaking,
      published_at: publishedAt,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Error creando noticia:", error);

    /*
     * Si el slug ya existe, mostrar un mensaje más claro.
     */
    if (error.code === "23505") {
      return {
        success: false,
        error:
          "Ese slug ya existe. Utiliza un slug diferente para esta noticia.",
      };
    }

    return {
      success: false,
      error: `No se pudo guardar la noticia: ${error.message}`,
    };
  }

  /*
   * Actualizar páginas
   */

  revalidatePath("/");
  revalidatePath("/noticias");
  revalidatePath("/admin");
  revalidatePath("/admin/noticias");

  return {
    success: true,
    id: data.id,
  };
}