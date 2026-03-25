"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createProductSchema,
  inventorySchema,
  updateProductSchema,
} from "@/lib/validations/product";

export async function createProduct(formData: FormData) {
  const parsed = createProductSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") || "",
    price: formData.get("price"),
    categoryId: formData.get("categoryId"),
    initialQuantity: formData.get("initialQuantity"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || "Validation алдаа");
  }

  const { name, description, price, categoryId, initialQuantity } = parsed.data;

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price,
      categoryId,
    },
  });

  await prisma.inventory.create({
    data: {
      productId: product.id,
      quantity: initialQuantity,
      lowStockThreshold: 5,
    },
  });

  redirect("/");
}

export async function deleteProduct(formData: FormData) {
  const productId = String(formData.get("productId") || "");

  if (!productId) {
    throw new Error("Product ID олдсонгүй");
  }

  await prisma.inventory.deleteMany({
    where: { productId },
  });

  await prisma.product.delete({
    where: { id: productId },
  });

  revalidatePath("/");
  revalidatePath("/inventory");
}

export async function updateProduct(productId: string, formData: FormData) {
  const parsed = updateProductSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") || "",
    price: formData.get("price"),
    categoryId: formData.get("categoryId"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || "Validation алдаа");
  }

  const { name, description, price, categoryId } = parsed.data;

  await prisma.product.update({
    where: { id: productId },
    data: {
      name,
      description,
      price,
      categoryId,
    },
  });

  revalidatePath("/");
  revalidatePath("/inventory");
  redirect("/");
}

export async function updateInventory(formData: FormData) {
  const parsed = inventorySchema.safeParse({
    productId: formData.get("productId"),
    type: formData.get("type"),
    amount: formData.get("amount"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || "Validation алдаа");
  }

  const { productId, type, amount } = parsed.data;

  const inventory = await prisma.inventory.findUnique({
    where: { productId },
  });

  if (!inventory) {
    throw new Error("Inventory олдсонгүй");
  }

  const newQuantity =
    type === "add" ? inventory.quantity + amount : inventory.quantity - amount;

  if (newQuantity < 0) {
    throw new Error("Нөөц 0-ээс доош байж болохгүй");
  }

  await prisma.inventory.update({
    where: { productId },
    data: { quantity: newQuantity },
  });

  revalidatePath("/");
  revalidatePath("/inventory");
}
