<div align="center">

# ✍️ Chuốt Văn

**Turn AI-sounding, machine-translated Vietnamese into natural Vietnamese.**

An agent skill for Claude Code, Codex, Gemini CLI, Cursor, Copilot… plus an offline "AI smell" scorer.

[Tiếng Việt](README.md) · English

</div>

---

*Chuốt văn* means "polishing prose" in Vietnamese. AI models write Vietnamese that native readers spot instantly: English structures translated word for word ("một cách hiệu quả" = *effectively*, "được … bởi" = *by*-passives, "đóng vai trò quan trọng" = *plays a crucial role*), chatbot openers ("Chắc chắn rồi!", "Dưới đây là…"), buzzwords ("hành trình", "nâng tầm", "toàn diện") and a monotonous rhythm.

Chuốt Văn teaches your agent to spot those tells and rewrite the text, keeping the meaning, numbers, names and terminology intact.

> **Before:** Trong bối cảnh cuộc sống hiện đại ngày nay, cà phê đóng vai trò vô cùng quan trọng trong thói quen hằng ngày của nhiều người. Hãy cùng khám phá những lợi ích tuyệt vời này nhé!
>
> **After:** Một ly cà phê buổi sáng giúp tỉnh người nhanh. Caffeine ngấm vào máu chỉ sau vài phút và phát huy tác dụng rõ nhất sau khoảng một tiếng.

## ✨ Features

| | |
|---|---|
| 🇻🇳 **Built for Vietnamese** | Not an English humanizer translated. 30+ detectors for Vietnamese-specific AI and translationese patterns, with Unicode-aware word boundaries. |
| 🎯 **Meaning-preserving** | Never invents facts or numbers; leaves terms, names, code and URLs alone. |
| 🗣️ **Register-aware** | Social media, work email, news, blog, product copy, administrative and academic writing. |
| 📏 **Measurable** | `chuot-van` CLI scores text 0–100 and reports each issue with line:column. Offline, no API key, nothing leaves your machine. |
| 🔌 **One skill, every agent** | Follows the open [Agent Skills](https://agentskills.io) standard (`SKILL.md`). |
| 🆓 **Free & open source** | MIT. Zero dependencies. |

## 📥 Install

**Claude Code plugin**

```
/plugin marketplace add mahiepit/ChuotVan
/plugin install chuot-van@chuot-van
```

**Any agent (Node.js 18+)**

```bash
npx github:mahiepit/ChuotVan install                    # Claude Code (~/.claude/skills)
npx github:mahiepit/ChuotVan install --target agents    # Codex, Gemini CLI, Cursor, Copilot (~/.agents/skills)
npx github:mahiepit/ChuotVan install --target agents --project   # current project only
```

Other targets: `codex`, `cursor`, `gemini`.

**Claude.ai / Claude Desktop**: download `chuot-van.zip` from [Releases](https://github.com/mahiepit/ChuotVan/releases) and upload it under **Settings → Capabilities → Skills**.

**Manual**: copy [`skills/chuot-van`](skills/chuot-van) into your agent's skills folder.

## 🖱️ Usage

Talk to your agent in Vietnamese as usual: *"Chuốt lại đoạn này cho tự nhiên: …"* ("polish this paragraph so it sounds natural"), *"Bài này giọng AI quá, sửa giúp mình"* ("this sounds too AI, fix it").

Scorer:

```bash
npx github:mahiepit/ChuotVan post.md
npx github:mahiepit/ChuotVan --text "Hãy cùng khám phá…" --json
npx github:mahiepit/ChuotVan docs/*.md --max 30     # exit 1 above the threshold (CI gate)
```

```js
import { analyze } from 'chuot-van';
const { score, verdict, findings } = analyze(text);
```

The score is a signal, not an AI detector: humans also write "tuy nhiên" (*however*). Text smells of AI when many tells pile up in a short passage.

## ❤️ Support the project

Chuốt Văn is free and always will be. If it saves you time, a donation keeps it maintained and improving. Thank you!

<table>
<tr>
<td align="center"><b>PayPal</b><br><img src="docs/img/donate-paypal.svg" width="180" alt="PayPal QR"><br><a href="https://paypal.me/thaogia">paypal.me/thaogia</a></td>
<td align="center"><b>BNB (BEP-20) / ETH (ERC-20)</b><br><img src="docs/img/donate-crypto.svg" width="180" alt="BNB / ETH QR"><br><code>0xd09c2E60cbC8526976C436e316630FA64296E824</code></td>
</tr>
</table>

Please double-check the network (BNB Smart Chain or Ethereum) before sending crypto.

## 📄 License

[MIT](LICENSE) © Thảo Gia.
