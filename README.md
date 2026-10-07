<div align="center">

# ✍️ Chuốt Văn

**Biến văn AI, văn dịch máy thành tiếng Việt tự nhiên như người viết.**

Agent skill cho Claude Code, Codex, Gemini CLI, Cursor, Copilot… kèm công cụ chấm điểm "mùi AI" chạy offline.

Tiếng Việt · [English](README.en.md)

</div>

---

Bạn nhờ AI viết một bài đăng, và nó trả về thế này:

> Trong bối cảnh cuộc sống hiện đại ngày nay, cà phê đóng vai trò vô cùng quan trọng trong thói quen hằng ngày của nhiều người. Không chỉ giúp tỉnh táo, cà phê mà còn mang lại nhiều lợi ích cho sức khỏe. Hãy cùng khám phá những lợi ích tuyệt vời này nhé!

Đọc là biết máy viết. **Chuốt Văn** dạy AI agent nhận ra những dấu hiệu đó và viết lại:

> Một ly cà phê buổi sáng giúp tỉnh người nhanh. Caffeine ngấm vào máu chỉ sau vài phút và phát huy tác dụng rõ nhất sau khoảng một tiếng.

## ✨ Vì sao dùng Chuốt Văn

| | |
|---|---|
| 🇻🇳 **Viết riêng cho tiếng Việt** | Không phải bộ "humanizer" tiếng Anh dịch lại. Bắt đúng lỗi của văn AI tiếng Việt: "một cách hiệu quả", "được … bởi", "đóng vai trò quan trọng", "Việc + động từ", "Hãy cùng khám phá"… |
| 🎯 **Giữ nguyên ý** | Không bịa số liệu, không đổi thuật ngữ, tên riêng, code, URL. Chỉ cắt chữ thừa và sửa cách diễn đạt. |
| 🗣️ **Đúng văn phong** | Mạng xã hội, email công việc, báo chí, blog, mô tả sản phẩm, hành chính, học thuật: mỗi kiểu một cách chuốt. |
| 📏 **Chấm điểm được** | Công cụ `chuot-van` chấm "mùi AI" 0–100, chỉ rõ từng lỗi theo dòng:cột. Chạy offline, không cần API key, không gửi văn bản đi đâu. |
| 🔌 **Một skill, mọi agent** | Theo chuẩn mở [Agent Skills](https://agentskills.io) (`SKILL.md`). |
| 🆓 **Miễn phí, mã nguồn mở** | MIT. Không quảng cáo, không thu thập dữ liệu. |

## 📥 Cài đặt

### Claude Code (plugin)

```
/plugin marketplace add mahiepit/ChuotVan
/plugin install chuot-van@chuot-van
```

### Mọi agent (cần Node.js 18+)

```bash
npx github:mahiepit/ChuotVan install                    # Claude Code (~/.claude/skills)
npx github:mahiepit/ChuotVan install --target agents    # Codex, Gemini CLI, Cursor, Copilot (~/.agents/skills)
npx github:mahiepit/ChuotVan install --target agents --project   # chỉ cho dự án hiện tại (./.agents/skills)
```

Các `--target` khác: `codex` (`~/.codex/skills`), `cursor` (`~/.cursor/skills`), `gemini` (`~/.gemini/skills`).

### Claude.ai / Claude Desktop

Tải `chuot-van.zip` ở [Releases](https://github.com/mahiepit/ChuotVan/releases), vào **Settings → Capabilities → Skills → Upload skill**.

### Cài tay

Chép thư mục [`skills/chuot-van`](skills/chuot-van) vào thư mục skills của agent bạn dùng.

## 🖱️ Cách dùng

Cài xong, cứ nói chuyện bình thường với agent:

- *"Chuốt lại đoạn này cho tự nhiên: …"*
- *"Bài này đọc giọng AI quá, sửa giúp mình, văn phong Facebook."*
- *"Viết email báo giá cho anh Minh, đừng để giọng chatbot."*
- *"Chấm xem file bai-viet.md có mùi AI không."*

Agent sẽ tự dùng skill: xác định văn phong, chấm bản gốc, viết lại, chấm lại bản mới.

## 📏 Công cụ chấm điểm

```bash
npx github:mahiepit/ChuotVan bai-viet.md
npx github:mahiepit/ChuotVan --text "Hãy cùng khám phá những lợi ích tuyệt vời này nhé!"
cat bai.txt | npx github:mahiepit/ChuotVan --json
```

Ví dụ (rút gọn):

```
van-ai.md:3:1   nặng  chac-chan-roi «Chắc chắn rồi»
    Câu mở đầu kiểu chatbot. → Bỏ hẳn, vào thẳng nội dung.
van-ai.md:5:52  vừa   dong-vai-tro «đóng vai trò vô cùng quan trọng»
    "Play a crucial role" dịch sát chữ. → Nói nó làm gì cụ thể: "X giữ…", "X quyết định…", "nhờ X mà…".
van-ai.md:7:53  vừa   mot-cach «một cách nhanh chóng»
    "một cách + tính từ" dịch từ trạng từ -ly. → Bỏ "một cách": "làm hiệu quả", "chạy nhanh".
van-ai.md:7:93  vừa   duoc-boi «được hấp thụ bởi»
    Bị động "được … bởi" (by) kiểu tiếng Anh. → Đổi sang chủ động: "X làm Y" hoặc "Y do X làm".
…
van-ai.md  Mùi AI: █████████████████░░░ 86/100  Rất giống văn AI
247 chữ, 16 câu, 31 dấu hiệu — Định dạng kiểu AI: 4 · Câu mở/kết kiểu chatbot: 5 · Cấu trúc dịch từ tiếng Anh: 12 · …
```

| Điểm | Đánh giá |
|---|---|
| 0–14 | Tự nhiên |
| 15–34 | Hơi có mùi AI |
| 35–59 | Mùi AI rõ |
| 60–100 | Rất giống văn AI |

Tùy chọn: `--json` (máy đọc), `--score` (chỉ in điểm), `--max 30` (thoát mã 1 nếu vượt ngưỡng, dùng trong CI để chặn nội dung "giọng AI" trước khi đăng), `--no-color`.

Dùng như thư viện:

```js
import { analyze } from 'chuot-van';
const { score, verdict, findings } = analyze('Hãy cùng khám phá…');
```

Điểm số chỉ là **tín hiệu**, không phải máy dò AI. Người thật cũng viết "tuy nhiên", "đáng kể". Văn có mùi AI khi nhiều dấu hiệu dồn lại trong một đoạn ngắn. Ngược lại, văn điểm 0 vẫn có thể dở. Phần đó để skill và người viết lo.

## 🧠 Skill bắt những gì

| Nhóm | Ví dụ |
|---|---|
| Câu mở/kết kiểu chatbot | "Chắc chắn rồi!", "Dưới đây là…", "Hãy cùng khám phá", "Tóm lại", "Hy vọng bài viết hữu ích" |
| Cấu trúc dịch từ tiếng Anh | "một cách + tính từ", "được … bởi", "đóng vai trò quan trọng", "Trong bối cảnh ngày nay", "Điều quan trọng là", "là một trong những", "cho phép bạn" |
| Danh từ hóa | "Việc + động từ" đầu câu, "tiến hành kiểm tra", "sự gia tăng của" |
| Sáo rỗng | "hành trình", "nâng tầm", "toàn diện", "vượt trội", "giải pháp tối ưu", "trải nghiệm tuyệt vời" |
| Từ nối dày đặc | "Hơn nữa… Ngoài ra… Bên cạnh đó…" |
| Định dạng | Tiêu Đề Viết Hoa Mỗi Chữ, chuỗi "**Nhãn:** …", emoji đầu dòng, gạch ngang dài "—" |
| Nhịp văn | Câu dài đều nhau, liệt kê bộ ba liên tục, ba câu liền cùng chữ mở đầu |

Danh mục đầy đủ có ví dụ trước–sau: [references/dau-hieu.md](skills/chuot-van/references/dau-hieu.md). Bài mẫu chuốt trọn vẹn: [references/vi-du.md](skills/chuot-van/references/vi-du.md).

## 🧩 Cấu trúc

```
skills/chuot-van/
├── SKILL.md                 quy trình và nguyên tắc cho agent
├── references/
│   ├── dau-hieu.md          danh mục dấu hiệu văn AI + cách sửa
│   ├── van-phong.md         đặc điểm từng văn phong
│   └── vi-du.md             bài mẫu trước–sau
└── scripts/
    ├── rules.mjs            luật phát hiện (regex có ranh giới từ tiếng Việt)
    ├── check.mjs            chấm điểm
    └── cli.mjs              dòng lệnh + lệnh install
.claude-plugin/              manifest plugin cho Claude Code
bin/chuot-van.mjs            lệnh `chuot-van`
```

Không có dependency nào. Chạy `npm test` để kiểm tra.

## 🤝 Đóng góp

Gặp cụm từ "giọng AI" mà công cụ chưa bắt? Mở [issue](https://github.com/mahiepit/ChuotVan/issues) kèm câu ví dụ, hoặc gửi PR thêm luật vào [`rules.mjs`](skills/chuot-van/scripts/rules.mjs) cùng một test trong [`tests/`](tests). Luật mới cần một test "bắt được" và một test "không bắt nhầm" văn người viết.

## 🔗 Dự án khác

- **[ControlPhone](https://github.com/mahiepit/ControlPhone)**: điều khiển nhiều điện thoại Android cùng lúc, xem màn hình trực tiếp
- **[DiaChiMoi](https://github.com/mahiepit/DiaChiMoi)**: chuyển địa chỉ cũ sang đơn vị hành chính mới sau sáp nhập 2025
- **[SkillLint](https://github.com/mahiepit/SkillLint)**: kiểm tra SKILL.md có hợp lệ và chạy được trên mọi agent
- **[PaperViet](https://github.com/mahiepit/PaperViet)**: đọc bài báo khoa học tiếng Anh bằng tiếng Việt

## ❤️ Ủng hộ dự án

Chuốt Văn miễn phí và sẽ luôn miễn phí. Nếu nó giúp bạn tiết kiệm thời gian, một khoản ủng hộ nhỏ giúp dự án được duy trì. Cảm ơn bạn!

<table>
<tr>
<td align="center"><b>PayPal</b><br><img src="docs/img/donate-paypal.svg" width="180" alt="PayPal QR"><br><a href="https://paypal.me/thaogia">paypal.me/thaogia</a></td>
<td align="center"><b>BNB (BEP-20) / ETH (ERC-20)</b><br><img src="docs/img/donate-crypto.svg" width="180" alt="BNB / ETH QR"><br><code>0xd09c2E60cbC8526976C436e316630FA64296E824</code></td>
</tr>
</table>

Vui lòng kiểm tra kỹ mạng (BNB Smart Chain hoặc Ethereum) trước khi gửi crypto.

## 📄 Giấy phép

[MIT](LICENSE) © Thảo Gia.
