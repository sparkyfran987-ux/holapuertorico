"use client";

import { FormEvent, useEffect, useState } from "react";
import { createNews } from "./actions";

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

function createSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function NuevaNoticiaForm() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Noticias Locales");
  const [author, setAuthor] = useState("Hola Puerto Rico+");
  const [featured, setFeatured] = useState(false);
  const [breaking, setBreaking] = useState(false);
  const [status, setStatus] = useState<"draft" | "published">("draft");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  function handleTitleChange(value: string) {
    setTitle(value);

    if (!slug || slug === createSlug(title)) {
      setSlug(createSlug(value));
    }
  }

  function handleImageChange(file: File | null) {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(file);

    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
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

      if (imageFile) {
        if (!imageFile.type.startsWith("image/")) {
          throw new Error("El archivo seleccionado no es una imagen.");
        }

        if (imageFile.size > 10 * 1024 * 1024) {
          throw new Error("La imagen no puede superar los 10 MB.");
        }
      }

      const formData = new FormData();

      formData.append("title", title.trim());
      formData.append("slug", slug.trim());
      formData.append("excerpt", excerpt.trim());
      formData.append("content", content.trim());
      formData.append("category", category);
      formData.append("author", author.trim());
      formData.append("status", status);
      formData.append("featured", String(featured));
      formData.append("breaking", String(breaking));

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const result = await createNews(formData);

      if (!result.success) {
        throw new Error(result.message);
      }

      setMessage(
        status === "published"
          ? "La noticia fue publicada correctamente."
          : "La noticia fue guardada como borrador."
      );

      setTitle("");
      setSlug("");
      setExcerpt("");
      setContent("");
      setCategory("Noticias Locales");
      setAuthor("Hola Puerto Rico+");
      setFeatured(false);
      setBreaking(false);
      setStatus("draft");
      handleImageChange(null);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Ocurrió un error inesperado."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f6f8]">
      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600">
            Gestión editorial
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-gray-950 sm:text-4xl">
            Nueva noticia
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            Crea, configura y publica una nueva noticia para Hola Puerto Rico+.
          </p>
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
                    placeholder="Escribe el título de la noticia"
                    className="w-full border border-gray-300 bg-white px-4 py-3 text-base font-semibold text-gray-950 outline-none transition focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-[0.1em] text-gray-700">
                    Slug
                  </label>

                  <input
                    type="text"
                    value={slug}
                    onChange={(event) => setSlug(event.target.value)}
                    placeholder="titulo-de-la-noticia"
                    className="w-full border border-gray-300 bg-white px-4 py-3 text-sm text-gray-950 outline-none transition focus:border-red-600"
                  />

                  <p className="mt-2 text-xs text-gray-400">
                    URL: /noticias/{slug || "titulo-de-la-noticia"}
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-[0.1em] text-gray-700">
                    Resumen
                  </label>

                  <textarea
                    value={excerpt}
                    onChange={(event) => setExcerpt(event.target.value)}
                    rows={4}
                    placeholder="Breve resumen que aparecerá en tarjetas y listados."
                    className="w-full resize-none border border-gray-300 bg-white px-4 py-3 text-sm leading-6 text-gray-950 outline-none transition focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-[0.1em] text-gray-700">
                    Contenido
                  </label>

                  <textarea
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    rows={18}
                    placeholder="Escribe aquí el contenido completo de la noticia..."
                    className="w-full resize-y border border-gray-300 bg-white px-4 py-3 text-sm leading-7 text-gray-950 outline-none transition focus:border-red-600"
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
                      onChange={(event) => setCategory(event.target.value)}
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
                      onChange={(event) => setAuthor(event.target.value)}
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
                          event.target.value as "draft" | "published"
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
                        alt="Vista previa"
                        className="h-auto w-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="mb-4 flex aspect-square items-center justify-center border border-dashed border-gray-300 bg-gray-50 text-center">
                      <p className="px-6 text-xs font-bold uppercase tracking-[0.12em] text-gray-400">
                        Vista previa de la imagen
                      </p>
                    </div>
                  )}

                  <label className="block cursor-pointer border border-gray-300 bg-white px-4 py-3 text-center text-xs font-black uppercase tracking-[0.1em] text-gray-700 transition hover:border-red-600 hover:text-red-600">
                    Seleccionar imagen

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
                    Recomendado: imagen cuadrada de 1080 × 1080 px. Máximo 10
                    MB.
                  </p>
                </div>
              </section>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-950 px-6 py-4 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Guardando..."
                  : status === "published"
                    ? "Publicar noticia"
                    : "Guardar borrador"}
              </button>
            </aside>
          </div>
        </form>
      </div>
    </main>
  );
}