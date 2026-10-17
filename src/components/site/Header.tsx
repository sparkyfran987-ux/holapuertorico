```tsx
import Image from "next/image";
import Link from "next/link";

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

        {/* Texto central */}
        <div className="hidden flex-1 text-center md:block">
          <p className="text-[13px] font-semibold tracking-wide text-gray-700">
            Más contenido • Más Puerto Rico • Siempre contigo
          </p>

          <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.18em] text-gray-400">
            Aquí siempre es buena noticia
          </p>
        </div>

        {/* Redes sociales */}
        <div className="flex shrink-0 items-center gap-5">
          <a
            href="#"
            aria-label="Facebook"
            className="text-[11px] font-black uppercase tracking-[0.12em] text-gray-600 transition-colors hover:text-[#1877F2]"
          >
            Facebook
          </a>

          <a
            href="#"
            aria-label="Instagram"
            className="text-[11px] font-black uppercase tracking-[0.12em] text-gray-600 transition-colors hover:text-[#E4405F]"
          >
            Instagram
          </a>

          <a
            href="#"
            aria-label="YouTube"
            className="text-[11px] font-black uppercase tracking-[0.12em] text-gray-600 transition-colors hover:text-[#FF0000]"
          >
            YouTube
          </a>
        </div>
      </div>
    </header>
  );
}
```
