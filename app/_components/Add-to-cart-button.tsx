"use client";

import { toast } from "sonner";
import { useCart } from "../cart/_components/Cart-context";

type Props = {
  id: string;
  name: string;
  price: number;
  stock: number;
  disabled: boolean;
};

export default function AddToCartButton({
  id,
  name,
  price,
  stock,
  disabled,
}: Props) {
  const { addToCart } = useCart();

  return (
    <button
      disabled={disabled}
      onClick={() => {
        addToCart({
          id,
          name,
          price,
          quantity: 1,
          stock,
        });

        toast.success(`${name} сагсанд нэмэгдлээ`);
      }}
      className="rounded-lg cursor-pointer bg-black px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-gray-300"
    >
      Add to cart
    </button>
  );
}
