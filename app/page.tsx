import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";

export default async function HomePage() {
  const session = await auth();
  if (session?.user) redirect("/projekty");

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-900">{APP_NAME}</h1>
      <p className="mt-3 text-slate-600">
        Mějte celou stavbu pod kontrolou — rozpočet, výdaje, faktury, dokumenty,
        fotky a termíny na jednom místě.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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
