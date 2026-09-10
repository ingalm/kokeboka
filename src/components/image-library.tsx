"use client";

import { Check, ImagePlus } from "lucide-react";
import { useEffect, useState } from "react";

type HomeImage = { id: string; key: string } | null;

export function ImageLibrary({ currentImage }: { currentImage: HomeImage }) {
  const [image, setImage] = useState(currentImage);
  const [images, setImages] = useState<HomeImage[]>(currentImage ? [currentImage] : []);
  const [message, setMessage] = useState("");
  useEffect(() => { void fetch("/api/settings/home-image").then((response) => response.json()).then((result) => setImages(result.images ?? [])).catch(() => undefined); }, []);
  const upload = async (file: File) => {
    setMessage("Laster opp …");
    const body = new FormData(); body.set("image", file); body.set("purpose", "home");
    const response = await fetch("/api/upload", { method: "POST", body }); const result = await response.json();
    if (!response.ok) { setMessage(result.error ?? "Kunne ikke laste opp bildet."); return; }
    const setResponse = await fetch("/api/settings/home-image", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ key: result.key }) });
    const setting = await setResponse.json();
    if (!setResponse.ok) { setMessage(setting.error ?? "Kunne ikke velge bildet."); return; }
    setImage(setting.image); setImages((current) => [setting.image, ...current.filter((item) => item?.id !== setting.image.id)]); setMessage("Hovedbildet er lagret.");
  };
  const choose = async (selected: NonNullable<HomeImage>) => {
    const response = await fetch("/api/settings/home-image", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ key: selected.key }) }); const result = await response.json();
    if (!response.ok) { setMessage(result.error ?? "Kunne ikke velge bildet."); return; }
    setImage(result.image); setMessage("Hovedbildet er endret.");
  };
  return <><section className="settings-image-card"><div className="settings-image-preview">{image ? <img src={`/media/${image.key}`} alt="Home page image" /> : <ImagePlus size={35} />}</div><div><h2>Hovedbilde</h2><p>Et nytt bilde blir beholdt i bildebiblioteket slik at du kan velge det igjen senere.</p><label className="upload-button"><input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file); }} />Last opp og velg bilde</label>{message && <p className="settings-message">{message}</p>}</div></section>{images.length > 0 && <section className="image-library"><h2>Tidligere hovedbilder</h2><div>{images.map((candidate) => candidate && <button key={candidate.id} className={candidate.id === image?.id ? "selected" : ""} type="button" onClick={() => void choose(candidate)}><img src={`/media/${candidate.key}`} alt="Home page image" />{candidate.id === image?.id && <span><Check size={16} />Valgt</span>}</button>)}</div></section>}</>;
}
