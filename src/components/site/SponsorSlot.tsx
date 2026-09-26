import { createClient } from "@/lib/supabase/server";

import SponsorRotator from "@/components/site/SponsorRotator";
import SponsorPlaceholder from "@/components/site/SponsorPlaceholder";

interface SponsorSlotProps {
  position: string;
  width: 1456 | 1024 | 320 | 160;
  height: 180 | 1024 | 1200 | 600;
  className?: string;
}

interface Sponsor {
  id: string;
  name: string;
  image_url: string;
  target_url: string | null;
}

export default async function SponsorSlot({
  position,
  width,
  height,
  className = "",
}: SponsorSlotProps) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("sponsors")
    .select("id, name, image_url, target_url")
    .eq("position", position)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error cargando auspiciadores:", error);
  }

  const sponsors = (data ?? []) as Sponsor[];

  if (sponsors.length === 0) {
    return (
      <SponsorPlaceholder
        width={width}
        height={height}
        className={className}
      />
    );
  }

  return (
    <SponsorRotator
      sponsors={sponsors}
      width={width}
      height={height}
      className={className}
    />
  );
}