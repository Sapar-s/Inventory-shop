"use client";

import Link from "next/link";
import { useCart } from "./_components/Cart-context";
import CheckoutButton from "./_components/Checkout-button";

export default function CartPage() {
  const { items, increaseQty, decreaseQty, removeItem, total } = useCart();

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Cart</h1>
          <Link href="/" className="text-sm text-blue-600">
            Буцах
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <p className="text-gray-500">Сагс хоосон байна</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="rounded-2xl bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg text-gray-900 font-semibold">
                      {item.name}
                    </h2>
                    <p className="text-sm  text-gray-500">
                      ₮{item.price.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => decreaseQty(item.id)}
                      className="rounded cursor-pointer text-gray-400 border px-3 py-1"
                    >
                      -
                    </button>
                    <span className="text-gray-900">{item.quantity}</span>
                    <button
                      onClick={() => increaseQty(item.id)}
                      className="rounded cursor-pointer text-gray-400 border px-3 py-1"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-gray-600">
                      ₮{(item.price * item.quantity).toLocaleString()}
                    </p>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="mt-2 cursor-pointer text-sm text-red-600"
                    >
                      Устгах
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-lg text-black font-bold">
                Нийт: ₮{total.toLocaleString()}
              </p>
              <CheckoutButton />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
