#!/usr/bin/env node
// Chuốt Văn — chấm "mùi AI" cho văn bản tiếng Việt. Không cần cài gì ngoài Node 18+.
// Dùng: node check.mjs bai-viet.md      |  cat bai.txt | node check.mjs  |  node check.mjs --json file
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { RULES, CONNECTORS, GROUPS, W, S } from './rules.mjs';

const WEIGHT = { 1: 1, 2: 2.5, 3: 5 };

// Che code, URL, front matter để không bắt nhầm — giữ nguyên độ dài và xuống dòng để vị trí không lệch.
function mask(text) {
  const blank = (m) => m.replace(/[^\n]/g, ' ');
  return text
    .replace(/^---\n[\s\S]*?\n---\n/, blank)
    .replace(/```[\s\S]*?```/g, blank)
    .replace(/`[^`\n]+`/g, blank)
    .replace(/https?:\/\/\S+/g, blank)
    .replace(/<[^>\n]+>/g, blank);
}

function lineIndex(text) {
  const starts = [0];
  for (let i = 0; i < text.length; i++) if (text[i] === '\n') starts.push(i + 1);
  return (pos) => {
    let lo = 0, hi = starts.length - 1;
    while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (starts[mid] <= pos) lo = mid; else hi = mid - 1; }
    return { line: lo + 1, col: pos - starts[lo] + 1 };
  };
}

const countWords = (t) => (t.match(/[\p{L}\p{N}]+/gu) || []).length;

// Tách câu văn xuôi (bỏ tiêu đề, dòng trống). Gạch đầu dòng tính là một câu.
function sentences(text) {
  const out = [];
  let offset = 0;
  for (const content of text.split('\n')) {
    if (content.trim() && !/^\s*#/.test(content)) {
      for (const m of content.matchAll(/[^.!?…\n]+[.!?…]*/gu)) {
        const s = m[0].replace(/^\s*(?:[-*+•]|\d+[.)])\s+/, '').trim();
        const words = countWords(s);
        if (words >= 3) out.push({ text: s, words, pos: offset + m.index + (m[0].length - m[0].trimStart().length) });
      }
    }
    offset += content.length + 1;
  }
  return out;
}

export function analyze(input, { minWords = 80 } = {}) {
  const text = String(input).normalize('NFC').replace(/\r\n?/g, '\n');
  const masked = mask(text);
  const at = lineIndex(text);
  const words = countWords(masked);
  let found = [];

  const add = (rule, index, length, extra = {}) => {
    const { line, col } = at(index);
    found.push({ id: rule.id, group: rule.group, level: rule.level, line, col, index, length,
      match: text.slice(index, index + length), message: rule.msg, fix: rule.fix, ...extra });
  };

  for (const rule of RULES) {
    rule.re.lastIndex = 0;
    for (const m of masked.matchAll(rule.re)) if (m[0].trim()) add(rule, m.index, m[0].length);
  }

  // Bỏ trùng: một đoạn chữ chỉ bị bắt một lần, ưu tiên luật nặng hơn.
  found.sort((a, b) => b.level - a.level || a.index - b.index);
  const kept = [];
  for (const f of found) {
    if (!kept.some((k) => f.index < k.index + k.length && k.index < f.index + f.length)) kept.push(f);
  }
  found = kept;

  // Từ nối đầu câu: chỉ là vấn đề khi dày đặc hoặc lặp lại.
  const sents = sentences(masked);
  const connRe = S(CONNECTORS.join('|'));
  const conns = [...masked.matchAll(connRe)];
  const perWord = {};
  for (const m of conns) perWord[m[0].toLowerCase()] = (perWord[m[0].toLowerCase()] || 0) + 1;
  const dense = conns.length >= 3 && conns.length / Math.max(sents.length, 1) >= 0.12;
  // Đoạn văn (ngăn bởi dòng trống) có từ 2 câu mở bằng từ nối trở lên.
  const para = (i) => (masked.slice(0, i).match(/\n\s*\n/g) || []).length;
  const perPara = {};
  for (const m of conns) perPara[para(m.index)] = (perPara[para(m.index)] || 0) + 1;
  for (const m of conns) {
    const w = m[0].toLowerCase();
    if (dense || perWord[w] >= 2 || perPara[para(m.index)] >= 2) {
      add({ id: 'noi-cau', group: 'noi-cau', level: 1,
        msg: `Mở câu bằng "${m[0]}" (${conns.length} câu mở bằng từ nối).`,
        fix: 'Bỏ bớt từ nối; câu sau nối tiếp ý câu trước là đủ.' }, m.index, m[0].length);
    }
  }

  // Định dạng.
  const lines = text.split('\n');
  const maskedLines = masked.split('\n');
  let offset = 0;
  const boldLabels = [], emojiLines = [];
  maskedLines.forEach((l, i) => {
    const heading = l.match(/^\s*#{1,6}\s+(.+?)\s*#*\s*$/);
    if (heading) {
      const ws = heading[1].replace(/[*_:]/g, '').match(/[\p{L}]+/gu) || [];
      const caps = ws.filter((w) => /^\p{Lu}/u.test(w)).length;
      if (ws.length >= 3 && caps === ws.length) {
        add({ id: 'tieu-de-hoa', group: 'dinh-dang', level: 2,
          msg: 'Tiêu đề Viết Hoa Mỗi Chữ — kiểu tiếng Anh.', fix: 'Chỉ viết hoa chữ đầu và tên riêng.' },
          offset + l.indexOf(heading[1]), heading[1].length);
      }
    }
    if (/^\s*(?:[-*+•]|\d+[.)])\s+\*\*[^*]{1,60}\*\*\s*[:：]|^\s*(?:[-*+•]|\d+[.)])\s+\*\*[^*]{1,60}[:：]\*\*/u.test(l)) boldLabels.push(offset);
    if (/^\s*(?:[-*+•#]+\s*)?\p{Extended_Pictographic}/u.test(l)) emojiLines.push(offset);
    offset += lines[i].length + 1;
  });
  if (boldLabels.length >= 3) for (const p of boldLabels) add({ id: 'gach-dau-dong-in-dam', group: 'dinh-dang', level: 1,
    msg: `${boldLabels.length} gạch đầu dòng dạng "**Nhãn:** giải thích".`, fix: 'Viết thành đoạn văn, hoặc bỏ phần in đậm.' }, p, 1);
  if (emojiLines.length >= 3) for (const p of emojiLines) add({ id: 'emoji-dau-dong', group: 'dinh-dang', level: 1,
    msg: `${emojiLines.length} dòng mở đầu bằng emoji.`, fix: 'Bỏ emoji trang trí, trừ khi viết cho mạng xã hội.' }, p, 1);

  const dashes = [...masked.matchAll(/\s—\s|—/g)];
  if (dashes.length >= 3 || (dashes.length >= 2 && words < 200)) for (const m of dashes) add({ id: 'gach-ngang-dai', group: 'dinh-dang', level: 1,
    msg: `Dùng gạch ngang dài "—" ${dashes.length} lần.`, fix: 'Thay bằng dấu phẩy, dấu chấm hoặc dấu hai chấm.' }, m.index, m[0].length);

  const bolds = (masked.match(/\*\*[^*\n]+\*\*/g) || []).length;
  if (bolds >= 6 && bolds / Math.max(words, 1) > 0.02) add({ id: 'in-dam-nhieu', group: 'dinh-dang', level: 1,
    msg: `${bolds} cụm in đậm — quá dày.`, fix: 'Chỉ in đậm 1–2 điều thật sự cần nhấn.' }, masked.indexOf('**'), 2);

  for (const m of masked.matchAll(/(?<=[\p{L}\p{N}])\s+[,.;:!?](?=\s|$)/gmu)) add({ id: 'khoang-trang-dau-cau', group: 'dinh-dang', level: 1,
    msg: 'Có khoảng trắng trước dấu câu.', fix: 'Dấu câu dính liền chữ đứng trước.' }, m.index, m[0].length);

  // Nhịp văn.
  if (sents.length >= 8) {
    const lens = sents.map((s) => s.words);
    const mean = lens.reduce((a, b) => a + b, 0) / lens.length;
    const sd = Math.sqrt(lens.reduce((a, b) => a + (b - mean) ** 2, 0) / lens.length);
    const cv = sd / mean;
    if (cv < 0.25 && mean >= 10) add({ id: 'nhip-deu', group: 'nhip-van', level: 1,
      msg: `Các câu dài gần bằng nhau (trung bình ${mean.toFixed(0)} chữ, độ lệch ${(cv * 100).toFixed(0)}%).`,
      fix: 'Xen câu ngắn 3–6 chữ với câu dài; gộp hoặc cắt vài câu.' }, sents[0].pos, 1);
  }
  const triples = [...masked.matchAll(/(?<![\p{L}])[\p{L}]+(?: [\p{L}]+){0,3}, [\p{L}]+(?: [\p{L}]+){0,3},? và [\p{L}]+(?: [\p{L}]+){0,3}/gu)];
  if (triples.length >= 3) for (const m of triples) add({ id: 'bo-ba', group: 'nhip-van', level: 1,
    msg: `Liệt kê bộ ba "A, B và C" ${triples.length} lần.`, fix: 'Giữ ý mạnh nhất, hoặc đổi số lượng (hai, bốn) cho đỡ đều.' }, m.index, m[0].length);
  for (let i = 0; i + 2 < sents.length; i++) {
    const first = (s) => (s.text.match(/[\p{L}]+/u) || [''])[0].toLowerCase();
    if (first(sents[i]) && first(sents[i]) === first(sents[i + 1]) && first(sents[i]) === first(sents[i + 2])) {
      add({ id: 'lap-dau-cau', group: 'nhip-van', level: 1,
        msg: `Ba câu liền mở bằng "${first(sents[i])}".`, fix: 'Đổi cách mở câu hoặc gộp câu.' }, sents[i].pos, 1);
      i += 2;
    }
  }

  // Xưng "bạn" quá dày.
  const ban = [...masked.matchAll(W('bạn'))];
  if (ban.length >= 6 && ban.length / Math.max(words, 1) > 0.025) add({ id: 'ban-qua-day', group: 'rao-don', level: 1,
    msg: `"bạn" xuất hiện ${ban.length} lần.`, fix: 'Bỏ bớt chủ ngữ "bạn" — tiếng Việt cho phép lược chủ ngữ.' }, ban[0].index, 3);

  found.sort((a, b) => a.index - b.index);
  const sum = found.reduce((a, f) => a + WEIGHT[f.level], 0);
  const raw = (sum / Math.max(words, minWords)) * 100;
  const score = Math.round(100 * (1 - Math.exp(-raw / 12)));
  const byGroup = {};
  for (const f of found) byGroup[f.group] = (byGroup[f.group] || 0) + 1;
  return { score, verdict: verdict(score), words, sentences: sents.length, findings: found, byGroup };
}

export function verdict(score) {
  if (score < 15) return 'Tự nhiên';
  if (score < 35) return 'Hơi có mùi AI';
  if (score < 60) return 'Mùi AI rõ';
  return 'Rất giống văn AI';
}

export function formatReport(result, { color = false, file = '' } = {}) {
  const c = (code, s) => (color ? `\x1b[${code}m${s}\x1b[0m` : s);
  const levelTag = { 1: c(36, 'nhẹ '), 2: c(33, 'vừa '), 3: c(31, 'nặng') };
  const out = [];
  for (const f of result.findings) {
    const where = `${file ? file + ':' : ''}${f.line}:${f.col}`;
    const snippet = f.match.length > 1 ? ` «${f.match.trim().slice(0, 60)}»` : '';
    out.push(`${c(2, where)}  ${levelTag[f.level]}  ${c(1, f.id)}${snippet}\n    ${f.message} → ${f.fix}`);
  }
  const bar = '█'.repeat(Math.round(result.score / 5)).padEnd(20, '░');
  const sc = result.score < 15 ? 32 : result.score < 35 ? 36 : result.score < 60 ? 33 : 31;
  out.push('');
  out.push(`${file ? c(1, file) + '  ' : ''}Mùi AI: ${c(sc, bar + ' ' + result.score + '/100')}  ${c(sc, result.verdict)}`);
  const groups = Object.entries(result.byGroup).map(([g, n]) => `${GROUPS[g] || g}: ${n}`).join(' · ');
  out.push(`${result.words} chữ, ${result.sentences} câu, ${result.findings.length} dấu hiệu${groups ? ' — ' + groups : ''}`);
  return out.join('\n');
}

// Chạy trực tiếp: node check.mjs [file...] [--json]
const isMain = process.argv[1] && fileURLToPath(import.meta.url).toLowerCase() === resolve(process.argv[1]).toLowerCase();
if (isMain) {
  const { runCli } = await import('./cli.mjs');
  process.exitCode = await runCli(process.argv.slice(2));
}
