import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createProduct } from "@/app/actions/product-actions";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Шинэ бүтээгдэхүүн нэмэх
          </h1>
          <Link href="/" className="text-sm text-blue-600">
            Буцах
          </Link>
        </div>

        <form
          action={createProduct}
          className="space-y-5 rounded-2xl bg-white p-6 shadow-sm"
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Нэр
            </label>
            <input
              name="name"
              type="text"
              required
              className="w-full rounded-lg border text-black border-gray-300 px-4 py-2 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Тайлбар
            </label>
            <textarea
              name="description"
              rows={4}
              className="w-full rounded-lg border text-black border-gray-300 px-4 py-2 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Үнэ
            </label>
            <input
              name="price"
              type="number"
              min="1"
              required
              className="w-full rounded-lg border text-black border-gray-300 px-4 py-2 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Ангилал
            </label>
            <select
              name="categoryId"
              required
              className="w-full rounded-lg border text-black border-gray-300 px-4 py-2 outline-none"
            >
              <option value="">Сонгох</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Эхний нөөцийн тоо
            </label>
            <input
              name="initialQuantity"
              type="number"
              min="0"
              required
              className="w-full rounded-lg text-black border border-gray-300 px-4 py-2 outline-none"
            />
          </div>

          <button
            type="submit"
            className="rounded-lg cursor-pointer bg-black px-5 py-2 text-sm font-medium text-white"
          >
            Хадгалах
          </button>
        </form>
      </div>
    </main>
  );
}
