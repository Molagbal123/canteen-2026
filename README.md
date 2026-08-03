# Cafeteria Ordering System

Ứng dụng đặt món canteen gồm React/Vite ở `client` và Express/MySQL ở `server`. Hệ thống hỗ trợ khách hàng đặt món, theo dõi đơn theo thời gian thực và khu vực quản trị cho món ăn, đơn hàng, doanh thu.

## Công nghệ

- React 19, React Router, Axios, Socket.IO Client và CSS Modules
- Express, Sequelize, MySQL, Socket.IO, JWT và Cloudinary
- Access token chỉ được giữ trong bộ nhớ; refresh token dùng cookie `HttpOnly`
- Migration có lịch sử trong bảng `schema_migrations`

## Chạy local

Yêu cầu Node.js và một database MySQL đã được tạo sẵn.

```powershell
Set-Location server
npm install
npm run migrate
npm run seed
npm run dev
```

Mở terminal thứ hai:

```powershell
Set-Location client
npm install
npm run dev
```

Frontend mặc định chạy tại `http://localhost:5173`, API và Socket.IO chạy tại `http://localhost:5000`.

Trước khi chạy, tự tạo `server/.env` với các biến database, JWT, Cloudinary và CORS cần thiết. Frontend có thể dùng giá trị local mặc định hoặc khai báo `client/.env` với `VITE_API_URL`, `VITE_REALTIME_URL` và `VITE_ASSET_URL`. Hai file `.env` đều bị Git bỏ qua.

`npm run seed` không xóa dữ liệu hiện có. Chỉ dùng `SEED_RESET=true` khi chủ động muốn xóa dữ liệu ứng dụng trước khi seed:

```powershell
$env:SEED_RESET='true'; npm run seed
```

## Realtime

Socket được xác thực bằng JWT nếu người dùng đã đăng nhập. Server tự gán room `user:{id}` và `admins`; client không được tự chọn room.

Các sự kiện chính:

- `order:created`: có đơn mới
- `order:status-updated`: trạng thái đơn thay đổi
- `food:changed`: thực đơn thay đổi
- `dashboard:changed`: dữ liệu dashboard cần đồng bộ lại

REST vẫn là nguồn dữ liệu chính. Sau khi Socket.IO reconnect, client gọi lại REST để lấy trạng thái đầy đủ và tránh mất sự kiện.

## Luồng trạng thái đơn

```text
pending -> cooking -> delivering -> done
```

Backend không cho bỏ qua bước hoặc chuyển ngược trạng thái. Doanh thu chỉ tính các đơn `done`.

## Kiểm tra

```powershell
Set-Location server
npm test

Set-Location ../client
npm run lint
npm run build
```

## Triển khai

- Khai báo `CLIENT_URL` bằng danh sách origin frontend, phân tách bởi dấu phẩy.
- Khai báo `VITE_API_URL`, `VITE_REALTIME_URL` và `VITE_ASSET_URL` khi build frontend.
- Nếu frontend và API khác site, đặt `COOKIE_SAME_SITE=none` và `COOKIE_SECURE=true`; cả hai phải dùng HTTPS.
- Chạy `npm run migrate` trước khi đưa phiên bản backend mới vào phục vụ.
- Không dùng seed reset trên production.

## Cấu trúc chính

```text
client/src/
  components/       Thành phần giao diện
  context/          Auth, cart và realtime providers
  pages/            Trang khách hàng và quản trị
  services/         REST client

server/src/
  controllers/      HTTP handlers và phát sự kiện realtime
  migrations/       Migration schema tuần tự
  models/            Sequelize models và quan hệ
  realtime/          Socket.IO authentication và rooms
  services/          Nghiệp vụ
  middleware/        Auth, role, upload, rate limit và error handling
```
