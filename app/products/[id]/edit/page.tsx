import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { updateProduct } from "@/app/actions/product-actions";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      inventory: true,
    },
  });

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  if (!product) {
    return (
      <main className="p-6">
        <p>Бүтээгдэхүүн олдсонгүй</p>
      </main>
    );
  }

  const updateProductWithId = updateProduct.bind(null, product.id);

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Бүтээгдэхүүн засах
          </h1>
          <Link href="/" className="text-sm text-blue-600">
            Буцах
          </Link>
        </div>

        <form
          action={updateProductWithId}
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
              defaultValue={product.name}
              className="w-full rounded-lg text-black border border-gray-300 px-4 py-2 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Тайлбар
            </label>
            <textarea
              name="description"
              rows={4}
              defaultValue={product.description ?? ""}
              className="w-full rounded-lg  text-black border border-gray-300 px-4 py-2 outline-none"
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
              defaultValue={Number(product.price)}
              className="w-full  text-black rounded-lg border border-gray-300 px-4 py-2 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Ангилал
            </label>
            <select
              name="categoryId"
              required
              defaultValue={product.categoryId}
              className="w-full text-black rounded-lg border border-gray-300 px-4 py-2 outline-none"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="rounded-lg bg-black px-5 py-2 text-sm font-medium text-white"
          >
            Хадгалах
          </button>
        </form>
      </div>
    </main>
  );
}
