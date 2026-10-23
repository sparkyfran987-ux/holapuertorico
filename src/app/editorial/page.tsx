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

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "";

  return new Intl.DateTimeFormat("es-PR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsedDate);
}

function EditorialImage({
  src,
  alt,
  featured = false,
}: {
  src: string | null;
  alt: string;
  featured?: boolean;
}) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#071428]">
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={featured}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes={
            featured
              ? "(max-width: 1024px) 100vw, 55vw"
              : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          }
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#071428] via-[#102b49] to-[#bf0a30]">
          <span className="text-7xl font-black tracking-tighter text-white/15">
            HPR
          </span>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-[#071428]/40 via-transparent to-transparent" />
    </div>
  );
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
    <main className="min-h-screen bg-[#f8f9fb] text-[#071428]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#071428] text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -right-32 -top-40 h-[450px] w-[450px] rounded-full border border-white/20" />
          <div className="absolute -right-20 -top-28 h-[350px] w-[350px] rounded-full border border-white/20" />
          <div className="absolute -bottom-64 -left-32 h-[500px] w-[500px] rounded-full border border-white/10" />
        </div>

        <div className="relative mx-auto max-w-[1450px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3">
              <span className="h-[2px] w-10 bg-[#bf0a30]" />
              <p className="text-xs font-black uppercase tracking-[0.3em] text-white/70">
                Hola Puerto Rico
              </p>
            </div>

            <h1 className="mt-7 text-6xl font-black tracking-[-0.065em] sm:text-7xl lg:text-8xl">
              Editorial<span className="text-[#bf0a30]">.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">
              Un espacio para las ideas que importan. Opiniones, análisis y
              reflexiones sobre los acontecimientos que marcan el presente y
              el futuro de Puerto Rico.
            </p>

            <div className="mt-9 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.16em] text-white/50">
              <span className="h-2 w-2 rounded-full bg-[#bf0a30]" />
              Ideas que conectan con nuestra isla
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[#bf0a30] via-[#bf0a30]/40 to-transparent" />
      </section>

      {/* CONTENIDO */}
      <div className="mx-auto max-w-[1450px] px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
        {error ? (
          <section className="rounded-3xl border border-gray-200 bg-white p-12 text-center">
            <h2 className="text-2xl font-black">No pudimos cargar los editoriales</h2>
            <p className="mt-3 text-sm text-gray-500">
              Inténtalo nuevamente más tarde.
            </p>
          </section>
        ) : editorials.length === 0 ? (
          <section className="relative overflow-hidden rounded-[2rem] border border-gray-200 bg-white px-6 py-24 text-center shadow-sm">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#071428]/[0.03]" />

            <div className="relative">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-[#bf0a30]">
                Hola Puerto Rico
              </p>

              <h2 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
                Próximamente<span className="text-[#bf0a30]">.</span>
              </h2>

              <p className="mx-auto mt-5 max-w-lg leading-8 text-gray-500">
                Estamos preparando nuevos espacios de opinión y análisis.
                Muy pronto encontrarás aquí historias, ideas y perspectivas
                sobre nuestra isla.
              </p>

              <Link
                href="/"
                className="mt-9 inline-flex items-center rounded-full bg-[#071428] px-8 py-4 text-sm font-black text-white transition hover:bg-[#bf0a30]"
              >
                Volver al inicio →
              </Link>
            </div>
          </section>
        ) : (
          <>
            {/* DESTACADO */}
            {featuredEditorial && (
              <section>
                <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="h-[2px] w-8 bg-[#bf0a30]" />
                      <p className="text-[11px] font-black uppercase tracking-[0.23em] text-[#bf0a30]">
                        Nuestra selección
                      </p>
                    </div>

                    <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                      En portada
                    </h2>
                  </div>

                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Editorial destacado
                  </span>
                </div>

                <Link
                  href={`/editorial/${featuredEditorial.slug}`}
                  className="group grid overflow-hidden rounded-[1.75rem] border border-gray-200 bg-white shadow-[0_15px_50px_rgba(7,20,40,0.07)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_25px_65px_rgba(7,20,40,0.13)] lg:min-h-[490px] lg:grid-cols-[1.15fr_0.85fr]"
                >
                  <div className="relative min-h-[280px] overflow-hidden sm:min-h-[400px] lg:min-h-full">
                    <EditorialImage
                      src={featuredEditorial.image_url}
                      alt={featuredEditorial.title}
                      featured
                    />
                  </div>

                  <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-[#bf0a30]/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[#bf0a30]">
                        Opinión
                      </span>

                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        Destacado
                      </span>
                    </div>

                    <h3 className="mt-6 text-3xl font-black leading-[1.12] tracking-[-0.04em] sm:text-4xl lg:text-[2.7rem]">
                      {featuredEditorial.title}
                    </h3>

                    {featuredEditorial.excerpt && (
                      <p className="mt-6 line-clamp-4 text-base leading-8 text-gray-500">
                        {featuredEditorial.excerpt}
                      </p>
                    )}

                    <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-gray-100 pt-6 text-xs font-bold text-gray-400">
                      <span className="text-[#071428]">
                        Por {featuredEditorial.author}
                      </span>

                      {featuredEditorial.published_at && (
                        <>
                          <span className="h-1 w-1 rounded-full bg-gray-300" />
                          <span>
                            {formatDate(featuredEditorial.published_at)}
                          </span>
                        </>
                      )}
                    </div>

                    <div className="mt-8 inline-flex items-center gap-3 text-sm font-black text-[#071428] transition group-hover:text-[#bf0a30]">
                      Leer editorial
                      <span className="transition-transform duration-300 group-hover:translate-x-2">
                        →
                      </span>
                    </div>
                  </div>
                </Link>
              </section>
            )}

            {/* MÁS EDITORIALES */}
            {otherEditorials.length > 0 && (
              <section className="mt-20">
                <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="h-[2px] w-8 bg-[#bf0a30]" />
                      <p className="text-[11px] font-black uppercase tracking-[0.23em] text-[#bf0a30]">
                        Desde nuestra perspectiva
                      </p>
                    </div>

                    <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                      Más editoriales
                    </h2>
                  </div>

                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    {otherEditorials.length}{" "}
                    {otherEditorials.length === 1 ? "publicación" : "publicaciones"}
                  </p>
                </div>

                <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                  {otherEditorials.map((editorial) => (
                    <Link
                      key={editorial.id}
                      href={`/editorial/${editorial.slug}`}
                      className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition duration-500 hover:-translate-y-1 hover:border-gray-300 hover:shadow-[0_18px_45px_rgba(7,20,40,0.09)]"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <EditorialImage
                          src={editorial.image_url}
                          alt={editorial.title}
                        />
                      </div>

                      <div className="p-6 sm:p-7">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#bf0a30]">
                            Editorial
                          </span>

                          {editorial.published_at && (
                            <span className="text-[10px] font-bold text-gray-400">
                              {formatDate(editorial.published_at)}
                            </span>
                          )}
                        </div>

                        <h3 className="mt-4 text-xl font-black leading-snug tracking-tight transition group-hover:text-[#bf0a30]">
                          {editorial.title}
                        </h3>

                        {editorial.excerpt && (
                          <p className="mt-3 line-clamp-3 text-sm leading-7 text-gray-500">
                            {editorial.excerpt}
                          </p>
                        )}

                        <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-5">
                          <span className="text-xs font-bold text-gray-400">
                            Por {editorial.author}
                          </span>

                          <span className="text-lg text-[#071428] transition group-hover:translate-x-1 group-hover:text-[#bf0a30]">
                            →
                          </span>
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

      {/* PIE EDITORIAL */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto flex max-w-[1450px] flex-col items-center justify-between gap-5 px-5 py-9 text-center sm:px-8 md:flex-row md:text-left lg:px-12">
          <div>
            <p className="text-sm font-black tracking-tight">
              Hola Puerto Rico
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Informando, conectando y dando voz a nuestra isla.
            </p>
          </div>

          <Link
            href="/"
            className="text-xs font-black uppercase tracking-widest text-[#071428] transition hover:text-[#bf0a30]"
          >
            Visitar página principal →
          </Link>
        </div>
      </section>
    </main>
  );
}
