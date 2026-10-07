// Danh sách dấu hiệu "văn AI / văn dịch máy" trong tiếng Việt.
// Mỗi luật: id, nhóm, mức (1 nhẹ, 2 vừa, 3 nặng), mẫu regex (không dấu ranh giới từ ASCII —
// dùng W() để bọc ranh giới chữ Unicode), lời nhắn và gợi ý sửa.

// Ranh giới từ cho tiếng Việt: \b của JS không hiểu chữ có dấu.
const B = '(?<![\\p{L}\\p{N}_])';
const E = '(?![\\p{L}\\p{N}_])';
export const W = (s) => new RegExp(B + '(?:' + s + ')' + E, 'giu');
// Mẫu chỉ khớp ở đầu câu (đầu dòng, sau dấu kết câu, sau gạch đầu dòng/số thứ tự).
export const S = (s) => new RegExp('(?:^|(?<=[.!?…:]\\s+)|(?<=^\\s*(?:[-*+•]|\\d+[.)])\\s+))(?:' + s + ')' + E, 'gimu');

export const GROUPS = {
  'khuon-chatbot': 'Câu mở/kết kiểu chatbot',
  'dich-may': 'Cấu trúc dịch từ tiếng Anh',
  'sao-rong': 'Từ sáo rỗng, phóng đại',
  'noi-cau': 'Từ nối đầu câu dày đặc',
  'danh-tu-hoa': 'Danh từ hóa (việc, sự, thực hiện…)',
  'rao-don': 'Rào đón, nói chung chung',
  'dinh-dang': 'Định dạng kiểu AI',
  'nhip-van': 'Nhịp văn đều đều',
};

export const RULES = [
  // ── Mở / kết kiểu chatbot ──────────────────────────────────────────
  { id: 'chac-chan-roi', group: 'khuon-chatbot', level: 3,
    re: S('chắc chắn rồi|tất nhiên rồi|rất sẵn lòng|câu hỏi (?:rất |thật )?hay|tuyệt vời,? (?:đây|dưới đây)'),
    msg: 'Câu mở đầu kiểu chatbot.', fix: 'Bỏ hẳn, vào thẳng nội dung.' },
  { id: 'duoi-day-la', group: 'khuon-chatbot', level: 2,
    re: S('dưới đây là|sau đây là|đây là (?:một số|những|danh sách|bài viết|các)'),
    msg: '"Dưới đây là…" — câu dẫn thừa.', fix: 'Bỏ câu dẫn hoặc nói luôn nội dung chính.' },
  { id: 'hay-cung', group: 'khuon-chatbot', level: 3,
    re: W('hãy cùng (?:nhau )?(?:tìm hiểu|khám phá|điểm qua|đi sâu|bắt đầu)|cùng (?:mình |tôi )?(?:tìm hiểu|khám phá) (?:ngay|nhé)'),
    msg: '"Hãy cùng khám phá…" — câu kéo người đọc sáo mòn.', fix: 'Bỏ; người đọc đã đang đọc rồi.' },
  { id: 'ban-co-bao-gio', group: 'khuon-chatbot', level: 2,
    re: W('bạn (?:đã )?(?:có )?bao giờ (?:tự hỏi|thắc mắc|nghĩ)|bạn có biết rằng'),
    msg: 'Câu hỏi tu từ mở bài kiểu content farm.', fix: 'Mở bằng một thông tin cụ thể thay vì câu hỏi.' },
  { id: 'hy-vong-huu-ich', group: 'khuon-chatbot', level: 3,
    re: W('hy vọng (?:rằng )?(?:thông tin|bài viết|những chia sẻ|nội dung|câu trả lời|hướng dẫn) (?:này|trên)(?: sẽ)? (?:hữu ích|giúp ích|có ích|giúp bạn)|chúc bạn thành công|nếu (?:bạn )?có (?:bất kỳ|thêm) (?:câu hỏi|thắc mắc)'),
    msg: 'Câu kết kiểu chatbot.', fix: 'Bỏ. Kết bằng ý cuối cùng có giá trị.' },
  { id: 'trong-bai-viet-nay', group: 'khuon-chatbot', level: 2,
    re: W('trong bài viết (?:này|dưới đây|hôm nay)|bài viết (?:này )?sẽ (?:giúp|cung cấp|hướng dẫn)'),
    msg: 'Giới thiệu bài viết thay vì viết bài.', fix: 'Bỏ, nói thẳng điều cần nói.' },
  { id: 'tom-lai', group: 'khuon-chatbot', level: 2,
    re: S('tóm lại|nói tóm lại|tổng kết lại|kết luận lại|nhìn chung|tựu trung lại|cuối cùng nhưng không kém phần quan trọng'),
    msg: 'Đoạn tổng kết lặp lại ý đã nói.', fix: 'Cân nhắc bỏ cả đoạn; nếu giữ, chỉ nói điều mới.' },

  // ── Dịch từ tiếng Anh ──────────────────────────────────────────────
  { id: 'trong-boi-canh', group: 'dich-may', level: 2,
    re: W('trong bối cảnh(?: [\\p{L}]+){0,5}? (?:hiện nay|ngày nay|hiện tại|hiện đại)|trong bối cảnh đó|trong (?:thế giới|cuộc sống) (?:ngày nay|hiện đại|số|công nghệ)|trong thời đại (?:ngày nay|công nghệ|số)(?: 4\\.0)?|trong kỷ nguyên số'),
    msg: '"In today\'s world…" dịch sát chữ.', fix: 'Bỏ, hoặc nêu mốc cụ thể ("Từ 2024…").' },
  { id: 'dong-vai-tro', group: 'dich-may', level: 2,
    re: W('đóng (?:một )?vai trò (?:vô cùng |cực kỳ |rất |hết sức )?(?:quan trọng|then chốt|thiết yếu|chủ chốt|trung tâm|không thể thiếu)'),
    msg: '"Play a crucial role" dịch sát chữ.', fix: 'Nói nó làm gì cụ thể: "X giữ…", "X quyết định…", "nhờ X mà…".' },
  { id: 'mot-cach', group: 'dich-may', level: 2,
    re: W('một cách (?:hiệu quả|nhanh chóng|dễ dàng|chính xác|tối ưu|đáng kể|toàn diện|chủ động|linh hoạt|an toàn|rõ ràng|chi tiết|tự nhiên|liền mạch|mạnh mẽ|bền vững|thông minh|chuyên nghiệp|nhất quán|hợp lý|triệt để|suôn sẻ|trơn tru)'),
    msg: '"một cách + tính từ" dịch từ trạng từ -ly.', fix: 'Bỏ "một cách": "làm hiệu quả", "chạy nhanh".' },
  { id: 'duoc-boi', group: 'dich-may', level: 2,
    re: W('được [\\p{L} ]{1,30}? bởi(?! vì| lẽ| thế| vậy)'),
    msg: 'Bị động "được … bởi" (by) kiểu tiếng Anh.', fix: 'Đổi sang chủ động: "X làm Y" hoặc "Y do X làm".' },
  { id: 'khong-chi-ma-con', group: 'dich-may', level: 1,
    re: W('không (?:chỉ|những) [^.!?\\n]{1,80}? mà còn'),
    msg: '"Not only… but also" — dùng nhiều thành giọng AI.', fix: 'Tách thành hai câu, hoặc chỉ giữ ý quan trọng hơn.' },
  { id: 'la-mot-trong-nhung', group: 'dich-may', level: 1,
    re: W('là một trong những'),
    msg: '"One of the…" dịch sát.', fix: 'Nói thẳng điều đặc biệt của nó, hoặc bỏ.' },
  { id: 'dieu-nay', group: 'dich-may', level: 1,
    re: S('điều này (?:cho thấy|có nghĩa|giúp|sẽ|đồng nghĩa|chứng tỏ|khiến|làm cho)'),
    msg: '"This shows/means…" đầu câu.', fix: 'Gộp vào câu trước, hoặc nêu chủ ngữ cụ thể.' },
  { id: 'dieu-quan-trong-la', group: 'dich-may', level: 2,
    re: W('(?:một )?điều quan trọng (?:cần lưu ý )?là|điều đáng chú ý là|cần lưu ý rằng|đáng chú ý là|thực tế là|sự thật là'),
    msg: '"It is important to note that…" dịch sát.', fix: 'Bỏ cụm này, nói luôn điều quan trọng.' },
  { id: 'cho-phep-ban', group: 'dich-may', level: 1,
    re: W('cho phép (?:bạn|người dùng|chúng ta|doanh nghiệp)'),
    msg: '"allows you to" dịch sát.', fix: '"Bạn có thể…", hoặc "để…".' },
  { id: 'chia-khoa', group: 'dich-may', level: 2,
    re: W('(?:là )?chìa khóa (?:vàng )?(?:để|cho|dẫn đến|của)|là yếu tố then chốt'),
    msg: '"the key to…" sáo.', fix: 'Nói rõ vì sao nó quan trọng.' },
  { id: 'voi-su', group: 'dich-may', level: 1,
    re: S('với sự (?:phát triển|bùng nổ|ra đời|tiến bộ|hỗ trợ|giúp đỡ)'),
    msg: '"With the development of…" mở câu dịch sát.', fix: '"Từ khi… / Nhờ…" hoặc bỏ.' },
  { id: 'nhieu-khac-nhau', group: 'dich-may', level: 1,
    re: W('(?:nhiều|các|những) [\\p{L}]+(?: [\\p{L}]+){0,3} khác nhau'),
    msg: '"various / different …" — "khác nhau" thường thừa.', fix: 'Bỏ "khác nhau" hoặc liệt kê cụ thể.' },
  { id: 'mang-lai-loi-ich', group: 'dich-may', level: 1,
    re: W('mang (?:lại|đến) (?:nhiều |vô số |những )?(?:lợi ích|giá trị|trải nghiệm)'),
    msg: '"bring benefits/value" — nói chung chung.', fix: 'Nêu lợi ích cụ thể (tiết kiệm bao nhiêu, nhanh hơn bao nhiêu).' },
  { id: 'nhu-mot', group: 'dich-may', level: 1,
    re: W('như một (?:phần|cách|công cụ|giải pháp)'),
    msg: '"as a …" dịch sát.', fix: 'Viết lại cho gọn: "làm …", "để …".' },
  { id: 'dam-bao-rang', group: 'dich-may', level: 1,
    re: W('đảm bảo rằng|hãy chắc chắn rằng|hãy đảm bảo'),
    msg: '"make sure that" dịch sát.', fix: '"nhớ …", "kiểm tra …", hoặc bỏ "rằng".' },

  // ── Danh từ hóa ────────────────────────────────────────────────────
  { id: 'viec-dau-cau', group: 'danh-tu-hoa', level: 1,
    re: S('việc (?!làm )[\\p{L}]+'),
    msg: 'Câu mở bằng "Việc + động từ".', fix: 'Đưa động từ lên làm vị ngữ: "Học sớm giúp…".' },
  { id: 'thuc-hien-viec', group: 'danh-tu-hoa', level: 2,
    re: W('(?:thực hiện|tiến hành) (?:việc|các|những|công tác|hoạt động)|tiến hành (?:kiểm tra|cài đặt|thực hiện|đánh giá|triển khai)'),
    msg: '"thực hiện/tiến hành" + danh từ — động từ rỗng.', fix: 'Dùng thẳng động từ chính: "kiểm tra", "cài".' },
  { id: 'su-dong-tu', group: 'danh-tu-hoa', level: 1,
    re: W('sự (?:gia tăng|phát triển|thay đổi|hỗ trợ|kết hợp|xuất hiện|tham gia|cải thiện|tối ưu)'),
    msg: '"sự + động từ" — văn danh từ hóa.', fix: 'Viết lại với động từ: "tăng", "phát triển".' },
  { id: 'co-kha-nang', group: 'danh-tu-hoa', level: 1,
    re: W('có khả năng (?:giúp|mang|tạo|cung cấp|hỗ trợ|xử lý)'),
    msg: '"có khả năng + động từ" thường thừa.', fix: 'Bỏ "có khả năng": "giúp…", "xử lý…".' },

  // ── Sáo rỗng, phóng đại ────────────────────────────────────────────
  { id: 'tu-sao', group: 'sao-rong', level: 1,
    re: W('hành trình|nâng tầm|bứt phá|đột phá|toàn diện|vượt trội|tối ưu hóa|liền mạch|cách mạng hóa|thay đổi cuộc chơi|kỷ nguyên mới|chinh phục|kho tàng|bức tranh toàn cảnh|đa dạng và phong phú|phong phú và đa dạng|không thể bỏ qua|không thể bỏ lỡ|hoàn hảo|đỉnh cao|vô tận|tiềm năng to lớn|sâu sắc|hệ sinh thái|thế giới đầy màu sắc|lan tỏa'),
    msg: 'Từ sáo rỗng/phóng đại hay gặp trong văn AI.', fix: 'Thay bằng chi tiết đo được hoặc từ thường.' },
  { id: 'kham-pha-trai-nghiem', group: 'sao-rong', level: 1,
    re: W('khám phá|trải nghiệm'),
    msg: '"khám phá / trải nghiệm" bị dùng tràn lan.', fix: '"xem", "dùng thử", "đi", "đọc"… tùy ngữ cảnh.' },
  { id: 'nhan-manh-rong', group: 'sao-rong', level: 1,
    re: W('vô cùng|cực kỳ|hết sức|thực sự|đáng kinh ngạc|tuyệt vời|mạnh mẽ|ấn tượng|đáng kể'),
    msg: 'Trạng từ nhấn mạnh rỗng.', fix: 'Bỏ, hoặc thay bằng con số/chi tiết.' },
  { id: 'giai-phap', group: 'sao-rong', level: 1,
    re: W('giải pháp (?:tối ưu|hoàn hảo|toàn diện|hiệu quả|thông minh|lý tưởng)|lựa chọn (?:hoàn hảo|lý tưởng|hàng đầu|tuyệt vời)'),
    msg: 'Cụm quảng cáo chung chung.', fix: 'Nói nó giải quyết vấn đề gì, cho ai.' },

  // ── Rào đón ────────────────────────────────────────────────────────
  { id: 'rao-don', group: 'rao-don', level: 1,
    re: W('tùy thuộc vào (?:nhiều yếu tố|từng trường hợp|nhu cầu)|có thể nói rằng|có thể thấy rằng|không thể phủ nhận (?:rằng)?|ai cũng biết|như chúng ta đã biết'),
    msg: 'Câu rào đón không thêm thông tin.', fix: 'Bỏ, hoặc nêu yếu tố cụ thể.' },
];

// Từ nối hay bị AI dùng ở đầu câu — đếm riêng để xét mật độ.
export const CONNECTORS = [
  'hơn nữa', 'ngoài ra', 'bên cạnh đó', 'thêm vào đó', 'đồng thời', 'không những thế',
  'mặt khác', 'tuy nhiên', 'do đó', 'vì vậy', 'chính vì vậy', 'chính vì thế', 'nhờ đó',
  'từ đó', 'qua đó', 'cụ thể', 'đặc biệt', 'thậm chí', 'trên thực tế', 'nói cách khác',
];
