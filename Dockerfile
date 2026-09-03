# syntax=docker/dockerfile:1

FROM node:22-bookworm-slim AS assets

WORKDIR /repo

COPY frontend/package.json frontend/package-lock.json ./frontend/
COPY admin/package.json admin/package-lock.json ./admin/
COPY backend/public/index.php backend/public/.htaccess ./backend/public/

WORKDIR /repo/frontend
RUN npm ci
COPY frontend ./
RUN VITE_API_URL=/api npm run build

WORKDIR /repo/admin
RUN npm ci
COPY admin ./
RUN VITE_API_URL=/api VITE_ADMIN_BASE=/admin/ npm run build

WORKDIR /repo
COPY scripts ./scripts
COPY backend ./backend
RUN node scripts/copy-to-public.mjs


FROM composer:2 AS vendor

WORKDIR /app

COPY backend/composer.json backend/composer.lock ./
RUN composer install \
    --no-dev \
    --no-interaction \
    --no-scripts \
    --prefer-dist \
    --optimize-autoloader

COPY backend .
RUN composer dump-autoload --optimize --no-dev


FROM php:8.3-fpm-bookworm AS app

RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev \
    libzip-dev \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    libicu-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j"$(nproc)" \
        pdo_pgsql \
        pgsql \
        mbstring \
        zip \
        gd \
        intl \
        opcache \
        bcmath \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

COPY --from=vendor /app /var/www/html
COPY --from=assets /repo/backend/public ./public

COPY deploy/docker/php.ini /usr/local/etc/php/conf.d/99-app.ini
COPY deploy/docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh \
    && mkdir -p storage/framework/{cache,sessions,views} storage/logs bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache

EXPOSE 9000

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["php-fpm", "-F"]


FROM nginx:1.27-alpine AS web

COPY --from=app /var/www/html/public /var/www/html/public
COPY deploy/docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
