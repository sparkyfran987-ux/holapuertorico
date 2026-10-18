
"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();

    try {
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (loginError || !data.user) {
        setError("Correo electrónico o contraseña incorrectos.");
        return;
      }

      const { data: admin, error: adminError } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", data.user.id)
        .maybeSingle();

      if (adminError || !admin) {
        await supabase.auth.signOut();
        setError("Esta cuenta no tiene permisos de administrador.");
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setError("No se pudo iniciar sesión. Inténtalo nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f3f5f9] px-5 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-2">
        <section className="relative hidden min-h-[580px] flex-col justify-between overflow-hidden bg-[#071428] p-12 text-white lg:flex">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#002868]/60 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-[#bf0a30]/30 blur-3xl" />

          <div className="relative">
            <Image
              src="/logo.png"
              alt="Hola Puerto Rico+"
              width={220}
              height={74}
              className="h-auto w-[200px] brightness-0 invert"
              priority
            />
          </div>

          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#ff647f]">
              Panel de administración
            </p>
            <h1 className="mt-5 text-5xl font-black leading-tight tracking-tight">
              Tu contenido.
              <br />
              Tu comunidad.
              <br />
              Tu Puerto Rico.
            </h1>
            <p className="mt-5 max-w-sm text-sm leading-7 text-white/60">
              Administra las publicaciones y los espacios publicitarios de
              Hola Puerto Rico+ desde un solo lugar.
            </p>
          </div>

          <p className="relative text-xs text-white/40">
            Más contenido • Más Puerto Rico • Siempre contigo
          </p>
        </section>

        <section className="flex min-h-[580px] items-center justify-center p-7 sm:p-12">
          <div className="w-full max-w-sm">
            <div className="mb-8 lg:hidden">
              <Image
                src="/logo.png"
                alt="Hola Puerto Rico+"
                width={180}
                height={60}
                className="h-auto w-[160px]"
                priority
              />
            </div>

            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#bf0a30]">
              Acceso privado
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#071428]">
              Bienvenido
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Inicia sesión para acceder al panel de administración.
            </p>

            <form onSubmit={handleLogin} className="mt-8 space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-bold text-[#071428]"
                >
                  Correo electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@tudominio.com"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-[#002868] focus:bg-white focus:ring-4 focus:ring-blue-900/5"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-bold text-[#071428]"
                >
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Tu contraseña"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-[#002868] focus:bg-white focus:ring-4 focus:ring-blue-900/5"
                />
              </div>

              {error && (
                <p
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#071428] px-5 py-4 text-sm font-bold text-white transition hover:bg-[#002868] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Verificando acceso..." : "Iniciar sesión"}
              </button>
            </form>

            <p className="mt-8 text-center text-xs leading-5 text-gray-400">
              Acceso exclusivo para administradores autorizados.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
