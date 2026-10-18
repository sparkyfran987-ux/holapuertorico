import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type Editorial = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  image_url: string | null;
  author: string;
  status: string;
  featured: boolean;
  published_at: string | null;
};

function formatDate(date: string | null) {
  if (!date) return "";

  return new Intl.DateTimeFormat("es-PR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export default async function EditorialArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("editorials")
    .select(
      "id, title, slug, excerpt, content, image_url, author, status, featured, published_at"
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error("Error cargando editorial:", error.message);
  }

  if (!data) {
    notFound();
  }

  const editorial = data as Editorial;

  return (
    <main className="min-h-screen bg-white">
      {/* Encabezado */}
      <section className="bg-[#071428] text-white">
        <div className="mx-auto max-w-[1100px] px-5 py-12 sm:px-8 lg:py-16">
          <Link
            href="/editorial"
            className="inline-flex items-center text-xs font-black uppercase tracking-[0.16em] text-white/60 transition hover:text-white"
          >
            ← Volver a Editorial
          </Link>

          <div className="mt-10 max-w-4xl">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#ff647f]">
              Editorial
            </p>

            <h1 className="mt-5 text-4xl font-black leading-[1.05] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              {editorial.title}
            </h1>

            {editorial.excerpt && (
              <p className="mt-6 max-w-3xl text-lg leading-8 text-white/65 sm:text-xl">
                {editorial.excerpt}
              </p>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-semibold text-white/50">
              <span>Por {editorial.author}</span>

              {editorial.published_at && (
                <>
                  <span className="h-1 w-1 rounded-full bg-white/30" />
                  <span>{formatDate(editorial.published_at)}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Imagen */}
      {editorial.image_url && (
        <div className="mx-auto max-w-[1300px] px-5 pt-8 sm:px-8 lg:pt-12">
          <div className="relative aspect-[16/7] overflow-hidden rounded-3xl bg-[#071428]">
            <Image
              src={editorial.image_url}
              alt={editorial.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1300px) 100vw, 1300px"
            />
          </div>
        </div>
      )}

      {/* Contenido */}
      <article className="mx-auto max-w-[850px] px-5 py-12 sm:px-8 lg:py-16">
        <div className="prose prose-lg max-w-none">
          {editorial.content.split(/\n\s*\n/).map((paragraph, index) => (
            <p
              key={index}
              className="mb-7 text-[17px] leading-9 text-gray-700 sm:text-[18px]"
            >
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-14 border-t border-gray-200 pt-8">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-gray-400">
            Hola Puerto Rico+
          </p>

          <p className="mt-2 text-sm font-semibold text-[#071428]">
            Más contenido • Más Puerto Rico • Siempre contigo
          </p>
        </div>
      </article>
    </main>
  );
}
