"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function SearchInput() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [value, setValue] = useState(searchParams.get("search") ?? "");

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (value.trim()) {
        params.set("search", value.trim());
      } else {
        params.delete("search");
      }

      params.set("page", "1");
      router.replace(`${pathname}?${params.toString()}`);
    }, 300);

    return () => clearTimeout(timer);
  }, [value, pathname, router, searchParams]);

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Нэрээр хайх..."
      className="rounded-lg border border-gray-300 px-4 py-2 outline-none"
    />
  );
}
