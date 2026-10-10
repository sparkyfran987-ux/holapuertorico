import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function SponsorStrip() {
  const supabase = await createClient();

  const { data: sponsors, error } = await supabase
    .from("sponsors")
    .select("id, name, image_url, target_url")
    .eq("is_active", true)
    .eq("position", "Inicio - Cintillo de sponsors")
    .order("created_at", { ascending: true })
    .limit(6);

  if (error) {
    console.error("Error cargando auspiciadores:", error.message);
    return null;
  }

  if (!sponsors || sponsors.length === 0) {
    return null;
  }

  return (
    <section className="border-y border-gray-200 bg-[#f6f8fc] py-14">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#bf0a30]">
              Auspiciadores
            </p>

            <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-[#071428]">
              Quienes hacen esto posible
            </h2>
          </div>

          <div className="hidden h-px flex-1 bg-gray-200 sm:block" />
        </div>

        <div className="grid grid-cols-2 items-start gap-5 sm:grid-cols-3 lg:gap-6">
          {sponsors.map((sponsor) => {
            const content = (
              <div className="group mx-auto flex aspect-square w-full max-w-[320px] items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#002868]/30 hover:shadow-lg sm:p-5">
                <img
                  src={sponsor.image_url}
                  alt={sponsor.name}
                  loading="lazy"
                  className="h-full w-full object-contain transition duration-200 group-hover:scale-[1.04]"
                />
              </div>
            );

            if (sponsor.target_url) {
              return (
                <Link
                  key={sponsor.id}
                  href={sponsor.target_url}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  aria-label={`Visitar ${sponsor.name}`}
                  className="block w-full"
                >
                  {content}
                </Link>
              );
            }

            return (
              <div key={sponsor.id} className="w-full">
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}