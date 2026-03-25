import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.inventory.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const electronics = await prisma.category.create({
    data: { name: "Электроник" },
  });

  const clothing = await prisma.category.create({
    data: { name: "Хувцас" },
  });

  const products = [
    {
      name: "iPhone 14",
      price: new Prisma.Decimal(3200000),
      description: "Apple ухаалаг утас",
      categoryId: electronics.id,
      quantity: 10,
      lowStockThreshold: 5,
    },
    {
      name: "Bluetooth Headphone",
      price: new Prisma.Decimal(280000),
      description: "Утасгүй чихэвч",
      categoryId: electronics.id,
      quantity: 2,
      lowStockThreshold: 5,
    },
    {
      name: "Gaming Mouse",
      price: new Prisma.Decimal(120000),
      description: "Тоглоомын хулгана",
      categoryId: electronics.id,
      quantity: 0,
      lowStockThreshold: 3,
    },
    {
      name: "Хар футболка",
      price: new Prisma.Decimal(45000),
      description: "Энгийн хар футболка",
      categoryId: clothing.id,
      quantity: 20,
      lowStockThreshold: 5,
    },
    {
      name: "Цагаан цамц",
      price: new Prisma.Decimal(89000),
      description: "Оффис цамц",
      categoryId: clothing.id,
      quantity: 4,
      lowStockThreshold: 5,
    },
    {
      name: "Жинсэн өмд",
      price: new Prisma.Decimal(110000),
      description: "Хөх жинсэн өмд",
      categoryId: clothing.id,
      quantity: 7,
      lowStockThreshold: 5,
    },
  ];

  for (const item of products) {
    const product = await prisma.product.create({
      data: {
        name: item.name,
        price: item.price,
        description: item.description,
        categoryId: item.categoryId,
      },
    });

    await prisma.inventory.create({
      data: {
        productId: product.id,
        quantity: item.quantity,
        lowStockThreshold: item.lowStockThreshold,
      },
    });
  }
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
