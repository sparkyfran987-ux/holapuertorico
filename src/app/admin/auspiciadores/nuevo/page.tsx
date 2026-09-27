import { requireAdmin } from "@/lib/supabase/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function createSponsor(formData: FormData) {
  "use server";

  await requireAdmin();

  const supabase = await createClient();

  const name = String(formData.get("name") || "").trim();
  const format = String(formData.get("format") || "").trim();
  const position = String(formData.get("position") || "").trim();
  const targetUrl = String(formData.get("target_url") || "").trim();
  const isActive = formData.get("is_active") === "on";

  const imageFile = formData.get("image");

  if (!name || !format || !position) {
    throw new Error("Faltan campos requeridos.");
  }

  if (!(imageFile instanceof File) || imageFile.size === 0) {
    throw new Error("Debes seleccionar una imagen.");
  }

  if (!imageFile.type.startsWith("image/")) {
    throw new Error("El archivo seleccionado no es una imagen.");
  }

  if (imageFile.size > 10 * 1024 * 1024) {
    throw new Error("La imagen no puede superar los 10 MB.");
  }

  const extension =
    imageFile.name.split(".").pop()?.toLowerCase() || "jpg";

  const safeName = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const fileName = `${Date.now()}-${safeName || "auspiciador"}.${extension}`;

  const filePath = `sponsors/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("sponsor-images")
    .upload(filePath, imageFile, {
      cacheControl: "3600",
      upsert: false,
      contentType: imageFile.type,
    });

  if (uploadError) {
    console.error("Error subiendo imagen:", {
      message: uploadError.message,
      name: uploadError.name,
    });

    throw new Error(uploadError.message);
  }

  const {
    data: { publicUrl },
  } = supabase.storage
    .from("sponsor-images")
    .getPublicUrl(filePath);

  const { error: insertError } = await supabase
    .from("sponsors")
    .insert({
      name,
      image_url: publicUrl,
      format,
      position,
      target_url: targetUrl || null,
      is_active: isActive,
      updated_at: new Date().toISOString(),
    });

  if (insertError) {
    console.error("Error creando auspiciador:", {
      message: insertError.message,
      details: insertError.details,
      hint: insertError.hint,
      code: insertError.code,
    });

    throw new Error(insertError.message);
  }

  redirect("/admin/auspiciadores");
}

export default async function NewSponsorPage() {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-[#f5f6f8]">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-[1500px] px-6 py-6 lg:px-8">
          <Link
            href="/admin/auspiciadores"
            className="text-sm font-bold text-gray-500 transition-colors hover:text-gray-950"
          >
            ← Volver a auspiciadores
          </Link>

          <div className="mt-5">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600">
              Administración
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight text-gray-950 sm:text-4xl">
              Nuevo auspiciador
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Añade una nueva marca al sistema de publicidad de Hola Puerto
              Rico+.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1100px] px-6 py-8 lg:px-8">
        <form action={createSponsor}>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
            <section className="border border-gray-200 bg-white">
              <div className="border-b border-gray-200 px-6 py-5">
                <h2 className="text-lg font-black text-gray-950">
                  Información del auspiciador
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Configura la información que utilizará el anuncio.
                </p>
              </div>

              <div className="space-y-6 p-6">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-gray-700"
                  >
                    Nombre del auspiciador
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Ej. Walmart Puerto Rico"
                    className="h-12 w-full border border-gray-300 bg-white px-4 text-sm font-medium text-gray-950 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-950"
                  />
                </div>

                <div>
                  <label
                    htmlFor="image"
                    className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-gray-700"
                  >
                    Logo / imagen del anuncio
                  </label>

                  <input
                    id="image"
                    name="image"
                    type="file"
                    required
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    className="block w-full cursor-pointer border border-gray-300 bg-white text-sm text-gray-600 file:mr-4 file:border-0 file:bg-gray-950 file:px-5 file:py-3 file:text-xs file:font-black file:text-white hover:file:bg-red-600"
                  />

                  <p className="mt-2 text-xs leading-5 text-gray-400">
                    PNG, JPG, WEBP o GIF. Máximo 10 MB.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="target_url"
                    className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-gray-700"
                  >
                    Enlace del anuncio
                  </label>

                  <input
                    id="target_url"
                    name="target_url"
                    type="url"
                    placeholder="https://www.ejemplo.com"
                    className="h-12 w-full border border-gray-300 bg-white px-4 text-sm font-medium text-gray-950 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-950"
                  />

                  <p className="mt-2 text-xs leading-5 text-gray-400">
                    Opcional. Se abrirá cuando el visitante pulse el anuncio.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="format"
                    className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-gray-700"
                  >
                    Formato
                  </label>

                  <select
                    id="format"
                    name="format"
                    required
                    defaultValue=""
                    className="h-12 w-full border border-gray-300 bg-white px-4 text-sm font-bold text-gray-950 outline-none focus:border-gray-950"
                  >
                    <option value="" disabled>
                      Selecciona un formato
                    </option>

                    <option value="1456x180">
                      1456 × 180 — Banner horizontal
                    </option>

                    <option value="1024x1024">
                      1024 × 1024 — Cuadrado
                    </option>

                    <option value="320x1200">
                      320 × 1200 — Vertical
                    </option>

                    <option value="160x600">
                      160 × 600 — Vertical pequeño
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="position"
                    className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-gray-700"
                  >
                    Posición
                  </label>

                  <select
                    id="position"
                    name="position"
                    required
                    defaultValue=""
                    className="h-12 w-full border border-gray-300 bg-white px-4 text-sm font-bold text-gray-950 outline-none focus:border-gray-950"
                  >
                    <option value="" disabled>
                      Selecciona una posición
                    </option>

                    <option value="Inicio - Banner principal">
                      Inicio — Banner principal
                    </option>

                    <option value="Inicio - Banner inferior">
                      Inicio — Banner inferior
                    </option>

                    <option value="Inicio - Sidebar">
                      Inicio — Sidebar
                    </option>

                    <option value="Inicio - Cintillo de sponsors">
                      Inicio — Cintillo de sponsors
                    </option>

                    <option value="Noticias - Sidebar">
                      Noticias — Sidebar
                    </option>

                    <option value="Noticias - Banner">
                      Noticias — Banner
                    </option>

                    <option value="Artículo - Sidebar">
                      Artículo — Sidebar
                    </option>

                    <option value="Artículo - Banner inferior">
                      Artículo — Banner inferior
                    </option>
                  </select>

                  <p className="mt-2 text-xs leading-5 text-gray-400">
                    El cintillo permite mostrar hasta 6 auspiciadores en la
                    página principal, cada uno con su propio enlace.
                  </p>
                </div>
              </div>
            </section>

            <aside className="space-y-6">
              <section className="border border-gray-200 bg-white">
                <div className="border-b border-gray-200 px-5 py-4">
                  <h2 className="text-sm font-black text-gray-950">
                    Estado
                  </h2>
                </div>

                <div className="p-5">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      name="is_active"
                      defaultChecked
                      className="mt-1 h-4 w-4 accent-red-600"
                    />

                    <span>
                      <span className="block text-sm font-black text-gray-950">
                        Auspiciador activo
                      </span>

                      <span className="mt-1 block text-xs leading-5 text-gray-500">
                        El anuncio podrá utilizarse en el sitio cuando esté
                        activo.
                      </span>
                    </span>
                  </label>
                </div>
              </section>

              <section className="border border-gray-200 bg-white">
                <div className="border-b border-gray-200 px-5 py-4">
                  <h2 className="text-sm font-black text-gray-950">
                    Información
                  </h2>
                </div>

                <div className="space-y-4 p-5">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.14em] text-gray-400">
                      Almacenamiento
                    </p>

                    <p className="mt-1 text-sm font-bold text-gray-900">
                      Supabase Storage
                    </p>
                  </div>

                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.14em] text-gray-400">
                      Carpeta
                    </p>

                    <p className="mt-1 text-sm font-bold text-gray-900">
                      sponsors/
                    </p>
                  </div>
                </div>
              </section>

              <div className="flex flex-col gap-2">
                <button
                  type="submit"
                  className="h-12 bg-red-600 px-5 text-sm font-black text-white transition-colors hover:bg-gray-950"
                >
                  Crear auspiciador
                </button>

                <Link
                  href="/admin/auspiciadores"
                  className="flex h-12 items-center justify-center border border-gray-200 bg-white px-5 text-sm font-black text-gray-700 transition-colors hover:border-gray-950 hover:text-gray-950"
                >
                  Cancelar
                </Link>
              </div>
            </aside>
          </div>
        </form>
      </main>
    </div>
  );
}
