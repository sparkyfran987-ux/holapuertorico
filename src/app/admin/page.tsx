
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const modules = [
  {
    title: "Franja de auspiciadores",
    description:
      "Administra los logos, enlaces y el orden del carrusel publicitario.",
    href: "/admin/auspiciadores-franja",
    icon: "▤",
    label: "Administrar logos",
  },
  {
    title: "Noticias",
    description:
      "Prepara, edita y publica el contenido de Hola Puerto Rico+.",
    href: "/admin/noticias",
    icon: "▧",
    label: "Gestionar noticias",
  },
  {
    title: "Configuración",
    description:
      "Accede a las opciones generales del sitio cuando estén disponibles.",
    href: "/admin/configuracion",
    icon: "⚙",
    label: "Ver configuración",
  },
];

export default async function AdminPage() {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  const { count: sponsorCount } = await supabase
    .from("sponsor_carousel")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true);

  const { count: publishedCount } = await supabase
    .from("news")
    .select("*", { count: "exact", head: true })
    .eq("status", "published");

  const firstName = user?.user_metadata?.full_name
    ? String(user.user_metadata.full_name).split(" ")[0]
    : user?.email?.split("@")[0] ?? "Administrador";

  return (
    <main className="min-h-screen bg-[#f4f6fa] text-[#071428]">
      <div className="flex min-h-screen">
        <aside className="hidden w-[260px] shrink-0 flex-col bg-[#071428] px-5 py-7 text-white md:flex">
          <Link href="/admin" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-lg font-black text-[#071428]">
              H+
            </span>
            <span>
              <span className="block text-sm font-black">
                Hola Puerto Rico+
              </span>
              <span className="mt-1 block text-xs text-white/50">
                Panel administrativo
              </span>
            </span>
          </Link>

          <p className="mb-3 mt-12 px-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
            General
          </p>

          <Link
            href="/admin"
            className="rounded-xl bg-white/10 px-4 py-3 text-sm font-bold text-white"
          >
            <span className="mr-3">▦</span>
            Dashboard
          </Link>

          <p className="mb-3 mt-8 px-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
            Administración
          </p>

          {modules.map((module) => (
            <Link
              key={module.href}
              href={module.href}
              className="mt-1 rounded-xl px-4 py-3 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <span className="mr-3">{module.icon}</span>
              {module.title}
            </Link>
          ))}

          <div className="mt-auto rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-xs font-bold">Hola Puerto Rico+</p>
            <p className="mt-1 text-xs leading-5 text-white/50">
              Más contenido • Más Puerto Rico • Siempre contigo.
            </p>
            <Link
              href="/"
              className="mt-4 inline-block text-xs font-bold text-white/70 hover:text-white"
            >
              ← Ver sitio público
            </Link>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 bg-white px-5 py-5 sm:px-8 lg:px-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#bf0a30]">
                Centro de control
              </p>
              <h1 className="mt-1 text-xl font-black sm:text-2xl">
                Dashboard
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#071428] text-sm font-black text-white">
                {firstName.charAt(0).toUpperCase()}
              </div>
              <div className="max-w-[190px]">
                <p className="truncate text-sm font-bold">{firstName}</p>
                <p className="truncate text-xs text-gray-500">
                  {user?.email}
                </p>
              </div>
            </div>
          </header>

          <div className="px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
            <div className="mb-8">
              <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
                ¡Bienvenido, {firstName}!
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Desde aquí puedes administrar el contenido y los espacios
                publicitarios de tu plataforma.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-500">
                    Logos activos
                  </p>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-lg">
                    ▤
                  </span>
                </div>
                <p className="mt-5 text-3xl font-black">
                  {sponsorCount ?? 0}
                </p>
                <p className="mt-2 text-xs text-gray-400">
                  En la franja publicitaria
                </p>
              </article>

              <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-500">
                    Noticias publicadas
                  </p>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-lg">
                    ▧
                  </span>
                </div>
                <p className="mt-5 text-3xl font-black">
                  {publishedCount ?? 0}
                </p>
                <p className="mt-2 text-xs text-gray-400">
                  Publicaciones visibles en el sitio
                </p>
              </article>

              <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:col-span-2 xl:col-span-1">
                <p className="text-sm font-semibold text-gray-500">
                  Estado del panel
                </p>
                <div className="mt-5 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <p className="text-lg font-black">Sesión verificada</p>
                </div>
                <p className="mt-2 text-xs leading-5 text-gray-400">
                  Tu acceso ha sido validado por Supabase.
                </p>
              </article>
            </div>

            <div className="mb-5 mt-10 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-xl font-black">Accesos rápidos</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Selecciona la sección que deseas administrar.
                </p>
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              {modules.map((module) => (
                <Link
                  key={module.href}
                  href={module.href}
                  className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-gray-300 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f1f4f9] text-2xl">
                      {module.icon}
                    </span>
                    <span className="text-xl text-gray-400 transition group-hover:translate-x-1 group-hover:text-[#bf0a30]">
                      →
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-black">
                    {module.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    {module.description}
                  </p>
                  <p className="mt-5 text-sm font-bold text-[#002868]">
                    {module.label} →
                  </p>
                </Link>
              ))}
            </div>

            <p className="mt-10 text-center text-xs text-gray-400">
              © {new Date().getFullYear()} Hola Puerto Rico+ · Administración
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
