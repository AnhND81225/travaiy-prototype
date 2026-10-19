# TravAIy prototype

Prototype ứng dụng du lịch: tạo lịch bằng AI mô phỏng hoặc tự xếp, khám phá địa điểm, chuyến đi nhóm và bản đồ kỷ niệm.

## Chạy trên máy

Yêu cầu Node.js 24.x và npm.

```sh
git clone https://github.com/AnhND81225/travaiy-prototype.git
cd travaiy-prototype
npm ci
npm run dev
```

Mở địa chỉ Vite in ra trong terminal (mặc định http://localhost:3000). Hiện tại không cần API key. Dữ liệu của người dùng lưu riêng trên trình duyệt; đây chưa phải backend dùng chung. AI, gói chuyến đi, ảnh và đánh giá là dữ liệu minh họa.

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
