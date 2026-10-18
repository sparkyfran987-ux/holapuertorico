import Link from "next/link";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-[#f5f6f8]">
      {/* Encabezado */}
      <header className="bg-[#071428] text-white">
        <div className="mx-auto max-w-[1200px] px-5 py-10 sm:px-8 sm:py-14">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#ff647f]">
            Hola Puerto Rico+
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            Administración
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">
            Selecciona el área que deseas administrar.
          </p>
        </div>
      </header>

      {/* Opciones */}
      <section className="mx-auto max-w-[1200px] px-5 py-10 sm:px-8 lg:py-16">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Editoriales */}
          <Link
            href="/admin/editoriales"
            className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#071428]/20 hover:shadow-xl sm:p-9"
          >
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#071428]/5 transition duration-500 group-hover:scale-150" />

            <div className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#071428] text-2xl">
                📰
              </div>

              <p className="mt-7 text-xs font-black uppercase tracking-[0.2em] text-[#bf0a30]">
                Contenido
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-tight text-[#071428]">
                Editoriales
              </h2>

              <p className="mt-4 max-w-md text-sm leading-7 text-gray-500">
                Crea, edita, publica y administra los editoriales de
                Hola Puerto Rico+.
              </p>

              <div className="mt-7 inline-flex items-center text-sm font-black text-[#071428] transition group-hover:text-[#bf0a30]">
                Entrar a Editoriales
                <span className="ml-2 transition-transform group-hover:translate-x-1">
                  →
                </span>
              </div>
            </div>
          </Link>

          {/* Auspiciadores */}
          <Link
            href="/admin/auspiciadores-franja"
            className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#071428]/20 hover:shadow-xl sm:p-9"
          >
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#bf0a30]/5 transition duration-500 group-hover:scale-150" />

            <div className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#bf0a30] text-2xl">
                📢
              </div>

              <p className="mt-7 text-xs font-black uppercase tracking-[0.2em] text-[#bf0a30]">
                Publicidad
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-tight text-[#071428]">
                Auspiciadores
              </h2>

              <p className="mt-4 max-w-md text-sm leading-7 text-gray-500">
                Administra los logos, enlaces, orden y visibilidad de
                los auspiciadores de la franja.
              </p>

              <div className="mt-7 inline-flex items-center text-sm font-black text-[#071428] transition group-hover:text-[#bf0a30]">
                Entrar a Auspiciadores
                <span className="ml-2 transition-transform group-hover:translate-x-1">
                  →
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}
