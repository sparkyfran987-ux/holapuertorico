"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import type { NewsArticle } from "@/types/news";

interface FeaturedCarouselProps {
  articles: NewsArticle[];
}

export default function FeaturedCarousel({
  articles,
}: FeaturedCarouselProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (articles.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setCurrent((previous) =>
        previous === articles.length - 1
          ? 0
          : previous + 1
      );
    }, 6000);

    return () => clearInterval(interval);
  }, [articles.length]);

  if (articles.length === 0) {
    return null;
  }

  const article = articles[current];

  const date = article.published_at
    ? new Date(article.published_at).toLocaleDateString(
        "es-PR",
        {
          day: "numeric",
          month: "long",
          year: "numeric",
        }
      )
    : null;

  const goPrevious = () => {
    setCurrent((previous) =>
      previous === 0
        ? articles.length - 1
        : previous - 1
    );
  };

  const goNext = () => {
    setCurrent((previous) =>
      previous === articles.length - 1
        ? 0
        : previous + 1
    );
  };

  return (
    <section className="mx-auto max-w-[1500px] px-4 pt-6 sm:px-6 lg:px-8">
      <div className="overflow-hidden border border-gray-200 bg-white">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
          {/* IMAGEN */}

          <Link
            href={`/noticias/${article.slug}`}
            className="group relative block overflow-hidden bg-gray-100"
          >
            <div className="relative flex min-h-[320px] w-full items-center justify-center sm:min-h-[430px] lg:min-h-[560px]">
              {article.image_url ? (
                <Image
                  key={article.image_url}
                  src={article.image_url}
                  alt={article.title}
                  fill
                  priority={current === 0}
                  className="object-contain transition-transform duration-700 group-hover:scale-[1.01]"
                  sizes="(max-width: 1024px) 100vw, 65vw"
                />
              ) : (
                <div className="flex min-h-[320px] w-full items-center justify-center text-sm font-bold uppercase tracking-[0.15em] text-gray-400 sm:min-h-[430px] lg:min-h-[560px]">
                  Hola Puerto Rico+
                </div>
              )}
            </div>

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

            <div className="absolute bottom-5 left-5 flex flex-wrap gap-2 sm:bottom-7 sm:left-7">
              <span className="bg-red-600 px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-white">
                {article.category}
              </span>

              {article.breaking && (
                <span className="bg-white px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-gray-950">
                  Última hora
                </span>
              )}
            </div>
          </Link>

          {/* INFORMACIÓN */}

          <div className="flex min-h-[320px] flex-col justify-between p-6 sm:p-8 lg:min-h-[560px] lg:p-10">
            <div>
              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.16em] text-gray-400">
                <span className="text-red-600">
                  Destacada
                </span>

                {date && (
                  <>
                    <span className="h-1 w-1 rounded-full bg-gray-300" />
                    <span>{date}</span>
                  </>
                )}
              </div>

              <Link href={`/noticias/${article.slug}`}>
                <h1 className="mt-5 text-3xl font-black leading-[1.04] tracking-[-0.04em] text-gray-950 transition-colors hover:text-red-600 sm:text-4xl lg:text-[42px]">
                  {article.title}
                </h1>
              </Link>

              {article.excerpt && (
                <p className="mt-5 max-w-xl text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">
                  {article.excerpt}
                </p>
              )}
            </div>

            <div className="mt-8">
              <div className="flex items-center justify-between gap-4 border-t border-gray-200 pt-5">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-gray-400">
                    Por
                  </p>

                  <p className="mt-1 text-sm font-bold text-gray-900">
                    {article.author}
                  </p>
                </div>

                <Link
                  href={`/noticias/${article.slug}`}
                  className="inline-flex items-center gap-2 border border-gray-200 px-4 py-2.5 text-xs font-black text-gray-950 transition-colors hover:border-red-600 hover:bg-red-600 hover:text-white"
                >
                  Leer noticia
                  <span aria-hidden="true">→</span>
                </Link>
              </div>

              {/* CONTROLES */}

              <div className="mt-7 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {articles.map((item, index) => (
                    <button
                      key={item.id}
                      type="button"
                      aria-label={`Ir a noticia destacada ${index + 1}`}
                      onClick={() => setCurrent(index)}
                      className={`h-1.5 transition-all ${
                        index === current
                          ? "w-8 bg-red-600"
                          : "w-2 bg-gray-300 hover:bg-gray-500"
                      }`}
                    />
                  ))}
                </div>

                {articles.length > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={goPrevious}
                      aria-label="Noticia destacada anterior"
                      className="flex h-9 w-9 items-center justify-center border border-gray-200 text-gray-900 transition-colors hover:border-gray-900 hover:bg-gray-900 hover:text-white"
                    >
                      ←
                    </button>

                    <button
                      type="button"
                      onClick={goNext}
                      aria-label="Siguiente noticia destacada"
                      className="flex h-9 w-9 items-center justify-center border border-gray-200 text-gray-900 transition-colors hover:border-gray-900 hover:bg-gray-900 hover:text-white"
                    >
                      →
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}