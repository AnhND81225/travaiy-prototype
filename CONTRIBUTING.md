# Làm việc trên TravAIy

## Quy trình nhóm

1. Pull `main` mới nhất và tạo nhánh `feature/...` hoặc `fix/...`.
2. Sửa code, chạy `npm run lint`, `npm test`, `npm run build`.
3. Push nhánh và mở pull request. Dùng link Vercel Preview để cùng kiểm tra.
4. Chủ repo review và chọn **Create a merge commit** bằng tài khoản của mình để merge vào `main`, phát hành production.

## Các phần chính

- `src/App.tsx`: routes và luồng tạo chuyến đi.
- `src/components/screens/`: các màn chính của ứng dụng.
- `src/features/travel/`: lịch trình, bản đồ, chi tiêu, kỷ niệm và dữ liệu lưu local.
- `src/data/`: nội dung mẫu, danh mục và đánh giá minh họa.
- `public/images/`: ảnh dùng trong prototype.

Mỗi trình duyệt có dữ liệu local riêng. Không coi lượt AI, thanh toán hoặc review mẫu là dữ liệu backend thật. Khi thêm dữ liệu demo, ghi rõ đó là nội dung minh họa.

Giữ các font và màu hiện có. Kiểm tra giao diện trong khung điện thoại, cả nội dung cuộn và nút cố định phía dưới. Với thay đổi luồng, kiểm tra cả nhánh AI và tự xếp, solo và nhóm.

## Vercel

Repository này được nối với dự án Vercel `travaiy-prototype`. `main` là nhánh production; link chính là https://travaiy-prototype.vercel.app. Build dùng `npm ci` rồi `npm run build`, xuất thư mục `dist`.

Vercel Hobby chỉ tự deploy commit của chủ dự án trong repo riêng tư. Preview của thành viên khác có thể bị chặn; các thành viên vẫn chạy local và mở PR để review. Xem https://vercel.com/docs/deployments/troubleshoot-project-collaboration#hobby-teams.
