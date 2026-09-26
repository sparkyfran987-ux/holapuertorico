import Image from "next/image";
import Link from "next/link";
import type { NewsArticle } from "@/types/news";

interface NewsCardProps {
  article: NewsArticle;
}

export default function NewsCard({ article }: NewsCardProps) {
  const date = article.published_at
    ? new Date(article.published_at).toLocaleDateString("es-PR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <article className="group border-b border-gray-200 pb-6">
      <Link
        href={`/noticias/${article.slug}`}
        className="block"
      >
        <div className="relative w-full overflow-hidden bg-gray-100">
          {article.image_url ? (
            <Image
              src={article.image_url}
              alt={article.title}
              width={1080}
              height={1080}
              className="block h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.035]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="flex aspect-square w-full items-center justify-center text-xs font-bold uppercase tracking-widest text-gray-400">
              Hola Puerto Rico+
            </div>
          )}

          {article.breaking && (
            <span className="absolute left-3 top-3 z-10 bg-red-600 px-2.5 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white">
              Última hora
            </span>
          )}
        </div>
      </Link>

      <div className="pt-4">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.14em]">
          <Link
            href={`/noticias?categoria=${encodeURIComponent(
              article.category
            )}`}
            className="text-red-600 transition-colors hover:text-gray-950"
          >
            {article.category}
          </Link>

          {date && (
            <>
              <span className="text-gray-300">•</span>

              <span className="font-semibold text-gray-400">
                {date}
              </span>
            </>
          )}
        </div>

        <Link href={`/noticias/${article.slug}`}>
          <h3 className="mt-2 text-xl font-black leading-tight tracking-[-0.02em] text-gray-950 transition-colors group-hover:text-red-600">
            {article.title}
          </h3>
        </Link>

        {article.excerpt && (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600">
            {article.excerpt}
          </p>
        )}
      </div>
    </article>
  );
}