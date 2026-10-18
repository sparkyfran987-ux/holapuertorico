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

export default function Header() {
  return (
    <header className="bg-white">
      <div className="mx-auto flex min-h-[92px] max-w-[1500px] items-center justify-between gap-6 px-5 lg:px-8">
        {/* Logo */}
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

        {/* Identidad */}
        <div className="hidden flex-1 text-center md:block">
          <p className="text-[13px] font-semibold tracking-wide text-gray-700">
            Más contenido • Más Puerto Rico • Siempre contigo
          </p>

          <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.18em] text-gray-400">
            Aquí siempre es buena noticia
          </p>
        </div>

        {/* Navegación + Redes */}
        <div className="flex shrink-0 items-center gap-3 sm:gap-5">
          <Link
            href="/editorial"
            className="rounded-full bg-[#071428] px-4 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-white transition hover:bg-[#bf0a30] sm:px-5 sm:text-[11px]"
          >
            Editorial
          </Link>

          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden text-[10px] font-black uppercase tracking-[0.12em] text-gray-600 transition-colors hover:text-red-600 sm:block sm:text-[11px]"
            >
              {social.label}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
