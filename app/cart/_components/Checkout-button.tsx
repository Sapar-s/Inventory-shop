"use client";

import { useTransition, useState } from "react";
import { checkoutOrder } from "@/app/actions/order-actions";
import { useRouter } from "next/navigation";
import { useCart } from "./Cart-context";
import { toast } from "sonner";

export default function CheckoutButton() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleCheckout = () => {
    setError("");

    startTransition(async () => {
      try {
        await checkoutOrder(items);
        clearCart();
        toast.success("Захиалга амжилттай боллоо");
        router.push("/");
        router.refresh();
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Алдаа гарлаа");
        }
      }
    });
  };

  return (
    <div className="mt-4">
      <button
        onClick={handleCheckout}
        disabled={pending || items.length === 0}
        className="rounded-lg bg-black px-5 py-2 cursor-pointer text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        {pending ? "Захиалж байна..." : "Захиалах"}
      </button>

      {error && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
