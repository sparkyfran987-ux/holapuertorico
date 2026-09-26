import Image from "next/image";
import Link from "next/link";

const sections = [
  { label: "Noticias", href: "/noticias" },
  { label: "Comunidad", href: "/comunidad" },
  { label: "Deportes", href: "/deportes" },
  { label: "Entretenimiento", href: "/entretenimiento" },
  { label: "Gastronomía", href: "/gastronomia" },
  { label: "Turismo", href: "/turismo" },
  { label: "Videos", href: "/videos" },
];

export default function Footer() {
  return (
    <footer className="mt-20 bg-[#111418] text-white">
      <div className="mx-auto max-w-[1500px] px-5 py-14 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-block">
              <Image
                src="/logo.png"
                alt="Hola Puerto Rico+"
                width={260}
                height={86}
                className="w-[210px] brightness-0 invert"
              />
            </Link>

            <p className="mt-5 max-w-md text-sm leading-7 text-gray-400">
              Más contenido, más Puerto Rico, siempre contigo.
              Noticias, comunidad, deportes, entretenimiento,
              gastronomía y turismo.
            </p>

            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
              Aquí siempre es buena noticia
            </p>
          </div>

          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.18em] text-white">
              Secciones
            </h3>

            <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-3">
              {sections.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-gray-400 transition hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.18em] text-white">
              Información
            </h3>

            <div className="mt-5 space-y-3">
              <Link
                href="/nosotros"
                className="block text-sm text-gray-400 transition hover:text-white"
              >
                Sobre nosotros
              </Link>

              <Link
                href="/contacto"
                className="block text-sm text-gray-400 transition hover:text-white"
              >
                Contacto
              </Link>

              <Link
                href="/buscar"
                className="block text-sm text-gray-400 transition hover:text-white"
              >
                Buscar
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Hola Puerto Rico+. Todos los
            derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}