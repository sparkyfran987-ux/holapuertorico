const socialNetworks = [
  {
    name: "Facebook",
    description: "Noticias, publicaciones y lo que sucede en Puerto Rico.",
    url: "https://www.facebook.com/holapr1/",
    label: "Visitar Facebook",
    color: "#1877F2",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M13.5 22v-8.2h2.8l.4-3.2h-3.2V8.6c0-.9.3-1.5 1.6-1.5H17V4.2C16.7 4.1 15.6 4 14.4 4c-2.4 0-4 1.5-4 4.2v2.4H7.5v3.2h2.9V22h3.1Z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    description: "Contenido visual, momentos especiales y novedades.",
    url: "https://www.instagram.com/holapuertorico1/",
    label: "Visitar Instagram",
    color: "#E4405F",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    description: "Videos, reportajes y contenido para disfrutar.",
    url: "https://www.youtube.com/@holaprtv",
    label: "Visitar YouTube",
    color: "#FF0033",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" />
      </svg>
    ),
  },
];

export default function FacebookFollow() {
  return (
    <section className="relative overflow-hidden bg-[#071428] py-20 text-white sm:py-24">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#bf0a30] via-white to-[#1877F2]"
      />

      <div
        aria-hidden="true"
        className="absolute -right-24 top-10 h-80 w-80 rounded-full bg-[#1877F2]/20 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-[#bf0a30]/20 blur-3xl"
      />

      <div className="relative mx-auto max-w-[1200px] px-5 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-white/50">
            Conéctate con nosotros
          </p>

          <h2 className="mt-4 text-4xl font-black tracking-[-0.045em] sm:text-5xl lg:text-6xl">
            Hola Puerto Rico+ está en tus redes.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
            Queremos estar más cerca de ti. Síguenos en nuestras redes
            sociales para descubrir noticias, historias, videos,
            entretenimiento y todo lo que hace especial a Puerto Rico.
            ¡Conéctate con nosotros y no te pierdas nuestras novedades!
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {socialNetworks.map((network) => (
            <a
              key={network.name}
              href={network.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={network.label}
              className="group rounded-3xl border border-white/10 bg-white/[0.05] p-7 transition duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.09] sm:p-8"
            >
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg transition group-hover:scale-105"
                style={{
                  backgroundColor: network.color,
                  boxShadow: `0 10px 30px ${network.color}30`,
                }}
              >
                <span className="h-7 w-7">{network.icon}</span>
              </div>

              <h3 className="mt-6 text-2xl font-black tracking-tight">
                {network.name}
              </h3>

              <p className="mt-3 min-h-[48px] text-sm leading-6 text-white/60">
                {network.description}
              </p>

              <div className="mt-7 flex items-center justify-between border-t border-white/10 pt-5">
                <span className="text-sm font-black" style={{ color: network.color }}>
                  {network.label}
                </span>

                <span className="text-lg transition group-hover:translate-x-1">
                  →
                </span>
              </div>
            </a>
          ))}
        </div>

        <p className="mt-10 text-center text-xs font-semibold tracking-wide text-white/40">
          Más contenido • Más Puerto Rico • Siempre contigo
        </p>
      </div>
    </section>
  );
}
