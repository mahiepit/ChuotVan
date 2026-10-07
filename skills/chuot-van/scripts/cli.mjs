// Giao diện dòng lệnh của Chuốt Văn.
import { readFile, readdir, cp, mkdir, rm, stat } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join, resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { analyze, formatReport } from './check.mjs';

const SKILL_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const VERSION = '1.0.0';

// Nơi các agent đọc skill: [thư mục cấp người dùng, thư mục cấp dự án].
export const TARGETS = {
  claude: ['.claude/skills', '.claude/skills'],
  agents: ['.agents/skills', '.agents/skills'], // Codex CLI, Gemini CLI, Cursor, Copilot…
  codex: ['.codex/skills', '.codex/skills'],
  cursor: ['.cursor/skills', '.cursor/skills'],
  gemini: ['.gemini/skills', '.gemini/skills'],
};

const HELP = `Chuốt Văn ${VERSION} — chấm "mùi AI" cho văn bản tiếng Việt

Dùng:
  chuot-van [tệp...]            chấm điểm tệp (không có tệp: đọc từ stdin)
  chuot-van --text "đoạn văn"   chấm một đoạn văn
  chuot-van install [--target claude|agents|codex|cursor|gemini] [--project]
                                cài skill cho agent (mặc định: claude, cấp người dùng)

Tùy chọn:
  --json         xuất JSON
  --score        chỉ in điểm
  --max <n>      thoát mã 1 nếu điểm > n (dùng trong CI)
  --no-color     tắt màu
  -h, --help     trợ giúp
  -v, --version  phiên bản`;

async function readStdin() {
  const chunks = [];
  for await (const c of process.stdin) chunks.push(c);
  return Buffer.concat(chunks).toString('utf8');
}

// PowerShell/cmd không tự mở rộng "*.md" — tự làm cho trường hợp đơn giản (ký tự đại diện ở tên tệp).
async function expand(pattern) {
  if (!/[*?]/.test(pattern)) return [pattern];
  const dir = dirname(pattern);
  const re = new RegExp('^' + basename(pattern).replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.') + '$', 'i');
  try {
    const names = (await readdir(dir)).filter((n) => re.test(n)).sort();
    return names.length ? names.map((n) => join(dir, n)) : [pattern];
  } catch { return [pattern]; }
}

async function install(args, log) {
  const ti = args.indexOf('--target');
  const target = ti >= 0 ? args[ti + 1] : 'claude';
  if (!TARGETS[target]) { log.err(`Không biết target "${target}". Chọn: ${Object.keys(TARGETS).join(', ')}`); return 2; }
  const project = args.includes('--project');
  const di = args.indexOf('--dir');
  const base = di >= 0 ? resolve(args[di + 1]) : project ? process.cwd() : homedir();
  const dest = join(base, TARGETS[target][project ? 1 : 0], 'chuot-van');
  await mkdir(dirname(dest), { recursive: true });
  await rm(dest, { recursive: true, force: true });
  await cp(SKILL_DIR, dest, { recursive: true });
  log.out(`Đã cài skill chuot-van vào ${dest}`);
  log.out('Khởi động lại agent rồi thử: "Chuốt lại đoạn này cho tự nhiên: …"');
  return 0;
}

export async function runCli(argv, log = { out: console.log, err: console.error }) {
  const args = [...argv];
  if (args.includes('-h') || args.includes('--help')) { log.out(HELP); return 0; }
  if (args.includes('-v') || args.includes('--version')) { log.out(VERSION); return 0; }
  if (args[0] === 'install') return install(args.slice(1), log);

  const json = args.includes('--json');
  const scoreOnly = args.includes('--score');
  const color = !args.includes('--no-color') && !json && process.stdout.isTTY && !process.env.NO_COLOR;
  const mi = args.indexOf('--max');
  const max = mi >= 0 ? Number(args[mi + 1]) : null;
  if (mi >= 0 && !Number.isFinite(max)) { log.err('--max cần một con số.'); return 2; }
  const ti = args.indexOf('--text');

  const inputs = [];
  if (ti >= 0) inputs.push({ file: '', text: args[ti + 1] ?? '' });
  const skip = new Set([mi + 1, ti + 1].filter((i) => i > 0));
  const files = [];
  for (const a of args.filter((a, i) => !a.startsWith('--') && !skip.has(i))) files.push(...(await expand(a)));
  for (const f of files) {
    if (f === '-') { inputs.push({ file: '', text: await readStdin() }); continue; }
    try {
      if (!(await stat(f)).isFile()) throw new Error('không phải tệp');
      inputs.push({ file: f, text: await readFile(f, 'utf8') });
    } catch (e) { log.err(`Không đọc được ${f}: ${e.message}`); return 2; }
  }
  if (!inputs.length) {
    if (process.stdin.isTTY) { log.out(HELP); return 0; }
    inputs.push({ file: '', text: await readStdin() });
  }

  let worst = 0;
  const results = inputs.map(({ file, text }) => {
    const r = analyze(text);
    worst = Math.max(worst, r.score);
    return { file, ...r };
  });
  if (json) log.out(JSON.stringify(results.length === 1 ? results[0] : results, null, 2));
  else if (scoreOnly) for (const r of results) log.out(`${r.file ? r.file + ': ' : ''}${r.score}`);
  else log.out(results.map((r) => formatReport(r, { color, file: r.file })).join('\n\n'));
  return max !== null && worst > max ? 1 : 0;
}
