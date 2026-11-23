import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const menus = [
    { name: "Es Kopi Susu", description: "Espresso, susu, dan gula aren", price: 18000, category: "Coffee" },
    { name: "Americano", description: "Espresso dengan air pilihan", price: 15000, category: "Coffee" },
    { name: "Cafe Latte", description: "Espresso dan steamed milk", price: 20000, category: "Coffee" },
    { name: "Caramel Latte", description: "Latte dengan sentuhan karamel", price: 23000, category: "Coffee" },
    { name: "Chocolate", description: "Cokelat creamy", price: 20000, category: "Non Coffee" },
    { name: "Matcha Latte", description: "Matcha dan susu", price: 22000, category: "Non Coffee" }
  ];
  for (const menu of menus) {
    await prisma.menu.upsert({
      where: { id: `seed-${menu.name.toLowerCase().replaceAll(" ", "-")}` },
      update: menu,
      create: { id: `seed-${menu.name.toLowerCase().replaceAll(" ", "-")}`, ...menu }
    });
  }
}
main().finally(() => prisma.$disconnect());