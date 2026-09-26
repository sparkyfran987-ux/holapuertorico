import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import Header from "@/components/site/Header";
import Navbar from "@/components/site/Navbar";
import BreakingNews from "@/components/site/BreakingNews";
import Footer from "@/components/site/Footer";
import SponsorSlot from "@/components/site/SponsorSlot";
import NewsCard from "@/components/news/NewsCard";

import { createClient } from "@/lib/supabase/server";
import type { NewsArticle } from "@/types/news";

export const dynamic = "force-dynamic";

interface NewsDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function NewsDetailPage({
  params,
}: NewsDetailPageProps) {
  const { slug } = await params;

  const supabase = await createClient();

  const { data: articleData, error } = await supabase
    .from("news")
    .select(
      "id, title, slug, excerpt, content, image_url, category, author, status, featured, breaking, published_at, created_at, updated_at"
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !articleData) {
    notFound();
  }

  const article = articleData as NewsArticle;

  const { data: relatedData } = await supabase
    .from("news")
    .select(
      "id, title, slug, excerpt, content, image_url, category, author, status, featured, breaking, published_at, created_at, updated_at"
    )
    .eq("status", "published")
    .neq("id", article.id)
    .eq("category", article.category)
    .order("published_at", { ascending: false })
    .limit(4);

  const relatedNews = (relatedData ?? []) as NewsArticle[];

  const formattedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString("es-PR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const categoryUrl =
    "/noticias?categoria=" + encodeURIComponent(article.category);

  return (
    <div className="min-h-screen bg-white text-gray-950">
      <Header />

      <Navbar active="Noticias" />

      {article.breaking && (
        <BreakingNews title={article.title} slug={article.slug} />
      )}

      <main>
        <article className="mx-auto max-w-[1300px] px-4 pb-16 pt-7 sm:px-6 lg:px-8 lg:pt-9">
          {/* Breadcrumb */}
          <div className="mb-7 flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
            <Link
              href="/"
              className="transition-colors hover:text-red-600"
            >
              Inicio
            </Link>

            <span className="text-gray-300">•</span>

            <Link
              href="/noticias"
              className="transition-colors hover:text-red-600"
            >
              Noticias
            </Link>

            <span className="text-gray-300">•</span>

            <span className="text-gray-500">
              {article.category}
            </span>
          </div>

          {/* Encabezado + imagen */}
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start lg:gap-14">
            <header className="max-w-3xl">
              <Link
                href={categoryUrl}
                className="inline-flex border-l-[3px] border-red-600 pl-3 text-[11px] font-black uppercase tracking-[0.16em] text-red-600 transition-colors hover:text-red-700"
              >
                {article.category}
              </Link>

              <h1 className="mt-4 text-4xl font-black leading-[1.04] tracking-[-0.045em] text-gray-950 sm:text-5xl lg:text-[52px]">
                {article.title}
              </h1>

              {article.excerpt && (
                <p className="mt-5 max-w-2xl text-[17px] leading-7 text-gray-600 sm:text-[18px]">
                  {article.excerpt}
                </p>
              )}

              <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-gray-200 pt-5">
                <div>
                  <span className="text-[9px] font-black uppercase tracking-[0.15em] text-gray-400">
                    Por
                  </span>

                  <p className="mt-1 text-sm font-bold text-gray-900">
                    {article.author}
                  </p>
                </div>

                {formattedDate && (
                  <>
                    <span className="hidden h-7 w-px bg-gray-200 sm:block" />

                    <div>
                      <span className="text-[9px] font-black uppercase tracking-[0.15em] text-gray-400">
                        Publicado
                      </span>

                      <p className="mt-1 text-sm font-medium text-gray-500">
                        {formattedDate}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </header>

            {/* Imagen */}
            {article.image_url && (
              <div className="order-first lg:order-none">
                <div className="overflow-hidden bg-gray-50">
                  <Image
                    src={article.image_url}
                    alt={article.title}
                    width={1080}
                    height={1080}
                    priority
                    className="block h-auto w-full object-contain"
                    sizes="(max-width: 1024px) 100vw, 400px"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Contenido + auspiciador */}
          <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div>
              <div className="border-t border-gray-200 pt-9">
                {article.content.split("\n").map((paragraph, index) => {
                  const trimmed = paragraph.trim();

                  if (!trimmed) {
                    return null;
                  }

                  return (
                    <p
                      key={index}
                      className="mb-6 text-[17px] leading-[1.85] text-gray-700 sm:text-[18px]"
                    >
                      {trimmed}
                    </p>
                  );
                })}
              </div>

              {/* Autor */}
              <div className="mt-10 border-t border-gray-200 pt-6">
                <p className="text-[9px] font-black uppercase tracking-[0.16em] text-gray-400">
                  Publicado por
                </p>

                <p className="mt-2 text-sm font-bold text-gray-900">
                  {article.author}
                </p>
              </div>
            </div>

            {/* Publicidad lateral 1024 × 1024 */}
            <aside className="hidden lg:block">
              <div className="sticky top-6">
                <SponsorSlot
                  position="Artículo - Sidebar"
                  width={1024}
                  height={1024}
                />
              </div>
            </aside>
          </div>
        </article>

        {/* Noticias relacionadas */}
        {relatedNews.length > 0 && (
          <section className="border-t border-gray-200 bg-gray-50">
            <div className="mx-auto max-w-[1500px] px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
              <div className="mb-8">
                <span className="text-[10px] font-black uppercase tracking-[0.17em] text-red-600">
                  Más contenido
                </span>

                <h2 className="mt-2 text-3xl font-black tracking-[-0.03em] text-gray-950 sm:text-4xl">
                  Noticias relacionadas
                </h2>
              </div>

              <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
                {relatedNews.map((item) => (
                  <NewsCard
                    key={item.id}
                    article={item}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Anuncio inferior */}
        <section className="mx-auto max-w-[1500px] px-4 py-10 sm:px-6 lg:px-8">
          <SponsorSlot
            position="Artículo - Banner inferior"
            width={1456}
            height={180}
          />
        </section>
      </main>

      <Footer />
    </div>
  );
}