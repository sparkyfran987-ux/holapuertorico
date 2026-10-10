"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
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

function createSlug(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function NuevaNoticiaForm() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [backlink, setBacklink] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [author, setAuthor] = useState("Hola Puerto Rico+");
  const [status, setStatus] = useState<"draft" | "published">("published");
  const [featured, setFeatured] = useState(false);
  const [breaking, setBreaking] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleTitleChange(value: string) {
    setTitle(value);
    setSlug(createSlug(value));
  }

  function handleImageChange(file: File | null) {
    setImageFile(file);

    if (!file) {
      setImagePreview("");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  }

  async function saveArticle(saveStatus: "draft" | "published") {
    setSaving(true);
    setMessage("");
    setError("");

    if (!title.trim()) {
      setError("El título es obligatorio.");
      setSaving(false);
      return;
    }

    if (!slug.trim()) {
      setError("El URL de la noticia es obligatorio.");
      setSaving(false);
      return;
    }

    if (!backlink.trim()) {
      setError("El backlink de la publicación es obligatorio.");
      setSaving(false);
      return;
    }

    try {
      new URL(backlink.trim());
    } catch {
      setError("El backlink debe ser una URL válida.");
      setSaving(false);
      return;
    }

    if (saveStatus === "published" && !backlink.trim()) {
      setError("Para publicar la noticia debes añadir el backlink.");
      setSaving(false);
      return;
    }

    const formData = new FormData();

    formData.append("title", title.trim());
    formData.append("slug", slug.trim());
    formData.append("excerpt", excerpt.trim());
    formData.append("backlink", backlink.trim());
    formData.append("category", category);
    formData.append("author", author.trim() || "Hola Puerto Rico+");
    formData.append("status", saveStatus);
    formData.append("featured", String(featured));
    formData.append("breaking", String(breaking));

    if (imageFile) {
      formData.append("image", imageFile);
    }

    const result = await createNews(formData);

    if (!result?.success) {
      setError(result?.error || "No se pudo guardar la noticia.");
      setSaving(false);
      return;
    }

    setMessage(
      saveStatus === "published"
        ? "La noticia fue publicada correctamente."
        : "La noticia fue guardada como borrador."
    );

    setSaving(false);

    if (saveStatus === "published") {
      setTitle("");
      setSlug("");
      setExcerpt("");
      setBacklink("");
      setCategory(categories[0]);
      setAuthor("Hola Puerto Rico+");
      setStatus("published");
      setFeatured(false);
      setBreaking(false);
      setImageFile(null);
      setImagePreview("");
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    saveArticle(status);
  }

  return (
    <main className="min-h-screen bg-[#f7f7f8]">
      <header className="sticky top-0 z-40 flex h-[76px] items-center justify-between border-b border-gray-200 bg-white/95 px-6 backdrop-blur md:px-10">
        <div>
          <Link
            href="/admin/noticias"
            className="text-xs font-medium text-gray-400 transition hover:text-gray-700"
          >
            ← Noticias
          </Link>

          <h1 className="mt-1 text-lg font-bold text-gray-900">
            Nueva noticia
          </h1>
        </div>

        <Link
          href="/admin"
          className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Cancelar
        </Link>
      </header>

      <div className="mx-auto max-w-[1200px] px-6 py-8 md:px-10">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_300px]">
            <section className="space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">
                  Información de la noticia
                </p>

                <div className="mt-5">
                  <label className="mb-2 block text-sm font-semibold text-gray-900">
                    Título
                  </label>

                  <input
                    value={title}
                    onChange={(event) =>
                      handleTitleChange(event.target.value)
                    }
                    placeholder="Escribe el título de la noticia..."
                    className="w-full rounded-xl border border-gray-200 px-4 py-4 text-xl font-bold text-gray-900 outline-none transition placeholder:text-gray-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                  />
                </div>

                <div className="mt-5">
                  <label className="mb-2 block text-sm font-semibold text-gray-900">
                    URL
                  </label>

                  <div className="flex overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                    <span className="flex items-center border-r border-gray-200 px-3 text-xs text-gray-400">
                      /noticias/
                    </span>

                    <input
                      value={slug}
                      onChange={(event) => setSlug(event.target.value)}
                      className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-gray-700 outline-none"
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <label className="mb-2 block text-sm font-semibold text-gray-900">
                    Resumen
                  </label>

                  <textarea
                    value={excerpt}
                    onChange={(event) => setExcerpt(event.target.value)}
                    rows={4}
                    placeholder="Escribe un resumen breve de la noticia..."
                    className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition placeholder:text-gray-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                  />
                </div>

                <div className="mt-5">
                  <label className="mb-2 block text-sm font-semibold text-gray-900">
                    Backlink de la publicación
                    <span className="ml-1 text-red-600">*</span>
                  </label>

                  <input
                    type="url"
                    value={backlink}
                    onChange={(event) => setBacklink(event.target.value)}
                    placeholder="https://www.facebook.com/..."
                    required
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                  />

                  <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
                    <p className="text-xs font-semibold text-blue-900">
                      Esta noticia utiliza un enlace externo
                    </p>

                    <p className="mt-1 text-xs leading-5 text-blue-700">
                      Pega aquí el enlace de la publicación de Facebook.
                      Cuando el visitante presione “Leer noticia”, será
                      llevado directamente a esa publicación.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">
                  Imagen principal
                </p>

                <div className="mt-5">
                  <label
                    htmlFor="news-image"
                    className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 px-6 py-10 text-center transition hover:border-red-300 hover:bg-red-50/30"
                  >
                    {imagePreview ? (
                      <div className="w-full">
                        <div className="flex max-h-[420px] items-center justify-center overflow-hidden rounded-xl bg-white p-4">
                          <img
                            src={imagePreview}
                            alt="Vista previa"
                            className="max-h-[380px] max-w-full object-contain"
                          />
                        </div>

                        <p className="mt-4 text-xs font-medium text-gray-500">
                          Haz clic para cambiar la imagen
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-gray-400 shadow-sm">
                          <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                          >
                            <rect
                              x="3"
                              y="3"
                              width="18"
                              height="18"
                              rx="2"
                            />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <path d="m21 15-5-5L5 21" />
                          </svg>
                        </div>

                        <p className="mt-4 text-sm font-semibold text-gray-700">
                          Selecciona una imagen
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          PNG, JPG o WEBP
                        </p>
                      </>
                    )}

                    <input
                      id="news-image"
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={(event) =>
                        handleImageChange(event.target.files?.[0] || null)
                      }
                    />
                  </label>
                </div>
              </div>
            </section>

            <aside className="space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">
                  Publicación
                </p>

                <div className="mt-5">
                  <label className="mb-2 block text-sm font-semibold text-gray-900">
                    Categoría
                  </label>

                  <select
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm text-gray-900 outline-none transition focus:border-red-500"
                  >
                    {categories.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-5">
                  <label className="mb-2 block text-sm font-semibold text-gray-900">
                    Autor
                  </label>

                  <input
                    value={author}
                    onChange={(event) => setAuthor(event.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm text-gray-900 outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                  />
                </div>

                <div className="mt-5">
                  <label className="mb-2 block text-sm font-semibold text-gray-900">
                    Estado
                  </label>

                  <select
                    value={status}
                    onChange={(event) =>
                      setStatus(
                        event.target.value as "draft" | "published"
                      )
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm text-gray-900 outline-none transition focus:border-red-500"
                  >
                    <option value="published">Publicada</option>
                    <option value="draft">Borrador</option>
                  </select>
                </div>

                <div className="mt-5 space-y-3">
                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-100 p-3 transition hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(event) =>
                        setFeatured(event.target.checked)
                      }
                      className="h-4 w-4 rounded border-gray-300 accent-red-600"
                    />

                    <span className="text-sm font-medium text-gray-800">
                      Destacar en portada
                    </span>
                  </label>

                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-100 p-3 transition hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={breaking}
                      onChange={(event) =>
                        setBreaking(event.target.checked)
                      }
                      className="h-4 w-4 rounded border-gray-300 accent-red-600"
                    />

                    <span className="text-sm font-medium text-gray-800">
                      Marcar como última hora
                    </span>
                  </label>
                </div>

                <div className="mt-6 space-y-2">
                  <button
                    type="submit"
                    disabled={saving}
                    onClick={() => setStatus("published")}
                    className="w-full rounded-xl bg-[#151515] px-4 py-3 text-sm font-bold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving && status === "published"
                      ? "Publicando..."
                      : "Publicar noticia"}
                  </button>

                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => saveArticle("draft")}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving && status === "draft"
                      ? "Guardando..."
                      : "Guardar borrador"}
                  </button>
                </div>

                {message && (
                  <div className="mt-4 rounded-xl border border-green-100 bg-green-50 p-3 text-sm font-medium text-green-700">
                    {message}
                  </div>
                )}

                {error && (
                  <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-3 text-sm font-medium text-red-700">
                    {error}
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-700">
                  Cómo funcionará
                </p>

                <p className="mt-3 text-sm leading-6 text-blue-900">
                  La noticia aparecerá en Hola Puerto Rico+ con su título,
                  resumen e imagen. El botón “Leer noticia” abrirá el
                  backlink que colocaste aquí.
                </p>
              </div>
            </aside>
          </div>
        </form>
      </div>
    </main>
  );
}