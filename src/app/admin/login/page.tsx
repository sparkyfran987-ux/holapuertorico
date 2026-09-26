"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("El correo electrónico o la contraseña son incorrectos.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f4f7fb] px-5 py-10">
      {/* DECORACIÓN DE FONDO */}
      <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-red-500/10 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        {/* LOGO */}
        <div className="mb-8 flex justify-center">
          <div className="rounded-2xl bg-white px-7 py-4 shadow-sm ring-1 ring-black/5">
            <Image
              src="/logo.png"
              alt="Hola Puerto Rico+"
              width={240}
              height={90}
              style={{
                width: "240px",
                height: "auto",
              }}
              priority
            />
          </div>
        </div>

        {/* LOGIN CARD */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-xl shadow-black/5 ring-1 ring-black/5">
          {/* TOP BRAND BAR */}
          <div className="h-1.5 bg-gradient-to-r from-red-600 via-white to-blue-700" />

          <div className="p-7 sm:p-9">
            <div className="mb-8">
              <p className="mb-2 text-sm font-bold uppercase tracking-wider text-red-600">
                Área administrativa
              </p>

              <h1 className="text-3xl font-black tracking-tight text-gray-950">
                Bienvenido
              </h1>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Inicia sesión para administrar las noticias y el contenido
                de Hola Puerto Rico+.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {/* EMAIL */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-bold text-gray-800"
                >
                  Correo electrónico
                </label>

                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    @
                  </span>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    autoComplete="email"
                    placeholder="tu-correo@ejemplo.com"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-bold text-gray-800"
                  >
                    Contraseña
                  </label>
                </div>

                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    •
                  </span>

                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10"
                  />
                </div>
              </div>

              {/* ERROR */}
              {error && (
                <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
                  <span className="font-black">!</span>

                  <p>{error}</p>
                </div>
              )}

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-red-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700 hover:shadow-red-600/30 focus:outline-none focus:ring-4 focus:ring-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Iniciando sesión..." : "Iniciar sesión"}
              </button>
            </form>
          </div>

          {/* FOOTER */}
          <div className="border-t bg-gray-50 px-7 py-5 text-center sm:px-9">
            <p className="text-xs text-gray-500">
              Panel privado de administración
            </p>

            <p className="mt-1 text-xs font-semibold text-gray-700">
              Hola Puerto Rico+
            </p>
          </div>
        </div>

        {/* BRAND MESSAGE */}
        <p className="mt-6 text-center text-xs font-medium text-gray-400">
          Más contenido • Más Puerto Rico • Siempre contigo
        </p>
      </div>
    </main>
  );
}