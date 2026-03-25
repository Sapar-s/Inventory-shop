"use client";

import { CartProvider } from "./cart/_components/Cart-context";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
