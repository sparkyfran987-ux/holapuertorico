import NewsCard from "@/components/news/NewsCard";
import type { NewsArticle } from "@/types/news";

interface NewsGridProps {
  articles: NewsArticle[];
  featured?: boolean;
}

export default function NewsGrid({
  articles,
  featured = false,
}: NewsGridProps) {
  if (!articles.length) {
    return (
      <div className="border border-dashed border-gray-300 px-6 py-14 text-center">
        <p className="text-sm font-semibold text-gray-500">
          No hay noticias disponibles.
        </p>
      </div>
    );
  }

  return (
    <div
      className={
        featured
          ? "grid gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-3"
          : "grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3"
      }
    >
      {articles.map((article) => (
        <NewsCard
          key={article.id}
          article={article}
        />
      ))}
    </div>
  );
}