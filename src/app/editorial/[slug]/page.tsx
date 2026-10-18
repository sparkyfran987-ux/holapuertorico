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
    <main className="min-h-screen bg-[#f7f7f5]">
      {/* Encabezado editorial */}
      <section className="bg-[#071428] text-white">
        <div className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8 lg:px-10">
          <Link
            href="/editorial"
            className="inline-flex items-center text-xs font-black uppercase tracking-[0.16em] text-white/50 transition hover:text-white"
          >
            ← Volver a Editorial
          </Link>
        </div>
      </section>

      {/* Hero del editorial */}
      <section className="bg-[#071428] pb-14 text-white sm:pb-20 lg:pb-24">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.75fr] lg:gap-16">
            {/* Información */}
            <div className="max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-[#ff647f]">
                Editorial
              </p>

              <h1 className="mt-5 text-4xl font-black leading-[1.02] tracking-[-0.045em] sm:text-5xl lg:text-6xl xl:text-7xl">
                {editorial.title}
              </h1>

              {editorial.excerpt && (
                <p className="mt-7 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">
                  {editorial.excerpt}
                </p>
              )}

              <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-semibold text-white/45">
                <span>Por {editorial.author}</span>

                {editorial.published_at && (
                  <>
                    <span className="h-1 w-1 rounded-full bg-white/30" />
                    <span>{formatDate(editorial.published_at)}</span>
                  </>
                )}
              </div>
            </div>

            {/* Imagen */}
            {editorial.image_url && (
              <div className="relative mx-auto w-full max-w-[520px] lg:mx-0 lg:ml-auto">
                <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-2 shadow-[0_25px_80px_rgba(0,0,0,0.30)]">
                  <Image
                    src={editorial.image_url}
                    alt={editorial.title}
                    width={1000}
                    height={700}
                    priority
                    className="h-auto max-h-[520px] w-full rounded-2xl object-contain"
                    sizes="(max-width: 1024px) 100vw, 520px"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contenido del editorial */}
      <article className="mx-auto max-w-[900px] px-5 py-14 sm:px-8 lg:py-20">
        <div className="relative">
          <div className="absolute -left-5 top-0 hidden h-full w-px bg-gradient-to-b from-[#bf0a30] via-gray-200 to-transparent lg:block" />

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
        </div>

        {/* Firma */}
        <div className="mt-16 border-t border-gray-200 pt-8">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-gray-400">
            Hola Puerto Rico
          </p>

          <p className="mt-2 text-sm font-semibold text-[#071428]">
            Más contenido • Más Puerto Rico • Siempre contigo
          </p>
        </div>
      </article>
    </main>
  );
}
