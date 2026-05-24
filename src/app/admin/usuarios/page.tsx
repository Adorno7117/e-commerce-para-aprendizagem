import { prisma } from "@/lib/prisma";
import { dateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orders: true } } }
  });

  return (
    <>
      <div>
        <span className="eyebrow">Admin</span>
        <h1>Usuarios</h1>
      </div>
      <section className="panel table-wrap">
        <table>
          <thead><tr><th>Nome</th><th>Email</th><th>Perfil</th><th>Pedidos</th><th>Criado</th></tr></thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user._count.orders}</td>
                <td>{dateTime(user.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
