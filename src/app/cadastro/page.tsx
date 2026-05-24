import { AuthForm } from "@/components/AuthForm";

export default function RegisterPage() {
  return (
    <main className="section">
      <div className="container two-col">
        <section>
          <span className="eyebrow">Conta</span>
          <h1>Criar conta</h1>
          <p className="lead">Use uma conta para manter seu historico e acessar downloads comprados.</p>
        </section>
        <section className="panel">
          <AuthForm mode="register" />
        </section>
      </div>
    </main>
  );
}
