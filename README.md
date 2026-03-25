# Product & Inventory Management App

Next.js 16 + Prisma + PostgreSQL ашигласан fullstack веб апп.

## 🚀 Features (Гол боломжууд)

- Product CRUD (Create, Read, Update, Delete) — Бүтээгдэхүүн нэмэх, харах, засах, устгах
- Search by product name — Нэрээр хайх
- Filter by category — Ангиллаар шүүх
- Pagination — Хуудаслах
- Inventory management (+ / - stock) — Нөөц нэмэх, хасах
- Low stock / Out of stock indicator — Нөөц бага болон дууссан төлөв
- Cart (client-side using localStorage) — Сагс (localStorage ашигласан)
- Checkout (inventory deduction with transaction) — Захиалга хийхэд нөөцөөс хасна

## 🧱 Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- PostgreSQL (Neon)
- Prisma ORM
- Tailwind CSS

## 🏗️ Architecture (Бүтэц)

- **Server Components** → Database-аас data авах (fetch)
- **Server Actions** → Create, Update, Delete, Checkout logic
- **Cart** → Client-side state (localStorage ашигласан)

👉 Энэ аргыг сонгосон шалтгаан:

- API route бичих шаардлага багасна
- Form-based үйлдлүүдийг (create/update/delete) илүү амар хийдэг

## ⚙️ Setup

```bash
npm install
```

## 🔐 Environment Variables

Project root дээр `.env` файл үүсгэнэ:

```env
DATABASE_URL="your_database_url"
```

## 🗄️ Database

Migration ажиллуулах:

```bash
npx prisma migrate dev --name init
```

Seed data оруулах:

```bash
npx prisma db seed
```

## ▶️ Run Project

```bash
npm run dev
```

Browser дээр нээх:

http://localhost:3000

## 🌐 Live Demo

https://inventory-shop-six.vercel.app/

## 📝 Notes

- Cart нь database-д хадгалагдахгүй (design-аар тийм)
- Checkout хийх үед Prisma transaction ашиглаж data consistency хадгалсан
- Inventory 0-ээс доош болохгүй
