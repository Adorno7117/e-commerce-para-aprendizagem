import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <main className="section">
      <div className="container two-col">
        <section>
          <span className="eyebrow">Acesso</span>
          <h1>Entrar</h1>
          <p className="lead">Acesse seus pedidos, historico de compras e downloads liberados.</p>
        </section>
        <section className="panel">
          <AuthForm mode="login" />
          <p className="meta">Ainda nao tem conta? <Link href="/cadastro">Crie uma conta</Link>.</p>
        </section>
      </div>
    </main>
  );
}
