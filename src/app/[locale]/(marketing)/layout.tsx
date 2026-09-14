import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

/**
 * Chrome for the public site. The client portal sits in its own route group
 * with its own shell, so neither has to opt out of the other's furniture.
 */
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
