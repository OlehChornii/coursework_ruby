# Pet Marketplace (Production guide)

Огляд
- Розділено на дві частини: бекенд (Rails API) в `pet_marketplace_api/` та клієнт (React) в `client/`.
- Це Readme фокусується на кроках для production: збірка, докерізація та деплой. Тести і test-артефакти не включені тут.

Швидкий старт (локально production-like)

1) Бекенд (Rails)
- Перейти в каталог бекенду:
  ```bash
  cd pet_marketplace_api
  ```
- Встановити ruby gems:
  ```bash
  bundle install --without development test
  ```
- Налаштувати змінні оточення (приклад):
  - `DATABASE_URL` або `config/database.yml` налаштовано для production DB
  - `RAILS_ENV=production`
  - `SECRET_KEY_BASE` (згенерувати `rails secret`)
  - `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY` (якщо використовуєте Stripe)
- Міграції і підготовка бази:
  ```bash
  RAILS_ENV=production rails db:create db:migrate
  ```
- Якщо потрібна precompile assets (для asset pipeline):
  ```bash
  RAILS_ENV=production rails assets:precompile
  ```

2) Клієнт (React)
- Перейти в каталог клієнта:
  ```bash
  cd client
  ```
- Встановити залежності і зібрати production-ресурси:
  ```bash
  npm ci
  npm run build
  ```
- Вариант докер-збірки (використовуючи `client/Dockerfile`):
  ```bash
  docker build -t pet-marketplace-client:prod ./client
  docker run -p 8080:80 pet-marketplace-client:prod
  ```

Docker / докер-композиція (приклад)
- Ви можете створити `docker-compose.yml`, щоб запустити бекенд (Rails + DB) та клієнт (nginx) разом. Загальна ідея:
  - backend: збірка образу Rails або використання існуючого `Dockerfile` у корені
  - client: використовувати `client/Dockerfile` для статичного сервера

Видалення/іґнорування тестів при коміті
- Якщо потрібно зробити коміт тільки з production-файлів, не включаючи тести, використайте послідовність:
  ```bash
  # створити нову гілку для production-змін
  git checkout -b production-prepare

  # додати всі файли
  git add -A

  # прибрати з індексу тестові файли (не включати у коміт)
  git reset -q HEAD -- client/src/**/*.test.* spec/ test/ || true

  # перевірити статус і створити коміт
  git status --porcelain
  git commit -m "chore: prepare production files (exclude tests)"
  git push origin production-prepare
  ```

Примітки по безпеці
- Не зберігайте секрети у репозиторії. Використовуйте змінні оточення, секретні менеджери або GitHub Secrets для CI/CD.

Пара порад для GitHub
- Додайте GitHub Actions workflow (CI) тільки для production build & deploy (без запуску тестів, якщо це дійсно вимога). Приклад job: `build-client` (npm ci && npm run build) та `build-backend` (bundle install && assets:precompile).

Файли, які я додав/оновив
- `.gitignore` — для ігнорування тестів, node_modules, логів, tmp та секретів.
- `client/Dockerfile` — multi-stage Dockerfile для збирання React та подачі через nginx.

Якщо хочете — я можу:
- додати `docker-compose.yml` приклад;
- створити простий GitHub Actions workflow для production build (без тестів);
- або підготувати clean commit (видалити тести з індексу та закомітити) — скажіть, чи ви хочете, щоб я автоматично видалив тест-файли з репо, або лише ігнорувати їх у коміті.

***
Автор: Репозиторій підготовлено для production — інструкції і Docker-ready клієнт.
***
