import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function login(formData: FormData) {
  "use server";
  const password = formData.get("password");
  if (password === process.env.ADMIN_SECRET) {
    cookies().set("admin_auth", process.env.ADMIN_SECRET as string, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 jours
    });
    redirect("/admin/new");
  }
  redirect("/admin/login?error=1");
}

export default function AdminLogin({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <main style={{ maxWidth: 360, margin: "80px auto", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: 22, marginBottom: 16 }}>Connexion admin</h1>
      <form action={login}>
        <input
          type="password"
          name="password"
          placeholder="Mot de passe admin"
          required
          style={{ width: "100%", padding: 10, marginBottom: 12 }}
        />
        <button type="submit" style={{ width: "100%", padding: 10 }}>
          Se connecter
        </button>
      </form>
      {searchParams.error && (
        <p style={{ color: "crimson", marginTop: 12 }}>Mot de passe incorrect.</p>
      )}
    </main>
  );
}
