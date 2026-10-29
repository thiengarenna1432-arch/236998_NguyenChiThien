# Hệ thống quản lý món ăn

Ứng dụng quản lý món ăn Việt Nam, gồm backend cung cấp API CRUD và frontend React
hiển thị, tìm kiếm, thêm, sửa và xóa món ăn.

## Công nghệ

- Backend: Node.js, Express, Mongoose và MongoDB Atlas
- Frontend: Vite và React
- Triển khai: Docker và Render

## Cấu trúc dự án

```text
.
├── backend/
└── frontend/
```

## Chạy local

### Backend

```powershell
cd backend
npm install
Copy-Item .env.example .env
# Điền MONGODB_URI trong backend/.env
npm run seed
npm start
```

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

Khi phát triển, frontend gọi API bằng đường dẫn tương đối `/api/foods`. Có thể
đổi địa chỉ backend bằng biến môi trường `BACKEND_URL` khi chạy frontend.
Frontend dev server mặc định chạy tại `http://localhost:5173` và proxy các
request `/api` tới `http://127.0.0.1:5000`.

## Docker

### Chạy backend bằng Docker

```powershell
docker build --platform linux/amd64 -t thien007/backend:latest ./backend
docker run -d --name food-backend -p 5000:5000 --env-file backend/.env thien007/backend:latest
docker push thien007/backend:latest
```

Image: https://hub.docker.com/r/thien007/backend

### Chạy frontend bằng Docker

```powershell
docker build --platform linux/amd64 -t thien007/frontend:latest ./frontend
docker run -d --name food-frontend -p 3000:80 -e BACKEND_URL=http://host.docker.internal:5000 thien007/frontend:latest
docker push thien007/frontend:latest
```

Image: https://hub.docker.com/r/thien007/frontend

`BACKEND_URL` là địa chỉ backend mà nginx dùng để chuyển tiếp các request
`/api/`. Khi chạy local bằng Docker, giá trị mặc định là
`http://host.docker.internal:5000`; khi triển khai, đặt biến này thành URL
backend public, không có dấu `/` ở cuối.

## Triển khai

### Frontend đã triển khai

- URL: https://web-236998.onrender.com
- Image: `thien007/frontend:latest`
- Tên dịch vụ: `web-236998`
- Biến môi trường: `BACKEND_URL` trỏ tới URL backend public, không có dấu `/`
  ở cuối.

### Backend API đã triển khai

- URL: https://api-236998.onrender.com
- Image: `thien007/backend:latest`
- Tên dịch vụ: `api-236998`
- Health check: `/health`
- API món ăn: `/api/foods`
- Biến môi trường: `MONGODB_URI`, `CORS_ORIGIN`

## Thông tin nộp bài

| Trường | Giá trị |
|---|---|
| Link_GitHub | https://github.com/thiengarenna1432-arch/236998_NguyenChiThien |
| Link_Docker_Backend | https://hub.docker.com/r/thien007/backend |
| Link_Docker_Frontend | https://hub.docker.com/r/thien007/frontend |
| Link_Render_App | https://web-236998.onrender.com |
| Link_Render_API | https://api-236998.onrender.com/api/foods |
| Link_Data_MongoDB | Cluster `cluster0.th5lv97.mongodb.net`, database `236998_NguyenChiThien`, collection `foods` |
