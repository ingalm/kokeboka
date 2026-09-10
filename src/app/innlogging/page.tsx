import { signIn } from "@/auth";

export default function LoginPage() {
  return (
    <div className="page-shell">
      <div className="empty-state" style={{ maxWidth: 540, margin: "60px auto" }}>
        <p className="eyebrow">Kun for redaktør</p>
        <h1 style={{ fontSize: "3.2rem", marginBottom: 0 }}>Logg inn</h1>
        <p>Logg inn med den godkjente Google-kontoen for å opprette og redigere oppskrifter.</p>
        <form action={async () => { "use server"; await signIn("google", { redirectTo: "/utkast" }); }}><button className="button-primary" type="submit">Logg inn med Google</button></form>
      </div>
    </div>
  );
}
