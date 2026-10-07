---
name: chuot-van
description: Chuốt văn tiếng Việt — viết lại văn bản tiếng Việt nghe như AI, chatbot hay dịch máy thành văn tự nhiên như người Việt viết, giữ nguyên ý và số liệu. Dùng khi người dùng nhờ sửa, biên tập, viết lại, "bớt giọng AI", "cho tự nhiên hơn", "đọc như người viết", "đừng sến", "văn dịch quá"; khi chấm xem một đoạn có "mùi AI" không; hoặc trước khi tự viết một đoạn tiếng Việt dài (bài đăng, email, mô tả sản phẩm, blog, thông báo). Humanize / de-AI Vietnamese text.
license: MIT
metadata:
  version: "1.0.0"
  author: Thảo Gia
  homepage: https://github.com/mahiepit/ChuotVan
---

# Chuốt Văn

Mục tiêu: văn bản đọc lên như một người Việt viết tốt đã viết ra — không phải chatbot, không phải bản dịch từ tiếng Anh. Giữ nguyên **ý, số liệu, tên riêng, thuật ngữ chuyên ngành, giọng của tác giả**. Không thêm thông tin mới.

## Quy trình

1. **Xác định văn phong đích** từ ngữ cảnh: mạng xã hội, email công việc, báo chí, blog, mô tả sản phẩm, văn bản hành chính, học thuật, tin nhắn. Nếu không rõ, giữ văn phong gốc nhưng bỏ dấu hiệu AI. Xem [references/van-phong.md](references/van-phong.md).
2. **Chấm điểm bản gốc** (nếu chạy được Node 18+):
   ```bash
   node scripts/check.mjs --text "…đoạn văn…"      # hoặc: node scripts/check.mjs bai-viet.md
   ```
   Đường dẫn `scripts/` tính từ thư mục của skill này. Kết quả liệt kê từng dấu hiệu theo dòng:cột và điểm "mùi AI" 0–100. Không có Node thì tự rà theo [references/dau-hieu.md](references/dau-hieu.md).
3. **Viết lại** theo các nguyên tắc bên dưới. Công cụ chỉ bắt được dấu hiệu bề mặt — phần quan trọng hơn (nhịp, ý thừa, giọng) phải tự đọc và sửa.
4. **Chấm lại** bản mới. Mục tiêu dưới 15 điểm. Đừng sửa cố cho về 0 nếu phải hy sinh nghĩa — một từ "tuyệt vời" đặt đúng chỗ vẫn ổn.
5. **Trả kết quả**: chỉ đưa bản đã chuốt. Thêm 2–4 gạch đầu dòng "đã sửa gì" khi người dùng hỏi, hoặc khi bạn cắt bỏ một ý (để họ biết mà khôi phục).

## Nguyên tắc viết lại

**Cắt trước, sửa sau.** Phần lớn "mùi AI" nằm ở chữ thừa. Bỏ câu mở kiểu chatbot ("Chắc chắn rồi!", "Dưới đây là…"), câu kéo người đọc ("Hãy cùng khám phá…"), câu giới thiệu bài viết ("Trong bài viết này…"), đoạn "Tóm lại" lặp ý, câu kết "Hy vọng thông tin này hữu ích". Mở bằng ý chính, kết bằng ý cuối có giá trị.

**Bỏ cấu trúc dịch từ tiếng Anh.**
- "một cách + tính từ" → bỏ "một cách": *tăng một cách đáng kể* → *tăng mạnh / tăng 30%*.
- "được … bởi" → chủ động hoặc "do": *được phát triển bởi Google* → *do Google phát triển*.
- "đóng vai trò quan trọng trong" → nói nó làm gì: *quyết định*, *giữ*, *nhờ … mà*.
- "Trong bối cảnh ngày nay / Trong thời đại số" → bỏ, hoặc nêu mốc cụ thể.
- "Điều quan trọng là / Cần lưu ý rằng" → bỏ, nói luôn điều đó.
- "không chỉ … mà còn" dùng nhiều lần → tách câu hoặc chỉ giữ ý mạnh.
- "là một trong những" → nói thẳng điểm khác biệt.
- "Nó" chỉ đồ vật ở đầu câu → lặp lại danh từ, hoặc lược chủ ngữ.

**Động từ thay cho danh từ hóa.** *Việc học tiếng Anh sớm giúp…* → *Học tiếng Anh sớm giúp…*. *Tiến hành kiểm tra* → *kiểm tra*. *Sự gia tăng của giá vàng* → *giá vàng tăng*.

**Cụ thể thay cho sáo rỗng.** Thay "toàn diện, vượt trội, nâng tầm, hành trình, trải nghiệm tuyệt vời, giải pháp tối ưu" bằng chi tiết: con số, ví dụ, tên, thời gian. Không có chi tiết thì bỏ tính từ, đừng bịa số.

**Nhịp câu tự nhiên.** Xen câu ngắn (3–6 chữ) với câu dài. Đừng mở ba câu liền bằng cùng một chữ. Bỏ bớt từ nối đầu câu ("Hơn nữa", "Ngoài ra", "Bên cạnh đó") — câu sau nối tiếp câu trước là đủ hiểu. Phá thói quen liệt kê bộ ba "A, B và C".

**Xưng hô nhất quán và tiết chế.** Chọn một cách xưng hô (bạn / anh chị / quý khách / mình – các bạn) và giữ nguyên. Tiếng Việt cho phép lược chủ ngữ: đừng để "bạn" ở mọi câu.

**Định dạng vừa đủ.** Tiêu đề viết hoa chữ đầu thôi ("Lợi ích của cà phê", không phải "Lợi Ích Của Cà Phê"). Gạch đầu dòng "**Nhãn:** giải thích" lặp đi lặp lại → viết thành đoạn văn nếu ý liền mạch. Hạn chế gạch ngang dài "—", emoji đầu dòng, in đậm dày đặc (trừ khi văn phong mạng xã hội cần). Dấu câu dính chữ đứng trước.

**Từ ngữ.** Ưu tiên từ thuần Việt, thông dụng khi văn phong đời thường (*dùng* thay *sử dụng* khi được, *giúp* thay *hỗ trợ*, *cần* thay *có nhu cầu*), nhưng giữ Hán Việt trong văn hành chính, học thuật. Không thêm tiếng lóng, không "trẻ hóa" giọng nếu bản gốc không như vậy.

## Không được làm

- Không đổi nghĩa, không thêm dữ kiện, không bịa số liệu hay ví dụ cụ thể mà bản gốc không có. Nếu bản gốc chung chung và bạn cần chi tiết, hỏi lại người dùng hoặc để chỗ trống `[số liệu]`.
- Không sửa thuật ngữ chuyên ngành, tên riêng, trích dẫn, code, URL, số điện thoại.
- Không biến văn trang trọng thành suồng sã (hay ngược lại) trừ khi được yêu cầu.
- Không giải thích dài dòng về những gì đã sửa nếu người dùng không hỏi.

## Tài liệu kèm theo

- [references/dau-hieu.md](references/dau-hieu.md) — danh mục dấu hiệu văn AI/dịch máy, ví dụ trước–sau. Đọc khi cần sửa kỹ hoặc không chạy được script.
- [references/van-phong.md](references/van-phong.md) — đặc điểm từng văn phong (mạng xã hội, email, báo chí, bán hàng, hành chính, học thuật).
- [references/vi-du.md](references/vi-du.md) — các bài mẫu đã chuốt trọn vẹn, có giải thích.
- `scripts/check.mjs` — chấm điểm; `--json` để lấy kết quả máy đọc được.
