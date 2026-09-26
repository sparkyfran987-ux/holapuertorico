import { requireAdmin } from "@/lib/supabase/auth";
import NuevaNoticiaForm from "./NuevaNoticiaForm";

export default async function NuevaNoticiaPage() {
  await requireAdmin();

  return <NuevaNoticiaForm />;
}