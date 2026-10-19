import React, { useState } from 'react';
import { ArrowUpRight, Star, X } from 'lucide-react';
import { ModalSheet } from '../../components/common/ModalSheet';
import { useTravel } from './TravelContext';
import { images } from './fixtures';
import { Image } from './UI';
import './destination-social.css';

type Review = { name: string; initials: string; rating: number; style: string; text: string };
type Article = { id: string; title: string; author: string; category: string; image?: string; summary: string; paragraphs: string[]; sample: boolean };
const reviewsByCity: Record<string, Review[]> = {
  'Đà Nẵng': [
    { name: 'Minh Anh', initials: 'MA', rating: 5, style: 'Đi cùng bạn bè', text: 'Mình thích dành buổi sáng đi biển, chiều ghé quán cà phê. Lịch có khoảng nghỉ nên cả nhóm không bị mệt.' },
    { name: 'Hoàng Nam', initials: 'HN', rating: 4, style: 'Đi một mình', text: 'Mình muốn gom các điểm gần nhau trong một ngày hơn. Nếu đi lại, mình sẽ để thêm thời gian cho việc di chuyển.' },
    { name: 'Linh Chi', initials: 'LC', rating: 5, style: 'Đi cùng gia đình', text: 'Gia đình mình thích lịch nhẹ nhàng, giữ giờ ăn và về nghỉ sớm. Có lịch để cả nhà cùng xem rất tiện.' },
  ],
  'Đà Lạt': [
    { name: 'Linh Chi', initials: 'LC', rating: 5, style: 'Đi cùng bạn bè', text: 'Mình thích buổi sáng thong thả bên ly cà phê. Chừa một buổi không có lịch cố định khiến chuyến đi thoải mái hơn.' },
    { name: 'Minh Anh', initials: 'MA', rating: 4, style: 'Đi một mình', text: 'Mình chọn ít điểm hơn và dành nhiều thời gian chụp ảnh. Lần tới mình sẽ sắp các quán muốn ghé theo từng khu vực.' },
  ],
};
function sampleArticles(city: string): Article[] {
  const photo = city === 'Đà Nẵng' ? images.bridge : city === 'Đà Lạt' ? images.dalatCabin : city === 'Hội An' ? images.town : images.beach;
  return [
    { id: `${city}-slow`, title: `Một chuyến ${city} theo nhịp riêng`, author: 'Linh Chi', category: 'Nhật ký chuyến đi', image: photo, summary: 'Một lịch trình vừa đủ, có thời gian nghỉ và những khoảng trống để khám phá.', paragraphs: [`Trong câu chuyện mẫu này, Linh Chi lên một chuyến đi đến ${city} với mục tiêu tận hưởng thay vì ghé thật nhiều điểm.`, 'Buổi sáng dành cho hoạt động chính, buổi trưa nghỉ ngơi, buổi chiều chọn một điểm yêu thích. Những khung giờ còn lại để cả nhóm tự quyết định theo sức khỏe và sở thích.', 'Bạn có thể bắt đầu một plan riêng từ điểm đến này rồi thêm những địa điểm mình muốn ghé. Nội dung này minh họa cách trình bày nhật ký, không phải đánh giá hay hướng dẫn du lịch đã xác thực.'], sample: true },
    { id: `${city}-friends`, title: `Lên kế hoạch đi ${city} cùng bạn bè`, author: 'Minh Anh', category: 'Kinh nghiệm lên lịch', image: city === 'Đà Lạt' ? images.hero : images.food, summary: 'Cách thống nhất điểm muốn đi và giữ lịch thoải mái cho cả nhóm.', paragraphs: ['Đây là bài viết mẫu cho luồng cộng đồng của Travaiy.', `Khi thử tạo chuyến ${city}, mỗi thành viên chọn một điểm mình muốn ghé. Nhóm giữ chung khung giờ ăn, thêm khoảng nghỉ và chỉ chọn vài hoạt động chính mỗi ngày.`, 'Nếu thời tiết hoặc giờ khởi hành thay đổi, nhóm xem đề xuất điều chỉnh, so sánh với lịch cũ rồi cùng quyết định. Bạn có thể thử luồng này trong tính năng AI thích nghi của bản demo.'], sample: true },
  ];
}

export function DestinationSocial({ city }: { city: string }) {
  const { localPosts } = useTravel();
  const [showReviews, setShowReviews] = useState(false);
  const [showAllPosts, setShowAllPosts] = useState(false);
  const [opened, setOpened] = useState<Article | null>(null);
  const reviews = reviewsByCity[city] || [
    { name: 'Minh Anh', initials: 'MA', rating: 5, style: 'Đi cùng bạn bè', text: `Trong chuyến ${city} mẫu này, mình thích có lịch chung nhưng vẫn chừa thời gian tự do cho từng người.` },
    { name: 'Hoàng Nam', initials: 'HN', rating: 4, style: 'Đi một mình', text: 'Mình ưu tiên một lịch nhẹ nhàng, có thời gian di chuyển và nghỉ giữa các hoạt động.' },
  ];
  const average = (reviews.reduce((total, review) => total + review.rating, 0) / reviews.length).toFixed(1);
  const ownPosts: Article[] = localPosts.filter(post => post.location.toLocaleLowerCase('vi-VN').includes(city.toLocaleLowerCase('vi-VN')) && post.audience.startsWith('Công khai')).map(post => ({ id: post.id, title: post.text.slice(0, 80), author: 'Bạn', category: 'Bài viết trên máy này', summary: post.text.slice(0, 130), paragraphs: [post.text, post.tags.join(' ')], sample: false }));
  const articles = [...ownPosts, ...sampleArticles(city)];
  const reviewCard = (review: Review) => <article className="destination-review" key={review.name}><div className="destination-review-top"><span className="destination-avatar">{review.initials}</span><div><b>{review.name}</b><small>{review.style}</small></div><span className="destination-stars" aria-label={`${review.rating} trên 5 sao`}>{'★'.repeat(review.rating)}<span aria-hidden="true">{'☆'.repeat(5-review.rating)}</span></span></div><p>{review.text}</p><small className="destination-sample">Đánh giá mẫu · Nhân vật minh họa</small></article>;
  const articleCard = (article: Article) => <button className="destination-article" key={article.id} onClick={() => setOpened(article)} aria-label={`Đọc bài: ${article.title}`}>{article.image && <Image src={article.image} alt={`Ảnh minh họa bài viết về ${city}`} />}<div><span className="destination-article-category">{article.category}</span><h3>{article.title}</h3><p>{article.summary}</p><footer><span>{article.author} · {article.sample ? 'Bài viết mẫu' : 'Lưu trên máy này'}</span><ArrowUpRight size={16}/></footer></div></button>;
  return <>
    <section className="destination-social" aria-label={`Đánh giá về ${city}`}><div className="travel-section-title"><h2>Người đi trước chia sẻ</h2><button onClick={() => setShowReviews(true)}>Xem tất cả</button></div><div className="destination-rating"><Star size={23} fill="currentColor"/><strong>{average}<small>/5</small></strong><div><b>{reviews.length} đánh giá mẫu</b><span>Nội dung mô phỏng để trải nghiệm giao diện</span></div></div>{reviews.slice(0, 2).map(reviewCard)}</section>
    <section className="destination-social" aria-label={`Bài viết về ${city}`}><div className="travel-section-title"><h2>Câu chuyện về {city}</h2><button onClick={() => setShowAllPosts(true)}>Xem tất cả</button></div><p className="destination-social-caption">Nhật ký và ý tưởng cho chuyến đi sắp tới.</p>{articles.slice(0, 2).map(articleCard)}</section>
    <ModalSheet isOpen={showReviews} onClose={() => setShowReviews(false)} title={`Đánh giá về ${city}`}><div className="travel-modal-content"><div className="travel-section-title"><h2>Đánh giá về {city}</h2><button className="travel-icon" aria-label="Đóng đánh giá" onClick={() => setShowReviews(false)}><X size={20}/></button></div><p className="travel-footnote">Điểm số và nhận xét mẫu, không phải đánh giá thực tế đã xác minh.</p>{reviews.map(reviewCard)}</div></ModalSheet>
    <ModalSheet isOpen={showAllPosts} onClose={() => setShowAllPosts(false)} title={`Bài viết về ${city}`}><div className="travel-modal-content"><div className="travel-section-title"><h2>Bài viết về {city}</h2><button className="travel-icon" aria-label="Đóng danh sách bài viết" onClick={() => setShowAllPosts(false)}><X size={20}/></button></div>{articles.map(article => <button className="adaptive-notification" key={article.id} onClick={() => { setShowAllPosts(false); setOpened(article); }}><b>{article.title}</b><span>{article.author} · {article.sample ? 'Bài viết mẫu' : 'Bài viết của bạn'}</span></button>)}</div></ModalSheet>
    <ModalSheet isOpen={!!opened} onClose={() => setOpened(null)} title="Chi tiết bài viết">{opened && <div className="travel-modal-content destination-reader"><div className="travel-section-title"><span className="travel-eyebrow">{opened.category}</span><button className="travel-icon" aria-label="Đóng bài viết" onClick={() => setOpened(null)}><X size={20}/></button></div>{opened.image && <Image src={opened.image} alt="Ảnh minh họa bài viết"/>}<h2>{opened.title}</h2><small>{opened.author} · {opened.sample ? 'Nội dung mô phỏng' : 'Bài viết lưu trên trình duyệt này'}</small>{opened.paragraphs.filter(Boolean).map((paragraph,index)=><p key={index}>{paragraph}</p>)}</div>}</ModalSheet>
  </>;
}
