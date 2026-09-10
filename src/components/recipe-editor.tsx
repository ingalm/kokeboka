"use client";

import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, ImagePlus, Lightbulb, ListPlus, Plus, Save, Send, Trash2, Undo2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { INSTRUCTION_TYPES, type InstructionType, UNITS, type Unit } from "@/lib/constants";
import type { EditableIngredient, EditableIngredientSection, EditableInstruction, EditableRecipe, RecipeDetail, Tag } from "@/lib/types";

const makeIngredient = (): EditableIngredient => ({ id: crypto.randomUUID(), amount: null, unit: "", name: "", note: "" });
const makeSection = (title = "Ingredienser"): EditableIngredientSection => ({ id: crypto.randomUUID(), title, ingredients: [makeIngredient()] });
const makeInstruction = (kind: InstructionType = "step"): EditableInstruction => ({ id: crypto.randomUUID(), kind, content: "" });

export const emptyRecipe = (): EditableRecipe => ({
  title: "",
  coverImageKey: null,
  servings: 4,
  status: "draft",
  tagIds: [],
  ingredientSections: [makeSection()],
  instructions: [makeInstruction()],
});

export function recipeToEditable(recipe: RecipeDetail): EditableRecipe {
  return {
    id: recipe.id,
    title: recipe.title,
    slug: recipe.slug,
    coverImageKey: recipe.coverImageKey,
    servings: recipe.servings,
    status: recipe.status,
    tagIds: recipe.tags.map((tag) => tag.id),
    ingredientSections: recipe.ingredientSections.map((section) => ({
      id: section.id,
      title: section.title,
      ingredients: section.ingredients.map((ingredient) => ({ ...ingredient })),
    })),
    instructions: recipe.instructions.map((instruction) => ({ ...instruction })),
  };
}

function SortableBlock({ id, children, className = "" }: { id: string; children: React.ReactNode; className?: string }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  return <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} className={className}><button type="button" className="drag-handle" aria-label="Dra for å endre rekkefølge" {...attributes} {...listeners}><GripVertical size={18} /></button>{children}</div>;
}

function SectionEditor({ section, update, remove, onSortIngredients }: { section: EditableIngredientSection; update: (section: EditableIngredientSection) => void; remove: () => void; onSortIngredients: (event: DragEndEvent) => void }) {
  const addIngredient = () => update({ ...section, ingredients: [...section.ingredients, makeIngredient()] });
  const changeIngredient = (index: number, patch: Partial<EditableIngredient>) => update({ ...section, ingredients: section.ingredients.map((ingredient, current) => current === index ? { ...ingredient, ...patch } : ingredient) });
  const removeIngredient = (index: number) => update({ ...section, ingredients: section.ingredients.filter((_, current) => current !== index) });

  return (
    <SortableBlock id={`section:${section.id}`} className="editor-section-card">
      <div className="editor-section-heading"><input value={section.title} onChange={(event) => update({ ...section, title: event.target.value })} aria-label="Navn på ingrediensseksjon" placeholder="Ingredienser" /><button type="button" className="icon-button danger" onClick={remove} aria-label="Slett seksjon"><Trash2 size={16} /></button></div>
      <DndContext sensors={useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 7 } }))} onDragEnd={onSortIngredients}>
        <SortableContext items={section.ingredients.map((ingredient) => `ingredient:${section.id}:${ingredient.id}`)} strategy={verticalListSortingStrategy}>
          <div className="ingredient-editor-list">
            {section.ingredients.map((ingredient, index) => (
              <SortableBlock key={ingredient.id} id={`ingredient:${section.id}:${ingredient.id}`} className="ingredient-editor-row">
                <input className="amount-input" type="number" step="0.1" min="0" value={ingredient.amount ?? ""} onChange={(event) => changeIngredient(index, { amount: event.target.value === "" ? null : Number(event.target.value) })} aria-label="Mengde" placeholder="Mengde" />
                <select value={ingredient.unit} onChange={(event) => changeIngredient(index, { unit: event.target.value as Unit })} aria-label="Enhet" disabled={Boolean(ingredient.note)}>{UNITS.map((unit) => <option key={unit} value={unit}>{unit || "–"}</option>)}</select>
                <input value={ingredient.name} onChange={(event) => changeIngredient(index, { name: event.target.value })} aria-label="Ingrediens" placeholder="Ingrediens" />
                <input value={ingredient.note} onChange={(event) => changeIngredient(index, { note: event.target.value, unit: event.target.value ? "" : ingredient.unit })} aria-label="Merknad" placeholder="Merknad" />
                <button type="button" className="icon-button danger" onClick={() => removeIngredient(index)} aria-label="Slett ingrediens"><Trash2 size={16} /></button>
              </SortableBlock>
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <button type="button" className="editor-add-button" onClick={addIngredient}><Plus size={16} />Legg til ingrediens</button>
    </SortableBlock>
  );
}

function InstructionEditor({ item, update, remove }: { item: EditableInstruction; update: (item: EditableInstruction) => void; remove: () => void }) {
  const labels: Record<InstructionType, string> = { heading: "Overskrift", step: "Steg", tip: "Tips" };
  return (
    <SortableBlock id={`instruction:${item.id}`} className={`instruction-editor-row ${item.kind}`}>
      <select value={item.kind} onChange={(event) => update({ ...item, kind: event.target.value as InstructionType })} aria-label="Type instrukselement">{INSTRUCTION_TYPES.map((kind) => <option key={kind} value={kind}>{labels[kind]}</option>)}</select>
      {item.kind === "tip" && <Lightbulb size={18} aria-hidden="true" />}
      <textarea rows={item.kind === "heading" ? 1 : 3} value={item.content} onChange={(event) => update({ ...item, content: event.target.value })} placeholder={item.kind === "heading" ? "For eksempel: Lag deigen" : item.kind === "tip" ? "Et nyttig tips" : "Beskriv steget"} />
      <button type="button" className="icon-button danger" onClick={remove} aria-label="Slett instrukselement"><Trash2 size={16} /></button>
    </SortableBlock>
  );
}

export function RecipeEditor({ initialRecipe, initialTags }: { initialRecipe?: RecipeDetail; initialTags: Tag[] }) {
  const [recipe, setRecipe] = useState<EditableRecipe>(() => initialRecipe ? recipeToEditable(initialRecipe) : emptyRecipe());
  const [tags, setTags] = useState(initialTags);
  const [tagName, setTagName] = useState("");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const latestRecipe = useRef(recipe);
  const lastSaved = useRef("");
  latestRecipe.current = recipe;
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 7 } }));

  const save = useCallback(async (next: EditableRecipe, explicit = false, republish = false): Promise<string | undefined> => {
    if (!next.title.trim()) return undefined;
    const serialised = JSON.stringify(next);
    if (!explicit && serialised === lastSaved.current) return next.id;
    setSaveState("saving"); setError("");
    try {
      const response = await fetch(next.id ? `/api/recipes/${next.id}` : "/api/recipes", { method: next.id ? "PATCH" : "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ recipe: next, republish }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Kunne ikke lagre oppskriften.");
      const id = result.id as string;
      if (!next.id) setRecipe((current) => ({ ...current, id }));
      lastSaved.current = JSON.stringify({ ...next, id });
      setSaveState("saved");
      return id;
    } catch (saveError) { setSaveState("error"); setError(saveError instanceof Error ? saveError.message : "Kunne ikke lagre oppskriften."); return undefined; }
  }, []);

  useEffect(() => {
    if (!recipe.title.trim()) return;
    const timer = window.setTimeout(() => { void save(recipe); }, 900);
    return () => window.clearTimeout(timer);
  }, [recipe, save]);

  const updateSections = (nextSections: EditableIngredientSection[]) => setRecipe((current) => ({ ...current, ingredientSections: nextSections }));
  const sortSections = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const oldIndex = recipe.ingredientSections.findIndex((section) => `section:${section.id}` === active.id);
    const newIndex = recipe.ingredientSections.findIndex((section) => `section:${section.id}` === over.id);
    if (oldIndex >= 0 && newIndex >= 0) updateSections(arrayMove(recipe.ingredientSections, oldIndex, newIndex));
  };
  const sortIngredients = (sectionId: string) => ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const section = recipe.ingredientSections.find((candidate) => candidate.id === sectionId);
    if (!section) return;
    const prefix = `ingredient:${sectionId}:`;
    const oldIndex = section.ingredients.findIndex((ingredient) => `${prefix}${ingredient.id}` === active.id);
    const newIndex = section.ingredients.findIndex((ingredient) => `${prefix}${ingredient.id}` === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    updateSections(recipe.ingredientSections.map((candidate) => candidate.id === sectionId ? { ...candidate, ingredients: arrayMove(candidate.ingredients, oldIndex, newIndex) } : candidate));
  };
  const sortInstructions = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const oldIndex = recipe.instructions.findIndex((instruction) => `instruction:${instruction.id}` === active.id);
    const newIndex = recipe.instructions.findIndex((instruction) => `instruction:${instruction.id}` === over.id);
    if (oldIndex >= 0 && newIndex >= 0) setRecipe((current) => ({ ...current, instructions: arrayMove(current.instructions, oldIndex, newIndex) }));
  };

  const addTag = async () => {
    if (!tagName.trim()) return;
    const response = await fetch("/api/tags", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: tagName }) });
    const result = await response.json();
    if (!response.ok) { setError(result.error ?? "Kunne ikke opprette taggen."); return; }
    const tag = result.tag as Tag;
    setTags((current) => current.some((item) => item.id === tag.id) ? current : [...current, tag].sort((a, b) => a.name.localeCompare(b.name, "nb")));
    setRecipe((current) => ({ ...current, tagIds: [...new Set([...current.tagIds, tag.id]) ] }));
    setTagName("");
  };
  const uploadImage = async (file: File) => {
    if (!recipe.title.trim()) { setError("Skriv inn en tittel før du laster opp et bilde."); return; }
    setUploading(true); setError("");
    try {
      let recipeId = latestRecipe.current.id;
      if (!recipeId) recipeId = await save(latestRecipe.current, true);
      if (!recipeId) throw new Error("Oppskriften må lagres før bildet kan lastes opp.");
      const formData = new FormData(); formData.set("image", file); formData.set("recipeId", recipeId);
      const response = await fetch("/api/upload", { method: "POST", body: formData }); const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Kunne ikke laste opp bildet.");
      setRecipe((current) => ({ ...current, coverImageKey: result.key }));
    } catch (uploadError) { setError(uploadError instanceof Error ? uploadError.message : "Kunne ikke laste opp bildet."); } finally { setUploading(false); }
  };
  const publish = async () => {
    const previous = recipe;
    const next = { ...recipe, status: "published" as const };
    setRecipe(next);
    const id = await save(next, true, true);
    if (!id) setRecipe(previous);
  };
  const unpublish = async () => {
    const previous = recipe;
    const next = { ...recipe, status: "draft" as const };
    setRecipe(next);
    const id = await save(next, true);
    if (!id) setRecipe(previous);
  };
  const removeRecipe = async () => {
    if (!recipe.id || !window.confirm(`Slette «${recipe.title}» permanent? Bildet slettes også.`)) return;
    const response = await fetch(`/api/recipes/${recipe.id}`, { method: "DELETE" });
    const result = await response.json();
    if (!response.ok) { setError(result.error ?? "Kunne ikke slette oppskriften."); return; }
    window.location.assign("/utkast");
  };

  const saveLabel = useMemo(() => ({ idle: "", saving: "Lagrer …", saved: "Lagret", error: "Kunne ikke lagre" }[saveState]), [saveState]);
  return (
    <div className="editor-shell">
      <div className="editor-topbar"><div><p className="eyebrow">{recipe.status === "published" ? "Publisert oppskrift" : "Utkast"}</p><div className={`save-state ${saveState}`}>{saveLabel && <><Save size={15} />{saveLabel}</>}</div></div><div className="editor-top-actions">{recipe.id && <button type="button" className="button-secondary delete-recipe-button" onClick={() => void removeRecipe()}><Trash2 size={16} />Slett</button>}<button type="button" className="button-secondary" onClick={() => void save(recipe, true)}>Lagre nå</button>{recipe.status === "published" ? <button type="button" className="button-secondary" onClick={() => void unpublish()}><Undo2 size={16} />Gjør til utkast</button> : <button type="button" className="button-primary" onClick={() => void publish()}><Send size={16} />Publiser</button>}</div></div>
      {error && <p className="editor-error" role="alert">{error}</p>}
      <div className="editor-main-grid">
        <div className="editor-content">
          <label className="form-label">Tittel<input className="title-input" value={recipe.title} onChange={(event) => setRecipe((current) => ({ ...current, title: event.target.value }))} placeholder="Navn på oppskriften" required /></label>
          <label className="form-label servings-input">Porsjoner<input type="number" min="1" value={recipe.servings} onChange={(event) => setRecipe((current) => ({ ...current, servings: Math.max(1, Number(event.target.value)) }))} /></label>
          <section className="editor-block"><div className="editor-block-heading"><div><p className="eyebrow">Bygg oppskriften</p><h2>Ingredienser</h2></div><button type="button" className="editor-add-button" onClick={() => updateSections([...recipe.ingredientSections, makeSection("Ny seksjon")])}><ListPlus size={16} />Ny seksjon</button></div>
            <DndContext sensors={sensors} onDragEnd={sortSections}><SortableContext items={recipe.ingredientSections.map((section) => `section:${section.id}`)} strategy={verticalListSortingStrategy}>{recipe.ingredientSections.map((section) => <SectionEditor key={section.id} section={section} update={(updated) => updateSections(recipe.ingredientSections.map((current) => current.id === section.id ? updated : current))} remove={() => updateSections(recipe.ingredientSections.filter((current) => current.id !== section.id))} onSortIngredients={sortIngredients(section.id)} />)}</SortableContext></DndContext>
          </section>
          <section className="editor-block"><div className="editor-block-heading"><div><p className="eyebrow">Slik gjør du</p><h2>Fremgangsmåte</h2></div><div className="add-menu"><button type="button" className="editor-add-button" onClick={() => setRecipe((current) => ({ ...current, instructions: [...current.instructions, makeInstruction("step")] }))}><Plus size={16} />Nytt steg</button><button type="button" className="editor-add-button" onClick={() => setRecipe((current) => ({ ...current, instructions: [...current.instructions, makeInstruction("tip")] }))}><Lightbulb size={16} />Nytt tips</button><button type="button" className="editor-add-button" onClick={() => setRecipe((current) => ({ ...current, instructions: [...current.instructions, makeInstruction("heading")] }))}><Plus size={16} />Overskrift</button></div></div>
            <DndContext sensors={sensors} onDragEnd={sortInstructions}><SortableContext items={recipe.instructions.map((instruction) => `instruction:${instruction.id}`)} strategy={verticalListSortingStrategy}><div className="instruction-editor-list">{recipe.instructions.map((item) => <InstructionEditor key={item.id} item={item} update={(updated) => setRecipe((current) => ({ ...current, instructions: current.instructions.map((candidate) => candidate.id === item.id ? updated : candidate) }))} remove={() => setRecipe((current) => ({ ...current, instructions: current.instructions.filter((candidate) => candidate.id !== item.id) }))} />)}</div></SortableContext></DndContext>
          </section>
        </div>
        <aside className="editor-sidebar">
          <section className="editor-side-card"><h2>Forsidebilde</h2><div className="upload-preview">{recipe.coverImageKey ? <img src={`/media/${recipe.coverImageKey}`} alt={recipe.title || "Forsidebilde"} /> : <ImagePlus size={28} />}</div><label className="upload-button"><input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadImage(file); }} />{uploading ? "Laster opp …" : "Last opp bilde"}</label><p>Bildet gjøres mindre og komprimeres automatisk.</p></section>
          <section className="editor-side-card"><h2>Tagger</h2><div className="tag-editor-list">{tags.map((tag) => <label key={tag.id}><input type="checkbox" checked={recipe.tagIds.includes(tag.id)} onChange={() => setRecipe((current) => ({ ...current, tagIds: current.tagIds.includes(tag.id) ? current.tagIds.filter((id) => id !== tag.id) : [...current.tagIds, tag.id] }))} />{tag.name}</label>)}</div><div className="new-tag"><input value={tagName} onChange={(event) => setTagName(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); void addTag(); } }} placeholder="Ny tagg" /><button type="button" onClick={() => void addTag()} aria-label="Legg til tagg"><Plus size={17} /></button></div></section>
        </aside>
      </div>
    </div>
  );
}
