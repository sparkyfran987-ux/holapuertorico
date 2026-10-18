"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Editorial = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  image_url: string | null;
  author: string;
  status: "draft" | "published";
  featured: boolean;
  published_at: string | null;
  created_at: string;
};

type FormState = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  status: "draft" | "published";
  featured: boolean;
};

const emptyForm: FormState = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  author: "",
  status: "draft",
  featured: false,
};

function createSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function formatDate(date: string | null) {
  if (!date) return "";

  return new Intl.DateTimeFormat("es-PR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export default function EditorialAdminPage() {
  const supabase = createClient();

  const [editorials, setEditorials] = useState<Editorial[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadEditorials() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("editorials")
      .select(
        "id, title, slug, excerpt, content, image_url, author, status, featured, published_at, created_at"
      )
      .order("created_at", { ascending: false });

    if (error) {
      setError(`No se pudieron cargar los editoriales: ${error.message}`);
      setLoading(false);
      return;
    }

    setEditorials((data ?? []) as Editorial[]);
    setLoading(false);
  }

  useEffect(() => {
    loadEditorials();
  }, []);

  function updateField<K extends keyof FormState>(
    field: K,
    value: FormState[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleTitleChange(value: string) {
    setForm((current) => ({
      ...current,
      title: value,
      slug:
        editingId || current.slug
          ? current.slug
          : createSlug(value),
    }));
  }

  function startNewEditorial() {
    setEditingId(null);
    setForm(emptyForm);
    setSelectedFile(null);
    setCurrentImageUrl(null);
    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function startEditing(editorial: Editorial) {
    setEditingId(editorial.id);

    setForm({
      title: editorial.title,
      slug: editorial.slug,
      excerpt: editorial.excerpt ?? "",
      content: editorial.content,
      author: editorial.author,
      status: editorial.status,
      featured: editorial.featured,
    });

    setCurrentImageUrl(editorial.image_url);
    setSelectedFile(null);
    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("El archivo seleccionado no es una imagen.");
      event.target.value = "";
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setError("La imagen no puede superar los 8 MB.");
      event.target.value = "";
      return;
    }

    setError("");
    setSelectedFile(file);
  }

  async function uploadImage(file: File) {
    const extension =
      file.name.split(".").pop()?.toLowerCase() || "jpg";

    const fileName = `${crypto.randomUUID()}.${extension}`;
    const filePath = `editorials/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("sponsor-logos")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) {
      throw new Error(
        `No se pudo subir la imagen: ${uploadError.message}`
      );
    }

    const { data } = supabase.storage
      .from("sponsor-logos")
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (!form.title.trim()) {
        throw new Error("Escribe un título para el editorial.");
      }

      if (!form.slug.trim()) {
        throw new Error("El editorial necesita un slug.");
      }

      if (!form.author.trim()) {
        throw new Error("Escribe el nombre del autor.");
      }

      if (!form.content.trim()) {
        throw new Error("Escribe el contenido del editorial.");
      }

      let imageUrl = currentImageUrl;

      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile);
      }

      const publishedAt =
        form.status === "published"
          ? new Date().toISOString()
          : null;

      const payload = {
        title: form.title.trim(),
        slug: createSlug(form.slug),
        excerpt: form.excerpt.trim() || null,
        content: form.content.trim(),
        author: form.author.trim(),
        image_url: imageUrl,
        status: form.status,
        featured: form.featured,
        published_at: publishedAt,
        updated_at: new Date().toISOString(),
      };

      if (form.featured) {
        await supabase
          .from("editorials")
          .update({ featured: false })
          .neq("id", editingId ?? "");
      }

      if (editingId) {
        const { error: updateError } = await supabase
          .from("editorials")
          .update(payload)
          .eq("id", editingId);

        if (updateError) {
          throw new Error(
            `No se pudo actualizar: ${updateError.message}`
          );
        }

        setSuccess("Editorial actualizado correctamente.");
      } else {
        const { error: insertError } = await supabase
          .from("editorials")
          .insert(payload);

        if (insertError) {
          throw new Error(
            `No se pudo crear el editorial: ${insertError.message}`
          );
        }

        setSuccess("Editorial creado correctamente.");
      }

      setEditingId(null);
      setForm(emptyForm);
      setSelectedFile(null);
      setCurrentImageUrl(null);

      await loadEditorials();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Ocurrió un error inesperado."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteEditorial(editorial: Editorial) {
    const confirmed = window.confirm(
      `¿Seguro que quieres eliminar "${editorial.title}"?`
    );

    if (!confirmed) return;

    setDeleting(editorial.id);
    setError("");
    setSuccess("");

    try {
      const { error: deleteError } = await supabase
        .from("editorials")
        .delete()
        .eq("id", editorial.id);

      if (deleteError) {
        throw new Error(
          `No se pudo eliminar: ${deleteError.message}`
        );
      }

      setSuccess("Editorial eliminado correctamente.");

      if (editingId === editorial.id) {
        startNewEditorial();
      }

      await loadEditorials();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo eliminar el editorial."
      );
    } finally {
      setDeleting(null);
    }
  }

  async function toggleStatus(editorial: Editorial) {
    setError("");
    setSuccess("");

    const newStatus =
      editorial.status === "published" ? "draft" : "published";

    const { error: updateError } = await supabase
      .from("editorials")
      .update({
        status: newStatus,
        published_at:
          newStatus === "published"
            ? new Date().toISOString()
            : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", editorial.id);

    if (updateError) {
      setError(`No se pudo cambiar el estado: ${updateError.message}`);
      return;
    }

    setSuccess(
      newStatus === "published"
        ? "Editorial publicado."
        : "Editorial movido a borradores."
    );

    await loadEditorials();
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <main className="min-h-screen bg-[#f5f6f8]">
      {/* Header */}
      <header className="border-b border-gray-200 bg-[#071428] text-white">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff647f]">
              Hola Puerto Rico+
            </p>

            <h1 className="mt-1 text-2xl font-black">
              Administración de Editoriales
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/editorial"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/20 px-4 py-2 text-xs font-black transition hover:bg-white/10"
            >
              Ver Editorial
            </a>

            <button
              type="button"
              onClick={logout}
              className="rounded-full bg-[#bf0a30] px-4 py-2 text-xs font-black transition hover:bg-[#a50828]"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8 lg:py-10">
        {/* Mensajes */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-semibold text-green-700">
            {success}
          </div>
        )}

        {/* Editor */}
        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#bf0a30]">
                {editingId ? "Editar" : "Nuevo"}
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-tight text-[#071428]">
                {editingId
                  ? "Editar editorial"
                  : "Crear editorial"}
              </h2>
            </div>

            {editingId && (
              <button
                type="button"
                onClick={startNewEditorial}
                className="rounded-full border border-gray-200 px-5 py-2.5 text-sm font-black text-gray-600 transition hover:bg-gray-50"
              >
                + Nuevo editorial
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Título */}
              <div className="lg:col-span-2">
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-gray-600">
                  Título
                </label>

                <input
                  type="text"
                  value={form.title}
                  onChange={(event) =>
                    handleTitleChange(event.target.value)
                  }
                  placeholder="Título del editorial"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base font-semibold outline-none transition focus:border-[#071428] focus:ring-2 focus:ring-[#071428]/10"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-gray-600">
                  Slug / URL
                </label>

                <input
                  type="text"
                  value={form.slug}
                  onChange={(event) =>
                    updateField("slug", createSlug(event.target.value))
                  }
                  placeholder="titulo-del-editorial"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#071428] focus:ring-2 focus:ring-[#071428]/10"
                />

                <p className="mt-2 text-xs text-gray-400">
                  /editorial/{form.slug || "titulo-del-editorial"}
                </p>
              </div>

              {/* Autor */}
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-gray-600">
                  Autor
                </label>

                <input
                  type="text"
                  value={form.author}
                  onChange={(event) =>
                    updateField("author", event.target.value)
                  }
                  placeholder="Nombre del autor"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#071428] focus:ring-2 focus:ring-[#071428]/10"
                />
              </div>

              {/* Extracto */}
              <div className="lg:col-span-2">
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-gray-600">
                  Extracto
                </label>

                <textarea
                  value={form.excerpt}
                  onChange={(event) =>
                    updateField("excerpt", event.target.value)
                  }
                  rows={3}
                  placeholder="Breve introducción que aparecerá en las tarjetas..."
                  className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm leading-6 outline-none transition focus:border-[#071428] focus:ring-2 focus:ring-[#071428]/10"
                />
              </div>

              {/* Imagen */}
              <div className="lg:col-span-2">
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-gray-600">
                  Imagen destacada
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm"
                />

                <p className="mt-2 text-xs text-gray-400">
                  Máximo 8 MB.
                </p>

                {(selectedFile || currentImageUrl) && (
                  <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200">
                    {selectedFile ? (
                      <img
                        src={URL.createObjectURL(selectedFile)}
                        alt="Vista previa"
                        className="h-64 w-full object-cover"
                      />
                    ) : currentImageUrl ? (
                      <img
                        src={currentImageUrl}
                        alt="Imagen actual"
                        className="h-64 w-full object-cover"
                      />
                    ) : null}
                  </div>
                )}
              </div>

              {/* Contenido */}
              <div className="lg:col-span-2">
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-gray-600">
                  Contenido
                </label>

                <textarea
                  value={form.content}
                  onChange={(event) =>
                    updateField("content", event.target.value)
                  }
                  rows={16}
                  placeholder="Escribe aquí el editorial..."
                  className="w-full resize-y rounded-xl border border-gray-200 px-4 py-4 text-base leading-8 outline-none transition focus:border-[#071428] focus:ring-2 focus:ring-[#071428]/10"
                />
              </div>

              {/* Estado */}
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-gray-600">
                  Estado
                </label>

                <select
                  value={form.status}
                  onChange={(event) =>
                    updateField(
                      "status",
                      event.target.value as "draft" | "published"
                    )
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-[#071428]"
                >
                  <option value="draft">Borrador</option>
                  <option value="published">Publicado</option>
                </select>
              </div>

              {/* Destacado */}
              <div className="flex items-end">
                <label className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-gray-200 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(event) =>
                      updateField("featured", event.target.checked)
                    }
                    className="h-4 w-4"
                  />

                  <span>
                    <span className="block text-sm font-black text-[#071428]">
                      Editorial destacado
                    </span>

                    <span className="block text-xs text-gray-400">
                      Aparecerá como el principal en /editorial.
                    </span>
                  </span>
                </label>
              </div>
            </div>

            {/* Botones */}
            <div className="flex flex-wrap items-center gap-3 border-t border-gray-100 pt-6">
              <button
                type="submit"
                disabled={saving}
                className="rounded-full bg-[#071428] px-7 py-3.5 text-sm font-black text-white transition hover:bg-[#bf0a30] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Guardando..."
                  : editingId
                    ? "Guardar cambios"
                    : "Crear editorial"}
              </button>

              <button
                type="button"
                onClick={startNewEditorial}
                className="rounded-full border border-gray-200 px-7 py-3.5 text-sm font-black text-gray-600 transition hover:bg-gray-50"
              >
                Limpiar
              </button>
            </div>
          </form>
        </section>

        {/* Lista */}
        <section className="mt-8">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#bf0a30]">
                Biblioteca
              </p>

              <h2 className="mt-1 text-2xl font-black text-[#071428]">
                Tus editoriales
              </h2>
            </div>

            <span className="rounded-full bg-white px-4 py-2 text-xs font-black text-gray-500 shadow-sm">
              {editorials.length}{" "}
              {editorials.length === 1
                ? "editorial"
                : "editoriales"}
            </span>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-sm font-semibold text-gray-400">
              Cargando editoriales...
            </div>
          ) : editorials.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
              <h3 className="text-xl font-black text-[#071428]">
                Todavía no hay editoriales
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Crea el primero utilizando el formulario de arriba.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {editorials.map((editorial) => (
                <article
                  key={editorial.id}
                  className="flex flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center"
                >
                  {/* Imagen */}
                  <div className="h-24 w-full shrink-0 overflow-hidden rounded-xl bg-[#071428] sm:w-36">
                    {editorial.image_url ? (
                      <img
                        src={editorial.image_url}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-2xl font-black text-white/20">
                        PR
                      </div>
                    )}
                  </div>

                  {/* Información */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
                          editorial.status === "published"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {editorial.status === "published"
                          ? "Publicado"
                          : "Borrador"}
                      </span>

                      {editorial.featured && (
                        <span className="rounded-full bg-red-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#bf0a30]">
                          Destacado
                        </span>
                      )}
                    </div>

                    <h3 className="mt-2 truncate text-lg font-black text-[#071428]">
                      {editorial.title}
                    </h3>

                    <p className="mt-1 text-xs font-semibold text-gray-400">
                      Por {editorial.author}
                      {editorial.published_at
                        ? ` · ${formatDate(editorial.published_at)}`
                        : ""}
                    </p>
                  </div>

                  {/* Acciones */}
                  <div className="flex shrink-0 flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => startEditing(editorial)}
                      className="rounded-full border border-gray-200 px-4 py-2 text-xs font-black text-gray-600 transition hover:bg-gray-50"
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleStatus(editorial)}
                      className="rounded-full border border-gray-200 px-4 py-2 text-xs font-black text-gray-600 transition hover:bg-gray-50"
                    >
                      {editorial.status === "published"
                        ? "Despublicar"
                        : "Publicar"}
                    </button>

                    {editorial.status === "published" && (
                      <a
                        href={`/editorial/${editorial.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full border border-gray-200 px-4 py-2 text-xs font-black text-gray-600 transition hover:bg-gray-50"
                      >
                        Ver
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => deleteEditorial(editorial)}
                      disabled={deleting === editorial.id}
                      className="rounded-full border border-red-200 px-4 py-2 text-xs font-black text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                    >
                      {deleting === editorial.id
                        ? "Eliminando..."
                        : "Eliminar"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
