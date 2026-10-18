import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#071428] text-white">
      <div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8">
        <div className="flex flex-col items-center justify-between gap-5 sm:flex-row">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
            <a href="/" aria-label="Hola Puerto Rico+, inicio">
              <Image
                src="/logo.png"
                alt="Hola Puerto Rico+"
                width={150}
                height={50}
                className="h-auto w-[125px] brightness-0 invert"
              />
            </a>

            <p className="text-center text-xs leading-5 text-white/50 sm:text-left">
              Más contenido • Más Puerto Rico • Siempre contigo.
              <span className="block">
                Aquí siempre es buena noticia.
              </span>
            </p>
          </div>

          <a
            href="#inicio"
            className="text-xs text-white/50 transition hover:text-white"
          >
            Volver al inicio ↑
          </a>
        </div>

        <div className="mt-6 border-t border-white/10 pt-5">
          <p className="text-center text-[11px] text-white/40 sm:text-left">
            © {new Date().getFullYear()} Hola Puerto Rico+. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
