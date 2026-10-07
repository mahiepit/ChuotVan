# Dấu hiệu văn AI và văn dịch máy trong tiếng Việt

Mỗi mục: dấu hiệu → vì sao nó lộ → cách sửa, kèm ví dụ trước/sau. Mã trong ngoặc là `id` mà `scripts/check.mjs` báo.

Một dấu hiệu đơn lẻ chưa nói lên gì: người thật cũng viết "Tuy nhiên", "đáng kể". Văn có mùi AI khi **nhiều dấu hiệu dồn lại trong một đoạn ngắn**.

## Mục lục

- [1. Câu mở và kết kiểu chatbot](#1-câu-mở-và-kết-kiểu-chatbot)
- [2. Cấu trúc dịch từ tiếng Anh](#2-cấu-trúc-dịch-từ-tiếng-anh)
- [3. Danh từ hóa](#3-danh-từ-hóa)
- [4. Từ sáo rỗng, phóng đại](#4-từ-sáo-rỗng-phóng-đại)
- [5. Từ nối đầu câu dày đặc](#5-từ-nối-đầu-câu-dày-đặc)
- [6. Rào đón](#6-rào-đón)
- [7. Định dạng](#7-định-dạng)
- [8. Nhịp văn](#8-nhịp-văn)
- [9. Những thứ máy không bắt được](#9-những-thứ-máy-không-bắt-được-phải-tự-đọc)

---

## 1. Câu mở và kết kiểu chatbot

| Dấu hiệu | Sửa |
|---|---|
| "Chắc chắn rồi!", "Câu hỏi rất hay!", "Rất sẵn lòng!" (`chac-chan-roi`) | Bỏ. |
| "Dưới đây là…", "Sau đây là một số…" (`duoi-day-la`) | Bỏ, đưa luôn nội dung. |
| "Hãy cùng khám phá / tìm hiểu…" (`hay-cung`) | Bỏ. |
| "Bạn đã bao giờ tự hỏi…?" (`ban-co-bao-gio`) | Mở bằng một sự thật cụ thể. |
| "Trong bài viết này, chúng ta sẽ…" (`trong-bai-viet-nay`) | Bỏ. |
| "Tóm lại", "Nhìn chung", "Cuối cùng nhưng không kém phần quan trọng" (`tom-lai`) | Bỏ cả đoạn nếu chỉ lặp ý. |
| "Hy vọng bài viết này hữu ích!", "Nếu có bất kỳ câu hỏi nào…" (`hy-vong-huu-ich`) | Bỏ. |

> ✗ Chắc chắn rồi! Dưới đây là 5 mẹo giúp bạn ngủ ngon hơn. Hãy cùng khám phá nhé!
> ✓ Năm cách dễ ngủ hơn, thử được ngay tối nay:

## 2. Cấu trúc dịch từ tiếng Anh

**"một cách + tính từ"** (`mot-cach`) — dịch từ trạng từ đuôi *-ly*. Tiếng Việt đặt tính từ ngay sau động từ.
> ✗ Hệ thống xử lý dữ liệu một cách nhanh chóng và chính xác.
> ✓ Hệ thống xử lý dữ liệu nhanh và chính xác.

**"được … bởi"** (`duoc-boi`) — bị động có tác nhân (*by*). Tiếng Việt chuộng chủ động hoặc "do".
> ✗ Ứng dụng được phát triển bởi một nhóm sinh viên.
> ✓ Ứng dụng do một nhóm sinh viên phát triển. / Một nhóm sinh viên đã viết ứng dụng này.

Lưu ý: "được" mang nghĩa *hưởng lợi* thì tự nhiên ("được thưởng", "được nghỉ"). Chỉ sửa khi có "bởi".

**"đóng vai trò quan trọng"** (`dong-vai-tro`) — *play a crucial role*.
> ✗ Giấc ngủ đóng vai trò vô cùng quan trọng đối với sức khỏe.
> ✓ Ngủ không đủ thì sức đề kháng giảm, trí nhớ kém đi.

**"Trong bối cảnh / thế giới / thời đại … ngày nay"** (`trong-boi-canh`) — *In today's world*.
> ✗ Trong thời đại công nghệ 4.0 ngày nay, kỹ năng số ngày càng quan trọng.
> ✓ Gần như việc văn phòng nào bây giờ cũng cần biết dùng bảng tính.

**"Điều quan trọng là / Cần lưu ý rằng / Đáng chú ý là"** (`dieu-quan-trong-la`)
> ✗ Điều quan trọng cần lưu ý là bạn nên sao lưu dữ liệu trước khi cập nhật.
> ✓ Sao lưu dữ liệu trước khi cập nhật.

**"không chỉ … mà còn"** (`khong-chi-ma-con`) — một lần thì được; AI dùng nó ở mọi đoạn.

**"là một trong những"** (`la-mot-trong-nhung`) — *one of the*. Nói luôn điểm đặc biệt.
> ✗ Đà Lạt là một trong những điểm du lịch nổi tiếng nhất Việt Nam.
> ✓ Mỗi năm Đà Lạt đón [số] triệu lượt khách. *(điền số liệu thật — đừng bịa)*

**"Điều này cho thấy / giúp / có nghĩa là"** (`dieu-nay`) — *This shows/means*. Gộp vào câu trước.

**"cho phép bạn"** (`cho-phep-ban`) — *allows you to* → "bạn có thể", hoặc "để".

**"chìa khóa để"** (`chia-khoa`) — *the key to*.

**"Với sự phát triển của…"** (`voi-su`) — *With the development of*.

**"nhiều/các … khác nhau"** (`nhieu-khac-nhau`) — *various*. "Khác nhau" thường thừa.
> ✗ Cửa hàng có nhiều mẫu mã khác nhau.  ✓ Cửa hàng có nhiều mẫu.

**"mang lại nhiều lợi ích / giá trị / trải nghiệm"** (`mang-lai-loi-ich`) — nêu lợi ích cụ thể.

**"đảm bảo rằng / hãy chắc chắn rằng"** (`dam-bao-rang`) — *make sure that* → "nhớ…", "kiểm tra…".

**"Nó" chỉ đồ vật đầu câu** — tiếng Việt hay lược chủ ngữ hoặc lặp danh từ.
> ✗ Chiếc máy này rất nhẹ. Nó chỉ nặng 1,2 kg.  ✓ Máy nhẹ, chỉ 1,2 kg.

## 3. Danh từ hóa

| Dấu hiệu | Sửa |
|---|---|
| "Việc + động từ" đầu câu (`viec-dau-cau`) | *Việc tập thể dục đều đặn giúp…* → *Tập thể dục đều giúp…* |
| "thực hiện / tiến hành + danh từ" (`thuc-hien-viec`) | *tiến hành kiểm tra* → *kiểm tra*; *thực hiện việc thanh toán* → *thanh toán* |
| "sự + động từ" (`su-dong-tu`) | *sự gia tăng của giá nhà* → *giá nhà tăng* |
| "có khả năng + động từ" (`co-kha-nang`) | *có khả năng hỗ trợ* → *hỗ trợ được / hỗ trợ* |

## 4. Từ sáo rỗng, phóng đại

Hay gặp (`tu-sao`, `kham-pha-trai-nghiem`, `nhan-manh-rong`, `giai-phap`): *hành trình, khám phá, trải nghiệm, nâng tầm, bứt phá, đột phá, toàn diện, vượt trội, tối ưu hóa, liền mạch, hệ sinh thái, kỷ nguyên mới, chinh phục, kho tàng, bức tranh toàn cảnh, đa dạng và phong phú, không thể bỏ qua, hoàn hảo, đỉnh cao, vô cùng, cực kỳ, tuyệt vời, mạnh mẽ, ấn tượng, giải pháp tối ưu, lựa chọn hoàn hảo, lan tỏa*.

Cách sửa: hỏi "cụ thể là gì?". Nếu trả lời được thì viết câu trả lời đó. Nếu không thì bỏ.
> ✗ Sản phẩm mang đến trải nghiệm vượt trội với hiệu năng mạnh mẽ.
> ✓ Máy mở 30 tab Chrome vẫn không giật. *(nếu có thông tin)* / Máy chạy mượt.

## 5. Từ nối đầu câu dày đặc

"Hơn nữa, Ngoài ra, Bên cạnh đó, Thêm vào đó, Đồng thời, Không những thế, Mặt khác, Do đó, Vì vậy, Nhờ đó, Từ đó, Qua đó…" (`noi-cau`). Người viết thật nối ý bằng nội dung, không cần biển báo trước mỗi câu.
> ✗ Cà phê giúp tỉnh táo. Hơn nữa, nó giúp tập trung. Ngoài ra, nó còn cải thiện tâm trạng. Bên cạnh đó, nó hỗ trợ giảm cân.
> ✓ Cà phê giúp tỉnh táo và tập trung hơn. Nhiều người còn thấy vui hơn sau ly đầu tiên.

## 6. Rào đón

"Có thể nói rằng", "Có thể thấy rằng", "Không thể phủ nhận rằng", "Như chúng ta đã biết", "tùy thuộc vào nhiều yếu tố" (`rao-don`). Bỏ, hoặc nêu yếu tố cụ thể.

Xưng "bạn" ở mọi câu (`ban-qua-day`) → lược bớt chủ ngữ.
> ✗ Bạn nên uống đủ nước. Bạn cũng nên ngủ đủ giấc. Bạn hãy tập thể dục mỗi ngày.
> ✓ Uống đủ nước, ngủ đủ giấc, tập thể dục mỗi ngày.

## 7. Định dạng

| Dấu hiệu | Sửa |
|---|---|
| Tiêu đề Viết Hoa Mỗi Chữ (`tieu-de-hoa`) | Chỉ viết hoa chữ đầu và tên riêng. |
| Chuỗi gạch đầu dòng "**Nhãn:** giải thích" (`gach-dau-dong-in-dam`) | Viết thành đoạn văn nếu các ý liền nhau. |
| Emoji đầu mỗi dòng (`emoji-dau-dong`) | Bỏ, trừ bài mạng xã hội. |
| Gạch ngang dài "—" dày đặc (`gach-ngang-dai`) | Dấu phẩy, dấu chấm, dấu hai chấm. |
| In đậm khắp nơi (`in-dam-nhieu`) | Chỉ in đậm 1–2 chỗ thật cần. |
| Khoảng trắng trước dấu câu "abc ," (`khoang-trang-dau-cau`) | "abc," |

## 8. Nhịp văn

- Câu nào cũng dài 15–20 chữ (`nhip-deu`) → xen câu ngắn. Một câu ba chữ đặt đúng chỗ làm cả đoạn sống lại.
- Liệt kê bộ ba "A, B và C" liên tục (`bo-ba`) → giữ hai, hoặc thêm thành bốn, hoặc tách câu.
- Ba câu liền mở bằng cùng một chữ (`lap-dau-cau`).
- Mỗi đoạn đúng ba câu, đoạn nào cũng "mở – thân – kết" → phá khuôn: đoạn một câu, đoạn năm câu.

## 9. Những thứ máy không bắt được (phải tự đọc)

- **Ý thừa**: câu nói lại điều câu trước vừa nói bằng từ khác.
- **Khen chung chung** không có bằng chứng.
- **Cân bằng giả**: "Tuy nhiên, mỗi phương pháp đều có ưu và nhược điểm riêng" — câu không nói gì.
- **Giọng không ai nói**: đọc to lên. Câu nào bạn không bao giờ nói thành tiếng với người khác thì viết lại.
- **Kết luận đạo lý**: "Hãy luôn trân trọng những khoảnh khắc…" cuối bài.
