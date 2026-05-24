import { ResetPasswordForm } from "@/components/ResetPasswordForm";

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const query = await searchParams;
  return (
    <main className="section">
      <div className="container two-col">
        <section>
          <span className="eyebrow">Nova senha</span>
          <h1>Redefinir senha</h1>
        </section>
        <section className="panel">
          <ResetPasswordForm token={query.token} />
        </section>
      </div>
    </main>
  );
}
