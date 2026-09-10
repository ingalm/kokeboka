import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { RecipeCarousel } from "@/components/recipe-carousel";
import { getHomeImage, listPublishedRecipes } from "@/db/repository";
import { osloDateKey, seededShuffle } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [recipes, homeImage] = await Promise.all([listPublishedRecipes(), getHomeImage()]);
  const dailyRecipes = seededShuffle(recipes, osloDateKey()).slice(0, 10);

  return (
    <div className="page-shell">
      <section className="home-hero">
        <div className="home-hero-copy">
          <p className="eyebrow">Velkommen til</p>
          <h1>En god samling oppskrifter.</h1>
          <p>Favoritter til hverdager, høytider og alt det gode innimellom.</p>
          <Link className="button-primary" href="/oppskrifter">Se alle oppskrifter <ArrowRight size={17} /></Link>
        </div>
        <div className="hero-image">
          {homeImage && <Image src={`/media/${homeImage.key}`} alt="Home page image" fill priority unoptimized sizes="(max-width: 720px) 100vw, 58vw" />}
        </div>
      </section>
      <section className="home-section">
        <div className="section-heading">
          <div><p className="eyebrow">Et nytt utvalg hver dag</p><h2>På menyen i dag</h2></div>
          <Link href="/oppskrifter">Alle oppskrifter <ArrowRight size={16} /></Link>
        </div>
        <RecipeCarousel recipes={dailyRecipes} />
      </section>
    </div>
  );
}
