import Image from "next/image";
import Link from "next/link";

import type { NewsArticle } from "@/types/news";

interface HeroNewsProps {
  article: NewsArticle;
}

export default function HeroNews({ article }: HeroNewsProps) {
  const date = article.published_at
    ? new Date(article.published_at).toLocaleDateString("es-PR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <article className="group overflow-hidden border border-gray-200 bg-white">
      <div className="grid lg:grid-cols-[minmax(0,1.05fr)_minmax(280px,0.95fr)]">
        {/* IMAGEN */}
        <Link
          href={`/noticias/${article.slug}`}
          className="block"
        >
          <div className="relative w-full overflow-hidden bg-gray-50">
            {article.image_url ? (
              <Image
                src={article.image_url}
                alt={article.title}
                width={1080}
                height={1080}
                priority
                className="block h-auto w-full object-contain transition duration-700 group-hover:scale-[1.015]"
                sizes="(max-width: 1024px) 100vw, 58vw"
              />
            ) : (
              <div className="flex aspect-square w-full items-center justify-center text-sm font-semibold text-gray-400">
                Hola Puerto Rico+
              </div>
            )}

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
              <span className="bg-red-600 px-2.5 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-white">
                {article.category}
              </span>

              {article.breaking && (
                <span className="bg-white px-2.5 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-gray-950">
                  Última hora
                </span>
              )}
            </div>
          </div>
        </Link>

        {/* INFORMACIÓN */}
        <div className="flex flex-col justify-between p-6 sm:p-7 lg:p-8">
          <div>
            <div className="mb-4 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.14em] text-gray-500">
              <span>Destacada</span>

              {date && (
                <>
                  <span className="h-1 w-1 rounded-full bg-red-600" />
                  <span>{date}</span>
                </>
              )}
            </div>

            <Link href={`/noticias/${article.slug}`}>
              <h1 className="text-2xl font-black leading-[1.06] tracking-[-0.035em] text-gray-950 transition-colors group-hover:text-red-600 sm:text-[28px] xl:text-[34px]">
                {article.title}
              </h1>
            </Link>

            {article.excerpt && (
              <p className="mt-4 max-w-xl text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">
                {article.excerpt}
              </p>
            )}
          </div>

          <div className="mt-7 border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-gray-400">
                  Por
                </p>

                <p className="mt-1 text-sm font-bold text-gray-900">
                  {article.author}
                </p>
              </div>

              <Link
                href={`/noticias/${article.slug}`}
                className="inline-flex items-center gap-2 text-xs font-black text-gray-950 transition-colors hover:text-red-600"
              >
                Leer noticia
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}