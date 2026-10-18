
import { createClient } from "@/lib/supabase/server";
import SponsorCarousel, {
  type SponsorLogo,
} from "@/components/site/SponsorCarousel";

export default async function SponsorCarouselLoader() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("sponsor_carousel")
    .select("id, name, image_url, target_url")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error cargando logos:", error.message);
    return null;
  }

  const logos = (data ?? []) as SponsorLogo[];

  return <SponsorCarousel logos={logos} />;
}
