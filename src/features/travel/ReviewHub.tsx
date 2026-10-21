import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Pill, TravelHeader } from './UI';
export function ReviewHub(){const nav=useNavigate();const flows=[
 ['Chọn điểm trước khi xếp lịch','/wizard/places','Chọn nhiều địa điểm, lọc danh mục rồi tiếp tục nhập ngày, giờ và thông tin chuyến đi.'],
 ['Lumi chào hỏi tên','/onboarding/name','Nhập tên, chọn DNA và xem màn hoàn tất hồ sơ có mascot. Tên lưu trên thiết bị.'],
 ['Luồng tạo chuyến đi chung','/trip/create','Thành phố → điểm muốn ghé → ngày, giờ → solo/nhóm → ngân sách → khách sạn → AI hoặc tự xếp → chọn gói. Tự xếp mở lịch trống, không trừ lượt AI.'],
 ['Công cụ & tiến độ','/trip/overview','Công cụ nằm trên cùng. Vào lịch từng ngày, đánh dấu hoạt động để thanh tiến độ cập nhật.'],
 ['Thêm và phân loại hành lý','/trip/packing-list','Mở Thêm món đồ, chọn nhóm bằng nút rồi lưu. Món mới hiện trong đúng nhóm.'],
 ['Chi tiêu & chia theo người','/trip/group/expense-split','Thêm khoản chi, chọn người thanh toán và người tham gia. 300.000đ cho 2 người = 150.000đ/người. Chuyển tab để xem cùng style cá nhân.'],
 ['Camera & photobooth','/trip/camera','Chọn ảnh hoặc mở camera. Chuyển tab Photobooth để ghép 3 ảnh và lưu album.'],
 ['Gói chuyến đi trong Tài khoản','/profile','Xem gói và số lượt AI đang dùng cho chuyến hiện tại.'],
 ['Chọn khách sạn trước khi tiếp tục','/wizard/stay','Chuyến qua đêm cần chọn chỗ ở. Không còn nút Chọn sau. Chuyến trong ngày không cần khách sạn.'],
 ['AI thích nghi','/trip/day/1','Mở Lịch trình, chọn mưa/trễ/nghỉ ngay trong ngày. Xem gợi ý, áp dụng hoặc hoàn tác tại chỗ.'],
 ['Chuyến đi của tôi','/trips','Mở chuyến đã lưu, tiếp tục nháp, đổi trạng thái và tạo chuyến mới.'],
 ['Khám phá điểm đến','/explore','Chọn một thành phố bất kỳ, xem chi tiết rồi tạo plan hoặc mở địa điểm.'],
 ['Chọn gói & hạn mức AI','/wizard/summary','Chọn Miễn phí, tạo thành công 3 lần. Lần 4 gặp hết lượt. Chọn gói rồi tiếp tục thẳng, không có bước thanh toán.'],
 ['Tham gia nhóm','/join','Mã hợp lệ TRAV123, mã hết hạn EXPIRED; thử mã sai và xác nhận tham gia.'],
 ['Khôi phục mật khẩu','/auth/recovery','Nhập email/SĐT, thử mã sai/hết hạn, mã đúng 123456, đặt mật khẩu demo. Không lưu mật khẩu.'],
 ['Bài viết & giấy tờ','/community','Đăng bài sẽ xuất hiện trên bảng tin local. Vào Ví giấy tờ trong chuyến đi để đính kèm, lưu và tải lại tệp.'],
 ['Recap','/trip/recap/final','Nút tải xuất video demo không âm thanh nếu trình duyệt hỗ trợ. Chia sẻ sẽ thêm bài vào bảng tin local.'],
 ];return <div className="travel-screen"><TravelHeader title="Bản kiểm tra trước deploy" onBack={()=>nav('/home')}/><main className="travel-scroll wizard-body space-y-4"><section className="adaptive-notice"><h1 className="plan-content-title">Các luồng để bạn duyệt</h1><p>Các màn demo để bạn kiểm tra. Dữ liệu được lưu riêng trên trình duyệt đang mở.</p><p>AI, gói chuyến đi, OTP và tham gia nhóm là mô phỏng. Dữ liệu plan, lượt AI, bài viết và giấy tờ được lưu local.</p></section>{flows.map(([title,path,note])=><section key={path} className="adaptive-change"><h2>{title}</h2><p>{note}</p><Pill secondary onClick={()=>nav(path)}>Mở để kiểm tra</Pill></section>)}</main></div>;}
