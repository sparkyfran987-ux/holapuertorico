import Link from "next/link";
import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const categories = [
  "Todas",
  "Noticias Locales",
  "Entretenimiento",
  "Cultura y Turismo",
  "Política y Gobierno",
  "Internacional",
  "Deportes",
  "Economía y Comercio",
  "Naturaleza y Medio Ambiente",
];

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  image_url: string | null;
  category: string;
  author: string;
  status: "draft" | "published";
  featured: boolean;
  breaking: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

function normalizeCategory(category: string) {
  if (category === "Puerto Rico" || category === "Noticias") {
    return "Noticias Locales";
  }

  if (category === "Turismo" || category === "Gastronomía") {
    return "Cultura y Turismo";
  }

  if (categories.includes(category)) {
    return category;
  }

  return category;
}

async function togglePublished(formData: FormData) {
  "use server";

  await requireAdmin();

  const id = String(formData.get("id") || "").trim();
  const currentStatus = String(formData.get("status") || "").trim();

  if (!id) {
    throw new Error("ID de noticia inválido.");
  }

  if (currentStatus !== "draft" && currentStatus !== "published") {
    throw new Error("Estado de noticia inválido.");
  }

  const supabase = await createClient();

  const newStatus =
    currentStatus === "published" ? "draft" : "published";

  const { error } = await supabase
    .from("news")
    .update({
      status: newStatus,
      published_at:
        newStatus === "published"
          ? new Date().toISOString()
          : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/noticias");
  revalidatePath("/admin");
  revalidatePath("/admin/noticias");
}

async function toggleFeatured(formData: FormData) {
  "use server";

  await requireAdmin();

  const id = String(formData.get("id") || "").trim();
  const featured = String(formData.get("featured")) === "true";

  if (!id) {
    throw new Error("ID de noticia inválido.");
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("news")
    .update({
      featured: !featured,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/noticias");
  revalidatePath("/admin");
  revalidatePath("/admin/noticias");
}

async function deleteNews(formData: FormData) {
  "use server";

  await requireAdmin();

  const id = String(formData.get("id") || "").trim();

  if (!id) {
    throw new Error("ID de noticia inválido.");
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("news")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/noticias");
  revalidatePath("/admin");
  revalidatePath("/admin/noticias");
}

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    category?: string;
    status?: string;
  }>;
}

export default async function AdminNoticiasPage({
  searchParams,
}: PageProps) {
  await requireAdmin();

  const params = await searchParams;

  const currentPage = Math.max(
    1,
    Number.parseInt(params.page || "1", 10) || 1
  );

  const search = (params.search || "").trim();
  const selectedCategory = params.category || "Todas";
  const selectedStatus = params.status || "all";

  const perPage = 5;

  const supabase = await createClient();

  let query = supabase
    .from("news")
    .select("*")
    .order("created_at", { ascending: false });

  if (search) {
    query = query.or(
      `title.ilike.%${search}%,excerpt.ilike.%${search}%,content.ilike.%${search}%`
    );
  }

  if (
    selectedCategory &&
    selectedCategory !== "Todas"
  ) {
    if (selectedCategory === "Noticias Locales") {
      query = query.in("category", [
        "Noticias Locales",
        "Noticias",
        "Puerto Rico",
      ]);
    } else if (selectedCategory === "Cultura y Turismo") {
      query = query.in("category", [
        "Cultura y Turismo",
        "Turismo",
        "Gastronomía",
      ]);
    } else {
      query = query.eq("category", selectedCategory);
    }
  }

  if (
    selectedStatus === "draft" ||
    selectedStatus === "published"
  ) {
    query = query.eq("status", selectedStatus);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  const news: NewsItem[] = (data || []) as NewsItem[];

  const totalPages = Math.max(
    1,
    Math.ceil(news.length / perPage)
  );

  const safePage = Math.min(currentPage, totalPages);

  const startIndex = (safePage - 1) * perPage;
  const paginatedNews = news.slice(
    startIndex,
    startIndex + perPage
  );

  function buildUrl(
    overrides: {
      page?: number;
      search?: string;
      category?: string;
      status?: string;
    } = {}
  ) {
    const url = new URLSearchParams();

    const nextSearch =
      overrides.search !== undefined
        ? overrides.search
        : search;

    const nextCategory =
      overrides.category !== undefined
        ? overrides.category
        : selectedCategory;

    const nextStatus =
      overrides.status !== undefined
        ? overrides.status
        : selectedStatus;

    const nextPage =
      overrides.page !== undefined
        ? overrides.page
        : 1;

    if (nextSearch) {
      url.set("search", nextSearch);
    }

    if (nextCategory && nextCategory !== "Todas") {
      url.set("category", nextCategory);
    }

    if (nextStatus && nextStatus !== "all") {
      url.set("status", nextStatus);
    }

    if (nextPage > 1) {
      url.set("page", String(nextPage));
    }

    const queryString = url.toString();

    return queryString
      ? `/admin/noticias?${queryString}`
      : "/admin/noticias";
  }

  return (
    <main className="min-h-screen bg-[#f5f6f8]">
      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-5 border-b border-gray-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link href="/admin">
              <img
                src="/logo.png"
                alt="Hola Puerto Rico+"
                className="h-auto w-[210px]"
              />
            </Link>

            <p className="mt-5 text-[10px] font-black uppercase tracking-[0.2em] text-red-600">
              Gestión editorial
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-gray-950 sm:text-4xl">
              Noticias
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Administra todas las noticias de Hola Puerto Rico+.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin"
              className="border border-gray-300 bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.1em] text-gray-700 transition hover:border-gray-950"
            >
              ← Administración
            </Link>

            <Link
              href="/admin/noticias/nueva"
              className="bg-gray-950 px-5 py-3 text-xs font-black uppercase tracking-[0.1em] text-white transition hover:bg-red-600"
            >
              + Nueva noticia
            </Link>
          </div>
        </header>

        <section className="mb-6 border border-gray-200 bg-white">
          <form
            method="GET"
            className="grid gap-4 p-5 lg:grid-cols-[minmax(0,1fr)_240px_180px_auto]"
          >
            <input
              type="search"
              name="search"
              defaultValue={search}
              placeholder="Buscar por título, resumen o contenido..."
              className="w-full border border-gray-300 bg-white px-4 py-3 text-sm text-gray-950 outline-none focus:border-red-600"
            />

            <select
              name="category"
              defaultValue={selectedCategory}
              className="border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-950 outline-none focus:border-red-600"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              name="status"
              defaultValue={selectedStatus}
              className="border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-950 outline-none focus:border-red-600"
            >
              <option value="all">Todos los estados</option>
              <option value="published">Publicadas</option>
              <option value="draft">Borradores</option>
            </select>

            <button
              type="submit"
              className="bg-gray-950 px-6 py-3 text-xs font-black uppercase tracking-[0.1em] text-white transition hover:bg-red-600"
            >
              Buscar
            </button>
          </form>
        </section>

        <section className="border border-gray-200 bg-white">
          <div className="flex flex-col gap-2 border-b border-gray-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-red-600">
                Contenido
              </p>

              <h2 className="mt-1 text-lg font-black text-gray-950">
                {news.length}{" "}
                {news.length === 1
                  ? "noticia encontrada"
                  : "noticias encontradas"}
              </h2>
            </div>

            <p className="text-xs text-gray-400">
              Página {safePage} de {totalPages}
            </p>
          </div>

          {/* DESKTOP */}
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-left">
                  <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.12em] text-gray-500">
                    Noticia
                  </th>

                  <th className="px-4 py-4 text-[9px] font-black uppercase tracking-[0.12em] text-gray-500">
                    Categoría
                  </th>

                  <th className="px-4 py-4 text-[9px] font-black uppercase tracking-[0.12em] text-gray-500">
                    Estado
                  </th>

                  <th className="px-4 py-4 text-[9px] font-black uppercase tracking-[0.12em] text-gray-500">
                    Destacada
                  </th>

                  <th className="px-6 py-4 text-right text-[9px] font-black uppercase tracking-[0.12em] text-gray-500">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {paginatedNews.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-5">
                      <div className="flex min-w-[360px] items-center gap-4">
                        <div className="h-20 w-20 shrink-0 overflow-hidden border border-gray-200 bg-gray-100">
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.title}
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center px-2 text-center text-[8px] font-black uppercase text-gray-400">
                              Sin imagen
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <h3 className="line-clamp-2 text-sm font-black text-gray-950">
                            {item.title}
                          </h3>

                          <p className="mt-1 text-xs text-gray-400">
                            {item.author}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-5">
                      <span className="text-[10px] font-black uppercase tracking-[0.08em] text-red-600">
                        {normalizeCategory(item.category)}
                      </span>
                    </td>

                    <td className="px-4 py-5">
                      <span
                        className={`inline-block px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.08em] ${
                          item.status === "published"
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {item.status === "published"
                          ? "Publicada"
                          : "Borrador"}
                      </span>
                    </td>

                    <td className="px-4 py-5">
                      <span className="text-xs font-bold text-gray-500">
                        {item.featured ? "Sí" : "No"}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex flex-wrap justify-end gap-2">
                        <Link
                          href={`/noticias/${item.slug}`}
                          target="_blank"
                          className="border border-gray-300 px-3 py-2 text-[9px] font-black uppercase tracking-[0.08em] text-gray-600 hover:border-gray-950 hover:text-gray-950"
                        >
                          Ver
                        </Link>

                        <Link
                          href={`/admin/noticias/${item.id}/editar`}
                          className="border border-gray-300 px-3 py-2 text-[9px] font-black uppercase tracking-[0.08em] text-gray-600 hover:border-red-600 hover:text-red-600"
                        >
                          Editar
                        </Link>

                        <form action={togglePublished}>
                          <input
                            type="hidden"
                            name="id"
                            value={item.id}
                          />

                          <input
                            type="hidden"
                            name="status"
                            value={item.status}
                          />

                          <button
                            type="submit"
                            className="border border-gray-300 px-3 py-2 text-[9px] font-black uppercase tracking-[0.08em] text-gray-600 hover:border-green-600 hover:text-green-600"
                          >
                            {item.status === "published"
                              ? "Despublicar"
                              : "Publicar"}
                          </button>
                        </form>

                        <form action={toggleFeatured}>
                          <input
                            type="hidden"
                            name="id"
                            value={item.id}
                          />

                          <input
                            type="hidden"
                            name="featured"
                            value={String(item.featured)}
                          />

                          <button
                            type="submit"
                            className="border border-gray-300 px-3 py-2 text-[9px] font-black uppercase tracking-[0.08em] text-gray-600 hover:border-yellow-600 hover:text-yellow-600"
                          >
                            {item.featured
                              ? "Quitar"
                              : "Destacar"}
                          </button>
                        </form>

                        <form action={deleteNews}>
                          <input
                            type="hidden"
                            name="id"
                            value={item.id}
                          />

                          <button
                            type="submit"
                            className="border border-red-200 px-3 py-2 text-[9px] font-black uppercase tracking-[0.08em] text-red-600 hover:bg-red-600 hover:text-white"
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

          {/* MOBILE */}
          <div className="divide-y divide-gray-100 lg:hidden">
            {paginatedNews.map((item) => (
              <article key={item.id} className="p-5">
                <div className="flex gap-4">
                  <div className="h-24 w-24 shrink-0 overflow-hidden border border-gray-200 bg-gray-100">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center px-2 text-center text-[8px] font-black uppercase text-gray-400">
                        Sin imagen
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-[9px] font-black uppercase tracking-[0.08em] text-red-600">
                      {normalizeCategory(item.category)}
                    </p>

                    <h3 className="mt-1 line-clamp-3 text-sm font-black text-gray-950">
                      {item.title}
                    </h3>

                    <div className="mt-2 flex flex-wrap gap-2">
                      <span
                        className={`px-2 py-1 text-[8px] font-black uppercase ${
                          item.status === "published"
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {item.status === "published"
                          ? "Publicada"
                          : "Borrador"}
                      </span>

                      {item.featured && (
                        <span className="bg-yellow-50 px-2 py-1 text-[8px] font-black uppercase text-yellow-700">
                          Destacada
                        </span>
                      )}

                      {item.breaking && (
                        <span className="bg-red-50 px-2 py-1 text-[8px] font-black uppercase text-red-600">
                          Última hora
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Link
                    href={`/noticias/${item.slug}`}
                    target="_blank"
                    className="border border-gray-300 px-3 py-2 text-center text-[9px] font-black uppercase tracking-[0.08em] text-gray-600"
                  >
                    Ver
                  </Link>

                  <Link
                    href={`/admin/noticias/${item.id}/editar`}
                    className="border border-gray-300 px-3 py-2 text-center text-[9px] font-black uppercase tracking-[0.08em] text-gray-600"
                  >
                    Editar
                  </Link>

                  <form action={togglePublished}>
                    <input
                      type="hidden"
                      name="id"
                      value={item.id}
                    />

                    <input
                      type="hidden"
                      name="status"
                      value={item.status}
                    />

                    <button
                      type="submit"
                      className="w-full border border-gray-300 px-3 py-2 text-[9px] font-black uppercase tracking-[0.08em] text-gray-600"
                    >
                      {item.status === "published"
                        ? "Despublicar"
                        : "Publicar"}
                    </button>
                  </form>

                  <form action={toggleFeatured}>
                    <input
                      type="hidden"
                      name="id"
                      value={item.id}
                    />

                    <input
                      type="hidden"
                      name="featured"
                      value={String(item.featured)}
                    />

                    <button
                      type="submit"
                      className="w-full border border-gray-300 px-3 py-2 text-[9px] font-black uppercase tracking-[0.08em] text-gray-600"
                    >
                      {item.featured
                        ? "Quitar destaque"
                        : "Destacar"}
                    </button>
                  </form>

                  <form
                    action={deleteNews}
                    className="col-span-2"
                  >
                    <input
                      type="hidden"
                      name="id"
                      value={item.id}
                    />

                    <button
                      type="submit"
                      className="w-full border border-red-200 px-3 py-2 text-[9px] font-black uppercase tracking-[0.08em] text-red-600"
                    >
                      Eliminar noticia
                    </button>
                  </form>
                </div>
              </article>
            ))}
          </div>

          {paginatedNews.length === 0 && (
            <div className="px-6 py-16 text-center">
              <p className="text-sm font-bold text-gray-500">
                No se encontraron noticias con estos filtros.
              </p>

              <Link
                href="/admin/noticias"
                className="mt-4 inline-block text-xs font-black uppercase tracking-[0.1em] text-red-600"
              >
                Limpiar filtros
              </Link>
            </div>
          )}
        </section>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            {safePage > 1 && (
              <Link
                href={buildUrl({ page: safePage - 1 })}
                className="border border-gray-300 bg-white px-4 py-3 text-xs font-black uppercase tracking-[0.08em] text-gray-600 hover:border-gray-950 hover:text-gray-950"
              >
                ← Anterior
              </Link>
            )}

            {Array.from(
              { length: totalPages },
              (_, index) => index + 1
            ).map((pageNumber) => (
              <Link
                key={pageNumber}
                href={buildUrl({ page: pageNumber })}
                className={`border px-4 py-3 text-xs font-black ${
                  pageNumber === safePage
                    ? "border-gray-950 bg-gray-950 text-white"
                    : "border-gray-300 bg-white text-gray-600 hover:border-gray-950"
                }`}
              >
                {pageNumber}
              </Link>
            ))}

            {safePage < totalPages && (
              <Link
                href={buildUrl({ page: safePage + 1 })}
                className="border border-gray-300 bg-white px-4 py-3 text-xs font-black uppercase tracking-[0.08em] text-gray-600 hover:border-gray-950 hover:text-gray-950"
              >
                Siguiente →
              </Link>
            )}
          </div>
        )}
      </div>
    </main>
  );
}