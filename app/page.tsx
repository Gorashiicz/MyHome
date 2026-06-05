import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/layout/section-banner";
import { APP_NAME } from "@/lib/constants";

export default async function HomePage() {
  const session = await auth();
  if (session?.user) redirect("/projekty");

  return (
    <main className="min-h-screen">
      <PageHero
        section="home"
        title={APP_NAME}
        description="Mějte celou stavbu pod kontrolou — rozpočet, výdaje, faktury, dokumenty, fotky a termíny na jednom místě."
      />
      <div className="mx-auto flex max-w-lg flex-col gap-3 px-6 pb-12 pt-2 sm:flex-row">
        <Button asChild size="lg" className="flex-1">
          <Link href="/registrace">Začít zdarma</Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="flex-1">
          <Link href="/prihlaseni">Přihlásit se</Link>
        </Button>
      </div>
    </main>
  );
}
