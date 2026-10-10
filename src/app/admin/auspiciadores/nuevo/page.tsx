
import { requireAdmin } from "@/lib/supabase/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

async function createSponsor(formData: FormData) {
  "use server";

  await requireAdmin();

  const supabase = await createClient();

  const name = String(formData.get("name") ?? "").trim();
  const format = String(formData.get("format") ?? "");
  const position = String(formData.get("position") ?? "");
  const targetUrl = String(formData.get("target_url") ?? "").trim();
  const isActive = formData.get("is_active") === "on";
  const image = formData.get("image");

  const allowedFormats = [
    "1456x180",
    "1024x1024",
    "320x1200",
    "160x600",
    "1080x1920",
    "1000x1000",
  ];

  const allowedPositions = [
    "Inicio - Banner principal",
    "Inicio - Banner inferior",
    "Inicio - Sidebar",
    "Inicio - Cintillo de sponsors",
    "Noticias - Sidebar",
    "Noticias - Banner",
    "Artículo - Sidebar",
    "Artículo - Banner inferior",
  ];

  if (!name) {
    redirect(
      "/admin/auspiciadores/nuevo?error=" +
        encodeURIComponent("El nombre del auspiciador es obligatorio.")
    );
  }

  if (!allowedFormats.includes(format)) {
    redirect(
      "/admin/auspiciadores/nuevo?error=" +
        encodeURIComponent("Selecciona un formato válido.")
    );
  }

  if (!allowedPositions.includes(position)) {
    redirect(
      "/admin/auspiciadores/nuevo?error=" +
        encodeURIComponent("Selecciona una posición válida.")
    );
  }

  if (!(image instanceof File) || image.size === 0) {
    redirect(
      "/admin/auspiciadores/nuevo?error=" +
        encodeURIComponent("Debes seleccionar una imagen.")
    );
  }

  const allowedMimeTypes = [
    "image/png",
    "image/jpeg",
    "image/webp",
    "image/gif",
  ];

  if (!allowedMimeTypes.includes(image.type)) {
    redirect(
      "/admin/auspiciadores/nuevo?error=" +
        encodeURIComponent(
          "El formato de imagen debe ser PNG, JPG, WEBP o GIF."
        )
    );
  }

  const maxSize = 10 * 1024 * 1024;

  if (image.size > maxSize) {
    redirect(
      "/admin/auspiciadores/nuevo?error=" +
        encodeURIComponent("La imagen no puede superar los 10 MB.")
    );
  }

  if (targetUrl) {
    try {
      const parsedUrl = new URL(targetUrl);

      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        throw new Error("URL inválida");
      }
    } catch {
      redirect(
        "/admin/auspiciadores/nuevo?error=" +
          encodeURIComponent(
            "El enlace del auspiciador debe ser una URL válida que comience con https:// o http://."
          )
      );
    }
  }

  const extensionByMimeType: Record<string, string> = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/webp": "webp",
    "image/gif": "gif",
  };

  const extension = extensionByMimeType[image.type];

  const safeName =
    name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60) || "auspiciador";

  const filePath = `sponsors/${Date.now()}-${safeName}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from("sponsor-images")
    .upload(filePath, image, {
      contentType: image.type,
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    redirect(
      "/admin/auspiciadores/nuevo?error=" +
        encodeURIComponent(
          `No se pudo subir la imagen: ${uploadError.message}`
        )
    );
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("sponsor-images").getPublicUrl(filePath);

  const { error: insertError } = await supabase.from("sponsors").insert({
    name,
    image_url: publicUrl,
    format,
    position,
    target_url: targetUrl || null,
    is_active: isActive,
    updated_at: new Date().toISOString(),
  });

  if (insertError) {
    await supabase.storage.from("sponsor-images").remove([filePath]);

    redirect(
      "/admin/auspiciadores/nuevo?error=" +
        encodeURIComponent(
          `No se pudo guardar el auspiciador: ${insertError.message}`
        )
    );
  }

  redirect("/admin/auspiciadores?success=" + encodeURIComponent("Auspiciador creado correctamente."));
}

interface NewSponsorPageProps {
  searchParams: Promise<{
    error?: string;
  }>;
}

export default async function NewSponsorPage({
  searchParams,
}: NewSponsorPageProps) {
  await requireAdmin();

  const params = await searchParams;
  const error = params.error;

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <Link
          href="/admin/auspiciadores"
          className="text-sm font-semibold text-gray-500 transition hover:text-gray-950"
        >
          ← Volver a auspiciadores
        </Link>

        <h1 className="mt-4 text-3xl font-black tracking-tight text-gray-950">
          Añadir auspiciador
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Sube la imagen, selecciona el formato y decide dónde aparecerá el
          auspiciador en Hola Puerto Rico+.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          {error}
        </div>
      )}

      <form
        action={createSponsor}
        className="space-y-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8"
      >
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-bold text-gray-900"
          >
            Nombre del auspiciador
          </label>

          <input
            id="name"
            name="name"
            type="text"
            required
            maxLength={150}
            placeholder="Ej. Nombre de la empresa"
            className="h-12 w-full rounded-lg border border-gray-300 px-4 text-sm outline-none transition focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10"
          />
        </div>

        <div>
          <label
            htmlFor="image"
            className="mb-2 block text-sm font-bold text-gray-900"
          >
            Imagen del auspiciador
          </label>

          <input
            id="image"
            name="image"
            type="file"
            required
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="block w-full rounded-lg border border-gray-300 p-3 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-bold file:text-gray-800"
          />

          <p className="mt-2 text-xs leading-5 text-gray-500">
            Formatos permitidos: PNG, JPG, WEBP y GIF. Tamaño máximo: 10 MB.
            Para el formato cuadrado grande, utiliza una imagen de 1000 × 1000
            píxeles.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="format"
              className="mb-2 block text-sm font-bold text-gray-900"
            >
              Formato de la imagen
            </label>

            <select
              id="format"
              name="format"
              required
              defaultValue=""
              className="h-12 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none transition focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10"
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

              <option value="1000x1000">
                1000 × 1000 — Cuadrado grande
              </option>

              <option value="320x1200">
                320 × 1200 — Vertical
              </option>

              <option value="160x600">
                160 × 600 — Vertical pequeño
              </option>

              <option value="1080x1920">
                1080 × 1920 — Vertical para móvil
              </option>
            </select>
          </div>

          <div>
            <label
              htmlFor="position"
              className="mb-2 block text-sm font-bold text-gray-900"
            >
              Posición del auspiciador
            </label>

            <select
              id="position"
              name="position"
              required
              defaultValue=""
              className="h-12 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none transition focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10"
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
                Inicio — Barra lateral
              </option>

              <option value="Inicio - Cintillo de sponsors">
                Inicio — Cintillo de auspiciadores
              </option>

              <option value="Noticias - Sidebar">
                Noticias — Barra lateral
              </option>

              <option value="Noticias - Banner">
                Noticias — Banner
              </option>

              <option value="Artículo - Sidebar">
                Artículo — Barra lateral
              </option>

              <option value="Artículo - Banner inferior">
                Artículo — Banner inferior
              </option>
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="target_url"
            className="mb-2 block text-sm font-bold text-gray-900"
          >
            Enlace del auspiciador{" "}
            <span className="font-normal text-gray-400">(opcional)</span>
          </label>

          <input
            id="target_url"
            name="target_url"
            type="url"
            placeholder="https://ejemplo.com"
            className="h-12 w-full rounded-lg border border-gray-300 px-4 text-sm outline-none transition focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10"
          />

          <p className="mt-2 text-xs text-gray-500">
            Si añades un enlace, el visitante podrá hacer clic en la imagen
            para visitar la página del auspiciador.
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              name="is_active"
              defaultChecked
              className="mt-1 h-4 w-4 rounded border-gray-300 accent-gray-950"
            />

            <span>
              <span className="block text-sm font-bold text-gray-900">
                Activar auspiciador
              </span>

              <span className="mt-1 block text-xs leading-5 text-gray-500">
                Si está activo, podrá aparecer en la posición seleccionada
                según la configuración del sitio.
              </span>
            </span>
          </label>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
          <Link
            href="/admin/auspiciadores"
            className="inline-flex h-12 items-center justify-center rounded-lg border border-gray-300 px-5 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
          >
            Cancelar
          </Link>

          <button
            type="submit"
            className="inline-flex h-12 items-center justify-center rounded-lg bg-gray-950 px-6 text-sm font-bold text-white transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2"
          >
            Guardar auspiciador
          </button>
        </div>
      </form>
    </main>
  );
}
