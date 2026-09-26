import { requireAdmin } from "@/lib/supabase/auth";
import Link from "next/link";
import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

interface Sponsor {
  id: string;
  name: string;
  image_url: string;
  format: string;
  position: string;
  target_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

async function toggleSponsor(formData: FormData) {
  "use server";

  const id = String(formData.get("id") ?? "");

  if (!id) return;

  const supabase = await createClient();

  const { data: sponsor } = await supabase
    .from("sponsors")
    .select("is_active")
    .eq("id", id)
    .single();

  if (!sponsor) return;

  await supabase
    .from("sponsors")
    .update({
      is_active: !sponsor.is_active,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  revalidatePath("/admin/auspiciadores");
  revalidatePath("/");
  revalidatePath("/noticias");
}

async function deleteSponsor(formData: FormData) {
  "use server";

  const id = String(formData.get("id") ?? "");

  if (!id) return;

  const supabase = await createClient();

  await supabase
    .from("sponsors")
    .delete()
    .eq("id", id);

  revalidatePath("/admin/auspiciadores");
  revalidatePath("/");
  revalidatePath("/noticias");
}

const formatLabels: Record<string, string> = {
  "1456x180": "Banner horizontal",
  "1024x1024": "Cuadrado",
  "320x1200": "Vertical",
  "160x600": "Vertical pequeño",
};

const positionLabels: Record<string, string> = {
  "Inicio - Banner principal": "Inicio · Banner principal",
  "Inicio - Banner inferior": "Inicio · Banner inferior",
  "Inicio - Sidebar": "Inicio · Sidebar",
  "Noticias - Sidebar": "Noticias · Sidebar",
  "Noticias - Banner": "Noticias · Banner",
  "Artículo - Sidebar": "Artículo · Sidebar",
  "Artículo - Banner inferior": "Artículo · Banner inferior",
};

export default async function AuspiciadoresPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("sponsors")
    .select(
      "id, name, image_url, format, position, target_url, is_active, created_at, updated_at"
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error cargando auspiciadores:", error);
  }

  const sponsors = (data ?? []) as Sponsor[];

  const activeSponsors = sponsors.filter(
    (sponsor) => sponsor.is_active
  ).length;

  const inactiveSponsors = sponsors.length - activeSponsors;

  const formatCount = new Set(
    sponsors.map((sponsor) => sponsor.format)
  ).size;

  return (
    <main className="min-h-screen bg-[#f7f7f8] text-gray-950">
      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[76px] max-w-[1400px] items-center justify-between px-6 lg:px-8">
          <div>
            <Link
              href="/admin"
              className="text-xs font-medium text-gray-400 transition hover:text-gray-800"
            >
              ← Panel administrativo
            </Link>

            <h1 className="mt-1 text-xl font-black tracking-[-0.02em]">
              Auspiciadores
            </h1>
          </div>

          <Link
            href="/admin/auspiciadores/nuevo"
            className="inline-flex items-center rounded-xl bg-[#151515] px-5 py-3 text-xs font-bold text-white transition hover:bg-red-600"
          >
            + Nuevo auspiciador
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-6 py-8 lg:px-8">
        {/* INTRO */}
        <section className="mb-8">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-red-600">
            Publicidad
          </p>

          <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
            Espacios publicitarios
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
            Administra los auspiciadores que aparecen en los diferentes
            espacios publicitarios de Hola Puerto Rico+.
          </p>
        </section>

        {/* ESTADÍSTICAS */}
        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <p className="text-[9px] font-black uppercase tracking-[0.16em] text-gray-400">
              Total
            </p>

            <p className="mt-2 text-3xl font-black">
              {sponsors.length}
            </p>

            <p className="mt-1 text-xs text-gray-400">
              auspiciadores registrados
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <p className="text-[9px] font-black uppercase tracking-[0.16em] text-gray-400">
              Activos
            </p>

            <p className="mt-2 text-3xl font-black text-green-600">
              {activeSponsors}
            </p>

            <p className="mt-1 text-xs text-gray-400">
              visibles en el sitio
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <p className="text-[9px] font-black uppercase tracking-[0.16em] text-gray-400">
              Formatos
            </p>

            <p className="mt-2 text-3xl font-black">
              {formatCount}
            </p>

            <p className="mt-1 text-xs text-gray-400">
              tamaños publicitarios utilizados
            </p>
          </div>
        </section>

        {/* LISTADO */}
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <div className="flex flex-col gap-3 border-b border-gray-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.16em] text-gray-400">
                Inventario publicitario
              </p>

              <h3 className="mt-1 text-lg font-black">
                Auspiciadores registrados
              </h3>
            </div>

            <p className="text-xs text-gray-400">
              {inactiveSponsors}{" "}
              {inactiveSponsors === 1
                ? "auspiciador inactivo"
                : "auspiciadores inactivos"}
            </p>
          </div>

          {sponsors.length === 0 ? (
            <div className="px-6 py-20 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
                <span className="text-xl text-gray-400">+</span>
              </div>

              <h3 className="mt-5 text-lg font-black">
                Todavía no hay auspiciadores
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                Añade el primer auspiciador para comenzar a utilizar
                los espacios publicitarios del sitio.
              </p>

              <Link
                href="/admin/auspiciadores/nuevo"
                className="mt-6 inline-flex rounded-xl bg-[#151515] px-5 py-3 text-xs font-bold text-white transition hover:bg-red-600"
              >
                Añadir auspiciador
              </Link>
            </div>
          ) : (
            <>
              {/* DESKTOP */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[1000px]">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/70">
                      <th className="px-6 py-4 text-left text-[9px] font-black uppercase tracking-[0.14em] text-gray-400">
                        Auspiciador
                      </th>

                      <th className="px-4 py-4 text-left text-[9px] font-black uppercase tracking-[0.14em] text-gray-400">
                        Formato
                      </th>

                      <th className="px-4 py-4 text-left text-[9px] font-black uppercase tracking-[0.14em] text-gray-400">
                        Posición
                      </th>

                      <th className="px-4 py-4 text-left text-[9px] font-black uppercase tracking-[0.14em] text-gray-400">
                        Estado
                      </th>

                      <th className="px-6 py-4 text-right text-[9px] font-black uppercase tracking-[0.14em] text-gray-400">
                        Acciones
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {sponsors.map((sponsor) => (
                      <tr
                        key={sponsor.id}
                        className="border-b border-gray-100 last:border-0"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                              <img
                                src={sponsor.image_url}
                                alt={sponsor.name}
                                className="h-full w-full object-contain"
                              />
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold text-gray-950">
                                {sponsor.name}
                              </p>

                              {sponsor.target_url && (
                                <p className="mt-1 max-w-[260px] truncate text-xs text-gray-400">
                                  {sponsor.target_url}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-5">
                          <span className="inline-flex rounded-lg bg-gray-100 px-3 py-2 text-[10px] font-bold text-gray-600">
                            {formatLabels[sponsor.format] ??
                              sponsor.format}
                          </span>

                          <p className="mt-1 text-[10px] text-gray-400">
                            {sponsor.format}
                          </p>
                        </td>

                        <td className="px-4 py-5">
                          <p className="max-w-[190px] text-xs font-semibold text-gray-700">
                            {positionLabels[sponsor.position] ??
                              sponsor.position}
                          </p>
                        </td>

                        <td className="px-4 py-5">
                          <span
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold ${
                              sponsor.is_active
                                ? "bg-green-50 text-green-700"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                sponsor.is_active
                                  ? "bg-green-500"
                                  : "bg-gray-400"
                              }`}
                            />

                            {sponsor.is_active
                              ? "Activo"
                              : "Inactivo"}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/admin/auspiciadores/${sponsor.id}/editar`}
                              className="rounded-lg border border-gray-200 px-3 py-2 text-[10px] font-bold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
                            >
                              Editar
                            </Link>

                            <form action={toggleSponsor}>
                              <input
                                type="hidden"
                                name="id"
                                value={sponsor.id}
                              />

                              <button
                                type="submit"
                                className={`rounded-lg border px-3 py-2 text-[10px] font-bold transition ${
                                  sponsor.is_active
                                    ? "border-gray-200 text-gray-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                                    : "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                                }`}
                              >
                                {sponsor.is_active
                                  ? "Desactivar"
                                  : "Activar"}
                              </button>
                            </form>

                            <form action={deleteSponsor}>
                              <input
                                type="hidden"
                                name="id"
                                value={sponsor.id}
                              />

                              <button
                                type="submit"
                                className="rounded-lg border border-red-100 px-3 py-2 text-[10px] font-bold text-red-600 transition hover:bg-red-50"
                              >
                                Eliminar
                              </button>
                            </form>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE / TABLET */}
              <div className="divide-y divide-gray-100 lg:hidden">
                {sponsors.map((sponsor) => (
                  <article
                    key={sponsor.id}
                    className="p-5 sm:p-6"
                  >
                    <div className="flex gap-4">
                      <div className="flex h-20 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                        <img
                          src={sponsor.image_url}
                          alt={sponsor.name}
                          className="h-full w-full object-contain"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-bold text-gray-950">
                            {sponsor.name}
                          </h3>

                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-bold ${
                              sponsor.is_active
                                ? "bg-green-50 text-green-700"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                sponsor.is_active
                                  ? "bg-green-500"
                                  : "bg-gray-400"
                              }`}
                            />

                            {sponsor.is_active
                              ? "Activo"
                              : "Inactivo"}
                          </span>
                        </div>

                        <p className="mt-2 text-xs text-gray-500">
                          {positionLabels[sponsor.position] ??
                            sponsor.position}
                        </p>

                        <p className="mt-1 text-[10px] text-gray-400">
                          {formatLabels[sponsor.format] ??
                            sponsor.format}{" "}
                          · {sponsor.format}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      <Link
                        href={`/admin/auspiciadores/${sponsor.id}/editar`}
                        className="rounded-lg border border-gray-200 px-3 py-2 text-[10px] font-bold text-gray-700 transition hover:bg-gray-50"
                      >
                        Editar
                      </Link>

                      <form action={toggleSponsor}>
                        <input
                          type="hidden"
                          name="id"
                          value={sponsor.id}
                        />

                        <button
                          type="submit"
                          className={`rounded-lg border px-3 py-2 text-[10px] font-bold transition ${
                            sponsor.is_active
                              ? "border-gray-200 text-gray-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                              : "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                          }`}
                        >
                          {sponsor.is_active
                            ? "Desactivar"
                            : "Activar"}
                        </button>
                      </form>

                      <form action={deleteSponsor}>
                        <input
                          type="hidden"
                          name="id"
                          value={sponsor.id}
                        />

                        <button
                          type="submit"
                          className="rounded-lg border border-red-100 px-3 py-2 text-[10px] font-bold text-red-600 transition hover:bg-red-50"
                        >
                          Eliminar
                        </button>
                      </form>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}