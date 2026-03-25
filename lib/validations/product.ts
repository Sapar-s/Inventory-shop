import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(2, { error: "Нэр хамгийн багадаа 2 тэмдэгт байна" }),
  description: z.string().optional(),
  price: z.coerce.number().positive({ error: "Үнэ 0-ээс их байх ёстой" }),
  categoryId: z.string().min(1, { error: "Ангилал сонгоно уу" }),
  initialQuantity: z.coerce
    .number()
    .int({ error: "Нөөц бүхэл тоо байх ёстой" })
    .min(0, { error: "Нөөц 0-ээс бага байж болохгүй" }),
});

export const updateProductSchema = z.object({
  name: z.string().min(2, { error: "Нэр хамгийн багадаа 2 тэмдэгт байна" }),
  description: z.string().optional(),
  price: z.coerce.number().positive({ error: "Үнэ 0-ээс их байх ёстой" }),
  categoryId: z.string().min(1, { error: "Ангилал сонгоно уу" }),
});

export const inventorySchema = z.object({
  productId: z.string().min(1, { error: "Product ID дутуу байна" }),
  type: z.enum(["add", "subtract"], { error: "Төрөл буруу байна" }),
  amount: z.coerce
    .number()
    .int({ error: "Тоо бүхэл байх ёстой" })
    .positive({ error: "Тоо 1-ээс их байх ёстой" }),
});
