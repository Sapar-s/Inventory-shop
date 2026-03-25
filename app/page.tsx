import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteProduct } from "@/app/actions/product-actions";
import AddToCartButton from "./_components/Add-to-cart-button";

type HomePageProps = {
  searchParams: Promise<{
    search?: string;
    category?: string;
    page?: string;
  }>;
};

const PAGE_SIZE = 6;

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;

  const search = params.search?.trim() || "";
  const category = params.category || "";
  const currentPage = Number(params.page || "1");

  const where = {
    ...(search
      ? {
          name: {
            contains: search,
            mode: "insensitive" as const,
          },
        }
      : {}),
    ...(category
      ? {
          categoryId: category,
        }
      : {}),
  };

  const [products, categories, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        inventory: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return (
    <main className="min-h-screen bg-gray-50 p-6 text-gray-900">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Product Inventory Shop
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Бүтээгдэхүүний жагсаалт
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/products/new"
              className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
            >
              Product нэмэх
            </Link>
            <Link
              href="/inventory"
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700"
            >
              Inventory
            </Link>
            <Link
              href="/cart"
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700"
            >
              Cart
            </Link>
          </div>
        </div>

        <form className="mb-6 grid gap-4 rounded-2xl bg-white p-4 shadow-sm md:grid-cols-3">
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Нэрээр хайх..."
            className="rounded-lg border border-gray-300 px-4 py-2 outline-none"
          />

          <select
            key={category || "all-categories"}
            name="category"
            defaultValue={category}
            className="rounded-lg border border-gray-300 px-4 py-2 outline-none"
          >
            {" "}
            <option value="">Бүх ангилал</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded-lg cursor-pointer bg-black px-4 py-2 text-sm font-medium text-white"
            >
              Шүүх
            </button>

            <Link
              href="/"
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700"
            >
              Цэвэрлэх
            </Link>
          </div>
        </form>

        {products.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
            Бүтээгдэхүүн олдсонгүй
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const quantity = product.inventory?.quantity ?? 0;
              const threshold = product.inventory?.lowStockThreshold ?? 5;
              const isOutOfStock = quantity === 0;
              const isLowStock = quantity > 0 && quantity <= threshold;

              return (
                <div
                  key={product.id}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        {product.name}
                      </h2>
                      <p className="mt-1 text-sm text-gray-500">
                        {product.category.name}
                      </p>
                    </div>

                    <Link
                      href={`/products/${product.id}/edit`}
                      className="text-sm font-medium text-blue-600"
                    >
                      Edit
                    </Link>
                  </div>

                  <p className="mb-3 text-sm text-gray-600">
                    {product.description || "Тайлбар байхгүй"}
                  </p>

                  <p className="mb-2 text-lg font-bold text-gray-900">
                    ₮{Number(product.price).toLocaleString()}
                  </p>

                  <div className="mb-4 space-y-1 text-sm">
                    <p className="text-gray-700">Үлдэгдэл: {quantity}</p>

                    {isOutOfStock && (
                      <p className="font-medium text-red-600">Out of stock</p>
                    )}

                    {isLowStock && (
                      <p className="font-medium text-orange-600">Low stock</p>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <AddToCartButton
                      id={product.id}
                      name={product.name}
                      price={Number(product.price)}
                      stock={quantity}
                      disabled={isOutOfStock}
                    />

                    <form action={deleteProduct}>
                      <input
                        type="hidden"
                        name="productId"
                        value={product.id}
                      />
                      <button
                        type="submit"
                        className="rounded-lg cursor-pointer border border-red-300 px-4 py-2 text-sm font-medium text-red-600"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-8 flex items-center justify-center gap-2">
          <Link
            href={`/?search=${search}&category=${category}&page=${Math.max(
              currentPage - 1,
              1,
            )}`}
            className={`rounded-lg border px-4 py-2 text-sm ${
              currentPage === 1
                ? "pointer-events-none border-gray-200 text-gray-400"
                : "border-gray-300 bg-white text-gray-700"
            }`}
          >
            Өмнөх
          </Link>

          <span className="text-sm text-gray-600">
            {currentPage} / {totalPages}
          </span>

          <Link
            href={`/?search=${search}&category=${category}&page=${Math.min(
              currentPage + 1,
              totalPages,
            )}`}
            className={`rounded-lg border px-4 py-2 text-sm ${
              currentPage === totalPages
                ? "pointer-events-none border-gray-200 text-gray-400"
                : "border-gray-300 bg-white text-gray-700"
            }`}
          >
            Дараах
          </Link>
        </div>
      </div>
    </main>
  );
}
