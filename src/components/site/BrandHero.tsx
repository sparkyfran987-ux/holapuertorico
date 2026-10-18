```tsx
import Image from "next/image";
import Link from "next/link";

export default function BrandHero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#071428] text-white">
      {/* Fondo */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(115deg,#071428_0%,#0b1f4a_55%,#bf0a30_100%)]"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-30 [background-image:repeating-linear-gradient(90deg,transparent,transparent_72px,rgba(255,255,255,0.06)_72px,rgba(255,255,255,0.06)_73px)]"
      />

      <div
        aria-hidden="true"
        className="absolute -left-24 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full border-[56px] border-white/10"
      />

      <div
        aria-hidden="true"
        className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-[#bf0a30]/40 blur-3xl"
      />

      <div className="relative mx-auto max-w-[1440px] px-5 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          {/* Bienvenida */}
          <div className="min-w-0">
            <p className="inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.28em] text-white/70">
              <span className="h-px w-10 bg-white/50" />
              Medio digital de Puerto Rico
            </p>

            <h1 className="mt-6 text-5xl font-black leading-[0.92] tracking-[-0.05em] sm:text-6xl lg:text-8xl">
              Hola
              <span className="block text-white">Puerto Rico</span>
              <span className="mt-2 block text-2xl font-bold tracking-tight text-white/70 sm:text-3xl lg:text-4xl" />
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-white/80 sm:text-lg">
              Noticias locales, cultura, entretenimiento y lo que mueve a
              la isla. Claro, cercano y siempre contigo.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="#destacadas"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-black text-[#071428] transition hover:bg-red-50"
              >
                Ver destacadas
                <span aria-hidden="true">↓</span>
              </Link>

              <a
                href="https://www.facebook.com/holapr1/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3.5 text-sm font-black text-white transition hover:border-white hover:bg-white/10"
              >
                Síguenos en Facebook ↗
              </a>
            </div>

            {/* Identidad de marca */}
            <div className="mt-12 hidden items-center gap-4 sm:flex">
              <Image
                src="/logo.png"
                alt="Hola Puerto Rico"
                width={180}
                height={60}
                priority
                className="h-auto w-[140px] brightness-0 invert"
              />

              <div className="h-10 w-px bg-white/20" />

              <p className="max-w-[220px] text-xs leading-5 text-white/55">
                Aquí siempre es buena noticia.
                <span className="mt-1 block">
                  Más contenido • Más Puerto Rico • Siempre contigo
                </span>
              </p>
            </div>
          </div>

          {/* Widget de Juicer */}
          <div className="min-w-0">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#ff647f]">
                  Nuestra comunidad
                </p>

                <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                  Síguenos en Facebook
                </h2>

                <p className="mt-2 text-sm leading-6 text-white/65">
                  Noticias, publicaciones y lo que pasa en Puerto Rico.
                </p>
              </div>

              <a
                href="https://www.facebook.com/holapr1/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-bold text-white transition hover:text-[#ff647f]"
              >
                Ver página ↗
              </a>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/15 bg-white p-2 shadow-[0_20px_65px_rgba(0,0,0,0.25)] sm:p-3">
              <iframe
                src="https://www.juicer.io/api/feeds/holapr1/iframe"
                title="Redes sociales de Hola Puerto Rico"
                className="block w-full border-0"
                style={{ height: "560px" }}
                loading="lazy"
              />
            </div>

            <p className="mt-4 text-center text-xs leading-5 text-white/45">
              Más contenido • Más Puerto Rico • Siempre contigo
            </p>
          </div>
        </div>
      </div>

      {/* Colores de Puerto Rico */}
      <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r from-[#bf0a30] via-white to-[#002868]" />
    </section>
  );
}
```
