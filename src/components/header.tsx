import Link from "next/link";
import { BookOpen, CircleUserRound, Plus, Search } from "lucide-react";

import { auth } from "@/auth";

export async function Header() {
  const session = await auth();
  const isEditor = session?.user?.isEditor;

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="wordmark" href="/" aria-label="Kokeboka – hjem">
          <BookOpen aria-hidden="true" size={21} strokeWidth={1.8} />
          <span>Kokeboka</span>
        </Link>
        <nav aria-label="Hovedmeny">
          <Link href="/">Hjem</Link>
          <Link href="/sok"><Search aria-hidden="true" size={16} />Søk</Link>
          <Link href="/oppskrifter">Alle oppskrifter</Link>
        </nav>
        <div className="header-actions">
          {isEditor ? (
            <>
              <Link href="/utkast">Utkast</Link>
              <Link className="add-link" href="/admin/oppskrifter/ny"><Plus aria-hidden="true" size={16} />Legg til oppskrift</Link>
              <Link className="icon-link" href="/innstillinger" aria-label="Innstillinger"><CircleUserRound size={20} /></Link>
            </>
          ) : (
            <Link className="login-link" href="/innlogging">Logg inn</Link>
          )}
        </div>
      </div>
    </header>
  );
}
