import Image from "next/image";
import Link from "next/link";

const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/holapr1",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/holapuertorico1/",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@holaprtv",
  },
];

const navLinks = [
  {
    label: "Inicio",
    href: "/",
  },
  {
    label: "Editorial",
    href: "/editorial",
  },
];

export default function Header() {
  return (
    <header className="bg-white">
      {/* Encabezado principal */}
      <div className="mx-auto flex min-h-[92px] max-w-[1500px] items-center justify-between gap-6 px-5 lg:px-8">
        <Link
          href="/"
          className="shrink-0 transition-opacity hover:opacity-90"
          aria-label="Hola Puerto Rico+ - Inicio"
        >
          <Image
            src="/logo.png"
            alt="Hola Puerto Rico+"
            width={260}
            height={86}
            priority
            className="h-auto w-[175px] sm:w-[210px] lg:w-[235px]"
          />
        </Link>

        <div className="hidden flex-1 text-center md:block">
          <p className="text-[13px] font-semibold tracking-wide text-gray-700">
            Más contenido • Más Puerto Rico • Siempre contigo
          </p>

          <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.18em] text-gray-400">
            Aquí siempre es buena noticia
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-4 sm:gap-5">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-black uppercase tracking-[0.12em] text-gray-600 transition-colors hover:text-red-600 sm:text-[11px]"
            >
              {social.label}
            </a>
          ))}
        </div>
      </div>

      {/* Navegación */}
      <nav
        aria-label="Navegación principal"
        className="border-t border-gray-100 bg-[#071428]"
      >
        <div className="mx-auto flex max-w-[1500px] items-center justify-center gap-2 px-5">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-white/80 transition hover:bg-white/10 hover:text-white sm:px-7"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
