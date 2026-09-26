"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { NewsArticle } from "@/types/news";

const categories = [
  "Noticias Locales",
  "Entretenimiento",
  "Cultura y Turismo",
  "Política y Gobierno",
  "Internacional",
  "Deportes",
  "Economía y Comercio",
  "Naturaleza y Medio Ambiente",
];

function normalizeCategory(
  category: string | null | undefined
) {
  switch (category) {
    case "Noticias":
    case "Puerto Rico":
    case "Comunidad":
      return "Noticias Locales";

    case "Gastronomía":
    case "Turismo":
      return "Cultura y Turismo";

    default:
      return categories.includes(category || "")
        ? category!
        : "Noticias Locales";
  }
}

export default function EditarNoticiaPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();

  const id = params.id as string;

  const [article, setArticle] = useState<NewsArticle | null>(null);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Noticias Locales");
  const [author, setAuthor] = useState("Hola Puerto Rico+");
  const [featured, setFeatured] = useState(false);
  const [breaking, setBreaking] = useState(false);
  const [status, setStatus] =
    useState<"draft" | "published">("draft");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] =
    useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadArticle() {
      setLoading(true);
      setError("");

      const { data, error: fetchError } = await supabase
        .from("news")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (fetchError) {
        setError(
          `No se pudo cargar la noticia: ${fetchError.message}`
        );
        setLoading(false);
        return;
      }

      if (!data) {
        setError("La noticia no existe.");
        setLoading(false);
        return;
      }

      const loadedArticle = data as NewsArticle;

      setArticle(loadedArticle);
      setTitle(loadedArticle.title);
      setSlug(loadedArticle.slug);
      setExcerpt(loadedArticle.excerpt || "");
      setContent(loadedArticle.content);
      setCategory(normalizeCategory(loadedArticle.category));
      setAuthor(loadedArticle.author);
      setFeatured(loadedArticle.featured);
      setBreaking(loadedArticle.breaking);
      setStatus(loadedArticle.status);
      setImagePreview(loadedArticle.image_url);

      setLoading(false);
    }

    loadArticle();
  }, [id]);

  function createSlug(value: string) {
    return value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function handleTitleChange(value: string) {
    const previousGeneratedSlug = createSlug(title);

    setTitle(value);

    if (!slug || slug === previousGeneratedSlug) {
      setSlug(createSlug(value));
    }
  }

  function handleImageChange(file: File | null) {
    setImageFile(file);

    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(article?.image_url || null);
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      /*
       * 1. COMPROBAR SESIÓN
       */
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw new Error(
          `Error comprobando la sesión: ${userError.message}`
        );
      }

      if (!user) {
        throw new Error(
          "No hay un usuario autenticado. Tu sesión de Supabase no está activa."
        );
      }

      console.log("=== DIAGNÓSTICO DE EDICIÓN ===");
      console.log("Usuario autenticado:", user.id);
      console.log("Email:", user.email);
      console.log("ID de noticia:", id);
      console.log("Categoría seleccionada:", category);

      /*
       * 2. VALIDACIONES
       */
      if (!title.trim()) {
        throw new Error("El título es obligatorio.");
      }

      if (!slug.trim()) {
        throw new Error("El slug es obligatorio.");
      }

      if (!content.trim()) {
        throw new Error("El contenido es obligatorio.");
      }

      if (!author.trim()) {
        throw new Error("El autor es obligatorio.");
      }

      if (!categories.includes(category)) {
        throw new Error(
          `La categoría "${category}" no es válida.`
        );
      }

      /*
       * 3. IMAGEN
       */
      let imageUrl = article?.image_url || null;

      if (imageFile) {
        if (!imageFile.type.startsWith("image/")) {
          throw new Error(
            "El archivo seleccionado no es una imagen."
          );
        }

        if (imageFile.size > 10 * 1024 * 1024) {
          throw new Error(
            "La imagen no puede superar los 10 MB."
          );
        }

        const extension =
          imageFile.name.split(".").pop()?.toLowerCase() ||
          "jpg";

        const filePath = `news/${new Date().getFullYear()}/${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}.${extension}`;

        const { error: uploadError } =
          await supabase.storage
            .from("news-images")
            .upload(filePath, imageFile, {
              cacheControl: "3600",
              upsert: false,
            });

        if (uploadError) {
          throw new Error(
            `No se pudo subir la imagen: ${uploadError.message}`
          );
        }

        const { data: publicUrlData } =
          supabase.storage
            .from("news-images")
            .getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;
      }

      /*
       * 4. COMPROBAR QUE LA NOTICIA EXISTE
       */
      const {
        data: existingArticle,
        error: existingError,
      } = await supabase
        .from("news")
        .select("id, title, category, status")
        .eq("id", id)
        .maybeSingle();

      if (existingError) {
        throw new Error(
          `No se pudo comprobar la noticia: ${existingError.message}`
        );
      }

      if (!existingArticle) {
        throw new Error(
          `Supabase no encontró la noticia con el ID: ${id}`
        );
      }

      console.log(
        "Noticia encontrada antes del UPDATE:",
        existingArticle
      );

      /*
       * 5. DATOS QUE SE GUARDARÁN
       */
      const updateData = {
        title: title.trim(),
        slug: slug.trim(),
        excerpt: excerpt.trim() || null,
        content: content.trim(),
        image_url: imageUrl,
        category: normalizeCategory(category),
        author: author.trim(),
        status,
        featured,
        breaking,
        published_at:
          status === "published"
            ? article?.published_at ||
              new Date().toISOString()
            : null,
        updated_at: new Date().toISOString(),
      };

      console.log("Datos enviados al UPDATE:", updateData);

      /*
       * 6. ACTUALIZAR
       */
      const {
        data: updatedArticle,
        error: updateError,
      } = await supabase
        .from("news")
        .update(updateData)
        .eq("id", id)
        .select("*")
        .single();

      console.log("Resultado del UPDATE:", {
        updatedArticle,
        updateError,
      });

      if (updateError) {
        throw new Error(
          `Supabase rechazó la actualización: ${updateError.message}`
        );
      }

      if (!updatedArticle) {
        throw new Error(
          "Supabase no devolvió la noticia después de actualizarla."
        );
      }

      /*
       * 7. CONFIRMAR CATEGORÍA
       */
      if (updatedArticle.category !== updateData.category) {
        throw new Error(
          `La noticia se actualizó, pero Supabase devolvió la categoría "${updatedArticle.category}" en lugar de "${updateData.category}".`
        );
      }

      /*
       * 8. ACTUALIZAR EL ESTADO DEL FORMULARIO
       */
      const savedArticle =
        updatedArticle as NewsArticle;

      setArticle(savedArticle);
      setTitle(savedArticle.title);
      setSlug(savedArticle.slug);
      setExcerpt(savedArticle.excerpt || "");
      setContent(savedArticle.content);
      setCategory(savedArticle.category);
      setAuthor(savedArticle.author);
      setFeatured(savedArticle.featured);
      setBreaking(savedArticle.breaking);
      setStatus(savedArticle.status);
      setImagePreview(savedArticle.image_url);
      setImageFile(null);

      setMessage(
        `La noticia fue actualizada correctamente. Categoría guardada: ${savedArticle.category}`
      );

      console.log(
        "=== EDICIÓN COMPLETADA CORRECTAMENTE ==="
      );
    } catch (saveError) {
      console.error(
        "=== ERROR COMPLETO AL GUARDAR ===",
        saveError
      );

      setError(
        saveError instanceof Error
          ? saveError.message
          : "Ocurrió un error inesperado."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      "¿Seguro que quieres eliminar esta noticia? Esta acción no se puede deshacer."
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setError("");

    const { error: deleteError } = await supabase
      .from("news")
      .delete()
      .eq("id", id);

    if (deleteError) {
      setError(
        `No se pudo eliminar la noticia: ${deleteError.message}`
      );
      setDeleting(false);
      return;
    }

    router.push("/admin/noticias");
    router.refresh();
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f6f8]">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-gray-400">
          Cargando noticia...
        </p>
      </main>
    );
  }

  if (!article) {
    return (
      <main className="min-h-screen bg-[#f5f6f8] px-6 py-12">
        <div className="mx-auto max-w-3xl border border-red-200 bg-red-50 p-6">
          <p className="text-sm font-bold text-red-700">
            {error || "No se encontró la noticia."}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f6f8]">
      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600">
              Gestión editorial
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-gray-950 sm:text-4xl">
              Editar noticia
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Modifica el contenido y la configuración de esta publicación.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/admin/noticias")}
            className="border border-gray-300 bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.1em] text-gray-700 transition hover:border-gray-950 hover:text-gray-950"
          >
            Volver a noticias
          </button>
        </div>

        {message && (
          <div className="mb-6 border border-green-200 bg-green-50 px-5 py-4 text-sm font-semibold text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <section className="border border-gray-200 bg-white">
              <div className="border-b border-gray-200 px-6 py-5">
                <h2 className="text-sm font-black uppercase tracking-[0.12em] text-gray-950">
                  Información de la noticia
                </h2>
              </div>

              <div className="space-y-6 p-6">
                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-[0.1em] text-gray-700">
                    Título
                  </label>

                  <input
                    type="text"
                    value={title}
                    onChange={(event) =>
                      handleTitleChange(event.target.value)
                    }
                    className="w-full border border-gray-300 bg-white px-4 py-3 text-base font-semibold text-gray-950 outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-[0.1em] text-gray-700">
                    Slug
                  </label>

                  <input
                    type="text"
                    value={slug}
                    onChange={(event) =>
                      setSlug(event.target.value)
                    }
                    className="w-full border border-gray-300 bg-white px-4 py-3 text-sm text-gray-950 outline-none focus:border-red-600"
                  />

                  <p className="mt-2 text-xs text-gray-400">
                    URL: /noticias/{slug}
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-[0.1em] text-gray-700">
                    Resumen
                  </label>

                  <textarea
                    value={excerpt}
                    onChange={(event) =>
                      setExcerpt(event.target.value)
                    }
                    rows={4}
                    className="w-full resize-none border border-gray-300 bg-white px-4 py-3 text-sm leading-6 text-gray-950 outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-[0.1em] text-gray-700">
                    Contenido
                  </label>

                  <textarea
                    value={content}
                    onChange={(event) =>
                      setContent(event.target.value)
                    }
                    rows={18}
                    className="w-full resize-y border border-gray-300 bg-white px-4 py-3 text-sm leading-7 text-gray-950 outline-none focus:border-red-600"
                  />
                </div>
              </div>
            </section>

            <aside className="space-y-6">
              <section className="border border-gray-200 bg-white">
                <div className="border-b border-gray-200 px-6 py-5">
                  <h2 className="text-sm font-black uppercase tracking-[0.12em] text-gray-950">
                    Publicación
                  </h2>
                </div>

                <div className="space-y-5 p-6">
                  <div>
                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.1em] text-gray-700">
                      Categoría
                    </label>

                    <select
                      value={category}
                      onChange={(event) =>
                        setCategory(event.target.value)
                      }
                      className="w-full border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-950 outline-none focus:border-red-600"
                    >
                      {categories.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.1em] text-gray-700">
                      Autor
                    </label>

                    <input
                      type="text"
                      value={author}
                      onChange={(event) =>
                        setAuthor(event.target.value)
                      }
                      className="w-full border border-gray-300 bg-white px-4 py-3 text-sm text-gray-950 outline-none focus:border-red-600"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.1em] text-gray-700">
                      Estado
                    </label>

                    <select
                      value={status}
                      onChange={(event) =>
                        setStatus(
                          event.target.value as
                            | "draft"
                            | "published"
                        )
                      }
                      className="w-full border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-950 outline-none focus:border-red-600"
                    >
                      <option value="draft">Borrador</option>
                      <option value="published">Publicada</option>
                    </select>
                  </div>

                  <label className="flex cursor-pointer items-center justify-between border border-gray-200 px-4 py-4">
                    <div>
                      <p className="text-sm font-bold text-gray-950">
                        Noticia destacada
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Mostrar en el carrusel principal.
                      </p>
                    </div>

                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(event) =>
                        setFeatured(event.target.checked)
                      }
                      className="h-5 w-5 accent-red-600"
                    />
                  </label>

                  <label className="flex cursor-pointer items-center justify-between border border-gray-200 px-4 py-4">
                    <div>
                      <p className="text-sm font-bold text-gray-950">
                        Última hora
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Marcar como noticia urgente.
                      </p>
                    </div>

                    <input
                      type="checkbox"
                      checked={breaking}
                      onChange={(event) =>
                        setBreaking(event.target.checked)
                      }
                      className="h-5 w-5 accent-red-600"
                    />
                  </label>
                </div>
              </section>

              <section className="border border-gray-200 bg-white">
                <div className="border-b border-gray-200 px-6 py-5">
                  <h2 className="text-sm font-black uppercase tracking-[0.12em] text-gray-950">
                    Imagen principal
                  </h2>
                </div>

                <div className="p-6">
                  {imagePreview ? (
                    <div className="mb-4 overflow-hidden border border-gray-200 bg-gray-100">
                      <img
                        src={imagePreview}
                        alt="Imagen principal"
                        className="h-auto w-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="mb-4 flex aspect-square items-center justify-center border border-dashed border-gray-300 bg-gray-50 text-center">
                      <p className="px-6 text-xs font-bold uppercase tracking-[0.12em] text-gray-400">
                        Sin imagen
                      </p>
                    </div>
                  )}

                  <label className="block cursor-pointer border border-gray-300 bg-white px-4 py-3 text-center text-xs font-black uppercase tracking-[0.1em] text-gray-700 transition hover:border-red-600 hover:text-red-600">
                    Cambiar imagen

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) =>
                        handleImageChange(
                          event.target.files?.[0] || null
                        )
                      }
                      className="hidden"
                    />
                  </label>

                  <p className="mt-3 text-xs leading-5 text-gray-400">
                    Recomendado: imagen cuadrada de 1080 × 1080 px.
                    Máximo 10 MB.
                  </p>
                </div>
              </section>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-gray-950 px-6 py-4 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Guardando cambios..."
                  : "Guardar cambios"}
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="w-full border border-red-200 bg-white px-6 py-4 text-sm font-black uppercase tracking-[0.12em] text-red-600 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting
                  ? "Eliminando..."
                  : "Eliminar noticia"}
              </button>
            </aside>
          </div>
        </form>
      </div>
    </main>
  );
}