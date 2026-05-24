import Link from "next/link";
import { Product, Category } from "@prisma/client";
import { money } from "@/lib/format";
import { AddToCartButton } from "@/components/AddToCartButton";

type ProductWithCategory = Product & { category: Category };

export function ProductCard({ product }: { product: ProductWithCategory }) {
  return (
    <article className="card product-card">
      <img src={product.imageUrl} alt={product.name} />
      <div className="card-body stack">
        <span className="pill">{product.category.name}</span>
        <div>
          <h3>{product.name}</h3>
          <p className="meta">{product.shortDescription}</p>
        </div>
        <div className="row">
          <span className="price">{money(product.priceCents)}</span>
          <Link href={`/produtos/${product.slug}`}>Detalhes</Link>
        </div>
        <AddToCartButton productId={product.id} />
      </div>
    </article>
  );
}
