import { readSession } from "@/lib/auth";
import { getCart } from "@/server/services/cart.service";
import { CartClient } from "@/components/CartClient";

export default async function CartPage() {
  const session = await readSession();
  const cart = await getCart(session);

  return (
    <main className="section">
      <div className="container">
        <CartClient
          initialItems={cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            product: {
              name: item.product.name,
              slug: item.product.slug,
              priceCents: item.product.priceCents,
              imageUrl: item.product.imageUrl
            }
          }))}
          initialTotal={cart.totalCents}
        />
      </div>
    </main>
  );
}
