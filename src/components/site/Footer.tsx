import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#071428] text-white">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#bf0a30] via-white to-[#002868]"
      />

      <div
        aria-hidden="true"
        className="absolute -right-24 top-10 h-72 w-72 rounded-full bg-[#002868]/30 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-[#bf0a30]/20 blur-3xl"
      />

      <div className="relative mx-auto max-w-[1400px] px-5 pb-8 pt-16 sm:px-8 sm:pt-20">
        <div className="grid gap-12 border-b border-white/10 pb-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <a href="/" aria-label="Hola Puerto Rico+, inicio" className="inline-block">
              <Image
                src="/logo.png"
                alt="Hola Puerto Rico+"
                width={260}
                height={86}
                className="w-[210px] brightness-0 invert sm:w-[240px]"
              />
            </a>

            <h2 className="mt-7 max-w-2xl text-3xl font-black leading-tight tracking-[-0.04em] sm:text-5xl">
              Más contenido.
              <span className="block text-[#ff536f]">Más Puerto Rico.</span>
              Siempre contigo.
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-white/60 sm:text-base">
              Un espacio dedicado a nuestra gente, nuestras historias y
              todo lo bueno que sucede en Puerto Rico. Gracias por ser parte
              de nuestra comunidad y acompañarnos cada día.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 sm:p-9">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-white/40">
              Sigamos conectados
            </p>

            <h3 className="mt-3 text-2xl font-black tracking-tight">
              Puerto Rico tiene mucho que contar.
            </h3>

            <p className="mt-3 text-sm leading-7 text-white/60">
              Visita nuestras redes sociales y mantente al día con nuestras
              publicaciones, historias y novedades.
            </p>

            <a
              href="https://www.facebook.com/holapr1/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-3 rounded-full bg-[#1877F2] px-6 py-3.5 text-sm font-black transition hover:-translate-y-0.5 hover:bg-[#166fe5]"
            >
              <svg
                viewBox="0 0 24 24"
                width="19"
                height="19"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M13.5 22v-8.2h2.8l.4-3.2h-3.2V8.6c0-.9.3-1.5 1.6-1.5H17V4.2C16.7 4.1 15.6 4 14.4 4c-2.4 0-4 1.5-4 4.2v2.4H7.5v3.2h2.9V22h3.1Z" />
              </svg>
              Síguenos en Facebook
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-6 text-white/40">
            © {new Date().getFullYear()} Hola Puerto Rico+. Todos los derechos reservados.
          </p>

          <a
            href="#inicio"
            className="text-xs font-bold text-white/50 transition hover:text-white"
          >
            Volver al inicio ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
