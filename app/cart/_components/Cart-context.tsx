"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  increaseQty: (id: string) => void;
  decreaseQty: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  total: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      if (typeof window === "undefined") return [];
      const stored = localStorage.getItem("cart-items");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart-items", JSON.stringify(items));
  }, [items]);

  const addToCart = (item: CartItem) => {
    setItems((prev) => {
      const found = prev.find((p) => p.id === item.id);

      if (found) {
        return prev.map((p) =>
          p.id === item.id
            ? {
                ...p,
                quantity: Math.min(p.quantity + 1, p.stock),
              }
            : p,
        );
      }

      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const increaseQty = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.min(item.quantity + 1, item.stock) }
          : item,
      ),
    );
  };

  const decreaseQty = (id: string) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setItems([]);

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        increaseQty,
        decreaseQty,
        removeItem,
        clearCart,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
