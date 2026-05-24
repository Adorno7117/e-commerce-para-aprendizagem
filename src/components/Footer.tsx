import Link from "next/link";
import { BookOpen, CreditCard, Headphones, Mail, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="site-footer">
      <section className="footer-newsletter">
        <div className="container footer-newsletter-grid">
          <div>
            <span className="eyebrow">DigitalHub Club</span>
            <h2>Receba lancamentos, cupons e kits gratuitos.</h2>
          </div>
          <form className="newsletter-form">
            <Mail size={18} />
            <input aria-label="Email para newsletter" placeholder="seuemail@exemplo.com" type="email" />
            <button type="button">Assinar</button>
          </form>
        </div>
      </section>

      <section className="footer-main">
        <div className="container footer-grid">
          <div className="footer-brand stack">
            <Link className="brand" href="/">
              <span className="brand-mark">
                <BookOpen size={20} />
              </span>
              <span>DigitalHub</span>
            </Link>
            <p>
              Marketplace de produtos digitais com checkout seguro, entrega protegida e area do cliente para downloads.
            </p>
            <div className="footer-badges">
              <span><ShieldCheck size={16} /> Download seguro</span>
              <span><CreditCard size={16} /> Pagamento protegido</span>
            </div>
          </div>

          <nav className="footer-col" aria-label="Comprar">
            <strong>Comprar</strong>
            <Link href="/produtos">Todos os produtos</Link>
            <Link href="/produtos">Cursos</Link>
            <Link href="/produtos">Templates</Link>
            <Link href="/produtos">Ebooks</Link>
            <Link href="/produtos">Sistemas</Link>
          </nav>

          <nav className="footer-col" aria-label="Conta">
            <strong>Conta</strong>
            <Link href="/login">Entrar</Link>
            <Link href="/cadastro">Criar conta</Link>
            <Link href="/cliente">Meus pedidos</Link>
            <Link href="/recuperar-senha">Recuperar senha</Link>
            <Link href="/carrinho">Carrinho</Link>
          </nav>

          <div className="footer-col">
            <strong>Atendimento</strong>
            <span><Headphones size={16} /> Segunda a sexta, 9h as 18h</span>
            <span>suporte@digitalhub.com</span>
            <span>Ajuda com acesso, pagamento e downloads.</span>
          </div>

          <div className="footer-col">
            <strong>Seguranca</strong>
            <span>Arquivos privados</span>
            <span>Links temporarios</span>
            <span>Cookies httpOnly</span>
            <span>Webhook validado</span>
          </div>
        </div>
      </section>

      <section className="footer-bottom">
        <div className="container footer-bottom-inner">
          <span>(c) 2026 DigitalHub. Todos os direitos reservados.</span>
          <div className="payment-row" aria-label="Formas de pagamento">
            <span>Pix</span>
            <span>Visa</span>
            <span>Mastercard</span>
            <span>Stripe</span>
            <span>Mercado Pago</span>
          </div>
        </div>
      </section>
    </footer>
  );
}
