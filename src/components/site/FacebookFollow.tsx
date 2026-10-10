export default function FacebookFollow() {
  return (
    <section className="relative overflow-hidden bg-[#071428] py-20 text-white">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#bf0a30] via-white to-[#1877F2]"
      />
      <div
        aria-hidden="true"
        className="absolute -right-24 top-10 h-80 w-80 rounded-full bg-[#1877F2]/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-[#bf0a30]/20 blur-3xl"
      />

      <div className="relative mx-auto max-w-[880px] px-5 text-center sm:px-8">
        <p className="text-[11px] font-black uppercase tracking-[0.28em] text-white/50">
          Más noticias
        </p>
        <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
          ¿Quieres ver más?
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-white/70">
          Publicamos más historias, videos y actualizaciones todos los
          días en Facebook. Entra a la página de Hola Puerto Rico+ y
          no te pierdas lo que está pasando en la isla.
        </p>

        <a
          href="https://www.facebook.com/holapr1/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-9 inline-flex items-center gap-3 rounded-full bg-[#1877F2] px-8 py-4 text-sm font-black shadow-lg shadow-[#1877F2]/30 transition hover:-translate-y-0.5 hover:bg-[#166fe5]"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M13.5 22v-8.2h2.8l.4-3.2h-3.2V8.6c0-.9.3-1.5 1.6-1.5H17V4.2C16.7 4.1 15.6 4 14.4 4c-2.4 0-4 1.5-4 4.2v2.4H7.5v3.2H10.4V22h3.1Z" />
          </svg>
          Seguir en Facebook
        </a>

        <p className="mt-5 text-xs font-semibold tracking-wide text-white/40">
          facebook.com/holapr1
        </p>
      </div>
    </section>
  );
}
