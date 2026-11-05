# TravAIy prototype

**MVP AI trên giao diện gốc:** mở `/welcome`, đăng nhập rồi tạo chuyến đi **TP.HCM**. Wizard → đề xuất → lịch từng ngày nối Spring Boot và Jev qua DefAPI. Sở thích onboarding ảnh hưởng tới AI. Có tiến độ, đề xuất điều chỉnh/apply/undo, thời tiết và Google reviews qua SerpApi. `/ai` chuyển về trang chủ. Các màn khám phá, cộng đồng và thanh toán vẫn là prototype.

Run the backend following `travaiy-backend/docs/AI_MVP.md`, then `npm run dev -- --host 127.0.0.1` and open http://127.0.0.1:3000/welcome. The demo account is in backend `.local/demo-account.json`. Set `VITE_GEOAPIFY_API_KEY` in frontend `.env` for the interactive trip map. Restrict this public browser key to your app origins in the Geoapify dashboard. Jev and SerpApi private keys stay in backend `.env`. Restart Vite after changing configuration. Without a Geoapify key, the place list remains available and the map shows an unconfigured message. Google review source links remain for attribution; Google Maps Embed has been removed.

Prototype ứng dụng du lịch: tạo lịch bằng AI mô phỏng hoặc tự xếp, khám phá địa điểm, chuyến đi nhóm và bản đồ kỷ niệm.

## Chạy trên máy

Yêu cầu Node.js 24.x và npm.

```sh
git clone https://github.com/AnhND81225/travaiy-prototype.git
cd travaiy-prototype
npm ci
npm run dev
```

Mở địa chỉ Vite in ra trong terminal (mặc định http://localhost:3000). Luồng AI cần backend và các API key theo hướng dẫn ở trên. Lịch AI lưu trong PostgreSQL; trình duyệt giữ trạng thái giao diện. Danh mục hiện có 18 điểm quanh trung tâm HCM từ Geoapify/OSM, ảnh minh họa; giá và giờ mở cửa chưa xác minh.

Nút **Hỏi Lumi** chỉ hiện ở `/home` sau khi bấm **Vào trang chủ** ở cuối onboarding hoặc đăng nhập thành công. Trạng thái được lưu trên trình duyệt và xóa khi đăng xuất; nút ẩn ở các trang khác, kể cả các bước onboarding.

## Kiểm tra

```sh
npm run lint
npm test
npm run build
```

`src/` chứa mã ứng dụng; `public/images/` chứa ảnh. Không sửa `dist/` vì được sinh lại khi build.

## Làm việc cùng nhóm

Chủ repo mời thành viên tại **Settings → Collaborators → Add people**. Mỗi người tạo nhánh riêng và mở pull request vào `main`:

```sh
git checkout -b feature/ten-tinh-nang
# Sửa code và chạy các lệnh kiểm tra ở trên
git add .
git commit -m "Describe the change"
git push -u origin feature/ten-tinh-nang
```

Sau khi review, chủ repo dùng **Create a merge commit** để merge pull request vào `main` bằng tài khoản của mình. Không commit `.env.local`, `node_modules`, `dist`, `.vercel` hoặc bản ZIP source cũ.

## Deploy trên Vercel

Dự án: `travaiy-prototype`. Link: https://travaiy-prototype.vercel.app

- Push/merge vào `main`: Vercel tự build và deploy production.
- Pull request/nhánh khác: Vercel tạo Preview khi tác giả có quyền cần thiết trên Git integration.
- Cấu hình build và SPA routing nằm trong `vercel.json`.
- GitHub Actions chạy kiểm tra code, test và build; xem kết quả trong tab Actions. Quy trình này không tự đặt branch protection hay bắt Vercel đợi CI.
- Dự án đang ở Vercel Hobby. Với repo riêng tư, chỉ commit của chủ Vercel được tự deploy. Thành viên vẫn code và mở PR bình thường; chủ repo tạo merge commit vào `main` để phát hành. Preview từ commit của thành viên khác có thể bị chặn. Muốn tất cả thành viên tự deploy/preview thì cần Vercel Pro và cấp quyền phù hợp.
- Quy định: https://vercel.com/docs/deployments/troubleshoot-project-collaboration#hobby-teams

Để AI tự lên chuyến: ở bước địa điểm, không chọn điểm nào và bấm **Để AI tự chọn địa điểm**. Nhập ngày, ngân sách và sở thích rồi chọn AI ở bước tổng kết. Các điểm chọn trước trở thành điểm bắt buộc; Jev có thể bổ sung điểm phù hợp khác. Danh sách khám phá và lịch mẫu HCM dùng `src/data/hcmCatalog.json` từ Geoapify/OSM; ảnh minh họa, không gán đánh giá mẫu cho địa điểm thật.
