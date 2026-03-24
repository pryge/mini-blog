# Mini-Blog 📝

## 🛠 Технологічний стек

### Frontend

- **Next.js 15** (App Router)
- **Tailwind CSS** (Styling)
- **Axios** (API requests)
- **Date-fns** (Formatting dates)

### Backend

- **Node.js & Express**
- **SQLite** (Database)
- **Prisma** (ORM)
- **JWT** (Authentication)
- **Zod** (Schema validation)

## 📦 Встановлення та запуск

### 1. Клонування репозиторію

```bash
git clone https://github.com/pryge/mini-blog.git
cd mini-blog
```

### 2. Налаштування Бекенду

```bash
cd backend
npm install
```

Створіть файл `.env` у папці `backend` та додайте:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your_super_secret_key"
PORT=5001
```

Запустіть міграції бази даних:

```bash
npx prisma db push
```

Запустіть сервер:

```bash
npm run dev
```

### 3. Налаштування Фронтенду

Відкрийте нове вікно терміналу:

```bash
cd frontend
npm install
npm run dev
```

Тепер додаток доступний за адресою `http://localhost:3000`.

## 📁 Структура проекту

- `/backend` — API сервер, логіка авторизації та робота з БД.
- `/frontend` — Клієнтська частина, компоненти та сторінки.
- `/frontend/components` — Перевикористовувані UI компоненти (`PostCard`, `AdminPostModal` тощо).

---

