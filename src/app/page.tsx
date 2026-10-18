import Header from "@/components/site/Header";
import BreakingNews from "@/components/site/BreakingNews";
import BrandHero from "@/components/site/BrandHero";
import Footer from "@/components/site/Footer";
import SponsorStrip from "@/components/SponsorStrip";
import FeaturedNews from "@/components/news/FeaturedNews";
import FacebookFollow from "@/components/site/FacebookFollow";
import SponsorCarouselLoader from "@/components/site/SponsorCarouselLoader";

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
    .or("featured.eq.true,breaking.eq.true")
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

  const featuredNews = noticias.filter((article) => article.featured);
  const breakingNews = noticias.find((article) => article.breaking) ?? null;

  return (
    <div className="min-h-screen bg-white text-[#071428]">
      <Header />

      <SponsorCarouselLoader />

{breakingNews && (
  <BreakingNews
    title={breakingNews.title}
    slug={breakingNews.slug}
  />
)}

      {breakingNews && (
        <BreakingNews
          title={breakingNews.title}
          slug={breakingNews.slug}
        />
      )}

      <main>
        <BrandHero />

        <FeaturedNews />

        <SponsorStrip />

        <FacebookFollow />

        <section className="bg-white">
          <div className="mx-auto max-w-[1100px] px-5 py-16 sm:px-8 lg:py-20">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-8 bg-[#bf0a30]" />
                  <span className="h-2 w-5 bg-[#002868]" />
                </div>

                <h2 className="mt-5 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
                  Hablemos
                </h2>

                <p className="mt-4 max-w-md text-sm leading-7 text-gray-600">
                  Publicidad, colaboraciones o cualquier pregunta sobre
                  Hola Puerto Rico. Estamos para ayudarte.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <a
                  href="mailto:luis@medianaranja.agency"
                  className="rounded-2xl border border-gray-200 bg-[#f6f8fc] p-6 transition hover:-translate-y-0.5 hover:border-[#bf0a30] hover:bg-white hover:shadow-lg"
                >
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                    Correo
                  </p>

                  <p className="mt-3 break-all text-sm font-black text-[#071428]">
                    luis@medianaranja.agency
                  </p>
                </a>

                <a
                  href="tel:+19395399979"
                  className="rounded-2xl border border-gray-200 bg-[#f6f8fc] p-6 transition hover:-translate-y-0.5 hover:border-[#002868] hover:bg-white hover:shadow-lg"
                >
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                    Teléfono
                  </p>

                  <p className="mt-3 text-lg font-black text-[#071428]">
                    (939) 539-9979
                  </p>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
