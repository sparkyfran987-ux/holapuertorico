import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await requireAdmin();

  const supabase = await createClient();

  const [
    { count: totalNews },
    { count: publishedNews },
    { count: draftNews },
    { count: featuredNews },
    { data: recentNews },
  ] = await Promise.all([
    supabase
      .from("news")
      .select("*", { count: "exact", head: true }),

    supabase
      .from("news")
      .select("*", { count: "exact", head: true })
      .eq("status", "published"),

    supabase
      .from("news")
      .select("*", { count: "exact", head: true })
      .eq("status", "draft"),

    supabase
      .from("news")
      .select("*", { count: "exact", head: true })
      .eq("featured", true),

    supabase
      .from("news")
      .select(
        "id, title, slug, category, status, featured, image_url, created_at"
      )
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  return (
    <main className="min-h-screen bg-[#f5f6f8]">
      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
        {/* HEADER */}
        <header className="mb-8 flex flex-col gap-5 border-b border-gray-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link href="/" className="inline-block">
              <img
                src="/logo.png"
                alt="Hola Puerto Rico+"
                className="h-auto w-[210px]"
              />
            </Link>

            <p className="mt-5 text-[10px] font-black uppercase tracking-[0.2em] text-red-600">
              Panel administrativo
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-gray-950 sm:text-4xl">
              Administración
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Gestiona las noticias y el contenido editorial de Hola Puerto
              Rico+.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="border border-gray-300 bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.1em] text-gray-700 transition hover:border-gray-950 hover:text-gray-950"
            >
              Ver sitio
            </Link>

            <Link
              href="/admin/noticias/nueva"
              className="bg-gray-950 px-5 py-3 text-xs font-black uppercase tracking-[0.1em] text-white transition hover:bg-red-600"
            >
              Nueva noticia
            </Link>
          </div>
        </header>

        {/* STATS */}
        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="border border-gray-200 bg-white p-6">
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">
              Total de noticias
            </p>

            <p className="mt-3 text-4xl font-black tracking-[-0.04em] text-gray-950">
              {totalNews ?? 0}
            </p>

            <p className="mt-2 text-xs text-gray-500">
              Todo el contenido registrado
            </p>
          </div>

          <div className="border border-gray-200 bg-white p-6">
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">
              Publicadas
            </p>

            <p className="mt-3 text-4xl font-black tracking-[-0.04em] text-gray-950">
              {publishedNews ?? 0}
            </p>

            <p className="mt-2 text-xs text-gray-500">
              Noticias visibles públicamente
            </p>
          </div>

          <div className="border border-gray-200 bg-white p-6">
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">
              Borradores
            </p>

            <p className="mt-3 text-4xl font-black tracking-[-0.04em] text-gray-950">
              {draftNews ?? 0}
            </p>

            <p className="mt-2 text-xs text-gray-500">
              Contenido pendiente de publicar
            </p>
          </div>

          <div className="border border-gray-200 bg-white p-6">
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">
              Destacadas
            </p>

            <p className="mt-3 text-4xl font-black tracking-[-0.04em] text-gray-950">
              {featuredNews ?? 0}
            </p>

            <p className="mt-2 text-xs text-gray-500">
              Noticias marcadas para destacar
            </p>
          </div>
        </section>

        {/* QUICK ACTIONS */}
        <section className="mb-8">
          <div className="mb-4">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-red-600">
              Gestión
            </p>

            <h2 className="mt-1 text-xl font-black tracking-[-0.03em] text-gray-950">
              Acciones rápidas
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Link
              href="/admin/noticias"
              className="group border border-gray-200 bg-white p-6 transition hover:border-red-600"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-black text-gray-950">
                    Administrar noticias
                  </p>

                  <p className="mt-2 text-xs leading-5 text-gray-500">
                    Consulta, edita, publica, destaca o elimina noticias.
                  </p>
                </div>

                <span className="text-xl font-light text-gray-300 transition group-hover:text-red-600">
                  →
                </span>
              </div>
            </Link>

            <Link
              href="/admin/noticias/nueva"
              className="group border border-gray-200 bg-white p-6 transition hover:border-red-600"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-black text-gray-950">
                    Crear noticia
                  </p>

                  <p className="mt-2 text-xs leading-5 text-gray-500">
                    Redacta una noticia nueva y publícala en el portal.
                  </p>
                </div>

                <span className="text-xl font-light text-gray-300 transition group-hover:text-red-600">
                  →
                </span>
              </div>
            </Link>

            <Link
              href="/admin/auspiciadores"
              className="group border border-gray-200 bg-white p-6 transition hover:border-red-600"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-black text-gray-950">
                    Auspiciadores
                  </p>

                  <p className="mt-2 text-xs leading-5 text-gray-500">
                    Administra banners y espacios publicitarios del sitio.
                  </p>
                </div>

                <span className="text-xl font-light text-gray-300 transition group-hover:text-red-600">
                  →
                </span>
              </div>
            </Link>
          </div>
        </section>

        {/* RECENT NEWS */}
        <section className="border border-gray-200 bg-white">
          <div className="flex flex-col gap-3 border-b border-gray-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-red-600">
                Actividad editorial
              </p>

              <h2 className="mt-1 text-lg font-black tracking-[-0.02em] text-gray-950">
                Noticias recientes
              </h2>
            </div>

            <Link
              href="/admin/noticias"
              className="text-xs font-black uppercase tracking-[0.1em] text-gray-500 transition hover:text-red-600"
            >
              Ver todas →
            </Link>
          </div>

          {recentNews && recentNews.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {recentNews.map((news) => (
                <div
                  key={news.id}
                  className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center"
                >
                  <div className="h-20 w-20 shrink-0 overflow-hidden border border-gray-200 bg-gray-100">
                    {news.image_url ? (
                      <img
                        src={news.image_url}
                        alt={news.title}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center px-2 text-center text-[8px] font-black uppercase tracking-[0.08em] text-gray-400">
                        Sin imagen
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span className="text-[9px] font-black uppercase tracking-[0.1em] text-red-600">
                        {news.category}
                      </span>

                      {news.featured && (
                        <span className="border border-yellow-200 bg-yellow-50 px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.08em] text-yellow-700">
                          Destacada
                        </span>
                      )}
                    </div>

                    <h3 className="line-clamp-2 text-sm font-black text-gray-950">
                      {news.title}
                    </h3>

                    <p className="mt-1 text-xs text-gray-400">
                      {news.status === "published"
                        ? "Publicada"
                        : "Borrador"}
                    </p>
                  </div>

                  <Link
                    href={`/admin/noticias/${news.id}/editar`}
                    className="shrink-0 border border-gray-300 px-4 py-2 text-[10px] font-black uppercase tracking-[0.1em] text-gray-600 transition hover:border-red-600 hover:text-red-600"
                  >
                    Editar
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-16 text-center">
              <p className="text-sm font-bold text-gray-500">
                Todavía no hay noticias registradas.
              </p>

              <Link
                href="/admin/noticias/nueva"
                className="mt-4 inline-block bg-gray-950 px-5 py-3 text-xs font-black uppercase tracking-[0.1em] text-white transition hover:bg-red-600"
              >
                Crear primera noticia
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}