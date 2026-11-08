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
    <div className="relative h-full w-full overflow-hidden bg-[#102b49]">
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
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#071428] via-[#163b63] to-[#bf0a30]">
          <span className="text-8xl font-black tracking-tighter text-white/15">
            HPR
          </span>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-[#071428]/70 via-transparent to-transparent" />
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
    <main className="min-h-screen overflow-hidden bg-[#f5f7fb] text-[#071428]">

      {/* HERO EDITORIAL */}
      <section className="relative overflow-hidden bg-[#071428] text-white">

        {/* Decoración */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full border border-white/[0.08]" />
          <div className="absolute -right-20 -top-20 h-[450px] w-[450px] rounded-full border border-white/[0.08]" />

          <div className="absolute -left-40 bottom-[-300px] h-[600px] w-[600px] rounded-full bg-[#bf0a30]/20 blur-[100px]" />

          <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-[#163b63]/20 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-[1450px] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-32">

          <div className="max-w-5xl">

            <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-[#bf0a30]" />
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-white/80">
                Hola Puerto Rico · Publicaciones
              </span>
            </div>

            <h1 className="mt-8 text-6xl font-black leading-[0.95] tracking-[-0.075em] sm:text-7xl lg:text-[100px]">
              Editorial
              <span className="text-[#bf0a30]">.</span>
            </h1>

            <p className="mt-8 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">
              Ideas, opiniones y perspectivas que merecen ser compartidas.
              Un espacio para explorar los temas que nos interesan,
              cuestionan y conectan como puertorriqueños.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-5">

              <a
                href="#publicaciones"
                className="inline-flex items-center gap-3 rounded-full bg-[#bf0a30] px-7 py-4 text-sm font-black text-white transition hover:-translate-y-1 hover:bg-[#a00828]"
              >
                Explorar editoriales
                <span>↓</span>
              </a>

              <span className="text-xs font-bold uppercase tracking-[0.15em] text-white/40">
                Voces · Ideas · Perspectivas
              </span>

            </div>

          </div>

          {/* Indicador inferior */}
          <div className="mt-20 flex items-center justify-between border-t border-white/10 pt-6">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
              Hola Puerto Rico
            </span>

            <div className="flex gap-1">
              <span className="h-1.5 w-8 rounded-full bg-[#bf0a30]" />
              <span className="h-1.5 w-4 rounded-full bg-[#002868]" />
              <span className="h-1.5 w-4 rounded-full bg-white/30" />
            </div>

            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
              Puerto Rico
            </span>
          </div>

        </div>

        <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[#bf0a30] via-white/40 to-[#002868]" />
      </section>


      {/* CONTENIDO EDITORIAL */}
      <div
        id="publicaciones"
        className="mx-auto max-w-[1450px] scroll-mt-10 px-5 py-16 sm:px-8 lg:px-12 lg:py-24"
      >

        {error ? (

          /* ERROR */
          <section className="rounded-[2rem] border border-gray-200 bg-white px-6 py-20 text-center shadow-sm">
            <h2 className="text-2xl font-black">
              No pudimos cargar los editoriales.
            </h2>

            <p className="mt-3 text-sm text-gray-500">
              Inténtalo nuevamente más tarde.
            </p>

            <Link
              href="/"
              className="mt-8 inline-flex rounded-full bg-[#071428] px-7 py-3.5 text-sm font-black text-white transition hover:bg-[#bf0a30]"
            >
              Volver al inicio
            </Link>
          </section>

        ) : editorials.length === 0 ? (

          /* SIN PUBLICACIONES */
          <section className="relative overflow-hidden rounded-[2rem] border border-gray-200 bg-white px-6 py-24 text-center shadow-sm">

            <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-red-50" />
            <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-blue-50" />

            <div className="relative">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-3xl text-[#bf0a30]">
                ✦
              </div>

              <p className="mt-7 text-xs font-black uppercase tracking-[0.25em] text-[#bf0a30]">
                Hola Puerto Rico
              </p>

              <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-5xl">
                Próximamente.
              </h2>

              <p className="mx-auto mt-5 max-w-lg text-sm leading-8 text-gray-500 sm:text-base">
                Estamos preparando nuevas publicaciones, opiniones
                e historias. Muy pronto encontrarás aquí nuevas
                perspectivas sobre Puerto Rico.
              </p>

              <Link
                href="/"
                className="mt-9 inline-flex items-center gap-3 rounded-full bg-[#071428] px-8 py-4 text-sm font-black text-white transition hover:bg-[#bf0a30]"
              >
                Volver al inicio
                <span>→</span>
              </Link>

            </div>
          </section>

        ) : (

          <>

            {/* EDITORIAL DESTACADO */}
            {featuredEditorial && (
              <section>

                <div className="mb-9 flex flex-wrap items-end justify-between gap-4">

                  <div>
                    <div className="flex items-center gap-3">
                      <span className="h-[2px] w-8 bg-[#bf0a30]" />

                      <p className="text-[10px] font-black uppercase tracking-[0.23em] text-[#bf0a30]">
                        Seleccionado para ti
                      </p>
                    </div>

                    <h2 className="mt-3 text-3xl font-black tracking-[-0.045em] sm:text-4xl">
                      En portada<span className="text-[#bf0a30]">.</span>
                    </h2>
                  </div>

                  <span className="rounded-full border border-gray-200 bg-white px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
                    Editorial destacado
                  </span>

                </div>

                <Link
                  href={`/editorial/${featuredEditorial.slug}`}
                  className="group grid overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-[0_15px_55px_rgba(7,20,40,0.07)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_25px_70px_rgba(7,20,40,0.13)] lg:min-h-[540px] lg:grid-cols-[1.15fr_0.85fr]"
                >

                  {/* Imagen */}
                  <div className="relative min-h-[300px] overflow-hidden sm:min-h-[420px] lg:min-h-full">

                    <EditorialImage
                      src={featuredEditorial.image_url}
                      alt={featuredEditorial.title}
                      featured
                    />

                    <div className="absolute bottom-6 left-6">
                      <span className="rounded-full border border-white/30 bg-[#071428]/60 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-md">
                        Historia destacada
                      </span>
                    </div>

                  </div>

                  {/* Información */}
                  <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">

                    <div className="flex items-center gap-3">

                      <span className="rounded-full bg-[#bf0a30]/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[#bf0a30]">
                        Opinión
                      </span>

                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        Destacado
                      </span>

                    </div>

                    <h3 className="mt-7 text-3xl font-black leading-[1.12] tracking-[-0.055em] sm:text-4xl lg:text-[2.8rem]">
                      {featuredEditorial.title}
                    </h3>

                    {featuredEditorial.excerpt && (
                      <p className="mt-6 line-clamp-4 text-sm leading-8 text-gray-500 sm:text-base">
                        {featuredEditorial.excerpt}
                      </p>
                    )}

                    <div className="mt-9 flex flex-wrap items-center gap-3 border-t border-gray-100 pt-6 text-xs font-bold text-gray-400">

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


            {/* MÁS PUBLICACIONES */}
            {otherEditorials.length > 0 && (
              <section className="mt-24">

                <div className="mb-10 flex flex-wrap items-end justify-between gap-5">

                  <div>
                    <div className="flex items-center gap-3">
                      <span className="h-[2px] w-8 bg-[#bf0a30]" />

                      <p className="text-[10px] font-black uppercase tracking-[0.23em] text-[#bf0a30]">
                        Más perspectivas
                      </p>
                    </div>

                    <h2 className="mt-3 text-3xl font-black tracking-[-0.045em] sm:text-4xl">
                      Últimos editoriales
                      <span className="text-[#bf0a30]">.</span>
                    </h2>

                    <p className="mt-3 text-sm leading-7 text-gray-500">
                      Descubre más ideas, opiniones e historias.
                    </p>
                  </div>

                  <span className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-500">
                    {otherEditorials.length}{" "}
                    {otherEditorials.length === 1
                      ? "publicación"
                      : "publicaciones"}
                  </span>

                </div>

                <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">

                  {otherEditorials.map((editorial) => (

                    <Link
                      key={editorial.id}
                      href={`/editorial/${editorial.slug}`}
                      className="group overflow-hidden rounded-[1.5rem] border border-gray-200 bg-white transition duration-500 hover:-translate-y-1 hover:border-gray-300 hover:shadow-[0_20px_50px_rgba(7,20,40,0.10)]"
                    >

                      {/* Imagen */}
                      <div className="relative aspect-[16/10] overflow-hidden">

                        <EditorialImage
                          src={editorial.image_url}
                          alt={editorial.title}
                        />

                        <div className="absolute bottom-4 left-4">
                          <span className="rounded-full bg-white/95 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-[#bf0a30]">
                            Editorial
                          </span>
                        </div>

                      </div>

                      {/* Texto */}
                      <div className="p-6 sm:p-7">

                        {editorial.published_at && (
                          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                            {formatDate(editorial.published_at)}
                          </p>
                        )}

                        <h3 className="mt-4 text-xl font-black leading-snug tracking-tight transition group-hover:text-[#bf0a30]">
                          {editorial.title}
                        </h3>

                        {editorial.excerpt && (
                          <p className="mt-3 line-clamp-3 text-sm leading-7 text-gray-500">
                            {editorial.excerpt}
                          </p>
                        )}

                        <div className="mt-7 flex items-center justify-between border-t border-gray-100 pt-5">

                          <span className="text-xs font-bold text-gray-400">
                            Por {editorial.author}
                          </span>

                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-50 text-lg text-[#071428] transition group-hover:bg-[#bf0a30] group-hover:text-white">
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


      {/* PIE DE PÁGINA */}
      <section className="relative overflow-hidden border-t border-gray-200 bg-white">

        <div className="mx-auto flex max-w-[1450px] flex-col items-center justify-between gap-6 px-5 py-12 text-center sm:px-8 md:flex-row md:text-left lg:px-12">

          <div>
            <div className="flex items-center justify-center gap-2 md:justify-start">
              <span className="h-2 w-6 bg-[#bf0a30]" />
              <span className="h-2 w-4 bg-[#002868]" />
            </div>

            <p className="mt-4 text-sm font-black">
              Hola Puerto Rico
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Ideas, historias y perspectivas de nuestra isla.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-3 text-xs font-black uppercase tracking-widest text-[#071428] transition hover:text-[#bf0a30]"
          >
            Visitar página principal
            <span>→</span>
          </Link>

        </div>

      </section>

    </main>
  );
}
