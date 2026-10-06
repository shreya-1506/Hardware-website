import { FloatingWhatsApp } from "@/components/site/FloatingWhatsApp";
import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";
import { NotFoundContent } from "@/components/site/NotFoundContent";

export const metadata = { title: "Page not found" };

export default function RootNotFound() {
  return (
    <>
      <Navbar />
      <main>
        <NotFoundContent />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
