import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Code2,
  FileText,
  GraduationCap,
  LayoutTemplate,
  Palette,
  ShieldCheck,
  Sparkles,
  Zap
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
import { money } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: { status: "ACTIVE" },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: 6
    }),
    prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: "asc" },
      take: 8
    })
  ]);

  const categoryIcons = [GraduationCap, LayoutTemplate, FileText, Code2, Palette, BookOpen, Sparkles, ShieldCheck];
  const featured = products[0];

  return (
    <main>
      <section className="shop-hero">
        <div className="container shop-hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Colecao digital 2026</span>
            <h1>Domine, baixe e aplique hoje.</h1>
            <p className="lead">
              Cursos, templates, ebooks e sistemas prontos para acelerar projetos reais, com compra simples e acesso protegido.
            </p>
            <div className="actions">
              <Link className="button" href="/produtos">
                Comprar agora <ArrowRight size={18} />
              </Link>
              <Link className="button ghost" href="/cadastro">Criar conta</Link>
            </div>
            <div className="hero-metrics">
              <span><strong>100%</strong> digital</span>
              <span><strong>0</strong> frete</span>
              <span><strong>15 min</strong> token</span>
            </div>
          </div>
          <div className="hero-showcase">
            <img
              src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1400&q=80"
              alt="Produtos digitais em tela"
            />
            <div className="floating-deal">
              <span>Oferta destaque</span>
              <strong>{featured ? featured.name : "Pack Digital Pro"}</strong>
              <em>{featured ? money(featured.priceCents) : "R$ 199,90"}</em>
            </div>
          </div>
        </div>
      </section>

      <section className="category-strip">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Categorias</span>
              <h2>Navegue por tipo de produto</h2>
            </div>
          </div>
          <div className="category-row">
            {categories.map((category, index) => {
              const Icon = categoryIcons[index % categoryIcons.length];
              return (
                <Link className="category-tile" href="/produtos" key={category.id}>
                  <span><Icon size={28} /></span>
                  <strong>{category.name}</strong>
                  <small>{category._count.products} itens</small>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section promo-section">
        <div className="container promo-grid">
          <div className="promo-card promo-large">
            <div>
              <span className="eyebrow">Mais vendido</span>
              <h2>Curso Full Stack Commerce</h2>
              <p>Projeto completo para lancar sua primeira loja digital.</p>
              <Link className="button" href="/produtos">Ver curso</Link>
            </div>
            <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80" alt="Curso digital em notebook" />
          </div>
          <div className="promo-card mint">
            <div>
              <span className="eyebrow">Templates</span>
              <h3>Arquivos prontos para vender melhor.</h3>
              <Link href="/produtos">Explorar</Link>
            </div>
            <img src="https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80" alt="Templates digitais" />
          </div>
          <div className="promo-card sage">
            <div>
              <span className="eyebrow">Sistemas</span>
              <h3>Bases baixaveis para acelerar entregas.</h3>
              <Link href="/produtos">Conhecer</Link>
            </div>
            <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80" alt="Dashboard digital" />
          </div>
        </div>
      </section>

      <section className="section products-showcase">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Produtos em alta</span>
              <h2>Novidades para baixar agora</h2>
            </div>
            <div className="tabs">
              <span className="active">Novos</span>
              <span>Mais vendidos</span>
              <span>Destaques</span>
            </div>
          </div>
          <div className="grid">
            {products.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </div>
      </section>

      <section className="section trust-band">
        <div className="container grid">
          <div className="trust-item">
            <ShieldCheck />
            <strong>Download protegido</strong>
            <span>Tokens temporarios e arquivos fora do publico.</span>
          </div>
          <div className="trust-item">
            <Zap />
            <strong>Checkout sem frete</strong>
            <span>Compra como visitante com nome e email.</span>
          </div>
          <div className="trust-item">
            <Sparkles />
            <strong>Admin completo</strong>
            <span>Produtos, categorias, pedidos e vendas.</span>
          </div>
        </div>
      </section>
    </main>
  );
}
