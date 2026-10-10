import Link from "next/link";

import Header from "@/components/site/Header";
import Navbar from "@/components/site/Navbar";
import BreakingNews from "@/components/site/BreakingNews";
import Footer from "@/components/site/Footer";
import SponsorSlot from "@/components/site/SponsorSlot";
import NewsCard from "@/components/news/NewsCard";

import { createClient } from "@/lib/supabase/server";
import type { NewsArticle, NewsCategory } from "@/types/news";

export const dynamic = "force-dynamic";

interface NoticiasPageProps {
  searchParams: Promise<{
    categoria?: string;
  }>;
}

const categories: NewsCategory[] = [
  "Noticias Locales",
  "Entretenimiento",
  "Cultura y Turismo",
  "Política y Gobierno",
  "Internacional",
  "Deportes",
  "Economía y Comercio",
  "Naturaleza y Medio Ambiente",
];

export default async function NoticiasPage({
  searchParams,
}: NoticiasPageProps) {
  const { categoria } = await searchParams;

  const supabase = await createClient();

  let query = supabase
    .from("news")
    .select(
      "id, title, slug, excerpt, content, image_url, category, author, status, featured, breaking, published_at, created_at, updated_at"
    )
    .eq("status", "published")
    .order("published_at", { ascending: false });

  const activeCategory =
    categoria && categories.includes(categoria as NewsCategory)
      ? categoria
      : null;

  if (activeCategory) {
    query = query.eq("category", activeCategory);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error cargando noticias:", error);
  }

  const news = (data ?? []) as NewsArticle[];

  const breakingArticle =
    news.find((article) => article.breaking) ?? null;

  return (
    <div className="min-h-screen bg-white text-gray-950">
      <Header />

      <Navbar active="Noticias" />

      {breakingArticle && (
        <BreakingNews
          title={breakingArticle.title}
          slug={breakingArticle.slug}
        />
      )}

      <main>
        {/* BANNER SUPERIOR */}
        <section className="mx-auto max-w-[1500px] px-4 pt-6 sm:px-6 lg:px-8">
          <SponsorSlot
            position="Noticias - Banner"
            width={1456}
            height={180}
          />
        </section>

        {/* ENCABEZADO */}
        <section className="mx-auto max-w-[1500px] px-4 pb-6 pt-10 sm:px-6 lg:px-8">
          <div className="border-b border-gray-200 pb-7">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600">
              Hola Puerto Rico+
            </p>

            <h1 className="mt-2 text-4xl font-black tracking-[-0.045em] sm:text-5xl lg:text-6xl">
              Noticias
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
              Más contenido • Más Puerto Rico • Siempre contigo
            </p>
          </div>
        </section>

        {/* CATEGORÍAS */}
        <section className="mx-auto max-w-[1500px] px-4 pb-10 sm:px-6 lg:px-8">
          <div className="border-b border-gray-200 pb-4">
            <p className="mb-4 text-[9px] font-black uppercase tracking-[0.18em] text-gray-400">
              Explora por categoría
            </p>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/noticias"
                className={`border px-4 py-2 text-[10px] font-black uppercase tracking-[0.12em] transition-colors ${
                  !activeCategory
                    ? "border-red-600 bg-red-600 text-white"
                    : "border-gray-200 bg-white text-gray-500 hover:border-red-600 hover:text-red-600"
                }`}
              >
                Todas
              </Link>

              {categories.map((category) => {
                const isActive = activeCategory === category;

                return (
                  <Link
                    key={category}
                    href={`/noticias?categoria=${encodeURIComponent(
                      category
                    )}`}
                    className={`border px-4 py-2 text-[10px] font-black uppercase tracking-[0.12em] transition-colors ${
                      isActive
                        ? "border-red-600 bg-red-600 text-white"
                        : "border-gray-200 bg-white text-gray-500 hover:border-red-600 hover:text-red-600"
                    }`}
                  >
                    {category}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* LISTADO DE NOTICIAS */}
        <section className="mx-auto max-w-[1500px] px-4 pb-16 sm:px-6 lg:px-8">
          {news.length === 0 ? (
            <div className="border-y border-gray-200 py-20 text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-400">
                {activeCategory
                  ? `Sin noticias en ${activeCategory}`
                  : "No hay noticias publicadas"}
              </p>

              <h2 className="mt-3 text-2xl font-black tracking-[-0.03em]">
                Todavía no hay contenido
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
                Las noticias publicadas desde el administrador aparecerán
                automáticamente aquí.
              </p>

              {activeCategory && (
                <Link
                  href="/noticias"
                  className="mt-6 inline-flex border border-gray-950 bg-gray-950 px-5 py-3 text-[10px] font-black uppercase tracking-[0.14em] text-white transition-colors hover:border-red-600 hover:bg-red-600"
                >
                  Ver todas las noticias
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="mb-8 flex items-end justify-between border-b border-gray-200 pb-4">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.18em] text-red-600">
                    {activeCategory
                      ? activeCategory
                      : "Actualidad"}
                  </p>

                  <h2 className="mt-1 text-2xl font-black tracking-[-0.03em] sm:text-3xl">
                    {activeCategory
                      ? `Noticias de ${activeCategory}`
                      : "Últimas noticias"}
                  </h2>
                </div>

                <span className="text-[10px] font-bold text-gray-400">
                  {news.length}{" "}
                  {news.length === 1 ? "noticia" : "noticias"}
                </span>
              </div>

              <div className="grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {news.map((article) => (
                  <NewsCard
                    key={article.id}
                    article={article}
                  />
                ))}
              </div>
            </>
          )}
        </section>

        {/* BANNER INFERIOR */}
        <section className="mx-auto max-w-[1500px] px-4 pb-12 sm:px-6 lg:px-8">
          <SponsorSlot
            position="Noticias - Banner"
            width={1456}
            height={180}
          />
        </section>
      </main>

      <Footer />
    </div>
  );
 }