import Link from "next/link";
import { BookOpen, ChevronDown, LayoutDashboard, Search, ShoppingCart, UserRound } from "lucide-react";
import { readSession } from "@/lib/auth";
import { LogoutButton } from "@/components/LogoutButton";

export async function Header() {
  const session = await readSession();

  return (
    <header className="site-header">
      <div className="utility-bar">
        <div className="container utility-inner">
          <span>Português</span>
          <span>BRL</span>
          <strong>Entrega digital imediata apos pagamento aprovado</strong>
          <div className="utility-actions">
            <Link href="/cliente">Minha conta</Link>
            <Link href="/admin">Admin</Link>
          </div>
        </div>
      </div>
      <div className="main-nav">
        <div className="container nav">
          <Link className="brand" href="/">
            <span className="brand-mark">
              <BookOpen size={20} />
            </span>
            <span>DigitalHub</span>
          </Link>

          <div className="search-shell" role="search">
            <Search size={18} />
            <input aria-label="Buscar produto" placeholder="Buscar cursos, templates, ebooks..." />
          </div>

          <nav className="nav-links" aria-label="Principal">
            <Link href="/">Home</Link>
            <Link href="/produtos">
              Produtos <ChevronDown size={15} />
            </Link>
            <Link href="/carrinho">
              <ShoppingCart size={17} /> Carrinho
            </Link>
            {session ? (
              <>
                <Link href="/cliente">
                  <UserRound size={17} /> Cliente
                </Link>
                {session.role === "ADMIN" ? (
                  <Link href="/admin">
                    <LayoutDashboard size={17} /> Admin
                  </Link>
                ) : null}
                <LogoutButton />
              </>
            ) : (
              <>
                <Link href="/login">Login</Link>
                <Link className="nav-cta" href="/cadastro">Cadastro</Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
