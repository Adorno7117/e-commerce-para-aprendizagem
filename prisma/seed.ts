import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/password";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@demo.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "Admin@123456";

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: process.env.ADMIN_NAME ?? "Administrador",
      email: adminEmail,
      passwordHash: await hashPassword(adminPassword),
      role: "ADMIN",
      emailVerifiedAt: new Date()
    }
  });

  const cursos = await prisma.category.upsert({
    where: { slug: "cursos" },
    update: {},
    create: {
      name: "Cursos",
      slug: "cursos",
      description: "Formacoes digitais para aprender e aplicar."
    }
  });

  const templates = await prisma.category.upsert({
    where: { slug: "templates" },
    update: {},
    create: {
      name: "Templates",
      slug: "templates",
      description: "Arquivos prontos para produtividade e design."
    }
  });

  const sistemas = await prisma.category.upsert({
    where: { slug: "sistemas" },
    update: {},
    create: {
      name: "Sistemas",
      slug: "sistemas",
      description: "Bases e sistemas baixaveis para acelerar projetos."
    }
  });

  await prisma.product.upsert({
    where: { slug: "curso-nextjs-commerce" },
    update: {},
    create: {
      name: "Curso Next.js Commerce",
      slug: "curso-nextjs-commerce",
      shortDescription: "Aprenda a criar lojas digitais modernas com Next.js.",
      description:
        "Um curso pratico com aulas, checklist de seguranca, exemplos de checkout, area do cliente e deploy. Inclui material complementar em PDF.",
      priceCents: 19990,
      imageUrl:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
      fileKey: "sample/curso-nextjs-commerce.txt",
      status: "ACTIVE",
      categoryId: cursos.id
    }
  });

  await prisma.product.upsert({
    where: { slug: "pack-templates-notion" },
    update: {},
    create: {
      name: "Pack Templates Notion",
      slug: "pack-templates-notion",
      shortDescription: "Modelos para projetos, estudos, financeiro e conteudo.",
      description:
        "Conjunto organizado com templates de Notion para planejamento, CRM pessoal, calendario editorial e acompanhamento de metas.",
      priceCents: 4990,
      imageUrl:
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80",
      fileKey: "sample/pack-templates-notion.txt",
      status: "ACTIVE",
      categoryId: templates.id
    }
  });

  await prisma.product.upsert({
    where: { slug: "sistema-dashboard-saas" },
    update: {},
    create: {
      name: "Sistema Dashboard SaaS",
      slug: "sistema-dashboard-saas",
      shortDescription: "Base administrativa responsiva com metricas e usuarios.",
      description:
        "Projeto inicial para SaaS com dashboard, tabelas, modais, autenticacao e padrao visual profissional para evoluir em producao.",
      priceCents: 29990,
      imageUrl:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
      fileKey: "sample/sistema-dashboard-saas.txt",
      status: "ACTIVE",
      categoryId: sistemas.id
    }
  });

  await prisma.coupon.upsert({
    where: { code: "BEMVINDO10" },
    update: {},
    create: {
      code: "BEMVINDO10",
      description: "10% de desconto para primeira compra.",
      percentOff: 10,
      active: true
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
