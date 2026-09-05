import { Footer } from "@/components/site/footer";
import { SiteNav } from "@/components/site/nav";

export const dynamic = "force-dynamic";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteNav />
      {children}
      <Footer />
    </>
  );
}
