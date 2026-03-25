import { prisma } from "@/lib/prisma";
import { updateInventory } from "@/app/actions/product-actions";
import Link from "next/link";

export default async function InventoryPage() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      inventory: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
          <Link href="/" className="text-sm text-blue-600">
            Буцах
          </Link>
        </div>

        <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="border-b bg-gray-100 text-left">
              <tr>
                <th className="px-4 text-gray-900 py-3">Нэр</th>
                <th className="px-4 text-gray-900 py-3">Ангилал</th>
                <th className="px-4 text-gray-900 py-3">Үлдэгдэл</th>
                <th className="px-4 text-gray-900 py-3">Төлөв</th>
                <th className="px-4 text-gray-900 py-3">Үйлдэл</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const quantity = product.inventory?.quantity ?? 0;
                const threshold = product.inventory?.lowStockThreshold ?? 5;
                const isOutOfStock = quantity === 0;
                const isLowStock = quantity > 0 && quantity <= threshold;

                return (
                  <tr key={product.id} className="border-b">
                    <td className="px-4 text-gray-500 py-3">{product.name}</td>
                    <td className="px-4 text-gray-500 py-3">
                      {product.category.name}
                    </td>
                    <td className="px-4 text-gray-500 py-3">{quantity}</td>
                    <td className="px-4 text-gray-500 py-3">
                      {isOutOfStock ? (
                        <span className="font-medium text-red-600">
                          Out of stock
                        </span>
                      ) : isLowStock ? (
                        <span className="font-medium text-orange-600">
                          Low stock
                        </span>
                      ) : (
                        <span className="font-medium text-green-600">
                          In stock
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <form
                          action={updateInventory}
                          className="flex items-center gap-2"
                        >
                          <input
                            type="hidden"
                            name="productId"
                            value={product.id}
                          />
                          <input type="hidden" name="type" value="add" />
                          <input
                            type="number"
                            name="amount"
                            min="1"
                            defaultValue={1}
                            className="w-16 text-gray-600 rounded border border-gray-300 px-2 py-1"
                          />
                          <button
                            type="submit"
                            className="rounded bg-green-600 px-3 py-1 text-white"
                          >
                            + Add
                          </button>
                        </form>

                        <form
                          action={updateInventory}
                          className="flex items-center gap-2"
                        >
                          <input
                            type="hidden"
                            name="productId"
                            value={product.id}
                          />
                          <input type="hidden" name="type" value="subtract" />
                          <input
                            type="number"
                            name="amount"
                            min="1"
                            defaultValue={1}
                            className="w-16 rounded text-gray-600 border border-gray-300 px-2 py-1"
                          />
                          <button
                            type="submit"
                            className="rounded bg-red-600 px-3 py-1 text-white"
                          >
                            - Subtract
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
