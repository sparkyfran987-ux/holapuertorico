import Image from "next/image";
import Link from "next/link";

import type { NewsArticle } from "@/types/news";

interface FeaturedNewsProps {
  articles: NewsArticle[];
}

function formatDate(value: string | null) {
  if (!value) return null;

  return new Date(value).toLocaleDateString("es-PR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function FeaturedNews({
  articles,
}: FeaturedNewsProps) {
  if (articles.length === 0) {
    return null;
  }

  const [lead, ...rest] = articles;
  const leadDate = formatDate(lead.published_at);
  const leadHref = "/noticias/" + lead.slug;

  return (
    <section
      id="destacadas"
      className="scroll-mt-6 bg-white py-16 sm:py-20"
    >
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-8 bg-[#bf0a30]" />
              <span className="h-2 w-5 bg-[#002868]" />
            </div>

            <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] text-[#071428] sm:text-4xl">
              Destacadas
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Lo más importante de Hola Puerto Rico+, ahora mismo.
            </p>
          </div>
        </div>

        {/* Noticia principal */}
        <article className="mt-10 overflow-hidden rounded-3xl border border-gray-200 bg-[#071428] shadow-[0_24px_80px_rgba(7,20,40,0.18)]">
          <Link
            href={leadHref}
            className="group grid lg:grid-cols-[1.2fr_0.8fr]"
          >
            <div className="relative min-h-[280px] bg-[#071428] sm:min-h-[380px] lg:min-h-[520px]">
              {lead.image_url ? (
                <Image
                  src={lead.image_url}
                  alt={lead.title}
                  fill
                  priority
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              ) : (
                <div className="flex h-full min-h-[280px] items-center justify-center text-sm font-bold uppercase tracking-[0.16em] text-white/40">
                  Hola Puerto Rico+
                </div>
              )}
            </div>

            <div className="relative flex flex-col justify-center p-7 text-white sm:p-10">
              <div className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em]">
                <span className="rounded-full bg-[#bf0a30] px-3 py-1.5">
                  {lead.category}
                </span>

                {lead.breaking && (
                  <span className="rounded-full bg-white px-3 py-1.5 text-[#071428]">
                    Última hora
                  </span>
                )}
              </div>

              <h3 className="mt-5 text-3xl font-black leading-[1.05] tracking-[-0.04em] transition group-hover:text-red-200 sm:text-4xl">
                {lead.title}
              </h3>

              {lead.excerpt && (
                <p className="mt-4 line-clamp-4 text-sm leading-7 text-white/70">
                  {lead.excerpt}
                </p>
              )}

              <div className="mt-8 flex items-center justify-between gap-4 border-t border-white/15 pt-5 text-sm">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">
                    {lead.author}
                  </p>

                  {leadDate && (
                    <p className="mt-1 text-white/70">
                      {leadDate}
                    </p>
                  )}
                </div>

                <span className="font-black">
                  Leer noticia →
                </span>
              </div>
            </div>
          </Link>
        </article>

        {/* Resto de las noticias destacadas */}
        {rest.length > 0 && (
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {rest.map((article) => {
              const date = formatDate(article.published_at);
              const articleHref = "/noticias/" + article.slug;

              return (
                <article
                  key={article.id}
                  className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:border-[#bf0a30]/40 hover:shadow-xl"
                >
                  <Link href={articleHref} className="block">
                    <div className="relative aspect-[16/10] bg-[#071428]">
                      {article.image_url ? (
                        <Image
                          src={article.image_url}
                          alt={article.title}
                          fill
                          className="object-contain transition duration-500"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs font-bold uppercase tracking-widest text-white/40">
                          Hola Puerto Rico+
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#bf0a30]">
                        {article.category}
                      </p>

                      <h3 className="mt-2 text-xl font-black leading-tight tracking-[-0.03em] text-[#071428] group-hover:text-[#bf0a30]">
                        {article.title}
                      </h3>

                      {article.excerpt && (
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600">
                          {article.excerpt}
                        </p>
                      )}

                      {date && (
                        <p className="mt-4 text-xs font-semibold text-gray-400">
                          {date}
                        </p>
                      )}

                      <p className="mt-4 text-sm font-black text-[#bf0a30]">
                        Leer noticia →
                      </p>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
