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

## Docker

(cập nhật sau)

## Triển khai

(cập nhật sau)
