# DonorSearchOrgWebApp

Этот проект представляет собой веб-приложение Telegram, которое использует Django в качестве бэкэнда (реализованного с использованием Django Rest Framework) и Vite.js в качестве фронтенда. Docker Compose используется для оркестрации трех контейнеров: Django, Vite и Nginx.
## Предварительные требования
- Docker
- Docker Compose
## Использование 
1. Клонируйте этот репозиторий:

```bash
git clone https://github.com/Angel367/hackathon2024-selectel.git
``` 
2. Перейдите в каталог проекта:

```bash
cd hackathon2024-selectel
``` 
3. Подключение SSL сертификата
<br>Для подключения SSL необходимо скопировать публичный и приватный ключи в папку certs
```bash
cp /path/to/your/cert.crt certs/cert.crt
cp /path/to/your/private.key certs/private.key
```
4. Изменение URL в nginx.conf
<br>В файле nginx.conf необходимо изменить URL `donorsearchorg.ru` на ваш домен
5. Запустите Docker Compose для сборки и запуска контейнеров:

```bash
docker-compose up --build -d
```
6. После запуска контейнеров вы можете получить доступ к приложению по адресу `http://localhost:8000`.
## Конфигурация Docker Compose

Файл `docker-compose.yml` определяет следующие сервисы: 
- **django** : сервис бэкэнда Django. 
- **vite** : сервис фронтенда Vite.js. 
- **nginx** : сервис Nginx, действующий как обратный прокси.
## Конфигурация Django
Бэкэнд Django настроен с использованием Django Rest Framework для обслуживания API веб-приложения Telegram. Файлы конфигурации для Django можно найти в каталоге `backend_api_app`.
## Конфигурация Vite

Vite.js используется в качестве средства сборки фронтенда для веб-приложения Telegram. Файлы конфигурации для Vite.js можно найти в каталоге `donor/frontend`.
## Конфигурация Nginx
nginx используется в качестве обратного прокси для бэкэнда Django и фронтенда Vite.js. Файлы конфигурации для nginx можно найти в каталоге `nginx`.
