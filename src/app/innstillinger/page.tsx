import { ImageLibrary } from "@/components/image-library";
import { TagManager } from "@/components/tag-manager";
import { getHomeImage, listTags } from "@/db/repository";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const [homeImage, tags] = await Promise.all([getHomeImage(), listTags()]);
  return <div className="page-shell"><div className="page-intro"><p className="eyebrow">Redaktør</p><h1>Innstillinger</h1><p>Velg bildet som møter besøkende på forsiden og hold orden i taggene.</p></div><ImageLibrary currentImage={homeImage} /><TagManager initialTags={tags} /></div>;
}
