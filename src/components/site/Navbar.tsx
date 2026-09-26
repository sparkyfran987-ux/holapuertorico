"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

interface NavbarProps {
  active?: string;
}

const navigation = [
  {
    label: "Inicio",
    href: "/",
  },
  {
    label: "Noticias Locales",
    href: "/noticias?categoria=Noticias%20Locales",
  },
  {
    label: "Entretenimiento",
    href: "/noticias?categoria=Entretenimiento",
  },
  {
    label: "Cultura y Turismo",
    href: "/noticias?categoria=Cultura%20y%20Turismo",
  },
  {
    label: "Política y Gobierno",
    href: "/noticias?categoria=Pol%C3%ADtica%20y%20Gobierno",
  },
  {
    label: "Internacional",
    href: "/noticias?categoria=Internacional",
  },
  {
    label: "Deportes",
    href: "/noticias?categoria=Deportes",
  },
  {
    label: "Economía y Comercio",
    href: "/noticias?categoria=Econom%C3%ADa%20y%20Comercio",
  },
  {
    label: "Naturaleza y Medio Ambiente",
    href: "/noticias?categoria=Naturaleza%20y%20Medio%20Ambiente",
  },
];

export default function Navbar({ active }: NavbarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function isActive(label: string, href: string) {
    if (active) {
      return active === label;
    }

    if (label === "Inicio") {
      return pathname === "/";
    }

    if (label === "Noticias") {
      return pathname === "/noticias" && !searchParams.get("categoria");
    }

    if (href.startsWith("/noticias?categoria=")) {
      const category = decodeURIComponent(
        href.split("categoria=")[1] || ""
      );

      return (
        pathname === "/noticias" &&
        searchParams.get("categoria") === category
      );
    }

    return pathname === href;
  }

  return (
    <nav className="border-y border-gray-200 bg-white">
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide">
          {navigation.map((item) => {
            const selected = isActive(item.label, item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`relative shrink-0 px-4 py-4 text-[10px] font-black uppercase tracking-[0.12em] transition-colors sm:px-5 ${
                  selected
                    ? "text-red-600"
                    : "text-gray-600 hover:text-gray-950"
                }`}
              >
                {item.label}

                {selected && (
                  <span className="absolute inset-x-4 bottom-0 h-0.5 bg-red-600 sm:inset-x-5" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}