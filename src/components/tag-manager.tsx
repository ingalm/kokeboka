"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import type { Tag } from "@/lib/types";

export function TagManager({ initialTags }: { initialTags: Tag[] }) {
  const [tags, setTags] = useState(initialTags);
  const [newName, setNewName] = useState("");
  const [message, setMessage] = useState("");
  const create = async () => {
    const response = await fetch("/api/tags", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: newName }) }); const result = await response.json();
    if (!response.ok) { setMessage(result.error ?? "Kunne ikke opprette tagg."); return; }
    setTags((current) => [...current.filter((tag) => tag.id !== result.tag.id), result.tag].sort((a, b) => a.name.localeCompare(b.name, "nb"))); setNewName("");
  };
  const rename = async (tag: Tag) => {
    const name = window.prompt("Nytt navn på taggen", tag.name)?.trim(); if (!name || name === tag.name) return;
    const response = await fetch(`/api/tags/${tag.id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ name }) }); const result = await response.json();
    if (!response.ok) { setMessage(result.error ?? "Kunne ikke endre taggen."); return; }
    setTags((current) => current.map((currentTag) => currentTag.id === tag.id ? { ...currentTag, name } : currentTag));
  };
  const remove = async (tag: Tag) => {
    if (!window.confirm(`Slette taggen «${tag.name}»? Den fjernes fra alle oppskrifter.`)) return;
    const response = await fetch(`/api/tags/${tag.id}`, { method: "DELETE" }); const result = await response.json();
    if (!response.ok) { setMessage(result.error ?? "Kunne ikke slette taggen."); return; }
    setTags((current) => current.filter((currentTag) => currentTag.id !== tag.id));
  };
  return <section className="tag-manager"><p className="eyebrow">Oppskriftsorganisering</p><h2>Tagger</h2><p>Tagger brukes til filtrering og kan legges til mens du redigerer en oppskrift.</p><div className="new-tag"><input value={newName} onChange={(event) => setNewName(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); void create(); } }} placeholder="Ny tagg" /><button type="button" onClick={() => void create()}><Plus size={17} />Legg til</button></div>{message && <p className="editor-error">{message}</p>}<ul>{tags.map((tag) => <li key={tag.id}><span>{tag.name}</span><div><button type="button" onClick={() => void rename(tag)} aria-label={`Endre ${tag.name}`}><Pencil size={15} /></button><button type="button" className="danger" onClick={() => void remove(tag)} aria-label={`Slett ${tag.name}`}><Trash2 size={15} /></button></div></li>)}</ul></section>;
}
