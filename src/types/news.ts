export type NewsCategory =
  | "Noticias Locales"
  | "Entretenimiento"
  | "Cultura y Turismo"
  | "Política y Gobierno"
  | "Internacional"
  | "Deportes"
  | "Economía y Comercio"
  | "Naturaleza y Medio Ambiente";

export type NewsStatus = "draft" | "published";

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  image_url: string | null;
  category: string;
  author: string;
  status: NewsStatus;
  featured: boolean;
  breaking: boolean;
  published_at: string | null;
  created_at?: string;
  updated_at?: string;
}