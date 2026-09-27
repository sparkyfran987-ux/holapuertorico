import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function SponsorStrip() {
  const supabase = await createClient();

  const { data: sponsors } = await supabase
    .from("sponsors")
    .select("id, name, image_url, target_url")
    .eq("is_active", true)
    .eq("position", "Inicio - Cintillo de sponsors")
    .order("created_at", { ascending: true })
    .limit(6);

  if (!sponsors || sponsors.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-white py-5">
      <div className="mx-auto max-w-[1456px] px-4 sm:px-6">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">
            Auspiciadores
          </p>

          <div className="h-px flex-1 bg-gray-200 ml-4" />
        </div>

        <div
          className={`grid gap-3 ${
            sponsors.length === 4
              ? "grid-cols-2 sm:grid-cols-4"
              : sponsors.length === 5
              ? "grid-cols-2 sm:grid-cols-5"
              : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
          }`}
        >
          {sponsors.map((sponsor) => {
            const content = (
              <div className="group flex h-[105px] items-center justify-center border border-gray-200 bg-white p-4 transition hover:border-red-600 hover:shadow-sm">
                <img
                  src={sponsor.image_url}
                  alt={sponsor.name}
                  className="max-h-[72px] max-w-full object-contain transition duration-200 group-hover:scale-[1.03]"
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
                >
                  {content}
                </Link>
              );
            }

            return (
              <div key={sponsor.id}>
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
