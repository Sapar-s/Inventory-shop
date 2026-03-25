"use server";

import { prisma } from "@/lib/prisma";

type CheckoutItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
};

export async function checkoutOrder(items: CheckoutItem[]) {
  if (!items.length) {
    throw new Error("Сагс хоосон байна");
  }

  await prisma.$transaction(async (tx) => {
    for (const item of items) {
      const inventory = await tx.inventory.findUnique({
        where: {
          productId: item.id,
        },
      });

      if (!inventory) {
        throw new Error(`${item.name} - inventory олдсонгүй`);
      }

      if (inventory.quantity < item.quantity) {
        throw new Error(`${item.name} - нөөц хүрэлцэхгүй байна`);
      }

      await tx.inventory.update({
        where: {
          productId: item.id,
        },
        data: {
          quantity: inventory.quantity - item.quantity,
        },
      });
    }
  });

  return { success: true };
}
