import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdtemp, rm, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { analyze, verdict } from '../skills/chuot-van/scripts/check.mjs';
import { runCli } from '../skills/chuot-van/scripts/cli.mjs';

const fixture = (f) => readFile(new URL(`./fixtures/${f}`, import.meta.url), 'utf8');
const ids = (text) => analyze(text).findings.map((f) => f.id);
const silent = () => { const out = []; return { out: (s) => out.push(s), err: (s) => out.push(s), lines: out }; };

test('văn AI điển hình bị chấm cao', async () => {
  const r = analyze(await fixture('van-ai.md'));
  assert.ok(r.score >= 60, `điểm ${r.score}`);
  assert.equal(r.verdict, 'Rất giống văn AI');
  for (const id of ['chac-chan-roi', 'duoi-day-la', 'hay-cung', 'hy-vong-huu-ich', 'mot-cach', 'duoc-boi',
    'dong-vai-tro', 'trong-boi-canh', 'tieu-de-hoa', 'gach-dau-dong-in-dam', 'noi-cau', 'tom-lai']) {
    assert.ok(r.findings.some((f) => f.id === id), `thiếu ${id}`);
  }
});

test('văn người viết được chấm thấp', async () => {
  for (const f of ['van-nguoi.md', 'van-ai-da-chuot.md', 'email-cong-viec.md', 'tin-tuc.md']) {
    const r = analyze(await fixture(f));
    assert.ok(r.score < 15, `${f}: ${r.score} — ${r.findings.map((x) => x.id).join(', ')}`);
  }
});

test('ranh giới từ tiếng Việt có dấu', () => {
  assert.ok(ids('Nó chạy một cách hiệu quả.').includes('mot-cach'));
  assert.ok(!ids('Đây là một cáchhiệu quả.').includes('mot-cach'));
  assert.ok(ids('Hành trình này dài.').includes('tu-sao'));
  assert.ok(!ids('Chúng tôi đi khám bệnh.').includes('kham-pha-trai-nghiem'));
});

test('được … bởi vì không phải bị động', () => {
  assert.ok(ids('Ứng dụng được phát triển bởi Google.').includes('duoc-boi'));
  assert.ok(!ids('Anh ấy được thưởng bởi vì làm tốt.').includes('duoc-boi'));
});

test('câu mở chỉ bắt ở đầu câu', () => {
  assert.ok(ids('Tóm lại, nên ngủ sớm.').includes('tom-lai'));
  assert.ok(ids('Ăn đủ.\nTóm lại, nên ngủ sớm.').includes('tom-lai'));
  assert.ok(ids('- Dưới đây là danh sách.').includes('duoi-day-la'));
  assert.ok(!ids('Anh tóm lại giúp em ý chính.').includes('tom-lai'));
});

test('bỏ qua code, URL và front matter', () => {
  const text = '---\ntitle: Chắc chắn rồi\n---\nMã: `một cách hiệu quả` và https://x.vn/hanh-trinh-toan-dien\n```\nTóm lại, một cách nhanh chóng\n```\n';
  assert.deepEqual(analyze(text).findings, []);
});

test('không bắt trùng một đoạn chữ hai lần', () => {
  const f = analyze('Đây là giải pháp toàn diện cho bạn.').findings;
  assert.equal(f.length, 1);
  assert.equal(f[0].id, 'giai-phap');
});

test('vị trí dòng:cột đúng', () => {
  const f = analyze('Dòng một ổn.\nNó chạy một cách nhanh chóng.').findings.find((x) => x.id === 'mot-cach');
  assert.equal(f.line, 2);
  assert.equal(f.col, 9);
});

test('từ nối dày đặc mới bị bắt', () => {
  assert.ok(!ids('Trời mưa. Tuy nhiên, tôi vẫn đi làm.').includes('noi-cau'));
  assert.ok(ids('A ăn cơm. Hơn nữa, A ngủ. Ngoài ra, A học. Bên cạnh đó, A chơi.').includes('noi-cau'));
});

test('chuẩn hóa NFD về NFC', () => {
  assert.ok(ids('Nó chạy một cách nhanh chóng.'.normalize('NFD')).includes('mot-cach'));
});

test('văn ngắn không bị điểm cao vì một lỗi nhỏ', () => {
  assert.ok(analyze('Sản phẩm rất tuyệt vời.').score < 15);
});

test('nhãn đánh giá', () => {
  assert.equal(verdict(0), 'Tự nhiên');
  assert.equal(verdict(20), 'Hơi có mùi AI');
  assert.equal(verdict(40), 'Mùi AI rõ');
  assert.equal(verdict(90), 'Rất giống văn AI');
});

test('CLI: --json, --score, --max', async () => {
  const file = new URL('./fixtures/van-ai.md', import.meta.url).pathname.replace(/^\/(\w:)/, '$1');
  let log = silent();
  assert.equal(await runCli([file, '--json'], log), 0);
  assert.ok(JSON.parse(log.lines[0]).score >= 60);
  log = silent();
  assert.equal(await runCli([file, '--max', '30', '--score'], log), 1);
  log = silent();
  assert.equal(await runCli(['--text', 'Trời hôm nay đẹp.', '--max', '30'], log), 0);
  log = silent();
  assert.equal(await runCli(['khong-co-tep.md'], log), 2);
});

test('CLI: install chép skill vào thư mục đích', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'chuot-van-'));
  try {
    const log = silent();
    assert.equal(await runCli(['install', '--target', 'agents', '--dir', dir], log), 0);
    const files = await readdir(join(dir, '.agents', 'skills', 'chuot-van'));
    assert.ok(files.includes('SKILL.md'));
    assert.equal(await runCli(['install', '--target', 'abc', '--dir', dir], silent()), 2);
  } finally { await rm(dir, { recursive: true, force: true }); }
});
