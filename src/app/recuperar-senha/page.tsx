import { ForgotPasswordForm } from "@/components/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <main className="section">
      <div className="container two-col">
        <section>
          <span className="eyebrow">Seguranca</span>
          <h1>Recuperar senha</h1>
          <p className="lead">A resposta nao revela se o email existe, evitando enumeracao de usuarios.</p>
        </section>
        <section className="panel">
          <ForgotPasswordForm />
        </section>
      </div>
    </main>
  );
}
