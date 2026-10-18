import Image from "next/image";
import Link from "next/link";
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

export default async function EditorialPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("editorials")
    .select(
      "id, title, slug, excerpt, content, image_url, author, status, featured, published_at"
    )
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error cargando editoriales:", error.message);
  }

  const editorials = (data ?? []) as Editorial[];

  const featuredEditorial =
    editorials.find((editorial) => editorial.featured) ??
    editorials[0] ??
    null;

  const otherEditorials = editorials.filter(
    (editorial) => editorial.id !== featuredEditorial?.id
  );

  return (
    <main className="min-h-screen bg-[#f7f7f5]">
      {/* Encabezado */}
      <section className="bg-[#071428] text-white">
        <div className="mx-auto max-w-[1500px] px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-[#ff647f]">
              Hola Puerto Rico
            </p>

            <h1 className="mt-4 text-5xl font-black tracking-[-0.04em] sm:text-6xl lg:text-7xl">
              Editorial
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">
              Opiniones, análisis y reflexiones sobre los temas que impactan
              nuestra isla.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1500px] px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
        {editorials.length === 0 ? (
          <section className="rounded-3xl border border-gray-200 bg-white px-6 py-20 text-center shadow-sm">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-gray-400">
              Editorial
            </p>

            <h2 className="mt-4 text-3xl font-black text-[#071428]">
              Próximamente
            </h2>

            <p className="mx-auto mt-4 max-w-lg text-gray-500">
              Estamos preparando nuestros primeros editoriales. Regresa
              pronto para conocer nuestras opiniones y análisis.
            </p>

            <Link
              href="/"
              className="mt-8 inline-flex rounded-full bg-[#071428] px-6 py-3 text-sm font-black text-white transition hover:bg-[#bf0a30]"
            >
              Volver al inicio
            </Link>
          </section>
        ) : (
          <>
            {/* Editorial destacado */}
            {featuredEditorial && (
              <section>
                <div className="mb-6 flex items-center gap-4">
                  <span className="h-px w-10 bg-[#bf0a30]" />

                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#bf0a30]">
                    Editorial destacado
                  </p>
                </div>

                <Link
                  href={`/editorial/${featuredEditorial.slug}`}
                  className="group grid overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_rgba(7,20,40,0.10)] transition hover:-translate-y-1 lg:grid-cols-2"
                >
                  <div className="relative min-h-[280px] bg-[#071428] sm:min-h-[400px]">
                    {featuredEditorial.image_url ? (
                      <Image
                        src={featuredEditorial.image_url}
                        alt={featuredEditorial.title}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-105"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#071428] to-[#bf0a30]">
                        <span className="text-7xl font-black text-white/10">
                          PR
                        </span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  </div>

                  <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#bf0a30]">
                      Opinión
                    </p>

                    <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-0.03em] text-[#071428] sm:text-4xl lg:text-5xl">
                      {featuredEditorial.title}
                    </h2>

                    {featuredEditorial.excerpt && (
                      <p className="mt-5 text-base leading-8 text-gray-600">
                        {featuredEditorial.excerpt}
                      </p>
                    )}

                    <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-bold text-gray-400">
                      <span>Por {featuredEditorial.author}</span>

                      {featuredEditorial.published_at && (
                        <>
                          <span className="h-1 w-1 rounded-full bg-gray-300" />
                          <span>
                            {formatDate(featuredEditorial.published_at)}
                          </span>
                        </>
                      )}
                    </div>

                    <span className="mt-8 inline-flex items-center text-sm font-black text-[#071428] transition group-hover:text-[#bf0a30]">
                      Leer editorial
                      <span className="ml-2 transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  </div>
                </Link>
              </section>
            )}

            {/* Editoriales anteriores */}
            {otherEditorials.length > 0 && (
              <section className="mt-16">
                <div className="mb-8 flex items-center gap-4">
                  <span className="h-px w-10 bg-[#071428]" />

                  <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#071428]">
                    Editoriales
                  </h2>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {otherEditorials.map((editorial) => (
                    <Link
                      key={editorial.id}
                      href={`/editorial/${editorial.slug}`}
                      className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-xl"
                    >
                      <div className="relative aspect-[16/9] overflow-hidden bg-[#071428]">
                        {editorial.image_url ? (
                          <Image
                            src={editorial.image_url}
                            alt={editorial.title}
                            fill
                            className="object-cover transition duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#071428] to-[#bf0a30]">
                            <span className="text-5xl font-black text-white/10">
                              PR
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-6">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#bf0a30]">
                          Editorial
                        </p>

                        <h3 className="mt-3 text-xl font-black leading-tight text-[#071428]">
                          {editorial.title}
                        </h3>

                        {editorial.excerpt && (
                          <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-500">
                            {editorial.excerpt}
                          </p>
                        )}

                        <div className="mt-5 text-xs font-bold text-gray-400">
                          Por {editorial.author}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}
