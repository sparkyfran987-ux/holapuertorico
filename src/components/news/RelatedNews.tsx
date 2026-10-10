import Link from "next/link";
import NewsCard from "@/components/news/NewsCard";
import type { NewsArticle } from "@/types/news";

interface RelatedNewsProps {
  articles: NewsArticle[];
  title?: string;
  eyebrow?: string;
}

export default function RelatedNews({
  articles,
  title = "También te puede interesar",
  eyebrow = "Más contenido",
}: RelatedNewsProps) {
  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-gray-200 pt-10">
      <div className="mb-7 flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#c7192e]">
            {eyebrow}
          </p>

          <h2 className="mt-1 text-2xl font-black tracking-tight text-gray-950 sm:text-3xl">
            {title}
          </h2>
        </div>

        <Link
          href="/noticias"
          className="shrink-0 text-xs font-black text-[#c7192e] hover:underline sm:text-sm"
        >
          Ver todas →
        </Link>
      </div>

      <div className="grid gap-7 md:grid-cols-3">
        {articles.slice(0, 3).map((article) => (
          <NewsCard
            key={article.id}
            article={article}
          />
        ))}
      </div>
    </section>
  );
}