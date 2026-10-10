import Image from "next/image";
import Link from "next/link";

export default function BrandHero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#071428] text-white">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(115deg,#071428_0%,#0b1f4a_42%,#bf0a30_100%)]"
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

      <div className="relative mx-auto flex min-h-[calc(100svh-168px)] max-w-[1280px] flex-col justify-center px-5 py-16 sm:px-8 lg:py-20">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.28em] text-white/70">
            <span className="h-px w-10 bg-white/50" />
            Medio digital de Puerto Rico
          </p>

          <h1 className="mt-6 text-5xl font-black leading-[0.92] tracking-[-0.05em] sm:text-6xl lg:text-8xl">
            Hola
            <span className="block text-white">Puerto Rico+</span>
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
              Síguenos
            </a>
          </div>
        </div>

        <div className="mt-16 flex items-end justify-between gap-6">
          <div className="hidden items-center gap-3 sm:flex">
            <Image
              src="/logo.png"
              alt="Hola Puerto Rico+"
              width={180}
              height={60}
              priority
              className="h-auto w-[140px] brightness-0 invert"
            />
            <p className="max-w-[220px] text-xs leading-5 text-white/55">
              Aquí siempre es buena noticia
            </p>
          </div>

          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/50">
            Desliza para las destacadas
          </p>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r from-[#bf0a30] via-white to-[#002868]" />
    </section>
  );
}
