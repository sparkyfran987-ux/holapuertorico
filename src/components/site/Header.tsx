import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white">
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

        <Link
          href="/buscar"
          aria-label="Buscar"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition-all hover:border-[#c7192e] hover:bg-[#c7192e] hover:text-white"
        >
          <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </svg>
        </Link>
      </div>
    </header>
  );
}