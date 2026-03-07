import BrandKit from "@/components/brand-kit";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";

export const metadata = {
  title: "Brand Kit | Mitchell Bozentka",
  description: "Brand guidelines: colors, typography, and voice.",
};

export default function BrandingPage() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <SiteHeader />
      <main className="flex-1">
        <BrandKit />
      </main>
      <Footer />
    </div>
  );
}
