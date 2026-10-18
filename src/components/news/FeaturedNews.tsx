import type { CSSProperties } from "react";

export default function FeaturedNews() {
  const iframeStyle: CSSProperties = {
    display: "block",
    width: "100%",
    height: "1050px",
    border: "none",
  };

  const topics = [
    {
      number: "01",
      title: "Noticias de Puerto Rico",
      description: "Lo que ocurre en nuestra isla y en nuestras comunidades.",
    },
    {
      number: "02",
      title: "Entretenimiento y cultura",
      description: "Artistas, música, espectáculos y lo que está dando de qué hablar.",
    },
    {
      number: "03",
      title: "Deportes",
      description: "Los eventos, resultados y protagonistas del deporte.",
    },
    {
      number: "04",
      title: "Comunidad y mucho más",
      description: "Historias positivas, turismo, gastronomía y contenido para todos.",
    },
  ];

  return (
    <section
      id="destacadas"
      className="scroll-mt-6 overflow-hidden bg-[#f5f7fb] py-16 sm:py-20"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-10">
        <div className="mb-10">
          <div className="flex items-center gap-2">
            <span className="h-2 w-8 bg-[#bf0a30]" />
            <span className="h-2 w-5 bg-[#002868]" />
          </div>

          <p className="mt-4 text-xs font-black uppercase tracking-[0.22em] text-[#bf0a30]">
            Siempre contigo
          </p>

          <h2 className="mt-2 text-3xl font-black tracking-[-0.045em] text-[#071428] sm:text-5xl">
            Puerto Rico tiene mucho que contar.
          </h2>

          <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600">
            En Hola Puerto Rico compartimos las noticias, historias y
            momentos que mantienen a nuestra isla conectada. Más contenido,
            más Puerto Rico, siempre contigo.
          </p>
        </div>

        <div className="grid items-start gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
          {/* Información a la izquierda */}
          <div className="lg:sticky lg:top-8">
            <div className="rounded-3xl bg-[#071428] p-7 text-white sm:p-9">
              <div className="inline-flex rounded-full border border-white/20 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white/80">
                Hola Puerto Rico
              </div>

              <h3 className="mt-6 text-3xl font-black leading-tight tracking-[-0.04em] sm:text-4xl">
                Aquí siempre es buena noticia.
              </h3>

              <p className="mt-4 text-sm leading-7 text-white/70">
                Un espacio para mantenerte informado, descubrir lo nuestro
                y disfrutar de todo lo que hace especial a Puerto Rico.
              </p>

              <div className="mt-8 space-y-5">
                {topics.map((topic) => (
                  <div
                    key={topic.number}
                    className="flex gap-4 border-t border-white/15 pt-5"
                  >
                    <span className="pt-1 text-sm font-black text-[#ff647f]">
                      {topic.number}
                    </span>

                    <div>
                      <h4 className="font-bold text-white">
                        {topic.title}
                      </h4>

                      <p className="mt-1 text-sm leading-6 text-white/60">
                        {topic.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-2xl bg-white/10 p-5">
                <p className="text-sm font-black">
                  Más contenido • Más Puerto Rico • Siempre contigo
                </p>
              </div>
            </div>
          </div>

          {/* Widget de Facebook a la derecha */}
          <div className="min-w-0">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#bf0a30]">
                  Síguenos en Facebook
                </p>

                <h3 className="mt-2 text-2xl font-black tracking-tight text-[#071428]">
                  Lo último de nuestra comunidad
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Publicaciones, noticias y momentos de Puerto Rico.
                </p>
              </div>

              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-bold text-[#002868] transition hover:text-[#bf0a30]"
              >
                Visitar Facebook ↗
              </a>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-2 shadow-[0_18px_55px_rgba(7,20,40,0.08)] sm:p-3">
              <iframe
                src="https://widgets.sociablekit.com/facebook-page-posts/iframe/25722931"
                title="Publicaciones de Facebook de Hola Puerto Rico"
                style={iframeStyle}
                loading="lazy"
                allow="encrypted-media"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
