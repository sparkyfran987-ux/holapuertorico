import Link from "next/link";
import NewsCard from "@/components/news/NewsCard";
import type { NewsArticle } from "@/types/news";

interface CategorySectionProps {
  title: string;
  eyebrow?: string;
  href: string;
  articles: NewsArticle[];
}

export default function CategorySection({
  title,
  eyebrow,
  href,
  articles,
}: CategorySectionProps) {
  if (!articles.length) {
    return null;
  }

  return (
    <section className="border-t border-gray-200">
      <div className="mx-auto max-w-[1500px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            {eyebrow && (
              <span className="text-[11px] font-black uppercase tracking-[0.18em] text-red-600">
                {eyebrow}
              </span>
            )}

            <h2 className="mt-2 text-3xl font-black tracking-[-0.035em] text-gray-950 sm:text-4xl">
              {title}
            </h2>
          </div>

          <Link
            href={href}
            className="hidden border-b-2 border-gray-950 pb-1 text-xs font-black uppercase tracking-[0.12em] text-gray-950 transition-colors hover:border-red-600 hover:text-red-600 sm:block"
          >
            Ver sección
          </Link>
        </div>

        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {articles.map((article) => (
            <NewsCard
              key={article.id}
              article={article}
            />
          ))}
        </div>

        <div className="mt-8 sm:hidden">
          <Link
            href={href}
            className="text-xs font-black uppercase tracking-[0.12em] text-red-600"
          >
            Ver toda la sección →
          </Link>
        </div>
      </div>
    </section>
  );
}