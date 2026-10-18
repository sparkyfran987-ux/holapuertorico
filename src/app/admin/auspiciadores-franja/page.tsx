
"use client";

import {
  useCallback,
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Sponsor = {
  id: string;
  name: string;
  image_url: string;
  target_url: string;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
};

const BUCKET = "sponsor-logos";

const EMPTY_FORM = {
  name: "",
  target_url: "",
};

export default function AuspiciadoresFranjaPage() {
  const router = useRouter();
  const [supabase] = useState(() => createClient());

  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState(EMPTY_FORM.name);
  const [targetUrl, setTargetUrl] = useState(EMPTY_FORM.target_url);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const loadSponsors = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from("sponsor_carousel")
      .select(
        "id, name, image_url, target_url, sort_order, is_active, created_at"
      )
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      setErrorMessage(
        `No se pudieron cargar los auspiciadores: ${error.message}`
      );
      setSponsors([]);
    } else {
      setSponsors((data ?? []) as Sponsor[]);
    }

    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    void loadSponsors();
  }, [loadSponsors]);

  function resetForm() {
    setEditingId(null);
    setName("");
    setTargetUrl("");
    setSelectedFile(null);
    setCurrentImageUrl("");
    setMessage("");
    setErrorMessage("");
  }

  function editSponsor(sponsor: Sponsor) {
    setEditingId(sponsor.id);
    setName(sponsor.name);
    setTargetUrl(sponsor.target_url);
    setCurrentImageUrl(sponsor.image_url);
    setSelectedFile(null);
    setMessage("");
    setErrorMessage("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    setErrorMessage("");
    setSelectedFile(file);

    if (file && !file.type.startsWith("image/")) {
      setErrorMessage("Selecciona un archivo de imagen válido.");
      setSelectedFile(null);
      event.target.value = "";
      return;
    }

    if (file && file.size > 8 * 1024 * 1024) {
      setErrorMessage("La imagen no puede superar los 8 MB.");
      setSelectedFile(null);
      event.target.value = "";
    }
  }

  async function uploadImage(file: File): Promise<string> {
    const extension = file.name.split(".").pop()?.toLowerCase() || "png";
    const safeExtension = /^[a-z0-9]+$/.test(extension)
      ? extension
      : "png";

    const path = `${crypto.randomUUID()}.${safeExtension}`;

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (error) {
      throw new Error(
        `No se pudo subir el logo. Verifica el bucket "${BUCKET}" y sus permisos. ${error.message}`
      );
    }

    const { data } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(path);

    if (!data.publicUrl) {
      throw new Error("No se pudo obtener la URL pública del logo.");
    }

    return data.publicUrl;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setErrorMessage("");

    try {
      const cleanName = name.trim();
      const cleanUrl = targetUrl.trim();

      if (!cleanName) {
        throw new Error("Escribe el nombre del auspiciador.");
      }

      let parsedUrl: URL;

      try {
        parsedUrl = new URL(cleanUrl);
      } catch {
        throw new Error("Escribe un enlace válido para el auspiciador.");
      }

      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        throw new Error("El enlace debe comenzar con http:// o https://.");
      }

      if (!editingId && !selectedFile) {
        throw new Error("Selecciona el logo del auspiciador.");
      }

      let imageUrl = currentImageUrl;

      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile);
      }

      if (!imageUrl) {
        throw new Error("El auspiciador necesita un logo.");
      }

      if (editingId) {
        const { error } = await supabase
          .from("sponsor_carousel")
          .update({
            name: cleanName,
            image_url: imageUrl,
            target_url: parsedUrl.toString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingId);

        if (error) throw new Error(error.message);

        setMessage("Auspiciador actualizado correctamente.");
      } else {
        const nextOrder =
          sponsors.length > 0
            ? Math.max(...sponsors.map((item) => item.sort_order)) + 1
            : 0;

        const { error } = await supabase
          .from("sponsor_carousel")
          .insert({
            name: cleanName,
            image_url: imageUrl,
            target_url: parsedUrl.toString(),
            sort_order: nextOrder,
            is_active: true,
          });

        if (error) throw new Error(error.message);

        setMessage("Auspiciador añadido correctamente.");
      }

      setEditingId(null);
      setName("");
      setTargetUrl("");
      setSelectedFile(null);
      setCurrentImageUrl("");

      const fileInput = document.getElementById(
        "sponsor-logo"
      ) as HTMLInputElement | null;

      if (fileInput) fileInput.value = "";

      await loadSponsors();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Ocurrió un error inesperado."
      );
    } finally {
      setSaving(false);
    }
  }

  async function toggleSponsor(sponsor: Sponsor) {
    setBusyId(sponsor.id);
    setMessage("");
    setErrorMessage("");

    const { error } = await supabase
      .from("sponsor_carousel")
      .update({
        is_active: !sponsor.is_active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", sponsor.id);

    if (error) {
      setErrorMessage(`No se pudo cambiar el estado: ${error.message}`);
    } else {
      setMessage(
        sponsor.is_active
          ? `${sponsor.name} está desactivado.`
          : `${sponsor.name} está activado.`
      );
      await loadSponsors();
    }

    setBusyId(null);
  }

  async function moveSponsor(sponsor: Sponsor, direction: -1 | 1) {
    const currentIndex = sponsors.findIndex(
      (item) => item.id === sponsor.id
    );

    const nextIndex = currentIndex + direction;

    if (currentIndex < 0 || nextIndex < 0 || nextIndex >= sponsors.length) {
      return;
    }

    const current = sponsors[currentIndex];
    const neighbor = sponsors[nextIndex];

    if (!current || !neighbor) return;

    setBusyId(sponsor.id);
    setMessage("");
    setErrorMessage("");

    const { error: firstError } = await supabase
      .from("sponsor_carousel")
      .update({
        sort_order: neighbor.sort_order,
        updated_at: new Date().toISOString(),
      })
      .eq("id", current.id);

    if (firstError) {
      setErrorMessage(`No se pudo cambiar el orden: ${firstError.message}`);
      setBusyId(null);
      return;
    }

    const { error: secondError } = await supabase
      .from("sponsor_carousel")
      .update({
        sort_order: current.sort_order,
        updated_at: new Date().toISOString(),
      })
      .eq("id", neighbor.id);

    if (secondError) {
      setErrorMessage(
        `El orden quedó parcialmente actualizado. Recarga la lista: ${secondError.message}`
      );
    } else {
      setMessage("Orden actualizado.");
    }

    await loadSponsors();
    setBusyId(null);
  }

  async function deleteSponsor(sponsor: Sponsor) {
    const confirmed = window.confirm(
      `¿Seguro que deseas eliminar a "${sponsor.name}"? Esta acción no se puede deshacer.`
    );

    if (!confirmed) return;

    setBusyId(sponsor.id);
    setMessage("");
    setErrorMessage("");

    const { error } = await supabase
      .from("sponsor_carousel")
      .delete()
      .eq("id", sponsor.id);

    if (error) {
      setErrorMessage(`No se pudo eliminar: ${error.message}`);
      setBusyId(null);
      return;
    }

    if (editingId === sponsor.id) resetForm();

    // Intenta borrar también el archivo del bucket si pertenece a este sistema.
    const marker = `/storage/v1/object/public/${BUCKET}/`;
    const markerIndex = sponsor.image_url.indexOf(marker);

    if (markerIndex !== -1) {
      const path = decodeURIComponent(
        sponsor.image_url.slice(markerIndex + marker.length).split("?")[0] ?? ""
      );

      if (path) {
        const { error: storageError } = await supabase.storage
          .from(BUCKET)
          .remove([path]);

        if (storageError) {
          setMessage(
            "Auspiciador eliminado. No se pudo borrar su archivo de imagen."
          );
        } else {
          setMessage("Auspiciador eliminado correctamente.");
        }
      } else {
        setMessage("Auspiciador eliminado correctamente.");
      }
    } else {
      setMessage("Auspiciador eliminado correctamente.");
    }

    await loadSponsors();
    setBusyId(null);
  }

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      setErrorMessage(`No se pudo cerrar sesión: ${error.message}`);
      return;
    }

    router.replace("/login");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-lg font-black text-white">
                +
              </span>
              <div>
                <p className="text-lg font-black tracking-tight">
                  Hola Puerto Rico+
                </p>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                  Administración de auspiciadores
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <span aria-hidden="true">↪</span>
            Cerrar sesión
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8 overflow-hidden rounded-2xl bg-slate-950 p-6 text-white shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-red-400">
                Panel de control
              </p>
              <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
                Franja de auspiciadores
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                Administra los logos que aparecen debajo del encabezado de tu
                página. Controla sus enlaces, su orden y cuáles están visibles.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="min-w-32 rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-medium text-slate-400">Registrados</p>
                <p className="mt-1 text-3xl font-black">{sponsors.length}</p>
              </div>
              <div className="min-w-32 rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-medium text-slate-400">Activos</p>
                <p className="mt-1 text-3xl font-black">
                  {sponsors.filter((item) => item.is_active).length}
                </p>
              </div>
            </div>
          </div>
        </section>

        {message && (
          <div
            role="status"
            className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800"
          >
            {message}
          </div>
        )}

        {errorMessage && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            <p className="font-semibold">No se pudo completar la operación</p>
            <p className="mt-1 break-words">{errorMessage}</p>
          </div>
        )}

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-6 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold">
                  {editingId ? "Editar auspiciador" : "Añadir auspiciador"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Completa la información y guarda los cambios.
                </p>
              </div>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="shrink-0 text-sm font-semibold text-slate-500 hover:text-slate-900"
                >
                  Cancelar
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="sponsor-name"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Nombre del auspiciador
                </label>
                <input
                  id="sponsor-name"
                  type="text"
                  required
                  maxLength={120}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Ej. Restaurante La Isla"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                />
              </div>

              <div>
                <label
                  htmlFor="sponsor-url"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Enlace del auspiciador
                </label>
                <input
                  id="sponsor-url"
                  type="url"
                  required
                  value={targetUrl}
                  onChange={(event) => setTargetUrl(event.target.value)}
                  placeholder="https://www.ejemplo.com"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                />
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Al pulsar el logo, el visitante abrirá este enlace en otra
                  pestaña.
                </p>
              </div>

              <div>
                <label
                  htmlFor="sponsor-logo"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Logo del auspiciador
                </label>

                <label
                  htmlFor="sponsor-logo"
                  className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-7 text-center transition hover:border-red-400 hover:bg-red-50/30"
                >
                  <span className="mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-white text-xl shadow-sm">
                    ↑
                  </span>
                  <span className="text-sm font-semibold text-slate-800">
                    Seleccionar imagen
                  </span>
                  <span className="mt-1 text-xs text-slate-500">
                    PNG, JPG, WEBP · Máximo 8 MB
                  </span>
                  {selectedFile && (
                    <span className="mt-3 max-w-full break-all text-xs font-semibold text-red-700">
                      {selectedFile.name}
                    </span>
                  )}
                </label>

                <input
                  id="sponsor-logo"
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  onChange={handleFileChange}
                  required={!editingId}
                  className="sr-only"
                />

                {(selectedFile || currentImageUrl) && (
                  <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Vista previa
                    </p>
                    <div className="flex min-h-28 items-center justify-center rounded-lg bg-slate-900 p-4">
                      <img
                        src={
                          selectedFile
                            ? URL.createObjectURL(selectedFile)
                            : currentImageUrl
                        }
                        alt="Vista previa del logo"
                        className="max-h-28 max-w-full object-contain"
                      />
                    </div>
                    {editingId && (
                      <p className="mt-2 text-xs text-slate-500">
                        Si no seleccionas otra imagen, se conservará el logo
                        actual.
                      </p>
                    )}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Guardando..."
                  : editingId
                    ? "Guardar cambios"
                    : "Añadir auspiciador"}
              </button>
            </form>
          </section>

          <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold">Auspiciadores registrados</h2>
                <p className="mt-1 text-sm text-slate-500">
                  El orden de esta lista determina el orden del carrusel.
                </p>
              </div>

              <button
                type="button"
                onClick={() => void loadSponsors()}
                disabled={loading}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                ↻ Actualizar
              </button>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-32 animate-pulse rounded-xl bg-slate-100"
                  />
                ))}
              </div>
            ) : sponsors.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 px-5 py-12 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-2xl">
                  +
                </div>
                <h3 className="font-bold">Todavía no hay auspiciadores</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-500">
                  Añade el primer logo utilizando el formulario. Aparecerá aquí
                  cuando se guarde correctamente.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {sponsors.map((sponsor, index) => (
                  <article
                    key={sponsor.id}
                    className={`rounded-xl border p-4 transition ${
                      editingId === sponsor.id
                        ? "border-red-300 bg-red-50/40"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="flex min-w-0 gap-3">
                      <div className="flex h-20 w-24 shrink-0 items-center justify-center rounded-lg bg-slate-900 p-2">
                        <img
                          src={sponsor.image_url}
                          alt={sponsor.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="break-words text-sm font-bold text-slate-900">
                            {sponsor.name}
                          </h3>
                          <span
                            className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${
                              sponsor.is_active
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {sponsor.is_active ? "Activo" : "Inactivo"}
                          </span>
                        </div>

                        <a
                          href={sponsor.target_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 block truncate text-xs text-blue-700 underline decoration-blue-200 underline-offset-2 hover:text-blue-900"
                          title={sponsor.target_url}
                        >
                          {sponsor.target_url}
                        </a>

                        <p className="mt-2 text-xs text-slate-500">
                          Posición {index + 1} de {sponsors.length}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
                      <button
                        type="button"
                        onClick={() => void moveSponsor(sponsor, -1)}
                        disabled={index === 0 || busyId !== null}
                        aria-label={`Subir ${sponsor.name}`}
                        title="Subir"
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        ↑
                      </button>

                      <button
                        type="button"
                        onClick={() => void moveSponsor(sponsor, 1)}
                        disabled={
                          index === sponsors.length - 1 || busyId !== null
                        }
                        aria-label={`Bajar ${sponsor.name}`}
                        title="Bajar"
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        ↓
                      </button>

                      <button
                        type="button"
                        onClick={() => editSponsor(sponsor)}
                        disabled={busyId !== null}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() => void toggleSponsor(sponsor)}
                        disabled={busyId !== null}
                        className={`rounded-lg border px-3 py-2 text-xs font-semibold transition disabled:opacity-50 ${
                          sponsor.is_active
                            ? "border-amber-200 text-amber-800 hover:bg-amber-50"
                            : "border-emerald-200 text-emerald-800 hover:bg-emerald-50"
                        }`}
                      >
                        {busyId === sponsor.id
                          ? "Procesando..."
                          : sponsor.is_active
                            ? "Desactivar"
                            : "Activar"}
                      </button>

                      <button
                        type="button"
                        onClick={() => void deleteSponsor(sponsor)}
                        disabled={busyId !== null}
                        className="ml-auto rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-50"
                      >
                        Eliminar
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>

        <footer className="mt-8 border-t border-slate-200 py-5 text-center text-xs text-slate-500">
          Hola Puerto Rico+ · Administración de auspiciadores
        </footer>
      </div>
    </main>
  );
}
