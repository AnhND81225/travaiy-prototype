import hcmCatalog from './hcmCatalog.json';
import { Collection, Destination, NotificationItem, PackingItem, Place, TripPlan, TripWizardData, UserPreferences } from '../types/travel';

export const INITIAL_PREFERENCES: UserPreferences = {
  interests: ['Ăn uống & cà phê', 'Chụp ảnh & check-in', 'Thiên nhiên & khám phá'],
  travelStyle: 'Cân bằng',
  priorities: ['Trải nghiệm mới', 'Tối ưu thời gian & di chuyển'],
  timeOfDay: ['Buổi sáng', 'Buổi chiều'],
};

export const INITIAL_WIZARD_DATA: TripWizardData = {
  destination: 'TP.HCM',
  destinationTagline: 'Văn hóa và cà phê Sài Gòn',
  destinationImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrD3e9gRmI97_t8q-VKA_iggatAQvNCWzilpf7TV1_J0DfUVBNdy2a78A4xFaeRwqbKq5atP68YCi45qpHrdYzBXxfYY6wmvsVSh9spytjFUe6gfimv2uFWg3a4tnvV88L3n1dPwDHg8urH3x8Qm05-d6pCANR56YnFbHvhgUWzndb5vw2G753FuWOwSWJ8vKZ_bwcSeeMdEwxS5OQP-06o9cPSLE2NfhnTJ_l5Ne_mySZup4gAA',
  startDate: '17/10/2026',
  endDate: '19/10/2026',
  durationText: '3 ngày 2 đêm',
  departureTime: '08:00',
  returnTime: '18:00',
  companionType: 'group',
  companionCount: 4,
  inviteCode: 'TRAV123',
  budgetTier: 'Vừa túi tiền',
  budgetAmount: 2500000,
  interests: ['Thư giãn', 'Văn hóa', 'Ẩm thực', 'Chụp ảnh'],
  transport: 'Ô tô',
  accommodation: 'Khách sạn',
  mustVisitPlaces: [],
  notes: 'Không có',
};

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Thời tiết TP.HCM',
    message: 'Dự báo ngày mai nắng nhẹ 28°C, rất lý tưởng để đi Thảo Cầm Viên!',
    timeAgo: '10 phút trước',
    type: 'weather',
    isRead: false,
  },
  {
    id: 'n2',
    title: 'Nhắc chuyến đi',
    message: 'Chuyến đi TP.HCM 3N2Đ sẽ bắt đầu sau 3 ngày nữa. Hãy kiểm tra danh sách hành lý!',
    timeAgo: '1 giờ trước',
    type: 'reminder',
    isRead: false,
  },
  {
    id: 'n3',
    title: 'Hoạt động nhóm',
    message: 'Minh Anh vừa bình chọn món Bữa tối Sài Gòn trong nhóm',
    timeAgo: '2 giờ trước',
    type: 'social',
    isRead: false,
  },
];

export const MOCK_DESTINATIONS: Destination[] = [{id:'hcm',title:'TP.HCM',location:'Việt Nam',region:'TP.HCM',tagline:'Văn hóa, cà phê và nhịp sống Sài Gòn',rating:0,image:'/images/vietnam-hero.png',placesCount:hcmCatalog.length}];

export const MOCK_PLACES: Place[] = hcmCatalog.map(p=>({id:p.id,name:p.name,category:p.category==='food'?'Cà phê':'Tham quan',city:'TP.HCM',rating:0,reviewsCount:0,openHours:'Chưa xác minh',priceRange:'Chưa có giá tham khảo',address:p.address||'TP.HCM',distance:'Chưa xác định',images:['/images/vietnam-hero.png'],tags:['TP.HCM'],description:'Địa điểm từ Geoapify / OpenStreetMap. Ảnh minh họa; xem đánh giá Google trong lịch chuyến đi.',coordinates:p.location?{x:50,y:50,lat:p.location.lat,lng:p.location.lng}:undefined}));

export const MOCK_COLLECTIONS: Collection[] = [
  {
    id: 'c1',
    title: 'Muốn đi Đà Lạt',
    updatedTime: 'Cập nhật 2 ngày trước',
    tags: 'Sương mù, Chill',
    placesCount: 12,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4QPkzqU4wuhXNErJMr_3q1tf4oFfpaMCWP_fq-hxqVNiJLl9KLqWdTJpEekiQTBfh4XdIT3PEEmY8o1m1hk9ghKcKBIAF0g-Z8DytYHCZX1ZZoMJSVpViw1TmqO13f6mAYwVkfge3clOYOjRFh6Cxr4jTiXkm8VgIHe88miiyXpxpm8BAt6sK8lXOLoEJg81PC1aPUZt7bLSQgRrfVueMTg4SL2YnexV3tet0svvayUfU76BDjg',
    isDefault: true,
  },
  {
    id: 'c2',
    title: 'Quán cà phê muốn thử',
    updatedTime: 'Cập nhật 5 ngày trước',
    tags: 'Cà phê ngon, View hoàng hôn',
    placesCount: 8,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBY198n9GFgOl1mm0iwFZhUl-zJmi3VhYvUBNkuZvMMQK8ItaTNnCRKusxvcHT4AnehkYlYOn_kaxRfBbWzTdqyxrU5O9ZpzKVePMWAkeqEi7oi9JAuKY0uX5pyfkSFYCx1nMfqE4rf2xbVgVC7uSpI5OEo3djcAa5J11t7kSMp2cp9ElGn-86eGkqK_p-kAGikzvnHXmA1gzEX2pdVHoN83qtnOcftXsGJp3pLUmxUIqSLMa4peg',
  },
  {
    id: 'c3',
    title: 'Biển tuyệt đẹp',
    updatedTime: 'Cập nhật 1 tuần trước',
    tags: 'Check-in, Nghỉ dưỡng',
    placesCount: 15,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWP8Xi1CHLdowWWVWDNyR1JEX5gNxhwzqHmxJDIypXdp1V3NU_0oReib0tDl4cumPA4TzKmXWt_eGcyJTEflpXMAzVbjjXDwz-mquMfGFKqpzht9Dx_K8J9QToxgccR49YkKhowv84tM5J4BEPEbUOATeD72DrrKYcNYWdAjAizahm2hLn3MJ5QEmDdn_PwGCQgKlgI2I9ff52JQgCM7undo4O3gPi0gtvsO-V1-shMWTAaaHqHA',
  },
  {
    id: 'c4',
    title: 'Ẩm thực phải thử',
    updatedTime: 'Cập nhật 2 tuần trước',
    tags: 'Món ngon, Đặc sản',
    placesCount: 10,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7SPirlt5Uaxpg9y-vTwZmOja9OV9zfgF2UhHW2nAd319vzflfoyPjVGmO4Qv6zIBBtFqXIGo_OVVqEvK4bif94VClZ1kMoY7KUpR-N3GX0kdotfjtT2V5KtSQM4DrK_31GJ8e7Q6IyHkOB66pJgpaQoyHF_WOyTOPI-gxQe31y_SBH3bzhYhMaC6_7DksNMH1zizt7o1IJMioVlH2xhiRHkV-Wu5aoehwnEFtaggSkpArnlSU-w',
  },
];

export const MOCK_TRIP: TripPlan = {
 id:'trip-hcm-sample',destination:'TP.HCM',title:'Khám phá TP.HCM · Lịch mẫu',days:3,dates:'05–07/11/2026',coverImage:'/images/vietnam-hero.png',estimatedCostPerPerson:'Chưa có giá tham khảo',
 daysSchedule:Array.from({length:3},(_,day)=>({dayNumber:day+1,title:'Văn hóa & cà phê Sài Gòn',dateText:`2026-11-${String(5+day).padStart(2,'0')}`,dayCost:'Chưa dự tính',items:hcmCatalog.slice(day*3,day*3+3).map((p,index)=>({id:`sample-${p.id}`,time:['09:00','11:00','14:00'][index],placeName:p.name,category:p.category==='food'?'Cà phê':'Tham quan',note:'Lịch mẫu minh họa. Tạo chuyến mới để AI lên lịch theo sở thích.',cost:'Chưa xác minh',duration:`${p.durationMinutes} phút`,image:'/images/vietnam-hero.png',address:p.address||'TP.HCM'}))}))
};

export const MOCK_PACKING_ITEMS: PackingItem[] = [
  // Giấy tờ quan trọng (cat-1)
  { id: 'item-1-1', name: 'CMND / CCCD', categoryId: 'cat-1', isChecked: true },
  { id: 'item-1-2', name: 'Vé máy bay / vé tàu', categoryId: 'cat-1', isChecked: true },
  { id: 'item-1-3', name: 'Thông tin đặt phòng', categoryId: 'cat-1', isChecked: true },
  { id: 'item-1-4', name: 'Bảo hiểm du lịch', categoryId: 'cat-1', isChecked: true },

  // Quần áo (cat-2)
  { id: 'item-2-1', name: 'Áo thun, quần short', categoryId: 'cat-2', isChecked: true },
  { id: 'item-2-2', name: 'Đồ bơi', categoryId: 'cat-2', isChecked: true },
  { id: 'item-2-3', name: 'Áo khoác mỏng', categoryId: 'cat-2', isChecked: true },
  { id: 'item-2-4', name: 'Mũ, nón', categoryId: 'cat-2', isChecked: false },
  { id: 'item-2-5', name: 'Giày thể thao', categoryId: 'cat-2', isChecked: false },

  // Thiết bị điện tử (cat-3)
  { id: 'item-3-1', name: 'Điện thoại, sạc', categoryId: 'cat-3', isChecked: true },
  { id: 'item-3-2', name: 'Pin dự phòng', categoryId: 'cat-3', isChecked: true },
  { id: 'item-3-3', name: 'Máy ảnh / GoPro', categoryId: 'cat-3', isChecked: false },
  { id: 'item-3-4', name: 'Tai nghe', categoryId: 'cat-3', isChecked: false },

  // Vệ sinh cá nhân (cat-4)
  { id: 'item-4-1', name: 'Bàn chải & kem đánh răng', categoryId: 'cat-4', isChecked: true },
  { id: 'item-4-2', name: 'Kem chống nắng đi biển', categoryId: 'cat-4', isChecked: true },
  { id: 'item-4-3', name: 'Sữa tắm, gội mini', categoryId: 'cat-4', isChecked: false },
  { id: 'item-4-4', name: 'Khăn mặt cá nhân', categoryId: 'cat-4', isChecked: false },

  // Đồ dùng theo hoạt động (cat-5)
  { id: 'item-5-1', name: 'Kính bơi & túi chống nước', categoryId: 'cat-5', isChecked: true },
  { id: 'item-5-2', name: 'Dép tông đi biển', categoryId: 'cat-5', isChecked: false },
  { id: 'item-5-3', name: 'Túi xách dạo phố Hội An', categoryId: 'cat-5', isChecked: false },
];

export const MOCK_HCM_TRIP = MOCK_TRIP;
