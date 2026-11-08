export default function FeaturedNews() {
  const editions = [
    {
      number: "01",
      title: "La Vueltita de Hoy",
      category: "Actualidad",
      description:
        "Un recorrido por lo que está pasando en Puerto Rico. Historias, lugares y acontecimientos que merecen ser compartidos.",
      color: "bg-[#bf0a30]",
      light: "bg-red-50",
      text: "text-[#bf0a30]",
    },
    {
      number: "02",
      title: "Detrás del Sabor",
      category: "Gastronomía",
      description:
        "Descubre los sabores de nuestra isla, conoce sus protagonistas y explora los lugares que mantienen viva nuestra gastronomía.",
      color: "bg-[#e99a20]",
      light: "bg-amber-50",
      text: "text-amber-700",
    },
    {
      number: "03",
      title: "En Ruta",
      category: "Exploración",
      description:
        "Nuevos destinos, rincones especiales y experiencias que nos invitan a descubrir Puerto Rico de una manera diferente.",
      color: "bg-[#002868]",
      light: "bg-blue-50",
      text: "text-[#002868]",
    },
  ];

  const topics = [
    {
      title: "Noticias",
      description: "Lo que sucede en Puerto Rico y sus comunidades.",
    },
    {
      title: "Entretenimiento",
      description: "Artistas, música, espectáculos y cultura popular.",
    },
    {
      title: "Deportes",
      description: "Eventos, resultados y protagonistas del deporte.",
    },
    {
      title: "Comunidad",
      description: "Historias, iniciativas y contenido de nuestra gente.",
    },
  ];

  return (
    <section
      id="destacadas"
      className="relative overflow-hidden bg-[#f5f7fb] py-20 sm:py-28"
    >
      {/* Fondos decorativos */}
      <div className="pointer-events-none absolute -right-40 top-0 h-96 w-96 rounded-full bg-red-100/60 blur-3xl" />
      <div className="pointer-events-none absolute -left-40 bottom-40 h-96 w-96 rounded-full bg-blue-100/60 blur-3xl" />

      <div className="relative mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-10">

        {/* ENCABEZADO */}
        <div className="mb-12 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-200 bg-white px-4 py-2 shadow-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-600" />
            <span className="text-xs font-black uppercase tracking-[0.18em] text-[#bf0a30]">
              Bienvenido a Hola Puerto Rico TV
            </span>
          </div>

          <h2 className="mx-auto max-w-5xl text-4xl font-black leading-[1.08] tracking-[-0.05em] text-[#071428] sm:text-6xl lg:text-7xl">
            Puerto Rico tiene
            <span className="text-[#bf0a30]"> mucho que contar.</span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
            Noticias, entretenimiento, cultura popular y producciones
            originales. Conoce todo lo que tenemos preparado para ti.
          </p>
        </div>

        {/* YOUTUBE PRINCIPAL */}
        <div className="relative mx-auto max-w-6xl">
          <div className="absolute -inset-1 rounded-[30px] bg-gradient-to-r from-[#bf0a30] via-white to-[#002868] opacity-70 blur-sm" />

          <div className="relative overflow-hidden rounded-[26px] border border-gray-200 bg-white p-2 shadow-[0_25px_80px_rgba(7,20,40,0.16)] sm:p-4">

            <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-3 sm:px-4 sm:pb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600 text-white">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" />
                  </svg>
                </div>

                <div>
                  <p className="font-black text-[#071428]">
                    Hola Puerto Rico TV
                  </p>
                  <p className="text-xs text-gray-500">
                    Nuestro canal oficial de YouTube
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-red-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-red-600">
                Canal oficial
              </span>
            </div>

            <div className="relative aspect-video overflow-hidden rounded-[18px] bg-black">
              <iframe
                src="https://www.youtube.com/embed?listType=playlist&list=UU1eYBIuG7c9ruG4TDgEHw4w"
                title="Hola Puerto Rico TV"
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>

            <div className="flex flex-col justify-between gap-5 px-3 py-5 sm:flex-row sm:items-center sm:px-5 sm:py-6">
              <div>
                <h3 className="text-xl font-black tracking-tight text-[#071428] sm:text-2xl">
                  Tu próximo contenido favorito está aquí.
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Disfruta nuestras producciones y suscríbete al canal.
                </p>
              </div>

              <a
                href="https://www.youtube.com/@holaprtv?sub_confirmation=1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 rounded-full bg-[#bf0a30] px-7 py-4 text-sm font-black text-white shadow-lg shadow-red-600/20 transition duration-300 hover:-translate-y-1 hover:bg-[#a00828]"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" />
                </svg>
                SUSCRÍBETE AL CANAL
                <span>↗</span>
              </a>
            </div>
          </div>
        </div>

        {/* EDICIONES ORIGINALES */}
        <div className="mt-24">
          <div className="mb-10">
            <div className="flex items-center gap-2">
              <span className="h-2 w-8 bg-[#bf0a30]" />
              <span className="h-2 w-5 bg-[#002868]" />
            </div>

            <p className="mt-5 text-xs font-black uppercase tracking-[0.2em] text-[#bf0a30]">
              Producciones originales
            </p>

            <div className="mt-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <h3 className="text-3xl font-black tracking-[-0.04em] text-[#071428] sm:text-4xl">
                  Nuestras ediciones.
                </h3>
                <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600">
                  Diferentes maneras de descubrir, disfrutar y conectar
                  con todo lo que hace especial a Puerto Rico.
                </p>
              </div>

              <span className="text-sm font-bold text-gray-400">
                HOLA PUERTO RICO TV
              </span>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {editions.map((edition) => (
              <article
                key={edition.number}
                className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl sm:p-8"
              >
                <div className={`absolute left-0 top-0 h-1.5 w-full ${edition.color}`} />

                <div className="flex items-center justify-between">
                  <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${edition.light} ${edition.text} text-sm font-black`}>
                    {edition.number}
                  </span>

                  <span className={`rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-wider ${edition.light} ${edition.text}`}>
                    {edition.category}
                  </span>
                </div>

                <h4 className="mt-8 text-2xl font-black leading-tight tracking-tight text-[#071428]">
                  {edition.title}
                </h4>

                <p className="mt-4 text-sm leading-7 text-gray-500">
                  {edition.description}
                </p>

                <div className="mt-8 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#071428] transition group-hover:gap-4">
                  Una edición de Hola Puerto Rico
                  <span className={edition.text}>↗</span>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* CONTENIDO DE LA PLATAFORMA */}
        <div className="mt-24 grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">

          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#bf0a30]">
              Nuestra esencia
            </p>

            <h3 className="mt-3 text-3xl font-black leading-tight tracking-[-0.04em] text-[#071428] sm:text-4xl">
              Todo lo que nos conecta con Puerto Rico.
            </h3>

            <p className="mt-4 text-base leading-7 text-gray-600">
              Somos una plataforma de comunicación y entretenimiento
              dedicada a compartir lo que sucede, lo que nos apasiona
              y lo que nos representa como puertorriqueños.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {topics.map((topic, index) => (
              <div
                key={topic.title}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <span className="text-sm font-black text-[#bf0a30]">
                  0{index + 1}
                </span>

                <h4 className="mt-3 text-lg font-black text-[#071428]">
                  {topic.title}
                </h4>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {topic.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CIERRE */}
        <div className="relative mt-20 overflow-hidden rounded-3xl bg-[#071428] px-6 py-12 text-center text-white sm:px-10">
          <div className="absolute -right-10 -top-20 h-52 w-52 rounded-full bg-red-600/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-10 h-52 w-52 rounded-full bg-blue-600/20 blur-3xl" />

          <div className="relative">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-red-400">
              Hola Puerto Rico
            </p>

            <h3 className="mt-4 text-2xl font-black sm:text-4xl">
              Nuestra isla. Nuestras historias. Nuestro contenido.
            </h3>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/65">
              Seguimos creando contenido para celebrar, descubrir
              y compartir todo lo que hace único a Puerto Rico.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
