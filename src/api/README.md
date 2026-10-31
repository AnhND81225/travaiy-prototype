# Cấu Trúc Thư Mục API (Feature-Based) - Kết Nối TravAIy Backend

Toàn bộ tầng API của Frontend đã được đối soát và ánh xạ chính xác 100% với tài liệu **OpenAPI / Swagger 3.1** từ backend đang chạy tại `http://127.0.0.1:18080/swagger-ui/index.html`.

---

## 1. Cấu Hình Cổng & Proxy (Port 18080)

- **Backend Swagger URL:** `http://127.0.0.1:18080/swagger-ui/index.html`
- **OpenAPI Schema Docs:** `http://127.0.0.1:18080/v3/api-docs`
- **Vite Dev Server Proxy (`vite.config.ts`):** 
  Mọi request bắt đầu bằng `/api` từ web client được tự động proxy ngầm sang `http://127.0.0.1:18080`, tránh hoàn toàn lỗi CORS khi chạy dev ở localhost.
- **Biến môi trường (`.env.example`):**
  - `VITE_API_BASE_URL=/api/v1`
  - `VITE_BACKEND_PROXY_URL=http://127.0.0.1:18080`
  - `VITE_API_TIMEOUT=15000`

---

## 2. Bảng Ánh Xạ Tính Năng (Feature Mapping)

| Thư mục Feature | Backend Controller | Các API Endpoint chính từ Backend |
|---|---|---|
| **`src/api/auth/`** | `auth-controller`, `me-controller` | - `POST /api/v1/auth/login` (email, password)<br>- `POST /api/v1/auth/register` (email, password, displayName)<br>- `POST /api/v1/auth/refresh` (token)<br>- `POST /api/v1/auth/logout`<br>- `GET /api/v1/me` (UserProfile)<br>- `PATCH /api/v1/me` (ProfileUpdate) |
| **`src/api/trips/`** | `trip-controller`, `planning-controller` | - `GET /api/v1/trips` (PageSummary)<br>- `POST /api/v1/trips` (Create title)<br>- `GET /api/v1/trips/{id}` (View chi tiết)<br>- `PUT /api/v1/trips/{id}` (Save lịch trình & Wizard)<br>- `POST /api/v1/trips/{id}/status`<br>- `PATCH /api/v1/trips/{id}/activities/{actId}/completion`<br>- `POST /api/v1/trips/{id}/planning-jobs` (AI sinh/chỉnh sửa lịch trình)<br>- `GET /api/v1/trips/{id}/quota` |
| **`src/api/places/`** | `catalog-controller` | - `GET /api/v1/catalog/destinations`<br>- `GET /api/v1/catalog/categories`<br>- `GET /api/v1/catalog/places` (lọc theo destination, category, q, cost, indoor)<br>- `GET /api/v1/catalog/places/{id}`<br>- `GET /api/v1/me/favorites`<br>- `PUT /api/v1/me/favorites/{id}` (Thêm yêu thích)<br>- `DELETE /api/v1/me/favorites/{id}` (Bỏ yêu thích) |
| **`src/api/stays/`** | `catalog-controller`, `partner-controller` | - `GET /api/v1/catalog/places?category=STAY`<br>- `GET /api/v1/catalog/places/{id}/offers` (Phòng và bảng giá công khai) |
| **`src/api/expenses/`** | `expense-controller` | - `GET /api/v1/trips/{trip}/expenses`<br>- `POST /api/v1/trips/{trip}/expenses` (Chia đều, tỷ lệ, chỉ định)<br>- `DELETE /api/v1/trips/{trip}/expenses/{id}`<br>- `GET /api/v1/trips/{trip}/expense-balances` (Bảng số dư & Đề xuất trả nợ)<br>- `POST /api/v1/trips/{trip}/settlements` (Quyết toán tiền giữa 2 người) |
| **`src/api/media/`** | `content-controller` | - `GET /api/v1/trips/{trip}/albums`<br>- `POST /api/v1/trips/{trip}/albums`<br>- `POST /api/v1/trips/{trip}/albums/{id}/media` (Multipart kèm metadata tọa độ/thời gian)<br>- `GET /api/v1/trips/{trip}/media-map` (Ảnh có tọa độ cho Memory Map)<br>- `GET /api/v1/trips/{trip}/media/{id}/file` (URL file ảnh trực tiếp) |

---

## 3. Ví Dụ Gọi API Trong Giao Diện

### Đăng nhập và lưu phiên (`useAuth`)
```tsx
import { useAuth } from '@/src/api/auth';

const { login, user, isAuthenticated, loading } = useAuth();
// Gọi khi submit form:
await login({ email: 'user@travaiy.com', password: 'password123' });
```

### Lấy danh sách điểm đến & địa điểm (`usePlaces`)
```tsx
import { usePlaces, placesApi } from '@/src/api/places';

// Trong component:
const { places, loading, toggleFavorite } = usePlaces({ destinationId: 'da-nang' });
```

### Tạo và quản lý lịch trình với Backend (`useTrips`)
```tsx
import { useTrips, tripsApi } from '@/src/api/trips';

const { trips, createTrip, saveTrip } = useTrips();
```
