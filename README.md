# Cooking — Магазин рецептов

**Современное fullstack-приложение для поиска, хранения и управления рецептами.**

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?logo=redis&logoColor=white)
![Capacitor](https://img.shields.io/badge/Capacitor-119EFF?logo=capacitor&logoColor=white)

## О проекте

**Cooking** — это удобный «магазин рецептов», где пользователи могут искать блюда по ингредиентам и тегам, сохранять любимые рецепты и получать умные рекомендации.

Приложение реализовано как **веб-сайт + Android-приложение** (через Capacitor) с единой кодовой базой на фронтенде.

### Основные возможности

-  **Умный полнотекстовый поиск** по названию, ингредиентам и тегам (PostgreSQL + trigram индексы)
-  Гибкая система тегов и фильтров
-  Авторизация через сессии (хранятся в Redis)
-  Сохранение любимых рецептов
-  **PWA + нативное Android-приложение** на базе Capacitor
-  Современный чистый дизайн (собственный дизайн-система в Lunacy + shadcn/ui)

## Архитектура и технологии

### Backend

- **FastAPI** (Python 3.11+)
- **DDD (Domain-Driven Design)** — чистая архитектура, разделение на домены, application и infrastructure
- **FastAdmin** — удобная административная панель
- **PostgreSQL** + **pg_trgm** расширение для умного поиска
- **Redis** — кэширование сессий и часто используемых данных
- Асинхронный стек (async/await)

### Frontend

- **React** + TypeScript
- **shadcn/ui** + **Tailwind CSS**
- Собственная дизайн-система, созданная в **Lunacy**
- Capacitor — для сборки нативного Android-приложения

### Общее

- Единая авторизация между веб и мобильной версией
- REST API с четкой структурой и документацией (OpenAPI)
- Адаптивный интерфейс (мобильный-first)

## Скриншоты

![Главная страница](assets/main.png)
![Корзина](assets/basket.png)
![Аутентификация](assets/auth.png)
![Поиск](assets/recipe_list.png)
![Предложение](assets/offer.png)
![Бесплатные рецепты](assets/free_recipes_on_main_page.png)

## Как запустить проект локально

### Требования
- Docker (рекомендуется)
- Node.js 20+
- Python 3.11+
- PostgreSQL + Redis (или через Docker Compose)

### Запуск

```bash
# Клонирование
git clone https://github.com/Arseniy-B/Cooking
cd cooking

# Запуск backend
cd backend
source .venv/bin/activate
uvicorn src.main:app --reload

# Запуск frontend
cd ../frontend
npm install
npm run dev
