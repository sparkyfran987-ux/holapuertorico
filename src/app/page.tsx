import Link from "next/link";

import Header from "@/components/site/Header";
import Navbar from "@/components/site/Navbar";
import BreakingNews from "@/components/site/BreakingNews";
import Footer from "@/components/site/Footer";
import SponsorSlot from "@/components/site/SponsorSlot";
import SponsorStrip from "@/components/SponsorStrip";

import FeaturedCarousel from "@/components/news/FeaturedCarousel";
import NewsGrid from "@/components/news/NewsGrid";
import CategorySection from "@/components/news/CategorySection";

import { createClient } from "@/lib/supabase/server";
import type { NewsArticle } from "@/types/news";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("news")
    .select(
      `
        id,
        title,
        slug,
        excerpt,
        content,
        image_url,
        category,
        author,
        status,
        featured,
        breaking,
        published_at,
        created_at,
        updated_at
      `
    )
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error cargando noticias:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
  }

  const noticias = (data ?? []) as NewsArticle[];

  const breakingNews =
    noticias.find((article) => article.breaking) ?? null;

  /*
   * Todas las noticias marcadas como destacadas
   * aparecen en el carrusel.
   */
  const featuredNews = noticias.filter(
    (article) => article.featured
  );

  /*
   * Si no existen noticias destacadas,
   * usamos la noticia más reciente como principal.
   */
  const heroNews = featuredNews[0] ?? noticias[0] ?? null;

  /*
   * Últimas noticias:
   * solamente mostramos 3.
   */
  const latestNews = noticias
    .filter((article) => article.id !== heroNews?.id)
    .slice(0, 3);

  /*
   * CATEGORÍAS
   */

  const noticiasLocales = noticias
    .filter(
      (article) => article.category === "Noticias Locales"
    )
    .slice(0, 4);

  const entretenimientoNews = noticias
    .filter(
      (article) => article.category === "Entretenimiento"
    )
    .slice(0, 4);

  const culturaTurismoNews = noticias
    .filter(
      (article) => article.category === "Cultura y Turismo"
    )
    .slice(0, 4);

  const politicaNews = noticias
    .filter(
      (article) => article.category === "Política y Gobierno"
    )
    .slice(0, 4);

  const internacionalNews = noticias
    .filter(
      (article) => article.category === "Internacional"
    )
    .slice(0, 4);

  const deportesNews = noticias
    .filter(
      (article) => article.category === "Deportes"
    )
    .slice(0, 4);

  const economiaNews = noticias
    .filter(
      (article) => article.category === "Economía y Comercio"
    )
    .slice(0, 4);

  const naturalezaNews = noticias
    .filter(
      (article) =>
        article.category === "Naturaleza y Medio Ambiente"
    )
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-white text-gray-950">
      <Header />

      <Navbar active="Inicio" />

      {breakingNews && (
        <BreakingNews
          title={breakingNews.title}
          slug={breakingNews.slug}
        />
      )}

      <main>
        {/* CARRUSEL DE DESTACADAS */}

        {featuredNews.length > 0 && (
          <FeaturedCarousel articles={featuredNews} />
        )}

        {/* SI NO HAY DESTACADAS */}

        {featuredNews.length === 0 && heroNews && (
          <section className="mx-auto max-w-[1150px] px-4 pt-6 sm:px-6 lg:px-8">
            <article className="overflow-hidden border border-gray-200 bg-white">
              <div className="grid lg:grid-cols-2">
                <Link
                  href={`/noticias/${heroNews.slug}`}
                  className="block bg-gray-50"
                >
                  {heroNews.image_url ? (
                    <div className="flex w-full items-center justify-center">
                      <img
                        src={heroNews.image_url}
                        alt={heroNews.title}
                        className="block h-auto w-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-square items-center justify-center text-sm font-bold text-gray-400">
                      Hola Puerto Rico+
                    </div>
                  )}
                </Link>

                <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
                  <span className="text-xs font-black uppercase tracking-[0.15em] text-red-600">
                    Noticias
                  </span>

                  <Link href={`/noticias/${heroNews.slug}`}>
                    <h1 className="mt-3 text-3xl font-black leading-tight tracking-tight text-gray-950 transition-colors hover:text-red-600 sm:text-4xl">
                      {heroNews.title}
                    </h1>
                  </Link>

                  {heroNews.excerpt && (
                    <p className="mt-4 text-sm leading-6 text-gray-600">
                      {heroNews.excerpt}
                    </p>
                  )}

                  <Link
                    href={`/noticias/${heroNews.slug}`}
                    className="mt-6 text-sm font-black text-gray-950 transition-colors hover:text-red-600"
                  >
                    Leer noticia →
                  </Link>
                </div>
              </div>
            </article>
          </section>
        )}

        {/* AUSPCIADOR PRINCIPAL */}

        <section className="mx-auto max-w-[1500px] px-4 py-12 sm:px-6 lg:px-8">
          <SponsorSlot
            position="Inicio - Banner principal"
            width={1456}
            height={180}
          />
        </section>

        {/* CINTILLO DE SPONSORS */}

        <SponsorStrip />

        {/* ÚLTIMAS NOTICIAS */}

        {latestNews.length > 0 && (
          <section className="mx-auto max-w-[1500px] px-4 py-12 sm:px-6 lg:px-8">
            <div className="mb-7 flex items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-red-600">
                  Lo más reciente
                </span>

                <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-950 sm:text-4xl">
                  Últimas noticias
                </h2>
              </div>

              <Link
                href="/noticias"
                className="text-sm font-bold text-gray-900 transition-colors hover:text-red-600"
              >
                Todas las noticias →
              </Link>
            </div>

            <NewsGrid articles={latestNews} />
          </section>
        )}

        {/* NOTICIAS LOCALES */}

        <CategorySection
          title="Noticias Locales"
          eyebrow="Noticias Locales"
          href="/noticias?categoria=Noticias%20Locales"
          articles={noticiasLocales}
        />

        {/* ENTRETENIMIENTO */}

        <CategorySection
          title="Entretenimiento"
          eyebrow="Entretenimiento"
          href="/noticias?categoria=Entretenimiento"
          articles={entretenimientoNews}
        />

        {/* CULTURA Y TURISMO */}

        <CategorySection
          title="Cultura y Turismo"
          eyebrow="Cultura y Turismo"
          href="/noticias?categoria=Cultura%20y%20Turismo"
          articles={culturaTurismoNews}
        />

        {/* POLÍTICA Y GOBIERNO */}

        <CategorySection
          title="Política y Gobierno"
          eyebrow="Política y Gobierno"
          href="/noticias?categoria=Pol%C3%ADtica%20y%20Gobierno"
          articles={politicaNews}
        />

        {/* INTERNACIONAL */}

        <CategorySection
          title="Internacional"
          eyebrow="Internacional"
          href="/noticias?categoria=Internacional"
          articles={internacionalNews}
        />

        {/* DEPORTES */}

        <CategorySection
          title="Deportes"
          eyebrow="Deportes"
          href="/noticias?categoria=Deportes"
          articles={deportesNews}
        />

        {/* ECONOMÍA Y COMERCIO */}

        <CategorySection
          title="Economía y Comercio"
          eyebrow="Economía y Comercio"
          href="/noticias?categoria=Econom%C3%ADa%20y%20Comercio"
          articles={economiaNews}
        />

        {/* NATURALEZA Y MEDIO AMBIENTE */}

        <CategorySection
          title="Naturaleza y Medio Ambiente"
          eyebrow="Naturaleza y Medio Ambiente"
          href="/noticias?categoria=Naturaleza%20y%20Medio%20Ambiente"
          articles={naturalezaNews}
        />

        {/* AUSPCIADOR FINAL */}

        <section className="mx-auto max-w-[1500px] px-4 py-12 sm:px-6 lg:px-8">
          <SponsorSlot
            position="Inicio - Banner inferior"
            width={1456}
            height={180}
          />
        </section>
      </main>

      <Footer />
    </div>
  );
}
