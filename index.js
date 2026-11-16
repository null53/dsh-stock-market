// 由 scripts/build.mjs 从 src/host/ 生成，不要直接修改。


// src/host/index.js
import { homedir } from "node:os";
import { dirname as dirname2, join as join3 } from "node:path";
import { fileURLToPath } from "node:url";

// src/host/store.js
import { mkdir, readFile, rename, writeFile, readdir, unlink } from "node:fs/promises";
import { dirname, join } from "node:path";
function createStore(dir) {
  const values = /* @__PURE__ */ new Map();
  const timers = /* @__PURE__ */ new Map();
  const fileOf = (name2) => join(dir, `${name2}.json`);
  async function writeNow(name2) {
    timers.delete(name2);
    const file = fileOf(name2);
    await mkdir(dirname(file), { recursive: true });
    const tmp = `${file}.${process.pid}.tmp`;
    await writeFile(tmp, JSON.stringify(values.get(name2), null, 1), "utf8");
    await rename(tmp, file);
  }
  return {
    dir,
    /** 读取集合；不存在或损坏时用 fallback() 初始化。 */
    async load(name2, fallback) {
      if (values.has(name2)) return values.get(name2);
      let value;
      try {
        value = JSON.parse(await readFile(fileOf(name2), "utf8"));
      } catch {
        value = fallback();
      }
      values.set(name2, value);
      return value;
    },
    /** 标记已修改，300 ms 后写盘。 */
    save(name2, value) {
      values.set(name2, value);
      clearTimeout(timers.get(name2));
      timers.set(name2, setTimeout(() => {
        writeNow(name2).catch(() => {
        });
      }, 300));
    },
    async remove(name2) {
      values.delete(name2);
      clearTimeout(timers.get(name2));
      timers.delete(name2);
      await unlink(fileOf(name2)).catch(() => {
      });
    },
    async list(prefix) {
      try {
        return (await readdir(join(dir, prefix))).filter((f) => f.endsWith(".json")).map((f) => f.slice(0, -5));
      } catch {
        return [];
      }
    },
    /** 插件卸载前把未写盘的数据写完。 */
    async flush() {
      const pending = [...timers.keys()];
      for (const name2 of pending) clearTimeout(timers.get(name2));
      await Promise.all(pending.map((name2) => writeNow(name2).catch(() => {
      })));
    }
  };
}

// src/host/knowledge.js
import { readFile as readFile2, readdir as readdir2, stat } from "node:fs/promises";
import { join as join2 } from "node:path";

// src/edition/public.js
var UPDATE_INDEX_URL = "https://null53.github.io/dsh-stock-market/index.json";
var PACKAGE_NAME = "@local/dsh-stock-market";
var TEXT = {
  roleSource: "你有一套成体系的交易规则（附在本提示词末尾的交易规则库），以趋势跟踪为核心，覆盖入场、止损、仓位、加仓、退出、资金管理、系统检验和交易心理；用户消息里还会附上与问题相关的规则条目。把这些当作你自己的专业知识来运用。",
  roleBasis: "写明用的是哪条规则（如〔规则：趋势过滤〕〔规则：2N 止损〕〔规则：1% 风险仓位〕），说明当前数据怎样满足或不满足这条规则；",
  roleSizing: "按 1% 风险的海龟头寸单位或固定风险百分比模型算出股数（数据里给了参考股数和账户权益）；",
  roleViews: "不同交易方法（趋势跟踪、逆势抄底、估值投资）结论不同时，并列说明各自的道理，不要强行统一。",
  roleExtra: "回答里不引用书名、作者或出处。用户问你的知识从哪里来时，如实说明这是插件内置的通用交易规则和公开的交易方法（例如海龟交易系统），不要编造出处。",
  kbHeading: "# 交易规则库",
  kbMissing: "（交易规则库未加载：请按通用交易原则回答，并告诉用户规则库缺失，建议重新安装插件。）",
  retrievedHeading: "# 与问题相关的规则条目",
  strongLabel: "强势趋势（择强汰弱）",
  reviewBasis: "后面括号注明依据的数据和对应的规则，例如〔规则：2N 止损〕〔规则：回撤减仓〕〔规则：只做趋势方向〕",
  toolAnalysisTail: "回答买卖问题前应先调用它；需要规则依据时再调用 trading_knowledge_search。",
  toolKnowledge: "检索插件内置的交易规则库（趋势跟踪、入场与退出、止损、仓位与资金管理、系统检验、交易心理、A 股与基金实务），返回与问题最相关的规则条目。回答交易规则、仓位、止损、心理、系统开发等问题时用它找依据。",
  citeTrendFilter: "",
  missingKnowledgeLog: "未找到内置交易规则库，AI 顾问将只按通用原则回答"
};
var knowledgeDirs = ({ pluginDir, join: join4 }) => [join4(pluginDir, "knowledge")];
var KB_LAYOUT = {
  lite: ["00-核心原则.md", "01-趋势跟踪系统.md", "02-公式与计算.md", "03-心理偏差与纪律.md", "04-检查清单.md", "05-概念词典.md"],
  sections: [
    { file: "15-常见问题.md", source: "常见问题" },
    { file: "10-仓位与资金管理.md", source: "仓位与资金管理" },
    { file: "02-公式与计算.md", source: "公式与计算" },
    { file: "11-系统开发与检验.md", source: "系统开发与检验" },
    { file: "12-A股与基金实务.md", source: "A股与基金实务" },
    { file: "13-选股与市场环境.md", source: "选股与市场环境" },
    { file: "14-复盘与持续改进.md", source: "复盘与持续改进" },
    { file: "01-趋势跟踪系统.md", source: "趋势跟踪系统" },
    { file: "03-心理偏差与纪律.md", source: "心理偏差与纪律" }
  ],
  notes: null
};

// src/host/knowledge.js
var stripFrontmatter = (text2) => text2.replace(/^---\n[\s\S]*?\n---\n/, "");
async function exists(path) {
  try {
    return (await stat(path)).isDirectory();
  } catch {
    return false;
  }
}
function tokenize(text2) {
  const tokens = [];
  const lower = text2.toLowerCase();
  for (const run of lower.match(/[一-鿿]+/g) ?? []) {
    if (run.length === 1) tokens.push(run);
    for (let i = 0; i + 1 < run.length; i++) tokens.push(run.slice(i, i + 2));
  }
  for (const word of lower.match(/[a-z0-9]{2,}/g) ?? []) tokens.push(word);
  return tokens;
}
function splitSections(text2, source) {
  const sections = [];
  let title = source;
  let buf = [];
  const flush = () => {
    const body = buf.join("\n").trim();
    if (body.length > 40) sections.push({ source, title, text: body.length > 3500 ? `${body.slice(0, 3500)}…` : body });
    buf = [];
  };
  for (const line of text2.split("\n")) {
    const m = /^(#{2,3})\s+(.*)$/.exec(line);
    if (m) {
      flush();
      title = m[2].trim();
    } else buf.push(line);
  }
  flush();
  return sections;
}
async function loadKnowledge(dirs, layout = KB_LAYOUT) {
  let dir;
  for (const candidate of dirs) {
    if (candidate && await exists(candidate)) {
      dir = candidate;
      break;
    }
  }
  if (dir === void 0) return { dir: null, lite: "", sections: [], retrieve: () => [] };
  const read = async (name2) => {
    try {
      return stripFrontmatter(await readFile2(join2(dir, name2), "utf8"));
    } catch {
      return "";
    }
  };
  const lite = (await Promise.all(layout.lite.map(read))).filter(Boolean).join("\n\n");
  const sections = [];
  for (const { file, source } of layout.sections) sections.push(...splitSections(await read(file), source));
  if (layout.notes) {
    let notes = [];
    try {
      notes = (await readdir2(join2(dir, layout.notes.dir))).filter((f) => layout.notes.pattern.test(f)).sort();
    } catch {
    }
    for (const f of notes) sections.push(...splitSections(await read(join2(layout.notes.dir, f)), layout.notes.source(f)));
  }
  const df = /* @__PURE__ */ new Map();
  const indexed = sections.map((s) => {
    const counts = /* @__PURE__ */ new Map();
    for (const t of tokenize(`${s.title} ${s.title} ${s.text}`)) counts.set(t, (counts.get(t) ?? 0) + 1);
    for (const t of counts.keys()) df.set(t, (df.get(t) ?? 0) + 1);
    return { ...s, counts };
  });
  const total = indexed.length;
  function retrieve(query, { k = 4, budget = 7e3 } = {}) {
    const q = [...new Set(tokenize(query))];
    if (q.length === 0) return [];
    const scored = indexed.map((s) => {
      let score = 0;
      for (const t of q) {
        const c = s.counts.get(t);
        if (c !== void 0) score += Math.min(c, 4) * Math.log(1 + total / (df.get(t) ?? 1));
      }
      return { s, score: score / Math.sqrt(1 + s.text.length / 1500) };
    }).filter((x) => x.score > 0).sort((a, b) => b.score - a.score);
    const out = [];
    let used = 0;
    for (const { s } of scored) {
      if (out.length >= k) break;
      if (used + s.text.length > budget && out.length > 0) continue;
      out.push({ source: s.source, title: s.title, text: s.text });
      used += s.text.length;
    }
    return out;
  }
  return { dir, lite, sections: indexed.length, retrieve };
}

// src/host/util.js
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";
function zonedParts(date, timeZone) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    weekday: "short"
  }).formatToParts(date);
  const get = (type) => parts.find((p) => p.type === type)?.value ?? "";
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
    weekday: get("weekday")
  };
}
function beijingDate(date = /* @__PURE__ */ new Date()) {
  return zonedParts(date, "Asia/Shanghai").date;
}
var SESSIONS = {
  cn: { tz: "Asia/Shanghai", ranges: [[9 * 60 + 30, 11 * 60 + 30], [13 * 60, 15 * 60]] },
  hk: { tz: "Asia/Hong_Kong", ranges: [[9 * 60 + 30, 12 * 60], [13 * 60, 16 * 60]] },
  us: { tz: "America/New_York", ranges: [[9 * 60 + 30, 16 * 60]] }
};
function isMarketOpen(region, date = /* @__PURE__ */ new Date()) {
  const session = SESSIONS[region];
  if (session === void 0) return false;
  const { minutes, weekday } = zonedParts(date, session.tz);
  if (weekday === "Sat" || weekday === "Sun") return false;
  return session.ranges.some(([start, end]) => minutes >= start && minutes < end);
}
function cnTradeDate(date = /* @__PURE__ */ new Date()) {
  const { date: today2, minutes, weekday } = zonedParts(date, "Asia/Shanghai");
  const closed = minutes >= 15 * 60;
  if (!closed && weekday !== "Sat" && weekday !== "Sun") return today2;
  const next = /* @__PURE__ */ new Date(`${today2}T12:00:00+08:00`);
  do
    next.setUTCDate(next.getUTCDate() + 1);
  while ([0, 6].includes(next.getUTCDay()));
  return next.toISOString().slice(0, 10);
}
function createCache() {
  const values = /* @__PURE__ */ new Map();
  const inflight = /* @__PURE__ */ new Map();
  return {
    async get(key, ttlMs, load) {
      const hit = values.get(key);
      if (hit !== void 0 && hit.expires > Date.now()) return hit.value;
      const pending = inflight.get(key);
      if (pending !== void 0) return pending;
      const promise = (async () => {
        try {
          const value = await load();
          values.set(key, { value, expires: Date.now() + ttlMs });
          if (values.size > 2e3) values.delete(values.keys().next().value);
          return value;
        } finally {
          inflight.delete(key);
        }
      })();
      inflight.set(key, promise);
      return promise;
    },
    clear() {
      values.clear();
    }
  };
}
function createLimiter(n) {
  let active = 0;
  const queue = [];
  const next = () => {
    if (active >= n || queue.length === 0) return;
    active++;
    const { task, resolve, reject } = queue.shift();
    task().then(resolve, reject).finally(() => {
      active--;
      next();
    });
  };
  return (task) => new Promise((resolve, reject) => {
    queue.push({ task, resolve, reject });
    next();
  });
}
var limit = createLimiter(8);
var HttpError = class extends Error {
  constructor(status2, host) {
    super(`HTTP ${status2} ${host}`);
    this.status = status2;
  }
};
var sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
function fetchText(url, { referer, timeoutMs = 1e4, encoding, retries = 1 } = {}) {
  return limit(async () => {
    const headers = { "user-agent": UA, accept: "*/*" };
    if (referer !== void 0) headers.referer = referer;
    for (let attempt = 0; ; attempt++) {
      try {
        const res = await fetch(url, { headers, signal: AbortSignal.timeout(timeoutMs) });
        if (!res.ok) throw new HttpError(res.status, new URL(url).host);
        if (encoding === void 0) return await res.text();
        return new TextDecoder(encoding).decode(await res.arrayBuffer());
      } catch (error) {
        const transient = !(error instanceof HttpError) || error.status >= 500;
        if (!transient || attempt >= retries) throw error;
        await sleep(400 + attempt * 800);
      }
    }
  });
}
async function fetchJson(url, options) {
  const text2 = await fetchText(url, options);
  try {
    return JSON.parse(text2);
  } catch {
    throw new Error(`返回内容不是 JSON：${new URL(url).host}`);
  }
}
function num(value) {
  if (value === null || value === void 0 || value === "-" || value === "") return null;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}
function round(value, digits = 2) {
  if (value === null || value === void 0 || !Number.isFinite(value)) return null;
  const f = 10 ** digits;
  return Math.round(value * f) / f;
}
function shortId(prefix = "") {
  return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// src/host/eastmoney.js
var PUSH2 = "https://push2.eastmoney.com/api/qt";
var PUSH2HIS = "https://push2his.eastmoney.com/api/qt";
var LIST_FIELDS = "f2,f3,f4,f5,f6,f7,f8,f9,f10,f12,f13,f14,f15,f16,f17,f18,f20,f21,f23,f24,f25";
var PAGE_MAX = 100;
function normalizeRow(d) {
  return {
    secid: `${d.f13}.${d.f12}`,
    code: String(d.f12),
    name: String(d.f14 ?? ""),
    price: num(d.f2),
    pct: num(d.f3),
    change: num(d.f4),
    volume: num(d.f5),
    amount: num(d.f6),
    amplitude: num(d.f7),
    turnover: num(d.f8),
    pe: num(d.f9),
    volRatio: num(d.f10),
    high: num(d.f15),
    low: num(d.f16),
    open: num(d.f17),
    prevClose: num(d.f18),
    mcap: num(d.f20),
    floatCap: num(d.f21),
    pb: num(d.f23),
    pct60: num(d.f24),
    pctYtd: num(d.f25)
  };
}
function assertOk(json2) {
  if (json2 === null || typeof json2 !== "object" || json2.rc !== 0) throw new Error("东方财富接口返回错误");
  return json2.data;
}
async function list({ fs, sort = "f3", order = "desc", page = 1, size = 50 }) {
  const params = new URLSearchParams({
    pn: String(page),
    pz: String(Math.min(size, PAGE_MAX)),
    po: order === "asc" ? "0" : "1",
    np: "1",
    fltt: "2",
    invt: "2",
    fid: sort,
    fs,
    fields: LIST_FIELDS
  });
  const data = assertOk(await fetchJson(`${PUSH2}/clist/get?${params}`));
  if (data === null) return { total: 0, rows: [] };
  return { total: data.total ?? 0, rows: (data.diff ?? []).map(normalizeRow) };
}
async function quotes(secids) {
  const out = [];
  for (let i = 0; i < secids.length; i += 80) {
    const chunk = secids.slice(i, i + 80);
    const params = new URLSearchParams({ fltt: "2", invt: "2", secids: chunk.join(","), fields: LIST_FIELDS });
    const data = assertOk(await fetchJson(`${PUSH2}/ulist.np/get?${params}`));
    out.push(...(data?.diff ?? []).map(normalizeRow));
  }
  return out;
}
var DETAIL_FIELDS = "f43,f44,f45,f46,f47,f48,f50,f51,f52,f57,f58,f60,f71,f86,f116,f117,f162,f167,f168,f169,f170,f171";
async function quote(secid) {
  const params = new URLSearchParams({ secid, fltt: "2", invt: "2", fields: DETAIL_FIELDS });
  const d = assertOk(await fetchJson(`${PUSH2}/stock/get?${params}`));
  if (d === null || d.f57 === void 0) throw new Error(`找不到证券 ${secid}`);
  return {
    secid,
    code: String(d.f57),
    name: String(d.f58 ?? ""),
    price: num(d.f43),
    high: num(d.f44),
    low: num(d.f45),
    open: num(d.f46),
    volume: num(d.f47),
    amount: num(d.f48),
    volRatio: num(d.f50),
    limitUp: num(d.f51),
    limitDown: num(d.f52),
    prevClose: num(d.f60),
    avgPrice: num(d.f71),
    time: num(d.f86),
    mcap: num(d.f116),
    floatCap: num(d.f117),
    pe: num(d.f162),
    pb: num(d.f167),
    turnover: num(d.f168),
    change: num(d.f169),
    pct: num(d.f170),
    amplitude: num(d.f171)
  };
}
var PERIODS = { day: "101", week: "102", month: "103", m1: "1", m5: "5", m15: "15", m30: "30", m60: "60" };
async function kline(secid, { period = "day", limit: limit2 = 320, adjust = 1 } = {}) {
  const klt = PERIODS[period] ?? "101";
  const params = new URLSearchParams({
    secid,
    klt,
    fqt: String(adjust),
    end: "20500101",
    lmt: String(Math.min(Math.max(limit2, 1), 2e3)),
    fields1: "f1,f2,f3,f4,f5,f6",
    fields2: "f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61"
  });
  const data = assertOk(await fetchJson(`${PUSH2HIS}/stock/kline/get?${params}`));
  if (data === null) return { secid, name: "", bars: [] };
  const bars = (data.klines ?? []).map((line) => {
    const [date, open, close, high, low, volume, amount, amplitude, pct2, change, turnover] = line.split(",");
    return {
      date,
      open: Number(open),
      close: Number(close),
      high: Number(high),
      low: Number(low),
      volume: Number(volume),
      amount: Number(amount),
      amplitude: num(amplitude),
      pct: num(pct2),
      change: num(change),
      turnover: num(turnover)
    };
  }).filter((b) => Number.isFinite(b.close));
  return { secid, name: String(data.name ?? ""), bars, source: "eastmoney" };
}
async function trends(secid) {
  const params = new URLSearchParams({
    secid,
    ndays: "1",
    iscr: "0",
    fields1: "f1,f2,f3,f4,f5,f6,f7,f8",
    fields2: "f51,f52,f53,f54,f55,f56,f57,f58"
  });
  const data = assertOk(await fetchJson(`${PUSH2}/stock/trends2/get?${params}`));
  if (data === null) return { secid, preClose: null, points: [] };
  const points = (data.trends ?? []).map((line) => {
    const [time, , close, , , volume, amount, avg] = line.split(",");
    return { time: time.slice(11), price: Number(close), volume: Number(volume), amount: Number(amount), avg: num(avg) };
  });
  return { secid, name: String(data.name ?? ""), preClose: num(data.preClose ?? data.prePrice), points };
}
var SUGGEST_TOKEN = "D43BF722C8E33BDC906FB84D85E326E8";
function parseJsonish(text2) {
  const t = text2.trim();
  if (t.startsWith("{") || t.startsWith("[")) return JSON.parse(t);
  const start = t.indexOf("(");
  const end = t.lastIndexOf(")");
  if (start < 0 || end <= start) throw new Error("无法解析的返回内容");
  return JSON.parse(t.slice(start + 1, end));
}
async function search(query, count = 12) {
  const params = new URLSearchParams({ input: query, type: "14", token: SUGGEST_TOKEN, count: String(count) });
  let rows = [];
  for (const host of ["searchadapter.eastmoney.com", "searchapi.eastmoney.com"]) {
    try {
      const json2 = parseJsonish(await fetchText(`https://${host}/api/suggest/get?${params}`));
      rows = json2?.QuotationCodeTable?.Data ?? [];
      if (rows.length > 0) break;
    } catch {
    }
  }
  return rows.filter((r) => typeof r.QuoteID === "string" && /^\d+\./.test(r.QuoteID)).map((r) => ({
    secid: r.QuoteID,
    code: String(r.Code),
    name: String(r.Name),
    type: String(r.SecurityTypeName ?? ""),
    classify: String(r.Classify ?? "")
  }));
}

// src/host/tencent.js
var US_MARKET = { oq: "105", n: "106", am: "107" };
var TYPE_LABEL = { "GP-A": "A股", "GP-A-CYB": "创业板", "GP-A-KCB": "科创板", ETF: "场内基金", LOF: "场内基金", ZS: "指数", KJ: "基金" };
function parseHint(item) {
  const [mkt, rawCode, name2, , type = ""] = item.split("~");
  if (!rawCode || !name2) return void 0;
  const base = { code: rawCode.toUpperCase(), name: name2 };
  if (mkt === "sh" || mkt === "sz" || mkt === "bj") {
    return { ...base, symbol: `${mkt === "sh" ? "1" : "0"}.${rawCode}`, type: TYPE_LABEL[type] ?? (type.startsWith("GP-A") ? "A股" : type.startsWith("ZS") ? "指数" : "场内") };
  }
  if (mkt === "hk") return { ...base, symbol: `116.${rawCode}`, type: type.startsWith("ZS") ? "港股指数" : "港股" };
  if (mkt === "us") {
    const [sym, ex = "oq"] = rawCode.split(".");
    return { code: sym.toUpperCase(), name: name2, symbol: `${US_MARKET[ex] ?? "105"}.${sym.toUpperCase()}`, type: "美股" };
  }
  if (mkt === "jj") return { ...base, code: rawCode, symbol: `fund:${rawCode}`, type: "基金" };
  return void 0;
}
async function search2(query) {
  const text2 = await fetchText(`https://smartbox.gtimg.cn/s3/?v=2&q=${encodeURIComponent(query)}&t=all&c=1`);
  const m = /v_hint="([\s\S]*)"/.exec(text2);
  if (m === null || m[1] === "N") return [];
  const decoded = JSON.parse(`"${m[1].replace(/"/g, '\\"')}"`);
  return decoded.split("^").map(parseHint).filter(Boolean);
}
function qtCode(secid) {
  const c = tencentCode(secid);
  return c?.startsWith("us") ? c.replace(/\.\w+$/, "").replace(/^us\./, "us") : c;
}
async function quotes2(secids) {
  const pairs = secids.map((id) => [id, qtCode(id)]).filter(([, c]) => c !== void 0);
  if (pairs.length === 0) return [];
  const text2 = await fetchText(`https://qt.gtimg.cn/q=${pairs.map(([, c]) => c).join(",")}`, { encoding: "gbk" });
  const byCode = /* @__PURE__ */ new Map();
  for (const line of text2.split(";")) {
    const m = /v_(\w+)="([^"]*)"/.exec(line);
    if (m) byCode.set(m[1], m[2].split("~"));
  }
  const out = [];
  for (const [secid, code] of pairs) {
    const f = byCode.get(code.replace(".", ""));
    if (f === void 0 || f.length < 40) continue;
    const cn = /^(sh|sz|bj)/.test(code);
    out.push({
      secid,
      code: secid.split(".")[1],
      name: f[1],
      price: num(f[3]),
      prevClose: num(f[4]),
      open: num(f[5]),
      volume: num(f[6]),
      change: num(f[31]),
      pct: num(f[32]),
      high: num(f[33]),
      low: num(f[34]),
      amount: cn ? num(f[37]) === null ? null : num(f[37]) * 1e4 : num(f[37]),
      turnover: num(f[38]),
      pe: num(f[39]),
      mcap: num(f[45]) === null ? null : num(f[45]) * 1e8,
      floatCap: num(f[44]) === null ? null : num(f[44]) * 1e8,
      pb: cn ? num(f[46]) : null,
      limitUp: cn ? num(f[47]) : null,
      limitDown: cn ? num(f[48]) : null,
      amplitude: null,
      volRatio: null,
      pct60: null,
      pctYtd: null
    });
  }
  return out;
}
var INDEX_MAP = { "HSI": "hkHSI", "NDX": "us.IXIC", "SPX": "us.INX", "DJIA": "us.DJI" };
function tencentCode(secid) {
  const [market, code] = secid.split(".");
  if (market === "1") return `sh${code}`;
  if (market === "0") return /^(4|8|92)/.test(code) ? `bj${code}` : `sz${code}`;
  if (market === "116" || market === "128") return `hk${code}`;
  if (market === "105") return `us${code}.OQ`;
  if (market === "106") return `us${code}.N`;
  if (market === "107") return `us${code}.AM`;
  if (market === "100") return INDEX_MAP[code];
  return void 0;
}
var DAY_PERIODS = { day: "day", week: "week", month: "month" };
var MINUTE_PERIODS = { m1: "m1", m5: "m5", m15: "m15", m30: "m30", m60: "m60" };
var PAGE = 640;
function rowsOf(json2, code, period) {
  const d = json2?.data?.[code];
  if (d === void 0 || typeof d !== "object") return [];
  return d[`qfq${period}`] ?? d[period] ?? [];
}
function toBar([date, open, close, high, low, volume], prevClose) {
  const c = Number(close);
  return {
    date: date.length === 12 ? `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)} ${date.slice(8, 10)}:${date.slice(10)}` : date,
    open: Number(open),
    close: c,
    high: Number(high),
    low: Number(low),
    volume: Number(volume),
    amount: null,
    amplitude: null,
    turnover: null,
    pct: prevClose > 0 ? Math.round((c / prevClose - 1) * 1e4) / 100 : null,
    change: prevClose > 0 ? Math.round((c - prevClose) * 1e3) / 1e3 : null
  };
}
async function kline2(secid, { period = "day", limit: limit2 = 320, adjust = 1 } = {}) {
  const code = tencentCode(secid);
  if (code === void 0) throw new Error(`腾讯行情不支持 ${secid}`);
  const fq = adjust === 0 ? "" : adjust === 2 ? "hfq" : "qfq";
  let raw = [];
  if (MINUTE_PERIODS[period]) {
    const json2 = await fetchJson(`https://ifzq.gtimg.cn/appstock/app/kline/mkline?param=${code},${period},,${Math.min(limit2, 800)}`);
    raw = rowsOf(json2, code, period);
  } else {
    const p = DAY_PERIODS[period] ?? "day";
    let end = "";
    while (raw.length < limit2) {
      const json2 = await fetchJson(`https://web.ifzq.gtimg.cn/appstock/app/fqkline/get?param=${code},${p},,${end},${PAGE},${fq}`);
      const page = rowsOf(json2, code, p).filter((r) => raw.length === 0 || r[0] < raw[0][0]);
      if (page.length === 0) break;
      raw = [...page, ...raw];
      if (page.length < PAGE - 1) break;
      const first = /* @__PURE__ */ new Date(`${page[0][0]}T00:00:00Z`);
      first.setUTCDate(first.getUTCDate() - 1);
      end = first.toISOString().slice(0, 10);
    }
  }
  raw = raw.slice(-limit2);
  const bars = raw.map((r, i) => toBar(r, i > 0 ? Number(raw[i - 1][2]) : NaN)).filter((b) => Number.isFinite(b.close));
  return { secid, name: "", bars, source: "tencent" };
}

// src/host/sina.js
var REFERER = "https://finance.sina.com.cn/";
var BASE = "https://vip.stock.finance.sina.com.cn/quotes_service/api/json_v2.php/Market_Center";
var SINA_NODES = { a: "hs_a", sh: "sh_a", sz: "sz_a", cyb: "cyb", kcb: "kcb", bj: "hs_bjs", etf: "etf_hq_fund", lof: "lof_hq_fund", hk: "qbgg_hk", us: "us" };
var empty = { amplitude: null, turnover: null, pe: null, volRatio: null, mcap: null, floatCap: null, pb: null, pct60: null, pctYtd: null };
var HK_SORTS = { f2: "lasttrade", f3: "changepercent", f4: "pricechange", f5: "volume", f6: "amount" };
async function hkList({ sort, order, page, size }) {
  const params = new URLSearchParams({ page: String(page), num: String(Math.min(size, 100)), sort: HK_SORTS[sort] ?? "changepercent", asc: order === "asc" ? "1" : "0", node: "qbgg_hk" });
  const [rowsText, total] = await Promise.all([
    fetchText(`${BASE}.getHKStockData?${params}`, { referer: REFERER }),
    totals.has("hk") ? totals.get("hk") : fetchText(`${BASE}.getHKStockCount?node=qbgg_hk`, { referer: REFERER }).then((t) => {
      const n = Number(JSON.parse(t));
      totals.set("hk", n);
      return n;
    }).catch(() => 0)
  ]);
  const rows = JSON.parse(rowsText);
  if (!Array.isArray(rows)) throw new Error("新浪港股列表格式异常");
  return {
    total,
    rows: rows.map((r) => ({
      ...empty,
      secid: `116.${r.symbol}`,
      code: String(r.symbol),
      name: String(r.name),
      price: num(r.lasttrade),
      pct: num(r.changepercent),
      change: num(r.pricechange),
      volume: num(r.volume),
      amount: num(r.amount),
      high: num(r.high),
      low: num(r.low),
      open: num(r.open),
      prevClose: num(r.prevclose)
    })),
    source: "sina"
  };
}
var US_SORTS = { f2: "price", f3: "chg", f5: "volume", f6: "volume", f20: "mktcap" };
var US_MARKET2 = { NASDAQ: "105", NYSE: "106", AMEX: "107" };
async function usList({ sort, order, page, size }) {
  const params = new URLSearchParams({ page: String(page), num: String(Math.min(size, 100)), sort: US_SORTS[sort] ?? "chg", asc: order === "asc" ? "1" : "0", market: "", id: "" });
  const text2 = await fetchText(`https://stock.finance.sina.com.cn/usstock/api/jsonp.php/cb/US_CategoryService.getList?${params}`, { referer: REFERER });
  const start = text2.indexOf("cb(");
  const json2 = JSON.parse(text2.slice(start + 3, text2.lastIndexOf(")")));
  return {
    total: Number(json2.count) || 0,
    rows: (json2.data ?? []).map((r) => ({
      ...empty,
      secid: `${US_MARKET2[r.market] ?? "105"}.${r.symbol}`,
      code: String(r.symbol),
      name: String(r.cname || r.name),
      price: num(r.price),
      pct: num(r.chg),
      change: num(r.diff),
      volume: num(r.volume),
      amount: null,
      high: num(r.high),
      low: num(r.low),
      open: num(r.open),
      prevClose: num(r.preclose),
      pe: num(r.pe),
      mcap: num(r.mktcap)
    })),
    source: "sina"
  };
}
var SORTS = { f2: "trade", f3: "changepercent", f4: "pricechange", f5: "volume", f6: "amount", f8: "turnoverratio", f9: "per", f12: "symbol", f20: "mktcap", f21: "nmc", f23: "pb" };
var secidOf = (symbol) => {
  const m = /^(sh|sz|bj)(\w+)$/.exec(symbol);
  if (m === null) return void 0;
  return `${m[1] === "sh" ? "1" : "0"}.${m[2]}`;
};
function normalizeSinaRow(r) {
  const price = num(r.trade);
  return {
    secid: secidOf(r.symbol),
    code: String(r.code),
    name: String(r.name),
    price,
    pct: num(r.changepercent),
    change: num(r.pricechange),
    volume: num(r.volume) === null ? null : Math.round(num(r.volume) / 100),
    // 股 → 手，与东方财富一致
    amount: num(r.amount),
    amplitude: null,
    turnover: num(r.turnoverratio),
    pe: num(r.per),
    volRatio: null,
    high: num(r.high),
    low: num(r.low),
    open: num(r.open),
    prevClose: num(r.settlement),
    mcap: num(r.mktcap) === null ? null : num(r.mktcap) * 1e4,
    floatCap: num(r.nmc) === null ? null : num(r.nmc) * 1e4,
    pb: num(r.pb),
    pct60: null,
    pctYtd: null
  };
}
var totals = /* @__PURE__ */ new Map();
async function kline3(secid, { period = "day", limit: limit2 = 320 } = {}) {
  if (period !== "day") throw new Error("新浪备用源只提供日 K");
  const [market, code] = secid.split(".");
  let raw;
  if (market === "1" || market === "0") {
    const symbol = `${market === "1" ? "sh" : /^(4|8|92)/.test(code) ? "bj" : "sz"}${code}`;
    const params = new URLSearchParams({ symbol, scale: "240", ma: "no", datalen: String(Math.min(limit2, 1023)) });
    const rows = JSON.parse(await fetchText(`https://money.finance.sina.com.cn/quotes_service/api/json_v2.php/CN_MarketData.getKLineData?${params}`, { referer: REFERER }));
    if (!Array.isArray(rows)) throw new Error("新浪 K 线格式异常");
    raw = rows.map((r) => ({ date: r.day, open: num(r.open), high: num(r.high), low: num(r.low), close: num(r.close), volume: Math.round((num(r.volume) ?? 0) / 100) }));
  } else if (market === "105" || market === "106" || market === "107") {
    const text2 = await fetchText(`https://stock.finance.sina.com.cn/usstock/api/jsonp_v2.php/var%20_k=/US_MinKService.getDailyK?symbol=${encodeURIComponent(code)}`, { referer: REFERER });
    const start = text2.indexOf("([");
    const rows = JSON.parse(text2.slice(start + 1, text2.lastIndexOf(")")));
    raw = rows.slice(-limit2).map((r) => ({ date: r.d, open: num(r.o), high: num(r.h), low: num(r.l), close: num(r.c), volume: num(r.v) }));
  } else {
    throw new Error(`新浪备用源不支持 ${secid}`);
  }
  const bars = raw.slice(-limit2).filter((b) => b.close !== null).map((b, i, arr) => {
    const prev = i > 0 ? arr[i - 1].close : null;
    return { ...b, amount: null, amplitude: null, turnover: null, pct: prev ? Math.round((b.close / prev - 1) * 1e4) / 100 : null, change: prev ? Math.round((b.close - prev) * 1e3) / 1e3 : null };
  });
  return { secid, name: "", bars, source: "sina", unadjusted: true };
}
async function list2({ market, sort = "f3", order = "desc", page = 1, size = 50 }) {
  const node = SINA_NODES[market];
  if (node === void 0) throw new Error(`新浪行情不支持市场 ${market}`);
  if (market === "hk") return hkList({ sort, order, page, size });
  if (market === "us") return usList({ sort, order, page, size });
  const params = new URLSearchParams({
    page: String(page),
    num: String(Math.min(size, 100)),
    sort: SORTS[sort] ?? "changepercent",
    asc: order === "asc" ? "1" : "0",
    node
  });
  const [rowsText, total] = await Promise.all([
    fetchText(`${BASE}.getHQNodeData?${params}`, { referer: REFERER }),
    totals.has(node) ? totals.get(node) : fetchText(`${BASE}.getHQNodeStockCount?node=${node}`, { referer: REFERER }).then((t) => {
      const n = Number(JSON.parse(t));
      totals.set(node, n);
      return n;
    }).catch(() => 0)
  ]);
  const rows = JSON.parse(rowsText);
  if (!Array.isArray(rows)) throw new Error("新浪列表格式异常");
  return { total, rows: rows.map(normalizeSinaRow).filter((r) => r.secid !== void 0), source: "sina" };
}

// src/host/sources.js
var COOL_MS = 5 * 6e4;
var COOL_MAX = 30 * 6e4;
var klineSlot = createLimiter(2);
var lastKline = 0;
var throttled = (fn) => (...args) => klineSlot(async () => {
  const wait = lastKline + 150 - Date.now();
  lastKline = Date.now() + Math.max(0, wait);
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  return fn(...args);
});
function failover(kind, providers) {
  const state = providers.map((p) => ({ ...p, coolUntil: 0, failures: 0, lastError: null }));
  const call = async (...args) => {
    const now = Date.now();
    const supported = state.filter((p) => p.supports === void 0 || p.supports(...args));
    const live = supported.filter((p) => p.coolUntil <= now);
    const ordered = live.length > 0 ? live : [...supported].sort((a, b) => a.coolUntil - b.coolUntil);
    let lastError = new Error(`没有可用的${kind}数据源`);
    for (const p of ordered) {
      try {
        const result = await p.fn(...args);
        p.failures = 0;
        if (p.accept === void 0 || p.accept(result) || p === ordered[ordered.length - 1]) return result;
      } catch (error) {
        lastError = error;
        p.failures++;
        p.coolUntil = Date.now() + Math.min(COOL_MAX, COOL_MS * 2 ** (p.failures - 1));
        p.lastError = String(error?.message ?? error);
      }
    }
    throw lastError;
  };
  call.status = () => state.map((p) => ({ kind, id: p.id, cooling: p.coolUntil > Date.now(), lastError: p.lastError }));
  return call;
}
var list3 = failover("列表", [
  { id: "eastmoney", fn: (args) => list(args) },
  { id: "sina", fn: (args) => list2(args), supports: (args) => SINA_NODES[args.market] !== void 0 }
]);
var quotes3 = failover("报价", [
  { id: "eastmoney", fn: (ids) => quotes(ids), accept: (rows) => rows.length > 0 },
  { id: "tencent", fn: (ids) => quotes2(ids) }
]);
var quote2 = failover("详情", [
  { id: "eastmoney", fn: (id) => quote(id) },
  {
    id: "tencent",
    fn: async (id) => {
      const [q] = await quotes2([id]);
      if (q === void 0) throw new Error(`找不到证券 ${id}`);
      return { ...q, avgPrice: null, time: null };
    }
  }
]);
var kline4 = failover("K 线", [
  { id: "eastmoney", fn: throttled((id, o) => kline(id, o)), accept: (r) => r.bars.length > 0 },
  { id: "tencent", fn: throttled((id, o) => kline2(id, o)), accept: (r) => r.bars.length > 0 },
  { id: "sina", fn: throttled((id, o) => kline3(id, o)), supports: (_id, o = {}) => (o.period ?? "day") === "day" }
]);
var trends2 = failover("分时", [{ id: "eastmoney", fn: (id) => trends(id) }]);
var search3 = failover("搜索", [
  { id: "tencent", fn: (q) => search2(q), accept: (rows) => rows.length > 0 },
  { id: "eastmoney", fn: async (q) => (await search(q)).map((r) => ({ symbol: r.secid, code: r.code, name: r.name, type: r.type })) }
]);
async function topRows({ market, fs, sort, pages }) {
  const out = [];
  for (let page = 1; page <= pages; page++) {
    const r = await list3({ market, fs, sort, order: "desc", page, size: 100 });
    out.push(...r.rows);
    if (r.rows.length < 100) break;
  }
  return out;
}
function status() {
  return [list3, quotes3, quote2, kline4, trends2, search3].flatMap((f) => f.status());
}

// src/host/funds.js
var RANK_REFERER = "https://fund.eastmoney.com/data/fundranking.html";
function parseFundList(text2) {
  const start = text2.indexOf("[");
  const end = text2.lastIndexOf("]");
  if (start < 0 || end < start) throw new Error("基金代码表格式异常");
  const rows = JSON.parse(text2.slice(start, end + 1));
  return rows.map(([code, abbr, name2, type, pinyin]) => ({ code, abbr, name: name2, type, pinyin }));
}
async function fetchFundList() {
  return parseFundList(await fetchText("https://fund.eastmoney.com/js/fundcode_search.js", { timeoutMs: 2e4 }));
}
function searchFundList(list4, query, count = 12) {
  const q = query.trim().toLowerCase();
  if (q === "") return [];
  const scored = [];
  for (const f of list4) {
    let score = 0;
    if (f.code.startsWith(q)) score = 3;
    else if (f.name.toLowerCase().includes(q)) score = 2;
    else if (f.abbr.toLowerCase().startsWith(q) || f.pinyin.toLowerCase().startsWith(q)) score = 1;
    if (score > 0) scored.push({ f, score });
    if (scored.length > 400) break;
  }
  scored.sort((a, b) => b.score - a.score || a.f.name.length - b.f.name.length);
  return scored.slice(0, count).map(({ f }) => ({ symbol: `fund:${f.code}`, code: f.code, name: f.name, type: f.type }));
}
var FUND_TYPES = /* @__PURE__ */ new Set(["all", "gp", "hh", "zq", "zs", "qdii", "fof", "lof"]);
var FUND_SORTS = /* @__PURE__ */ new Set(["rzdf", "zzf", "1yzf", "3yzf", "6yzf", "1nzf", "2nzf", "3nzf", "jnzf", "lnzf"]);
function parseFundRank(text2) {
  const datas = /datas:(\[[\s\S]*?\]),allRecords:(\d+)/.exec(text2);
  if (datas === null) throw new Error("基金排行格式异常");
  const rows = JSON.parse(datas[1]).map((line) => {
    const c = line.split(",");
    return {
      symbol: `fund:${c[0]}`,
      code: c[0],
      name: c[1],
      date: c[3],
      nav: num(c[4]),
      accNav: num(c[5]),
      day: num(c[6]),
      week: num(c[7]),
      month: num(c[8]),
      month3: num(c[9]),
      month6: num(c[10]),
      year1: num(c[11]),
      year2: num(c[12]),
      year3: num(c[13]),
      ytd: num(c[14]),
      since: num(c[15]),
      inception: c[16],
      fee: c[20] || null
    };
  });
  return { total: Number(datas[2]), rows };
}
async function fundRank({ type = "all", sort = "1nzf", order = "desc", page = 1, size = 50 }) {
  const params = new URLSearchParams({
    op: "ph",
    dt: "kf",
    ft: FUND_TYPES.has(type) ? type : "all",
    rs: "",
    gs: "0",
    sc: FUND_SORTS.has(sort) ? sort : "1nzf",
    st: order === "asc" ? "asc" : "desc",
    pi: String(page),
    pn: String(Math.min(size, 100)),
    dx: "1"
  });
  return parseFundRank(await fetchText(`https://fund.eastmoney.com/data/rankhandler.aspx?${params}`, { referer: RANK_REFERER }));
}
function readVar(text2, name2) {
  const m = new RegExp(`var ${name2}\\s*=\\s*([\\s\\S]*?);\\s*(?:/\\*|var |$)`).exec(text2);
  if (m === null) return void 0;
  try {
    return JSON.parse(m[1]);
  } catch {
    return void 0;
  }
}
function parsePingzhong(text2, code) {
  const trend = readVar(text2, "Data_netWorthTrend") ?? [];
  const managers = readVar(text2, "Data_currentFundManager") ?? [];
  const scale = readVar(text2, "Data_fluctuationScale");
  const navs = trend.filter((p) => Number.isFinite(p?.x) && Number.isFinite(p?.y)).map((p) => ({ date: new Date(p.x + 8 * 3600 * 1e3).toISOString().slice(0, 10), nav: p.y, pct: num(p.equityReturn) }));
  const lastScale = Array.isArray(scale?.series) ? scale.series[scale.series.length - 1] : void 0;
  return {
    symbol: `fund:${code}`,
    code,
    name: readVar(text2, "fS_name") ?? code,
    feeRate: readVar(text2, "fund_Rate") ?? null,
    minPurchase: readVar(text2, "fund_minsg") ?? null,
    returns: {
      month1: num(readVar(text2, "syl_1y")),
      month3: num(readVar(text2, "syl_3y")),
      month6: num(readVar(text2, "syl_6y")),
      year1: num(readVar(text2, "syl_1n"))
    },
    holdingSecids: readVar(text2, "stockCodesNew") ?? [],
    managers: managers.map((m) => ({ name: m.name, workTime: m.workTime, fundSize: m.fundSize })),
    scale: lastScale === void 0 ? null : { value: num(lastScale.y), label: String(lastScale.mom ?? "") },
    navs
  };
}
async function fundDetail(code) {
  if (!/^\d{6}$/.test(code)) throw new Error("基金代码应为 6 位数字");
  const text2 = await fetchText(`https://fund.eastmoney.com/pingzhongdata/${code}.js`, { timeoutMs: 15e3 });
  if (!text2.includes("fS_code")) throw new Error(`找不到基金 ${code}`);
  return parsePingzhong(text2, code);
}
async function fundHoldings(code) {
  try {
    const params = new URLSearchParams({ FCODE: code, deviceid: "Wap", plat: "Wap", product: "EFund", version: "2.0.0" });
    const json2 = await fetchJson(`https://fundmobapi.eastmoney.com/FundMNewApi/FundMNInverstPosition?${params}`);
    const stocks = json2?.Datas?.fundStocks ?? [];
    return stocks.slice(0, 10).map((s) => ({
      code: String(s.GPDM),
      name: String(s.GPJC),
      weight: num(s.JZBL),
      secid: s.NEWTEXCH !== void 0 ? `${s.NEWTEXCH}.${s.GPDM}` : void 0
    }));
  } catch {
    return [];
  }
}

// src/host/markets.js
var MARKETS = [
  { id: "a", region: "cn", fs: "m:0+t:6,m:0+t:80,m:1+t:2,m:1+t:23,m:0+t:81+s:2048" },
  { id: "sh", region: "cn", fs: "m:1+t:2,m:1+t:23" },
  { id: "sz", region: "cn", fs: "m:0+t:6,m:0+t:80" },
  { id: "cyb", region: "cn", fs: "m:0+t:80" },
  { id: "kcb", region: "cn", fs: "m:1+t:23" },
  { id: "bj", region: "cn", fs: "m:0+t:81+s:2048" },
  { id: "etf", region: "cn", fs: "b:MK0021,b:MK0022,b:MK0023,b:MK0024" },
  { id: "lof", region: "cn", fs: "b:MK0404,b:MK0405,b:MK0406,b:MK0407" },
  { id: "hk", region: "hk", fs: "m:128+t:3,m:128+t:4,m:128+t:1,m:128+t:2" },
  { id: "us", region: "us", fs: "m:105,m:106,m:107" },
  { id: "fund", region: "cn", source: "fund" }
];
var INDICES = [
  "1.000001",
  "0.399001",
  "0.399006",
  "1.000300",
  "1.000688",
  "0.899050",
  "100.HSI",
  "100.NDX",
  "100.SPX"
];
var SORT_FIELDS = /* @__PURE__ */ new Set(["f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "f10", "f12", "f20", "f21", "f23", "f24", "f25"]);
var FUND_PREFIX = "fund:";
function isFundSymbol(symbol) {
  return typeof symbol === "string" && symbol.startsWith(FUND_PREFIX);
}
function isSecid(value) {
  return typeof value === "string" && /^\d{1,3}\.[A-Za-z0-9_.-]{1,16}$/.test(value);
}
function classify(secid, name2 = "") {
  const [market, code = ""] = secid.split(".");
  if (market === "116" || market === "128") return { kind: "stock", region: "hk", board: "hk" };
  if (market === "105" || market === "106" || market === "107") return { kind: "stock", region: "us", board: "us" };
  if (market === "100" || market === "124" || market === "134") return { kind: "index", region: "global", board: "index" };
  const st = /ST/i.test(name2);
  if (market === "1") {
    if (/^(000|880|999)/.test(code)) return { kind: "index", region: "cn", board: "index" };
    if (/^5/.test(code)) return { kind: "etf", region: "cn", board: "fund" };
    if (/^9/.test(code)) return { kind: "stock", region: "cn", board: "b" };
    if (/^68[89]/.test(code)) return { kind: "stock", region: "cn", board: "kcb", st };
    return { kind: "stock", region: "cn", board: "main", st };
  }
  if (market === "0") {
    if (/^(399|899)/.test(code)) return { kind: "index", region: "cn", board: "index" };
    if (/^1[2-9]/.test(code)) return { kind: "etf", region: "cn", board: "fund" };
    if (/^2/.test(code)) return { kind: "stock", region: "cn", board: "b" };
    if (/^30/.test(code)) return { kind: "stock", region: "cn", board: "cyb", st };
    if (/^(4|8|92)/.test(code)) return { kind: "stock", region: "cn", board: "bj", st };
    return { kind: "stock", region: "cn", board: "main", st };
  }
  return { kind: "stock", region: "cn", board: "main", st };
}
function paperTradable(info) {
  return info.region === "cn" && (info.kind === "etf" || info.kind === "stock" && info.board !== "b");
}
function priceLimitRatio(info) {
  if (info.st) return 0.05;
  if (info.board === "cyb" || info.board === "kcb") return 0.2;
  if (info.board === "bj") return 0.3;
  return 0.1;
}
function buyLotRule(info) {
  if (info.board === "kcb") return { min: 200, step: 1 };
  if (info.board === "bj") return { min: 100, step: 1 };
  return { min: 100, step: 100 };
}
function guessCnSecid(code) {
  if (!/^\d{6}$/.test(code)) return void 0;
  if (/^(6|5|9)/.test(code)) return `1.${code}`;
  return `0.${code}`;
}

// src/host/indicators.js
function sma(values, n) {
  const out = new Array(values.length).fill(null);
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    sum += values[i];
    if (i >= n) sum -= values[i - n];
    if (i >= n - 1) out[i] = sum / n;
  }
  return out;
}
function ema(values, n) {
  const out = new Array(values.length).fill(null);
  if (values.length < n) return out;
  const k = 2 / (n + 1);
  let prev = values.slice(0, n).reduce((a, b) => a + b, 0) / n;
  out[n - 1] = prev;
  for (let i = n; i < values.length; i++) {
    prev = values[i] * k + prev * (1 - k);
    out[i] = prev;
  }
  return out;
}
function macd(closes, fast = 12, slow = 26, signal = 9) {
  const ef = ema(closes, fast);
  const es = ema(closes, slow);
  const dif = closes.map((_, i) => ef[i] === null || es[i] === null ? null : ef[i] - es[i]);
  const start = dif.findIndex((v) => v !== null);
  const dea = new Array(closes.length).fill(null);
  if (start >= 0) {
    const tail = ema(dif.slice(start), signal);
    tail.forEach((v, j) => {
      dea[start + j] = v;
    });
  }
  const hist = dif.map((v, i) => v === null || dea[i] === null ? null : 2 * (v - dea[i]));
  return { dif, dea, hist };
}
function rsi(closes, n = 14) {
  const out = new Array(closes.length).fill(null);
  if (closes.length <= n) return out;
  let gain = 0;
  let loss = 0;
  for (let i = 1; i <= n; i++) {
    const d = closes[i] - closes[i - 1];
    if (d >= 0) gain += d;
    else loss -= d;
  }
  gain /= n;
  loss /= n;
  out[n] = loss === 0 ? 100 : 100 - 100 / (1 + gain / loss);
  for (let i = n + 1; i < closes.length; i++) {
    const d = closes[i] - closes[i - 1];
    gain = (gain * (n - 1) + Math.max(d, 0)) / n;
    loss = (loss * (n - 1) + Math.max(-d, 0)) / n;
    out[i] = loss === 0 ? 100 : 100 - 100 / (1 + gain / loss);
  }
  return out;
}
function trueRange(bars) {
  return bars.map((b, i) => {
    if (i === 0) return b.high - b.low;
    const pdc = bars[i - 1].close;
    return Math.max(b.high - b.low, b.high - pdc, pdc - b.low);
  });
}
function turtleN(bars, n = 20) {
  const tr = trueRange(bars);
  const out = new Array(bars.length).fill(null);
  if (bars.length <= n) return out;
  let prev = tr.slice(1, n + 1).reduce((a, b) => a + b, 0) / n;
  out[n] = prev;
  for (let i = n + 1; i < bars.length; i++) {
    prev = ((n - 1) * prev + tr[i]) / n;
    out[i] = prev;
  }
  return out;
}
function donchian(bars, n) {
  const upper = new Array(bars.length).fill(null);
  const lower = new Array(bars.length).fill(null);
  for (let i = n; i < bars.length; i++) {
    let hi = -Infinity;
    let lo = Infinity;
    for (let j = i - n; j < i; j++) {
      if (bars[j].high > hi) hi = bars[j].high;
      if (bars[j].low < lo) lo = bars[j].low;
    }
    upper[i] = hi;
    lower[i] = lo;
  }
  return { upper, lower };
}
function logReturns(values) {
  const out = [];
  for (let i = 1; i < values.length; i++) {
    if (values[i - 1] > 0 && values[i] > 0) out.push(Math.log(values[i] / values[i - 1]));
  }
  return out;
}
function stdev(values) {
  if (values.length < 2) return null;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const v = values.reduce((a, b) => a + (b - mean) ** 2, 0) / (values.length - 1);
  return Math.sqrt(v);
}
function dailyVolatility(values, n = 60) {
  return stdev(logReturns(values.slice(-(n + 1))));
}
function maxDrawdown(values) {
  let peak = -Infinity;
  let mdd = 0;
  for (const v of values) {
    if (v > peak) peak = v;
    if (peak > 0) mdd = Math.min(mdd, v / peak - 1);
  }
  return mdd;
}
function changeOver(values, n) {
  if (values.length <= n) return null;
  const base = values[values.length - 1 - n];
  return base > 0 ? values[values.length - 1] / base - 1 : null;
}
function median(values) {
  if (values.length === 0) return null;
  const s = [...values].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 === 1 ? s[m] : (s[m - 1] + s[m]) / 2;
}

// src/host/signals.js
var at = (arr) => arr[arr.length - 1];
function systemState(bars, entryN, exitN) {
  const entry = donchian(bars, entryN).upper;
  const exit = donchian(bars, exitN).lower;
  let inPos = false;
  let entryIdx = -1;
  let exitIdx = -1;
  for (let i = 0; i < bars.length; i++) {
    const c = bars[i].close;
    if (!inPos && entry[i] !== null && c > entry[i]) {
      inPos = true;
      entryIdx = i;
    } else if (inPos && exit[i] !== null && c < exit[i]) {
      inPos = false;
      exitIdx = i;
    }
  }
  const last = bars.length - 1;
  let state = "flat";
  if (inPos) state = entryIdx === last ? "breakout" : "long";
  else if (exitIdx === last) state = "exit";
  return {
    state,
    entryLevel: entry[last],
    exitLevel: exit[last],
    entryDate: inPos ? bars[entryIdx].date : null,
    entryPrice: inPos ? bars[entryIdx].close : null,
    lastExitDate: exitIdx >= 0 ? bars[exitIdx].date : null
  };
}
function priceRanges(price, sigma, horizons = [5, 20]) {
  if (sigma === null || !(price > 0)) return null;
  const out = {};
  for (const h of horizons) {
    const s = sigma * Math.sqrt(h);
    out[`h${h}`] = {
      move: round(s * 100, 2),
      p68: [round(price * Math.exp(-s), 3), round(price * Math.exp(s), 3)],
      p95: [round(price * Math.exp(-1.96 * s), 3), round(price * Math.exp(1.96 * s), 3)]
    };
  }
  return out;
}
function signalBaseRate(bars, { entryN = 55, hold = 20, trendFilter = true } = {}) {
  if (bars.length < entryN + hold + 10) return null;
  const closes = bars.map((b) => b.close);
  const upper = donchian(bars, entryN).upper;
  const ma50 = sma(closes, 50);
  const ma300 = sma(closes, 300);
  const n = turtleN(bars);
  const results = [];
  for (let i = entryN + 1; i < bars.length - hold; i++) {
    const hit = upper[i] !== null && closes[i] > upper[i] && !(upper[i - 1] !== null && closes[i - 1] > upper[i - 1]);
    if (!hit) continue;
    if (trendFilter && !(ma50[i] !== null && ma300[i] !== null && ma50[i] > ma300[i])) continue;
    const entry = closes[i];
    let minLow = Infinity;
    for (let j = i + 1; j <= i + hold; j++) minLow = Math.min(minLow, bars[j].low);
    const stop = n[i] === null ? null : entry - 2 * n[i];
    results.push({ ret: closes[i + hold] / entry - 1, mae: minLow / entry - 1, stopHit: stop !== null && minLow <= stop });
  }
  if (results.length === 0) return { count: 0 };
  const rets = results.map((r) => r.ret);
  return {
    count: results.length,
    hold,
    winRate: round(results.filter((r) => r.ret > 0).length / results.length * 100, 1),
    avg: round(rets.reduce((a, b) => a + b, 0) / rets.length * 100, 2),
    median: round(median(rets) * 100, 2),
    avgMae: round(results.reduce((a, r) => a + r.mae, 0) / results.length * 100, 2),
    stopHitRate: round(results.filter((r) => r.stopHit).length / results.length * 100, 1)
  };
}
function unitShares(equity, riskPct, n, lot) {
  if (!(n > 0) || !(equity > 0)) return 0;
  const raw = Math.floor(equity * riskPct / n);
  const shares = lot.step > 1 ? Math.floor(raw / lot.step) * lot.step : raw;
  return shares >= lot.min ? shares : 0;
}
function stanceOf(score) {
  if (score >= 45) return "bullish";
  if (score >= 15) return "leanBull";
  if (score > -15) return "neutral";
  if (score > -45) return "leanBear";
  return "bearish";
}
function analyzeBars(bars, { equity = 1e6, riskPct = 0.01, lot = { min: 100, step: 100 } } = {}) {
  if (bars.length < 30) return { insufficient: true, bars: bars.length };
  const closes = bars.map((b) => b.close);
  const last = at(bars);
  const price = last.close;
  const ma = (n2) => at(sma(closes, n2));
  const levels = {
    ma20: ma(20),
    ma60: ma(60),
    ma250: ma(250),
    ma50: ma(50),
    ma300: ma(300),
    high20: at(donchian(bars, 20).upper),
    low20: at(donchian(bars, 20).lower),
    high55: at(donchian(bars, 55).upper),
    low55: at(donchian(bars, 55).lower),
    low10: at(donchian(bars, 10).lower)
  };
  const year = bars.slice(-250);
  levels.high52w = Math.max(...year.map((b) => b.high));
  levels.low52w = Math.min(...year.map((b) => b.low));
  const n = at(turtleN(bars));
  const sigma = dailyVolatility(closes, 60);
  const m = macd(closes);
  const r = at(rsi(closes));
  const s1 = systemState(bars, 20, 10);
  const s2 = systemState(bars, 55, 20);
  const trendFilter = levels.ma50 !== null && levels.ma300 !== null ? levels.ma50 > levels.ma300 ? "up" : "down" : null;
  const momentum = { d5: changeOver(closes, 5), d20: changeOver(closes, 20), d60: changeOver(closes, 60), d250: changeOver(closes, 250) };
  const reasons = [];
  let score = 0;
  const add = (delta, key, params = {}) => {
    score += delta;
    reasons.push({ key, params, tone: delta > 0 ? "bull" : delta < 0 ? "bear" : "neutral" });
  };
  if (levels.ma60 !== null) add(price > levels.ma60 ? 15 : -15, price > levels.ma60 ? "trend.aboveMa60" : "trend.belowMa60", { ma: round(levels.ma60, 3) });
  if (levels.ma250 !== null) add(price > levels.ma250 ? 10 : -10, price > levels.ma250 ? "trend.aboveMa250" : "trend.belowMa250", { ma: round(levels.ma250, 3) });
  if (trendFilter !== null) add(trendFilter === "up" ? 15 : -15, trendFilter === "up" ? "trend.filterUp" : "trend.filterDown");
  if (s2.state === "breakout") add(25, "turtle.s2Breakout", { level: round(s2.entryLevel, 3) });
  else if (s2.state === "long") add(20, "turtle.s2Long", { date: s2.entryDate, exit: round(s2.exitLevel, 3) });
  else if (s2.state === "exit") add(-20, "turtle.s2Exit", { level: round(s2.exitLevel, 3) });
  else add(0, "turtle.s2Flat", { level: round(s2.entryLevel, 3) });
  if (s1.state === "breakout") add(10, "turtle.s1Breakout", { level: round(s1.entryLevel, 3) });
  else if (s1.state === "long") add(5, "turtle.s1Long", { date: s1.entryDate, exit: round(s1.exitLevel, 3) });
  else if (s1.state === "exit") add(-10, "turtle.s1Exit", { level: round(s1.exitLevel, 3) });
  if (momentum.d60 !== null && Math.abs(momentum.d60) >= 0.1) {
    add(momentum.d60 > 0 ? 10 : -10, momentum.d60 > 0 ? "momentum.up60" : "momentum.down60", { pct: round(Math.abs(momentum.d60) * 100, 1) });
  }
  const hist = at(m.hist);
  const prevHist = m.hist[m.hist.length - 2];
  if (hist !== null && prevHist !== null) {
    if (hist > 0 && prevHist <= 0) add(5, "macd.golden");
    else if (hist < 0 && prevHist >= 0) add(-5, "macd.dead");
  }
  if (r !== null && r >= 80) add(-5, "rsi.overbought", { value: round(r, 1) });
  else if (r !== null && r <= 20) add(0, "rsi.oversold", { value: round(r, 1) });
  if (price >= levels.high52w * 0.98) add(0, "pos.near52wHigh");
  else if (price <= levels.low52w * 1.02) add(0, "pos.near52wLow");
  score = Math.max(-100, Math.min(100, score));
  const shares = unitShares(equity, riskPct, n, lot);
  const plan = n === null ? null : {
    n: round(n, 4),
    nPct: round(n / price * 100, 2),
    buyNow: { price, stop: round(price - 2 * n, 3) },
    s1Entry: s1.entryLevel === null ? null : { price: round(s1.entryLevel, 3), stop: round(s1.entryLevel - 2 * n, 3) },
    s2Entry: s2.entryLevel === null ? null : { price: round(s2.entryLevel, 3), stop: round(s2.entryLevel - 2 * n, 3) },
    addStep: round(n / 2, 4),
    unitShares: shares,
    unitValue: round(shares * price, 2),
    riskAtStop: round(shares * 2 * n, 2),
    equity,
    riskPct
  };
  return {
    asOf: last.date,
    price,
    levels: Object.fromEntries(Object.entries(levels).map(([k, v]) => [k, round(v, 3)])),
    momentum: Object.fromEntries(Object.entries(momentum).map(([k, v]) => [k, v === null ? null : round(v * 100, 2)])),
    volatility: sigma === null ? null : { daily: round(sigma * 100, 2), annual: round(sigma * Math.sqrt(252) * 100, 1) },
    maxDrawdown1y: round(maxDrawdown(year.map((b) => b.close)) * 100, 1),
    macd: { dif: round(at(m.dif), 4), dea: round(at(m.dea), 4), hist: round(hist, 4) },
    rsi: round(r, 1),
    turtle: {
      trendFilter,
      system1: { ...s1, entryLevel: round(s1.entryLevel, 3), exitLevel: round(s1.exitLevel, 3) },
      system2: { ...s2, entryLevel: round(s2.entryLevel, 3), exitLevel: round(s2.exitLevel, 3) },
      plan
    },
    forecast: priceRanges(price, sigma),
    baseRates: {
      system2: signalBaseRate(bars, { entryN: 55, hold: 20, trendFilter: true }),
      system1: signalBaseRate(bars, { entryN: 20, hold: 20, trendFilter: true }),
      system2Raw: signalBaseRate(bars, { entryN: 55, hold: 20, trendFilter: false })
    },
    score,
    stance: stanceOf(score),
    reasons
  };
}
function analyzeNav(navs) {
  if (navs.length < 30) return { insufficient: true, bars: navs.length };
  const values = navs.map((p) => p.nav);
  const nav = at(values);
  const ma60 = at(sma(values, 60));
  const ma250 = at(sma(values, 250));
  const year = values.slice(-250);
  const peak = Math.max(...year);
  const ret = (d) => {
    const c = changeOver(values, d);
    return c === null ? null : round(c * 100, 2);
  };
  const returns = { m1: ret(21), m3: ret(63), m6: ret(126), y1: ret(250), y3: ret(750) };
  const sigma = dailyVolatility(values, 250);
  const reasons = [];
  let score = 0;
  const add = (delta, key, params = {}) => {
    score += delta;
    reasons.push({ key, params, tone: delta > 0 ? "bull" : delta < 0 ? "bear" : "neutral" });
  };
  if (ma60 !== null) add(nav > ma60 ? 20 : -20, nav > ma60 ? "fund.aboveMa60" : "fund.belowMa60", { ma: round(ma60, 4) });
  if (ma250 !== null) add(nav > ma250 ? 20 : -20, nav > ma250 ? "fund.aboveMa250" : "fund.belowMa250", { ma: round(ma250, 4) });
  if (returns.m3 !== null) add(returns.m3 > 0 ? 10 : -10, returns.m3 > 0 ? "fund.m3Up" : "fund.m3Down", { pct: Math.abs(returns.m3) });
  if (returns.y1 !== null) add(returns.y1 > 0 ? 10 : -10, returns.y1 > 0 ? "fund.y1Up" : "fund.y1Down", { pct: Math.abs(returns.y1) });
  const fromPeak = peak > 0 ? nav / peak - 1 : 0;
  if (fromPeak <= -0.2) add(-10, "fund.deepDrawdown", { pct: round(Math.abs(fromPeak) * 100, 1) });
  return {
    asOf: at(navs).date,
    nav,
    levels: { ma60: round(ma60, 4), ma250: round(ma250, 4), peak1y: round(peak, 4) },
    returns,
    fromPeak: round(fromPeak * 100, 2),
    maxDrawdown1y: round(maxDrawdown(year) * 100, 1),
    maxDrawdownAll: round(maxDrawdown(values) * 100, 1),
    volatility: sigma === null ? null : { daily: round(sigma * 100, 2), annual: round(sigma * Math.sqrt(252) * 100, 1) },
    forecast: priceRanges(nav, sigma, [20, 60]),
    score: Math.max(-100, Math.min(100, score)),
    stance: stanceOf(score),
    reasons
  };
}

// src/host/paper.js
var DEFAULT_FEES = { commissionRate: 25e-5, minCommission: 5, stampTaxRate: 5e-4, transferRate: 1e-5 };
function createAccount(initialCash = 1e6) {
  return {
    version: 1,
    initialCash,
    cash: initialCash,
    realized: 0,
    feesPaid: 0,
    positions: {},
    orders: [],
    trades: [],
    equityHistory: [],
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
}
function feesFor(side, amount, info, fees = DEFAULT_FEES) {
  const commission = Math.max(amount * fees.commissionRate, fees.minCommission);
  const stock = info.kind === "stock";
  const stampTax = side === "sell" && stock ? amount * fees.stampTaxRate : 0;
  const transfer = stock ? amount * fees.transferRate : 0;
  return {
    commission: round(commission, 2),
    stampTax: round(stampTax, 2),
    transfer: round(transfer, 2),
    total: round(commission + stampTax + transfer, 2)
  };
}
function availableQty(position, today2 = beijingDate()) {
  if (position === void 0) return 0;
  return position.lots.filter((l) => l.date < today2).reduce((a, l) => a + l.qty, 0);
}
function totalQty(position) {
  return position === void 0 ? 0 : position.lots.reduce((a, l) => a + l.qty, 0);
}
function limitPrices(quote3, info) {
  if (quote3.limitUp !== null && quote3.limitUp !== void 0 && quote3.limitDown !== null && quote3.limitDown !== void 0) {
    return { up: quote3.limitUp, down: quote3.limitDown };
  }
  if (!(quote3.prevClose > 0)) return { up: Infinity, down: 0 };
  const r = priceLimitRatio(info);
  return { up: round(quote3.prevClose * (1 + r), 2), down: round(quote3.prevClose * (1 - r), 2) };
}
var fail = (code, params = {}) => ({ ok: false, code, params });
function checkQty(side, qty, info, position, today2) {
  if (!Number.isInteger(qty) || qty <= 0) return fail("paper.badQty");
  const lot = buyLotRule(info);
  if (side === "buy") {
    if (qty < lot.min) return fail("paper.minQty", { min: lot.min });
    if (lot.step > 1 && qty % lot.step !== 0) return fail("paper.lotStep", { step: lot.step });
    return null;
  }
  const avail = availableQty(position, today2);
  if (avail === 0) return fail(totalQty(position) > 0 ? "paper.tPlusOne" : "paper.noPosition");
  if (qty > avail) return fail("paper.overSell", { avail });
  const oddLot = lot.step > 1 ? qty % lot.step !== 0 : qty < lot.min;
  if (oddLot && qty !== avail) return fail("paper.oddLot", { avail });
  return null;
}
function fill(state, order, price, info, fees, now) {
  const amount = round(price * order.qty, 2);
  const f = feesFor(order.side, amount, info, fees);
  const today2 = beijingDate(now);
  let pos = state.positions[order.secid];
  if (order.side === "buy") {
    state.cash = round(state.cash - amount - f.total, 2);
    if (pos === void 0) {
      pos = { secid: order.secid, code: order.code, name: order.name, kind: info.kind, lots: [], cost: 0, stop: null };
      state.positions[order.secid] = pos;
    }
    pos.lots.push({ qty: order.qty, date: today2, price });
    pos.cost = round(pos.cost + amount + f.total, 2);
    if (order.stop !== void 0 && order.stop !== null) pos.stop = order.stop;
  } else {
    const qtyBefore = totalQty(pos);
    const avgCost = pos.cost / qtyBefore;
    const proceeds = amount - f.total;
    const realized = round(proceeds - avgCost * order.qty, 2);
    state.cash = round(state.cash + proceeds, 2);
    state.realized = round(state.realized + realized, 2);
    let remaining = order.qty;
    for (const lot of pos.lots) {
      if (remaining === 0 || lot.date >= today2) continue;
      const take = Math.min(lot.qty, remaining);
      lot.qty -= take;
      remaining -= take;
    }
    pos.lots = pos.lots.filter((l) => l.qty > 0);
    pos.cost = round(avgCost * totalQty(pos), 2);
    order.realized = realized;
    if (totalQty(pos) === 0) delete state.positions[order.secid];
  }
  state.feesPaid = round(state.feesPaid + f.total, 2);
  Object.assign(order, { status: "filled", fillPrice: price, amount, fee: f.total, filledAt: now.toISOString() });
  state.trades.unshift({
    id: shortId("t"),
    orderId: order.id,
    secid: order.secid,
    code: order.code,
    name: order.name,
    side: order.side,
    qty: order.qty,
    price,
    amount,
    fee: f.total,
    realized: order.realized ?? null,
    at: order.filledAt
  });
  if (state.trades.length > 500) state.trades.length = 500;
}
function placeOrder(state, request, quote3, info, { fees = DEFAULT_FEES, now = /* @__PURE__ */ new Date(), open = isMarketOpen("cn", now) } = {}) {
  if (!paperTradable(info)) return fail("paper.notTradable");
  const { side, type } = request;
  if (side !== "buy" && side !== "sell") return fail("paper.badSide");
  if (type !== "market" && type !== "limit") return fail("paper.badType");
  if (!(quote3.price > 0)) return fail("paper.noPrice");
  const today2 = beijingDate(now);
  const pos = state.positions[request.secid];
  const qtyError = checkQty(side, request.qty, info, pos, today2);
  if (qtyError) return qtyError;
  if (type === "market" && !open) return fail("paper.marketClosed");
  const limits = limitPrices(quote3, info);
  if (type === "limit") {
    if (!(request.price > 0)) return fail("paper.badPrice");
    if (request.price > limits.up || request.price < limits.down) return fail("paper.outOfLimit", { up: limits.up, down: limits.down });
  }
  const order = {
    id: shortId("o"),
    secid: request.secid,
    code: request.code,
    name: request.name,
    kind: info.kind,
    side,
    type,
    qty: request.qty,
    price: type === "limit" ? round(request.price, 3) : null,
    stop: request.stop ?? null,
    status: "pending",
    createdAt: now.toISOString(),
    tradeDate: cnTradeDate(now)
  };
  if (side === "buy") {
    const refPrice = type === "limit" ? order.price : quote3.price;
    const need = refPrice * order.qty + feesFor("buy", refPrice * order.qty, info, fees).total;
    if (need > availableCash(state)) return fail("paper.noCash", { need: round(need, 2), cash: round(availableCash(state), 2) });
  }
  const marketable = type === "market" || (side === "buy" ? quote3.price <= order.price : quote3.price >= order.price);
  if (open && marketable) {
    if (side === "buy" && quote3.price >= limits.up) return fail("paper.limitUp");
    if (side === "sell" && quote3.price <= limits.down) return fail("paper.limitDown");
    fill(state, order, quote3.price, info, fees, now);
  }
  state.orders.unshift(order);
  if (state.orders.length > 500) state.orders.length = 500;
  return { ok: true, order };
}
function availableCash(state) {
  const frozen = state.orders.filter((o) => o.status === "pending" && o.side === "buy").reduce((a, o) => a + o.price * o.qty * 1.001, 0);
  return state.cash - frozen;
}
function cancelOrder(state, orderId) {
  const order = state.orders.find((o) => o.id === orderId);
  if (order === void 0) return fail("paper.noOrder");
  if (order.status !== "pending") return fail("paper.notPending");
  order.status = "cancelled";
  return { ok: true, order };
}
function matchPending(state, quoteOf, infoOf, { fees = DEFAULT_FEES, now = /* @__PURE__ */ new Date(), open = isMarketOpen("cn", now) } = {}) {
  const today2 = beijingDate(now);
  const filled = [];
  for (const order of state.orders) {
    if (order.status !== "pending") continue;
    if (order.tradeDate < today2) {
      order.status = "expired";
      continue;
    }
    if (!open || order.tradeDate !== today2) continue;
    const quote3 = quoteOf(order.secid);
    if (quote3 === void 0 || !(quote3.price > 0)) continue;
    const info = infoOf(order.secid, order.name);
    const limits = limitPrices(quote3, info);
    if (order.side === "buy" && quote3.price <= order.price && quote3.price < limits.up) {
      if (quote3.price * order.qty + feesFor("buy", quote3.price * order.qty, info, fees).total > state.cash) continue;
      fill(state, order, quote3.price, info, fees, now);
      filled.push(order);
    } else if (order.side === "sell" && quote3.price >= order.price && quote3.price > limits.down) {
      if (availableQty(state.positions[order.secid], today2) < order.qty) continue;
      fill(state, order, quote3.price, info, fees, now);
      filled.push(order);
    }
  }
  return filled;
}
function summarize(state, quoteOf, today2 = beijingDate()) {
  const positions = Object.values(state.positions).map((pos) => {
    const qty = totalQty(pos);
    const q = quoteOf(pos.secid);
    const lastLot = pos.lots[pos.lots.length - 1];
    const price = q?.price ?? lastLot?.price ?? 0;
    const value = round(price * qty, 2);
    const avgCost = qty > 0 ? pos.cost / qty : 0;
    return {
      secid: pos.secid,
      code: pos.code,
      name: pos.name,
      kind: pos.kind,
      qty,
      available: availableQty(pos, today2),
      avgCost: round(avgCost, 4),
      price,
      pct: q?.pct ?? null,
      value,
      pnl: round(value - pos.cost, 2),
      pnlPct: pos.cost > 0 ? round((value / pos.cost - 1) * 100, 2) : null,
      stop: pos.stop
    };
  });
  const marketValue = round(positions.reduce((a, p) => a + p.value, 0), 2);
  const equity = round(state.cash + marketValue, 2);
  return {
    initialCash: state.initialCash,
    cash: state.cash,
    availableCash: round(availableCash(state), 2),
    marketValue,
    equity,
    totalPnl: round(equity - state.initialCash, 2),
    totalPnlPct: round((equity / state.initialCash - 1) * 100, 2),
    realized: state.realized,
    feesPaid: state.feesPaid,
    positions: positions.sort((a, b) => b.value - a.value),
    orders: state.orders.slice(0, 100),
    trades: state.trades.slice(0, 100),
    equityHistory: state.equityHistory.slice(-500)
  };
}
function recordEquity(state, equity, date = beijingDate()) {
  const last = state.equityHistory[state.equityHistory.length - 1];
  if (last !== void 0 && last.date === date) last.equity = equity;
  else state.equityHistory.push({ date, equity });
  if (state.equityHistory.length > 2e3) state.equityHistory.splice(0, state.equityHistory.length - 2e3);
}
function setStop(state, secid, stop) {
  const pos = state.positions[secid];
  if (pos === void 0) return fail("paper.noPosition");
  pos.stop = stop === null ? null : round(stop, 3);
  return { ok: true };
}

// src/host/alerts.js
var ALERT_TYPES = /* @__PURE__ */ new Set([
  "priceAbove",
  "priceBelow",
  "pctAbove",
  "pctBelow",
  "breakout20",
  "breakout55",
  "breakdown10",
  "breakdown20"
]);
function createTracking() {
  return { version: 1, watchlist: [], alerts: [], events: [] };
}
function addWatch(state, item) {
  if (state.watchlist.some((w) => w.symbol === item.symbol)) return { ok: true, duplicate: true };
  state.watchlist.unshift({ symbol: item.symbol, code: item.code, name: item.name, addedAt: (/* @__PURE__ */ new Date()).toISOString() });
  if (state.watchlist.length > 300) state.watchlist.length = 300;
  return { ok: true };
}
function removeWatch(state, symbol) {
  state.watchlist = state.watchlist.filter((w) => w.symbol !== symbol);
  return { ok: true };
}
function addAlert(state, { symbol, code, name: name2, type, value }) {
  if (!ALERT_TYPES.has(type)) return { ok: false, code: "alert.badType" };
  const needsValue = type.startsWith("price") || type.startsWith("pct");
  if (needsValue && !(Number.isFinite(value) && value > 0)) return { ok: false, code: "alert.badValue" };
  const alert = {
    id: shortId("a"),
    symbol,
    code,
    name: name2,
    type,
    value: needsValue ? value : null,
    active: true,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  state.alerts.unshift(alert);
  if (state.alerts.length > 300) state.alerts.length = 300;
  return { ok: true, alert };
}
function removeAlert(state, id) {
  state.alerts = state.alerts.filter((a) => a.id !== id);
  return { ok: true };
}
function markRead(state, ids) {
  const all = ids === void 0;
  for (const e of state.events) if (all || ids.includes(e.id)) e.read = true;
  return { ok: true };
}
function alertHit(alert, quote3, levels) {
  const p = quote3.price;
  if (!(p > 0)) return false;
  switch (alert.type) {
    case "priceAbove":
      return p >= alert.value;
    case "priceBelow":
      return p <= alert.value;
    case "pctAbove":
      return quote3.pct !== null && quote3.pct >= alert.value;
    case "pctBelow":
      return quote3.pct !== null && quote3.pct <= -alert.value;
    case "breakout20":
      return levels?.high20 != null && p > levels.high20;
    case "breakout55":
      return levels?.high55 != null && p > levels.high55;
    case "breakdown10":
      return levels?.low10 != null && p < levels.low10;
    case "breakdown20":
      return levels?.low20 != null && p < levels.low20;
    default:
      return false;
  }
}
function checkAlerts(state, quoteOf, levelsOf) {
  const fired = [];
  for (const alert of state.alerts) {
    if (!alert.active) continue;
    const quote3 = quoteOf(alert.symbol);
    if (quote3 === void 0) continue;
    if (!alertHit(alert, quote3, levelsOf(alert.symbol))) continue;
    alert.active = false;
    alert.triggeredAt = (/* @__PURE__ */ new Date()).toISOString();
    fired.push(pushEvent(state, {
      kind: "alert",
      alertId: alert.id,
      symbol: alert.symbol,
      code: alert.code,
      name: alert.name,
      type: alert.type,
      value: alert.value,
      price: quote3.price,
      pct: quote3.pct
    }));
  }
  return fired;
}
function checkStops(state, positions, quoteOf, today2) {
  const fired = [];
  for (const pos of positions) {
    if (pos.stop === null || pos.stop === void 0) continue;
    const quote3 = quoteOf(pos.secid);
    if (quote3 === void 0 || !(quote3.price > 0) || quote3.price > pos.stop) continue;
    const dup = state.events.some((e) => e.kind === "stop" && e.symbol === pos.secid && e.at.slice(0, 10) === today2);
    if (dup) continue;
    fired.push(pushEvent(state, {
      kind: "stop",
      symbol: pos.secid,
      code: pos.code,
      name: pos.name,
      type: "paperStop",
      value: pos.stop,
      price: quote3.price,
      pct: quote3.pct
    }));
  }
  return fired;
}
function pushEvent(state, fields) {
  const event = { id: shortId("e"), ...fields, price: round(fields.price, 3), at: (/* @__PURE__ */ new Date()).toISOString(), read: false };
  state.events.unshift(event);
  if (state.events.length > 200) state.events.length = 200;
  return event;
}

// src/host/live.js
var PLAN_RULES = {
  expectedDrawdown: 0.3,
  // 趋势跟踪要准备承受的回撤（海龟第 3 章：回撤约等于年回报）
  emergencyMonths: 6,
  // 【补充】生活应急金月数，不属于书中规则
  maxOpenRisk: 0.06,
  // 所有持仓同时打到止损时的总亏损上限
  maxPositions: 5,
  reduceAt: 0.1,
  pauseAt: 0.2,
  trialTrades: 20,
  followRate: 0.8
};
var EXPERIENCE = {
  none: { trial: 0.2, risk: 5e-3 },
  some: { trial: 0.35, risk: 75e-4 },
  experienced: { trial: 0.5, risk: 0.01 }
};
var MISTAKES = ["chase", "noStop", "earlyExit", "againstTrend", "oversize", "noSignal", "averageDown", "news"];
var SIGNALS = ["s1", "s2", "trend", "other"];
var EXIT_REASONS = ["stop", "exit", "target", "manual", "other"];
function createLive() {
  return {
    version: 1,
    profile: null,
    plan: null,
    cash: 0,
    deposits: [],
    positions: {},
    trades: [],
    fills: [],
    todoState: {},
    lessons: null,
    equityHistory: [],
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
}
function niceFloor(v) {
  const n = Number(v) || 0;
  const step = n >= 1e4 ? 1e3 : n >= 1e3 ? 100 : 10;
  return Math.max(0, Math.floor(n / step) * step);
}
var FOCUS = ["fund", "stock", "both"];
function capitalPlan(profile, rules = PLAN_RULES) {
  const reasons = [];
  const exp = EXPERIENCE[profile.experience] ? profile.experience : "none";
  const focus = FOCUS.includes(profile.focus) ? profile.focus : "both";
  const practice = profile.mode === "practice";
  const e = EXPERIENCE[exp];
  let riskPerTrade = e.risk;
  let maxCapital;
  let startCapital;
  if (practice) {
    startCapital = Math.max(0, Math.floor(Number(profile.practiceAmount) || 0));
    maxCapital = startCapital;
    if (startCapital > 0) reasons.push({ key: "practice", params: { amount: startCapital, risk: e.risk * 100, trades: rules.trialTrades } });
  } else {
    const assets = Math.max(0, Number(profile.assets) || 0);
    const maxLoss = Math.max(0, Number(profile.maxLoss) || 0);
    const expense = Math.max(0, Number(profile.monthlyExpense) || 0);
    const emergency = profile.emergencySaved ? 0 : expense * rules.emergencyMonths;
    if (emergency > 0) reasons.push({ key: "emergency", params: { months: rules.emergencyMonths, amount: round(emergency, 0) } });
    const investable = Math.max(0, assets - emergency);
    const byLoss = maxLoss / rules.expectedDrawdown;
    reasons.push({ key: "byLoss", params: { loss: round(maxLoss, 0), dd: rules.expectedDrawdown * 100, cap: round(byLoss, 0) } });
    maxCapital = niceFloor(Math.min(investable, byLoss));
    if (byLoss > investable && investable > 0) reasons.push({ key: "capByAssets", params: { investable: round(investable, 0) } });
    reasons.push({ key: `trial.${exp}`, params: { pct: e.trial * 100, risk: e.risk * 100 } });
    if (profile.needIncome) {
      riskPerTrade = Math.min(riskPerTrade, 5e-3);
      reasons.push({ key: "income" });
    }
    startCapital = niceFloor(maxCapital * e.trial);
  }
  if (startCapital > 0 && startCapital < 2e4) {
    reasons.push({ key: focus === "fund" ? "smallFund" : focus === "stock" ? "smallStock" : "smallBoth", params: { amount: startCapital } });
  }
  if (startCapital === 0) reasons.push({ key: "notReady" });
  reasons.push({ key: "guards", params: { open: rules.maxOpenRisk * 100, reduce: rules.reduceAt * 100, pause: rules.pauseAt * 100, trades: rules.trialTrades } });
  return {
    maxCapital,
    startCapital,
    riskPerTrade,
    maxOpenRisk: rules.maxOpenRisk,
    maxPositions: rules.maxPositions,
    reduceAt: rules.reduceAt,
    pauseAt: rules.pauseAt,
    trialTrades: rules.trialTrades,
    experience: exp,
    mode: practice ? "practice" : "normal",
    focus,
    reasons
  };
}
function adoptPlan(state, profile, plan, now = /* @__PURE__ */ new Date()) {
  state.profile = { ...profile, at: now.toISOString() };
  state.plan = { ...plan, adoptedAt: now.toISOString(), stage: state.plan?.stage ?? "trial", closedAtAdopt: state.plan?.closedAtAdopt ?? closedTrades(state).length };
  if (state.deposits.length === 0 && plan.startCapital > 0) {
    state.deposits.push({ date: beijingDate(now), amount: plan.startCapital });
    state.cash = round(state.cash + plan.startCapital, 2);
  }
  return { ok: true };
}
function moveCapital(state, amount, now = /* @__PURE__ */ new Date()) {
  const a = Number(amount);
  if (!Number.isFinite(a) || a === 0) return { ok: false, code: "live.badAmount" };
  if (a < 0 && -a > state.cash) return { ok: false, code: "live.noCash" };
  state.deposits.push({ date: beijingDate(now), amount: a });
  state.cash = round(state.cash + a, 2);
  return { ok: true };
}
var totalQty2 = (pos) => round(pos.lots.reduce((s, l) => s + l.qty, 0), 2);
var isFundInfo = (info) => info?.kind === "fund";
var FUND_SHORT_HOLD_DAYS = 7;
var stopMultiple = (fund) => fund ? 3 : 2;
var closedTrades = (state) => state.trades.filter((t) => t.status === "closed");
var tradeOf = (state, id) => state.trades.find((t) => t.id === id);
function recordFill(state, fill3, info, { now = /* @__PURE__ */ new Date() } = {}) {
  const fund = isFundInfo(info);
  const qty = fund ? round(Number(fill3.qty), 2) : Math.round(Number(fill3.qty));
  const price = Number(fill3.price);
  if (!(qty > 0)) return { ok: false, code: "live.badQty" };
  if (!(price > 0)) return { ok: false, code: "live.badPrice" };
  const date = /^\d{4}-\d{2}-\d{2}$/.test(fill3.date ?? "") ? fill3.date : beijingDate(now);
  const amount = round(price * qty, 2);
  const given = fill3.fee !== "" && fill3.fee !== null && fill3.fee !== void 0 && Number.isFinite(Number(fill3.fee));
  const fee = given ? round(Number(fill3.fee), 2) : fund ? defaultFundFee(state, fill3, amount, info, date) : feesFor(fill3.side, amount, info).total;
  const warnings = [];
  let pos = state.positions[fill3.secid];
  let trade;
  if (fill3.side === "buy") {
    const stop = fill3.stop === void 0 || fill3.stop === null || fill3.stop === "" ? pos?.stop : Number(fill3.stop);
    if (!(stop > 0) || stop >= price) return { ok: false, code: "live.needStop" };
    if (!fund && qty % 100 !== 0 && info.board !== "kcb" && info.board !== "bj") warnings.push({ key: "lot" });
    if (amount + fee > state.cash) warnings.push({ key: "cash" });
    const risk = round((price - stop) * qty, 2);
    if (pos === void 0) {
      trade = {
        id: shortId("tr"),
        secid: fill3.secid,
        code: fill3.code,
        name: fill3.name,
        kind: fund ? "fund" : "cn",
        signal: SIGNALS.includes(fill3.signal) ? fill3.signal : "other",
        status: "open",
        openedAt: date,
        closedAt: null,
        entries: [],
        exits: [],
        initialStop: stop,
        riskAmount: 0,
        note: String(fill3.note ?? "").slice(0, 500),
        mistakes: [],
        followed: null,
        reviewed: false
      };
      state.trades.unshift(trade);
      pos = { secid: fill3.secid, code: fill3.code, name: fill3.name, kind: fund ? "fund" : "cn", tradeId: trade.id, lots: [], cost: 0, stop, n: Number(fill3.n) > 0 ? Number(fill3.n) : null, units: 0, lastAddPrice: price, signal: trade.signal, openedAt: date };
      state.positions[fill3.secid] = pos;
    } else {
      trade = tradeOf(state, pos.tradeId);
      if (Number(fill3.n) > 0) pos.n = Number(fill3.n);
    }
    trade.entries.push({ date, price, qty, fee, stop });
    trade.riskAmount = round(trade.riskAmount + Math.max(0, risk), 2);
    pos.lots.push({ qty, date, price });
    pos.cost = round(pos.cost + amount + fee, 2);
    pos.units += 1;
    pos.lastAddPrice = price;
    pos.stop = stop;
    state.cash = round(state.cash - amount - fee, 2);
  } else if (fill3.side === "sell") {
    if (pos === void 0) return { ok: false, code: "live.noPosition" };
    const total = totalQty2(pos);
    if (qty > total) return { ok: false, code: "live.overSell", params: { total } };
    if (fund) {
      if (shortHeld(pos.lots, qty, date)) warnings.push({ key: "fund7d" });
    } else {
      const sellable = pos.lots.filter((l) => l.date < date).reduce((s, l) => s + l.qty, 0);
      if (qty > sellable) warnings.push({ key: "tPlusOne" });
    }
    trade = tradeOf(state, pos.tradeId);
    const avgCost = pos.cost / total;
    let remaining = qty;
    for (const lot of pos.lots) {
      if (remaining === 0) break;
      const take = Math.min(lot.qty, remaining);
      lot.qty = round(lot.qty - take, 2);
      remaining = round(remaining - take, 2);
    }
    pos.lots = pos.lots.filter((l) => l.qty > 0);
    pos.cost = round(avgCost * totalQty2(pos), 2);
    const reason = EXIT_REASONS.includes(fill3.reason) ? fill3.reason : "manual";
    trade.exits.push({ date, price, qty, fee, reason });
    state.cash = round(state.cash + amount - fee, 2);
    if (totalQty2(pos) === 0) {
      delete state.positions[fill3.secid];
      closeTrade(trade, date);
    }
  } else {
    return { ok: false, code: "live.badSide" };
  }
  state.fills.unshift({ id: shortId("f"), tradeId: trade.id, secid: fill3.secid, name: fill3.name, side: fill3.side, qty, price, fee, date, at: now.toISOString() });
  if (state.fills.length > 2e3) state.fills.length = 2e3;
  return { ok: true, trade, warnings };
}
function fundSeries(navs) {
  if (navs.length === 0) return [];
  const adj = new Array(navs.length);
  adj[navs.length - 1] = navs[navs.length - 1].nav;
  for (let i = navs.length - 1; i > 0; i--) {
    const pct2 = navs[i].pct;
    adj[i - 1] = Number.isFinite(pct2) && pct2 > -100 ? adj[i] / (1 + pct2 / 100) : adj[i] * navs[i - 1].nav / navs[i].nav;
  }
  return navs.map((p, i) => {
    const v = round(adj[i], 4);
    return { date: p.date, open: v, high: v, low: v, close: v, pct: p.pct, amount: 0 };
  });
}
function shortHeld(lots, qty, date) {
  let remaining = qty;
  for (const lot of lots) {
    if (remaining <= 0) break;
    if ((Date.parse(date) - Date.parse(lot.date)) / 864e5 < FUND_SHORT_HOLD_DAYS) return true;
    remaining -= lot.qty;
  }
  return false;
}
function defaultFundFee(state, fill3, amount, info, date) {
  if (fill3.side === "buy") return round(amount * (Number(info.feeRate) || 0) / 100, 2);
  const pos = state.positions[fill3.secid];
  return pos && shortHeld(pos.lots, Number(fill3.qty), date) ? round(amount * 0.015, 2) : 0;
}
function closeTrade(trade, date) {
  const cost = trade.entries.reduce((s, e) => s + e.price * e.qty + e.fee, 0);
  const proceeds = trade.exits.reduce((s, e) => s + e.price * e.qty - e.fee, 0);
  trade.status = "closed";
  trade.closedAt = date;
  trade.pnl = round(proceeds - cost, 2);
  trade.r = trade.riskAmount > 0 ? round(trade.pnl / trade.riskAmount, 2) : null;
  trade.holdingDays = Math.max(0, Math.round((Date.parse(date) - Date.parse(trade.openedAt)) / 864e5));
  const lastExit = trade.exits[trade.exits.length - 1];
  trade.followed = trade.r !== null && trade.r < -1.3 ? false : lastExit && (lastExit.reason === "stop" || lastExit.reason === "exit") ? true : null;
  if (trade.r !== null && trade.r < -1.3 && !trade.mistakes.includes("noStop")) trade.mistakes.push("noStop");
}
function setStop2(state, secid, stop) {
  const pos = state.positions[secid];
  if (pos === void 0) return { ok: false, code: "live.noPosition" };
  const s = Number(stop);
  if (!(s > 0)) return { ok: false, code: "live.badPrice" };
  pos.stop = round(s, 4);
  return { ok: true };
}
function updateTrade(state, id, { mistakes, followed, note }) {
  const trade = tradeOf(state, id);
  if (trade === void 0) return { ok: false, code: "live.noTrade" };
  if (Array.isArray(mistakes)) trade.mistakes = mistakes.filter((m) => MISTAKES.includes(m));
  if (followed === true || followed === false) trade.followed = followed;
  if (typeof note === "string") trade.note = note.slice(0, 500);
  if (trade.status === "closed") trade.reviewed = true;
  return { ok: true, trade };
}
function liveSummary(state, quoteOf) {
  const positions = Object.values(state.positions).map((pos) => {
    const qty = totalQty2(pos);
    const q = quoteOf(pos.secid);
    const price = q?.price ?? pos.lots[pos.lots.length - 1]?.price ?? 0;
    const value = round(price * qty, 2);
    const trade = state.trades.find((t) => t.id === pos.tradeId);
    const pnl = round(value - pos.cost, 2);
    return {
      secid: pos.secid,
      code: pos.code,
      name: pos.name,
      fund: pos.kind === "fund",
      qty,
      price,
      pct: q?.pct ?? null,
      value,
      cost: pos.cost,
      avgCost: qty > 0 ? round(pos.cost / qty, 4) : 0,
      pnl,
      stop: pos.stop,
      n: pos.n,
      units: pos.units,
      signal: pos.signal,
      openedAt: pos.openedAt,
      tradeId: pos.tradeId,
      lastAddPrice: pos.lastAddPrice,
      unrealizedR: trade?.riskAmount > 0 ? round(pnl / trade.riskAmount, 2) : null,
      riskToStop: round(Math.max(0, (price - pos.stop) * qty), 2),
      stopDistancePct: price > 0 ? round((price / pos.stop - 1) * 100, 2) : null,
      stopDistanceN: pos.n ? round((price - pos.stop) / pos.n, 2) : null
    };
  });
  const marketValue = round(positions.reduce((s, p) => s + p.value, 0), 2);
  const equity = round(state.cash + marketValue, 2);
  const deposited = round(state.deposits.reduce((s, d) => s + d.amount, 0), 2);
  const peak = Math.max(equity, ...state.equityHistory.map((e) => e.equity), deposited);
  const openRisk = positions.reduce((s, p) => s + p.riskToStop, 0);
  for (const p of positions) p.weight = equity > 0 ? round(p.value / equity * 100, 2) : null;
  return {
    cash: state.cash,
    marketValue,
    equity,
    deposited,
    totalPnl: round(equity - deposited, 2),
    totalPnlPct: deposited > 0 ? round((equity / deposited - 1) * 100, 2) : null,
    peak: round(peak, 2),
    drawdown: peak > 0 ? round((equity / peak - 1) * 100, 2) : 0,
    openRiskPct: equity > 0 ? round(openRisk / equity * 100, 2) : 0,
    positions
  };
}
function recordLiveEquity(state, equity, date = beijingDate()) {
  const last = state.equityHistory[state.equityHistory.length - 1];
  if (last !== void 0 && last.date === date) last.equity = equity;
  else state.equityHistory.push({ date, equity });
  if (state.equityHistory.length > 2e3) state.equityHistory.splice(0, state.equityHistory.length - 2e3);
}
function liveStats(state) {
  const closed = closedTrades(state).filter((t) => t.r !== null);
  const n = closed.length;
  if (n === 0) return { n: 0 };
  const rs = closed.map((t) => t.r);
  const wins = rs.filter((r) => r > 0);
  const losses = rs.filter((r) => r <= 0);
  let streak = 0;
  let maxLossStreak = 0;
  for (const t of [...closed].reverse()) {
    streak = t.r <= 0 ? streak + 1 : 0;
    maxLossStreak = Math.max(maxLossStreak, streak);
  }
  const mean = (arr) => arr.length ? round(arr.reduce((a, b) => a + b, 0) / arr.length, 2) : null;
  const group = (keyOf, keys) => Object.fromEntries(keys.map((k) => {
    const g = closed.filter((t) => keyOf(t).includes(k));
    return [k, { n: g.length, expectancy: mean(g.map((t) => t.r)) }];
  }).filter(([, v]) => v.n > 0));
  const reviewed = closed.filter((t) => t.followed !== null);
  const followedTrades = closed.filter((t) => t.followed === true);
  const buckets = [-3, -2, -1, 0, 1, 2, 3, 5, 10];
  const distribution = buckets.map((b, i) => ({
    from: i === 0 ? -Infinity : buckets[i - 1],
    to: b,
    count: rs.filter((r) => i === 0 ? r < b : r >= buckets[i - 1] && r < b).length
  }));
  distribution.push({ from: 10, to: Infinity, count: rs.filter((r) => r >= 10).length });
  return {
    n,
    winRate: round(wins.length / n * 100, 1),
    avgWinR: mean(wins),
    avgLossR: mean(losses),
    expectancy: mean(rs),
    totalR: round(rs.reduce((a, b) => a + b, 0), 2),
    profitFactor: losses.length && losses.reduce((a, b) => a + b, 0) !== 0 ? round(wins.reduce((a, b) => a + b, 0) / Math.abs(losses.reduce((a, b) => a + b, 0)), 2) : null,
    maxLossStreak,
    avgHoldingDays: mean(closed.map((t) => t.holdingDays)),
    followRate: reviewed.length ? round(followedTrades.length / reviewed.length * 100, 1) : null,
    followedExpectancy: mean(followedTrades.map((t) => t.r)),
    brokenExpectancy: mean(closed.filter((t) => t.followed === false).map((t) => t.r)),
    bySignal: group((t) => [t.signal], SIGNALS),
    byMistake: group((t) => t.mistakes, MISTAKES),
    distribution: distribution.map((d) => ({ ...d, from: Number.isFinite(d.from) ? d.from : null, to: Number.isFinite(d.to) ? d.to : null }))
  };
}
function computeTodos(state, ctx) {
  const today2 = beijingDate(ctx.now ?? /* @__PURE__ */ new Date());
  const todos = [];
  const push = (id, type, priority, params = {}) => {
    if (state.todoState[id] === void 0) todos.push({ id, type, priority, ...params });
  };
  const plan = state.plan;
  const s = ctx.summary;
  for (const p of s.positions) {
    const lv = ctx.levelsOf(p.secid) ?? {};
    const n = p.n ?? lv.n ?? null;
    const fund = p.fund === true;
    if (p.price > 0 && p.price <= p.stop) push(`stop:${p.secid}:${today2}`, "sellStop", 1, { secid: p.secid, name: p.name, fund, price: p.price, stop: p.stop, qty: p.qty });
    const exitLevel = p.signal === "s1" ? lv.low10 : lv.low20;
    if (exitLevel && p.price > p.stop && p.price < exitLevel) push(`exit:${p.secid}:${today2}`, "exitSignal", 2, { secid: p.secid, name: p.name, fund, price: p.price, level: round(exitLevel, 3), days: p.signal === "s1" ? 10 : 20, qty: p.qty });
    if (n && p.units < 4 && plan) {
      const trigger = round(p.lastAddPrice + n / 2, 3);
      const k = stopMultiple(fund);
      const rawQty = s.equity * plan.riskPerTrade / (k * n);
      const amount = fund ? niceFloor(rawQty * p.price) : null;
      const unitQty = fund ? round(amount / p.price, 2) : Math.floor(rawQty / 100) * 100;
      const newStop = round(trigger - k * n, fund ? 4 : 3);
      const extraRisk = unitQty * (trigger - newStop);
      if (p.price >= trigger && unitQty > 0 && s.openRiskPct / 100 * s.equity + extraRisk <= plan.maxOpenRisk * s.equity) {
        push(`add:${p.secid}:${p.units}`, "addUnit", 3, { secid: p.secid, name: p.name, fund, price: p.price, trigger, qty: unitQty, amount, newStop, unit: p.units + 1 });
      }
    }
    const channel = p.signal === "s1" ? lv.low10 : lv.low20;
    const turtleStop = n ? p.lastAddPrice - stopMultiple(fund) * n : null;
    const better = Math.max(turtleStop ?? 0, channel && channel < p.price ? channel : 0);
    if (better > p.stop * 1.005 && better < p.price) push(`raise:${p.secid}:${round(better, 2)}`, "raiseStop", 3, { secid: p.secid, name: p.name, fund, from: p.stop, to: round(better, fund ? 4 : 3) });
    for (const e of ctx.eventsOf(p.secid) ?? []) {
      push(`event:${p.secid}:${e.time.slice(0, 10)}:${e.kind}`, "eventRisk", 4, { secid: p.secid, name: p.name, date: e.time.slice(0, 10), kind: e.kind, title: e.title });
    }
  }
  if (plan) {
    if (s.drawdown <= -plan.pauseAt * 100) push(`pause:${today2}`, "pause", 1, { drawdown: s.drawdown, limit: plan.pauseAt * 100 });
    else if (s.drawdown <= -plan.reduceAt * 100) push(`reduce:${today2}`, "reduceSize", 2, { drawdown: s.drawdown, limit: plan.reduceAt * 100 });
    const st = ctx.stats;
    const sinceAdopt = closedTrades(state).length - (plan.closedAtAdopt ?? 0);
    if (plan.stage === "trial" && sinceAdopt >= plan.trialTrades && st.n > 0 && st.expectancy > 0 && (st.followRate ?? 0) >= PLAN_RULES.followRate * 100 && s.drawdown > -15) {
      push(`scaleUp:${closedTrades(state).length}`, "scaleUp", 4, { trades: sinceAdopt, expectancy: st.expectancy, followRate: st.followRate });
    }
    if (st.n >= 10 && st.expectancy !== null && st.expectancy < 0) push(`negative:${st.n}`, "negativeEdge", 2, { trades: st.n, expectancy: st.expectancy });
  }
  const unreviewed = closedTrades(state).filter((t) => !t.reviewed).length;
  if (unreviewed > 0) push(`review:${unreviewed}:${today2}`, "reviewTrades", 4, { count: unreviewed });
  const basedOn = state.lessons?.basedOn ?? 0;
  const closedN = closedTrades(state).length;
  if (closedN - basedOn >= 5) push(`ai:${closedN}`, "aiReview", 5, { count: closedN - basedOn });
  return todos.sort((a, b) => a.priority - b.priority);
}
function setTodo(state, id, action) {
  if (action === "reset") delete state.todoState[id];
  else state.todoState[id] = { action: action === "done" ? "done" : "dismissed", at: (/* @__PURE__ */ new Date()).toISOString() };
  const keys = Object.keys(state.todoState);
  if (keys.length > 500) for (const k of keys.slice(0, keys.length - 500)) delete state.todoState[k];
  return { ok: true };
}
function guardStatus(plan, summary) {
  const notes = [];
  if (summary.drawdown <= -plan.pauseAt * 100) notes.push(`回撤已到暂停线（${plan.pauseAt * 100}%），不应开新仓`);
  else if (summary.drawdown <= -plan.reduceAt * 100) notes.push(`回撤已到减仓线（${plan.reduceAt * 100}%），新仓位按八成`);
  const roomPct = round(plan.maxOpenRisk * 100 - summary.openRiskPct, 2);
  if (roomPct <= plan.riskPerTrade * 100) notes.push(`总持仓风险 ${summary.openRiskPct}% 已接近上限 ${plan.maxOpenRisk * 100}%，再开一笔会超限`);
  else notes.push(`总持仓风险还可增加 ${roomPct}%（约 ${Math.floor(roomPct / (plan.riskPerTrade * 100))} 笔新仓）`);
  const held = summary.positions.length;
  notes.push(held >= plan.maxPositions ? `持仓已满（${held}/${plan.maxPositions} 只），不应再开新仓` : `持仓 ${held}/${plan.maxPositions} 只`);
  return notes.join("；");
}
function liveForAi(state, summary, stats) {
  const lines = ["## 用户的实盘（已脱敏：只有比例、R 倍数和价格，没有金额和股数）"];
  const plan = state.plan;
  if (!plan) return `${lines[0]}
用户还没有制定实盘资金计划：涉及真钱时先建议在"实盘"页定好起步资金和单笔风险，不给实盘的具体仓位。`;
  lines.push(
    `用途：${plan.mode === "practice" ? "小钱练手（金额很小，目的是练习按计划执行）" : "按资产规划"}；主要想做：${{ fund: "场外基金", stock: "股票和场内 ETF", both: "基金和股票都有" }[plan.focus ?? "both"]}`,
    `阶段：${plan.stage === "trial" ? `试用期（前 ${plan.trialTrades} 笔交易）` : "正常"}；单笔风险 ${round(plan.riskPerTrade * 100, 2)}%；总持仓风险上限 ${plan.maxOpenRisk * 100}%；回撤 ${plan.reduceAt * 100}% 时缩小规模、${plan.pauseAt * 100}% 时暂停复盘`,
    `账户：相对入金 ${summary.totalPnlPct ?? 0}%；距高点回撤 ${summary.drawdown}%；所有持仓打到止损的总风险占权益 ${summary.openRiskPct}%；现金占比 ${summary.equity > 0 ? round(summary.cash / summary.equity * 100, 1) : 100}%`,
    `护栏状态：${guardStatus(plan, summary)}`
  );
  if (summary.positions.length > 0) {
    lines.push("### 当前实盘持仓");
    for (const p of summary.positions) {
      lines.push(`- ${p.name}（${p.fund ? "场外基金 " : ""}${p.code}）：占权益 ${p.weight}%，${p.units} 个单位，信号 ${p.signal}，建仓 ${p.openedAt}，成本价 ${p.avgCost}，现价 ${p.price}，浮动 ${p.unrealizedR ?? "—"}R，止损 ${p.stop}（距现价 ${p.stopDistancePct}%${p.stopDistanceN !== null ? `，${p.stopDistanceN}N` : ""}）`);
    }
  }
  if (stats.n > 0) {
    lines.push(
      "### 已平仓统计（R 倍数）",
      `共 ${stats.n} 笔，胜率 ${stats.winRate}%，平均盈利 ${stats.avgWinR}R，平均亏损 ${stats.avgLossR}R，期望 ${stats.expectancy}R/笔，累计 ${stats.totalR}R，最长连亏 ${stats.maxLossStreak} 笔，平均持有 ${stats.avgHoldingDays} 天`,
      `按计划执行率 ${stats.followRate ?? "—"}%；按计划的交易期望 ${stats.followedExpectancy ?? "—"}R，没按计划的 ${stats.brokenExpectancy ?? "—"}R`,
      `按信号：${Object.entries(stats.bySignal).map(([k, v]) => `${k} ${v.n} 笔 ${v.expectancy}R`).join("；") || "—"}`,
      `按失误：${Object.entries(stats.byMistake).map(([k, v]) => `${k} ${v.n} 笔 平均 ${v.expectancy}R`).join("；") || "暂无标记"}`
    );
    lines.push("### 最近的已平仓交易");
    for (const t of closedTrades(state).slice(0, 30)) {
      const entry = t.entries[0];
      const exit = t.exits[t.exits.length - 1];
      lines.push(`- ${t.closedAt} ${t.name}（${t.kind === "fund" ? "场外基金 " : ""}${t.code}）信号 ${t.signal}：入场 ${entry?.price}（初始止损 ${t.initialStop}，加仓 ${t.entries.length - 1} 次）→ 离场 ${exit?.price}（${exit?.reason}），${t.r}R，持有 ${t.holdingDays} 天，${t.followed === true ? "按计划" : t.followed === false ? "未按计划" : "未评估"}${t.mistakes.length ? `，失误：${t.mistakes.join("、")}` : ""}${t.note ? `，备注：${t.note.slice(0, 80)}` : ""}`);
    }
  }
  return lines.join("\n");
}

// src/host/screener.js
var recentEntry = (bars, date, within) => {
  if (date === null) return false;
  const idx = bars.findIndex((b) => b.date === date);
  return idx >= 0 && idx >= bars.length - within;
};
var PRESETS = {
  turtle55: {
    universe: "a",
    sortField: "f6",
    pages: 2,
    minAmount: 2e8,
    scan: 100,
    rankBy: "amount",
    pick: (a, bars) => a.turtle.trendFilter === "up" && (a.turtle.system2.state === "breakout" || a.turtle.system2.state === "long" && recentEntry(bars, a.turtle.system2.entryDate, 10))
  },
  turtle20: {
    universe: "a",
    sortField: "f6",
    pages: 2,
    minAmount: 2e8,
    scan: 100,
    rankBy: "amount",
    pick: (a, bars) => a.turtle.trendFilter === "up" && (a.turtle.system1.state === "breakout" || a.turtle.system1.state === "long" && recentEntry(bars, a.turtle.system1.entryDate, 5))
  },
  strong: {
    universe: "a",
    sortField: "f24",
    pages: 3,
    minAmount: 1e8,
    scan: 100,
    rankBy: "pct60",
    pick: (a) => a.turtle.trendFilter === "up" && a.levels.ma60 !== null && a.levels.ma250 !== null && a.price > a.levels.ma60 && a.levels.ma60 > a.levels.ma250
  },
  etfTrend: {
    universe: "etf",
    sortField: "f6",
    pages: 2,
    minAmount: 5e7,
    scan: 80,
    rankBy: "amount",
    sortBy: "momentum60",
    pick: (a) => a.turtle.trendFilter === "up" && (a.turtle.system2.state === "breakout" || a.turtle.system2.state === "long")
  },
  /** 场外基金：从指数型、股票型、混合型近 6 月收益排行里取前列，用净值跑同一套趋势规则。 */
  fundTrend: {
    kind: "fund",
    types: ["zs", "gp", "hh"],
    rankSort: "6yzf",
    perType: 20,
    sortBy: "momentum60",
    sameAbove: 0.95,
    pick: (a) => a.turtle.trendFilter === "up" && a.levels.ma60 !== null && a.price > a.levels.ma60 && (a.turtle.system2.state === "breakout" || a.turtle.system2.state === "long")
  }
};
var fundBaseName = (name2) => String(name2).replace(/[A-Z]$/, "").replace(/[（(]QDII[）)]$/, "").trim();
function correlation(a, b) {
  const n = Math.min(a.length, b.length);
  if (n < 20) return 0;
  const x = a.slice(-n);
  const y = b.slice(-n);
  const mx = x.reduce((s, v) => s + v, 0) / n;
  const my = y.reduce((s, v) => s + v, 0) / n;
  let sxy = 0;
  let sxx = 0;
  let syy = 0;
  for (let i = 0; i < n; i++) {
    sxy += (x[i] - mx) * (y[i] - my);
    sxx += (x[i] - mx) ** 2;
    syy += (y[i] - my) ** 2;
  }
  return sxx > 0 && syy > 0 ? sxy / Math.sqrt(sxx * syy) : 0;
}
function groupCorrelated(candidates, threshold) {
  const kept = [];
  for (const c of candidates) {
    const twin = kept.find((k) => correlation(k.rets, c.rets) >= threshold);
    if (twin) {
      if (twin.similar.length < 6) twin.similar.push({ code: c.code, name: c.name });
      twin.similarCount++;
    } else {
      kept.push({ ...c, similar: [], similarCount: 0 });
    }
  }
  return kept.map(({ rets, ...rest }) => rest);
}
async function mapLimit(items, limit2, fn) {
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const i = next++;
      await fn(items[i], i);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit2, items.length) }, worker));
}
async function runFundScreen(presetId, { rank, fund, equity, riskPct = 0.01, onProgress }) {
  const preset = PRESETS[presetId];
  const lists = await Promise.all(preset.types.map((type) => rank(type, preset.rankSort).then((r) => r.rows.map((row) => ({ ...row, type })), () => [])));
  const seen = /* @__PURE__ */ new Set();
  const pool = [];
  for (const list4 of lists) {
    let taken = 0;
    for (const row of list4) {
      const base = fundBaseName(row.name);
      if (taken >= preset.perType || seen.has(base) || row.nav === null) continue;
      seen.add(base);
      pool.push(row);
      taken++;
    }
  }
  const k = stopMultiple(true);
  const candidates = [];
  let done = 0;
  await mapLimit(pool, 4, async (row) => {
    try {
      const f = await fund(row.code);
      const bars = fundSeries(f.navs);
      if (bars.length < 320) return;
      const a = analyzeBars(bars, { equity, riskPct, lot: { min: 1, step: 1 } });
      if (a.insufficient || !preset.pick(a, bars)) return;
      const nav = analyzeNav(bars.map((b) => ({ date: b.date, nav: b.close, pct: b.pct })));
      const n = a.turtle.plan?.n ?? null;
      const last = f.navs[f.navs.length - 1];
      const closes = bars.slice(-121).map((b) => b.close);
      const rets = closes.slice(1).map((v, i) => v / closes[i] - 1);
      const unitAmount = n === null ? 0 : Math.floor(equity * riskPct / (k * n) * last.nav / 100) * 100;
      candidates.push({
        rets,
        secid: `fund:${row.code}`,
        code: row.code,
        name: f.name ?? row.name,
        fund: true,
        fundType: row.type,
        price: last.nav,
        pct: last.pct ?? null,
        navDate: last.date,
        score: a.score,
        stance: a.stance,
        s1: a.turtle.system1.state,
        s2: a.turtle.system2.state,
        s2EntryDate: a.turtle.system2.entryDate,
        trendFilter: a.turtle.trendFilter,
        n,
        stop: n === null ? null : round(last.nav - k * n, 4),
        unitAmount,
        unitPct: equity > 0 ? round(unitAmount / equity * 100, 1) : null,
        momentum60: a.momentum.d60,
        volAnnual: a.volatility?.annual ?? null,
        returns: { m3: row.month3, m6: row.month6, y1: row.year1 },
        maxDrawdown1y: nav.insufficient ? null : nav.maxDrawdown1y,
        fromPeak: nav.insufficient ? null : nav.fromPeak,
        feeRate: Number.parseFloat(f.feeRate) || null,
        reasons: a.reasons.filter((r) => r.tone !== "neutral").slice(0, 4)
      });
    } catch {
    } finally {
      done++;
      onProgress?.(done, pool.length);
    }
  });
  candidates.sort((a, b) => (b[preset.sortBy] ?? -Infinity) - (a[preset.sortBy] ?? -Infinity) || b.score - a.score);
  const grouped = groupCorrelated(candidates, preset.sameAbove);
  return {
    preset: presetId,
    at: (/* @__PURE__ */ new Date()).toISOString(),
    universe: lists.reduce((s, l) => s + l.length, 0),
    scanned: pool.length,
    hits: candidates.length,
    equity: round(equity, 0),
    candidates: grouped.slice(0, 40)
  };
}
function prefilter(rows, preset) {
  return rows.filter((r) => r.price !== null && r.price >= 2 && r.amount !== null && r.amount >= preset.minAmount && !/ST|退/.test(r.name)).sort((a, b) => (b[preset.rankBy] ?? -Infinity) - (a[preset.rankBy] ?? -Infinity)).slice(0, preset.scan);
}
async function runScreen(presetId, { rows: loadRows, bars, equity, onProgress }) {
  const preset = PRESETS[presetId];
  if (preset === void 0) throw new Error(`未知的选股方案 ${presetId}`);
  const rows = await loadRows(preset);
  const pool = prefilter(rows, preset);
  const candidates = [];
  let done = 0;
  await Promise.all(pool.map(async (row) => {
    try {
      const series = await bars(row.secid);
      if (series.length < 320) return;
      const info = classify(row.secid, row.name);
      const a = analyzeBars(series, { equity, lot: buyLotRule(info) });
      if (a.insufficient || !preset.pick(a, series)) return;
      candidates.push({
        secid: row.secid,
        code: row.code,
        name: row.name,
        price: row.price,
        pct: row.pct,
        amount: row.amount,
        score: a.score,
        stance: a.stance,
        s1: a.turtle.system1.state,
        s2: a.turtle.system2.state,
        s2EntryDate: a.turtle.system2.entryDate,
        trendFilter: a.turtle.trendFilter,
        n: a.turtle.plan?.n ?? null,
        stop: a.turtle.plan?.buyNow.stop ?? null,
        unitShares: a.turtle.plan?.unitShares ?? 0,
        momentum60: a.momentum.d60,
        volAnnual: a.volatility?.annual ?? null,
        baseRate: a.baseRates.system2?.count ? { count: a.baseRates.system2.count, winRate: a.baseRates.system2.winRate, avg: a.baseRates.system2.avg } : null,
        reasons: a.reasons.filter((r) => r.tone !== "neutral").slice(0, 4)
      });
    } catch {
    } finally {
      done++;
      onProgress?.(done, pool.length);
    }
  }));
  const sortKey = preset.sortBy ?? "score";
  candidates.sort((a, b) => (b[sortKey] ?? -Infinity) - (a[sortKey] ?? -Infinity) || b.score - a.score);
  return {
    preset: presetId,
    at: (/* @__PURE__ */ new Date()).toISOString(),
    universe: rows.length,
    scanned: pool.length,
    equity: round(equity, 0),
    candidates: candidates.slice(0, 40)
  };
}

// src/shared/reasons.js
var REASONS = {
  zh: {
    "trend.aboveMa60": "收盘价在 60 日均线（{ma}）之上，中期趋势向上",
    "trend.belowMa60": "收盘价在 60 日均线（{ma}）之下，中期趋势向下",
    "trend.aboveMa250": "站上 250 日均线（{ma}），长期趋势向上",
    "trend.belowMa250": "位于 250 日均线（{ma}）之下，长期趋势偏弱",
    "trend.filterUp": `50 日均线在 300 日均线之上：海龟趋势过滤器允许做多${TEXT.citeTrendFilter}`,
    "trend.filterDown": `50 日均线在 300 日均线之下：海龟趋势过滤器不支持做多${TEXT.citeTrendFilter}`,
    "turtle.s2Breakout": "今日收盘突破前 55 日最高价 {level}：海龟系统 2 入市信号",
    "turtle.s2Long": "系统 2 自 {date} 突破后仍在持有，跌破 20 日低点 {exit} 才退出",
    "turtle.s2Exit": "今日收盘跌破前 20 日最低价 {level}：海龟系统 2 退出信号",
    "turtle.s2Flat": "系统 2 空仓，等待收盘突破 55 日最高价 {level}",
    "turtle.s1Breakout": "今日收盘突破前 20 日最高价 {level}：海龟系统 1 入市信号",
    "turtle.s1Long": "系统 1 自 {date} 突破后仍在持有，跌破 10 日低点 {exit} 才退出",
    "turtle.s1Exit": "今日收盘跌破前 10 日最低价 {level}：海龟系统 1 退出信号",
    "momentum.up60": "近 60 个交易日上涨 {pct}%，动量向上",
    "momentum.down60": "近 60 个交易日下跌 {pct}%，动量向下",
    "macd.golden": "MACD 金叉",
    "macd.dead": "MACD 死叉",
    "rsi.overbought": "RSI {value}，短期过热",
    "rsi.oversold": "RSI {value}，短期超卖（趋势跟踪不把超卖当作买入理由）",
    "pos.near52wHigh": "接近 52 周最高价",
    "pos.near52wLow": "接近 52 周最低价",
    "fund.aboveMa60": "净值在 60 日均线（{ma}）之上",
    "fund.belowMa60": "净值在 60 日均线（{ma}）之下",
    "fund.aboveMa250": "净值在 250 日均线（{ma}）之上，长期趋势向上",
    "fund.belowMa250": "净值在 250 日均线（{ma}）之下，长期趋势偏弱",
    "fund.m3Up": "近 3 个月上涨 {pct}%",
    "fund.m3Down": "近 3 个月下跌 {pct}%",
    "fund.y1Up": "近 1 年上涨 {pct}%",
    "fund.y1Down": "近 1 年下跌 {pct}%",
    "fund.deepDrawdown": "距 1 年内最高净值回撤 {pct}%",
    "stance.bullish": "偏多",
    "stance.leanBull": "中性偏多",
    "stance.neutral": "中性",
    "stance.leanBear": "中性偏空",
    "stance.bearish": "偏空"
  },
  en: {
    "trend.aboveMa60": "Close is above the 60-day average ({ma}); the medium-term trend is up",
    "trend.belowMa60": "Close is below the 60-day average ({ma}); the medium-term trend is down",
    "trend.aboveMa250": "Above the 250-day average ({ma}); the long-term trend is up",
    "trend.belowMa250": "Below the 250-day average ({ma}); the long-term trend is weak",
    "trend.filterUp": "50-day average above the 300-day average: the Turtle trend filter allows longs",
    "trend.filterDown": "50-day average below the 300-day average: the Turtle trend filter rejects longs",
    "turtle.s2Breakout": "Closed above the prior 55-day high {level}: Turtle System 2 entry",
    "turtle.s2Long": "System 2 long since {date}; exits below the 20-day low {exit}",
    "turtle.s2Exit": "Closed below the prior 20-day low {level}: Turtle System 2 exit",
    "turtle.s2Flat": "System 2 flat; waiting for a close above the 55-day high {level}",
    "turtle.s1Breakout": "Closed above the prior 20-day high {level}: Turtle System 1 entry",
    "turtle.s1Long": "System 1 long since {date}; exits below the 10-day low {exit}",
    "turtle.s1Exit": "Closed below the prior 10-day low {level}: Turtle System 1 exit",
    "momentum.up60": "Up {pct}% over 60 trading days",
    "momentum.down60": "Down {pct}% over 60 trading days",
    "macd.golden": "MACD bullish cross",
    "macd.dead": "MACD bearish cross",
    "rsi.overbought": "RSI {value}: short-term overbought",
    "rsi.oversold": "RSI {value}: oversold (trend followers do not buy on that alone)",
    "pos.near52wHigh": "Near the 52-week high",
    "pos.near52wLow": "Near the 52-week low",
    "fund.aboveMa60": "NAV above its 60-day average ({ma})",
    "fund.belowMa60": "NAV below its 60-day average ({ma})",
    "fund.aboveMa250": "NAV above its 250-day average ({ma})",
    "fund.belowMa250": "NAV below its 250-day average ({ma})",
    "fund.m3Up": "Up {pct}% over 3 months",
    "fund.m3Down": "Down {pct}% over 3 months",
    "fund.y1Up": "Up {pct}% over 1 year",
    "fund.y1Down": "Down {pct}% over 1 year",
    "fund.deepDrawdown": "{pct}% below its 1-year high",
    "stance.bullish": "Bullish",
    "stance.leanBull": "Leaning bullish",
    "stance.neutral": "Neutral",
    "stance.leanBear": "Leaning bearish",
    "stance.bearish": "Bearish"
  }
};
function fill2(template, params = {}) {
  return template.replace(/\{(\w+)\}/g, (_, k) => params[k] === void 0 || params[k] === null ? "—" : String(params[k]));
}
function formatReason(lang, key, params) {
  const dict = REASONS[lang] ?? REASONS.zh;
  return fill2(dict[key] ?? key, params);
}

// src/host/advisor.js
var ROLE = `你是 DeepSeek Harness"市场"插件里的 AI 交易顾问，用户是一位个人投资者。
${TEXT.roleSource}

## 回答规则
1. 用中文回答。先给结论，再给理由。
2. 用户问"该不该买 / 卖 / 加仓 / 止损 / 持有"时，必须给出明确倾向——买入、加仓、持有、减仓、卖出、观望 之一，并写清：
   - 依据：${TEXT.roleBasis}
   - 入场条件：现价买，还是等收盘突破某个价位再买；
   - 止损位：默认用 2N 止损（数据里给了 N），也可以用结构位，必须写出具体价格；
   - 仓位：${TEXT.roleSizing}这里的股数和权益来自模拟盘，只适用于模拟盘；真实资金按第 10 条处理；
   - 失效条件：出现什么情况这个判断作废；
   - 最后一句风险提示。
3. 只使用提供的数据，不编造价格、财报、新闻。数据里没有基本面信息；涉及基本面时说明这超出了现有数据。
4. ${TEXT.roleViews}
5. 关于"预测"：只给概率性情景。数据里有基于历史波动率的价格区间，以及这只证券自己历史上同类信号的统计，请据此说明可能性，不要给确定的点位预言。
6. 注意 A 股约束：T+1、100 股一手（科创板 200 股起）、涨跌停、多数股票不能做空。场外基金按当天 15:00 后公布的净值申赎，没有盘中价格：用收盘净值判断信号，止损放在 3N（比股票多 1N 应对次日成交的滞后），持有不满 7 天赎回要付 1.5% 赎回费。不要因为没有盘中价就把场外基金排除在外，用户问基金时场外基金和 ETF 都要考虑。
7. 用户消息开头附有关于用户的长期记忆和这个对话框里之前的全部对话（太长时较早部分是摘要）。回答要和之前说过的保持一致、接着之前的话题往下说；用户改了主意时以最新说法为准；行情以"当前数据"为准，不要沿用旧对话里的价格。
   数据里会附上近期新闻、公告与事件。解释涨跌原因时引用具体条目（时间 + 标题），分清"直接原因"和"可能相关"；没有抓到相关消息时如实说明，不要编造新闻。
8. 用户问"买哪些、推荐哪只"时，数据里会附上规则选股的候选清单：从清单里挑 3～5 只，逐只写出入选理由、入场方式、止损和仓位，并说明候选之间是否高度相关（同一指数或同一行业只选一只）。清单为空或没跑完时如实说明，并建议用户在"选股"页重新运行，不要编造代码。
9. 默认 600 字以内，用户要求详细时可以展开。可以用 Markdown 的标题、列表和表格。
10. 真实资金要格外谨慎。数据里附有"用户的实盘"（已脱敏，只有比例、R 倍数和价格）以及个人交易规则，回答前先看：
   - 用户还没有制定实盘资金计划时，可以照常分析并给出倾向，但涉及真钱时先建议在"实盘"页定好起步资金和单笔风险（或先用模拟盘练习），不给实盘的具体仓位；
   - 账户回撤已到暂停线时，建议暂停开新仓、先复盘；到了减仓线时，新仓位按八成计算；总持仓风险接近上限或持仓数已满时，不建议再开新仓，可以建议先处理现有持仓；
   - 实盘仓位只用比例表达：按实盘的单笔风险比例，写出止损价、打到止损约亏实盘权益的百分比、仓位约占实盘权益的百分比；具体股数或申购金额请用户在这只证券详情里点"记录实盘"看计划单（你看不到金额，不要自己编股数）；
   - 用户已经实盘持有这只时，先根据它的止损、浮动 R 和退出信号回答持有、加仓还是卖出；
   - 个人交易规则与当前建议冲突时，按个人规则执行并指出冲突；
   - 没有规则信号支持时只能给观望，不要因为用户想买就降低标准；不承诺收益，提醒只用亏得起的钱。${TEXT.roleExtra ? `
11. ${TEXT.roleExtra}` : ""}`;
var fmt = (v, digits = 2) => v === null || v === void 0 || Number.isNaN(v) ? "—" : typeof v === "number" ? Number(v.toFixed(digits)).toString() : String(v);
var yi = (v) => v === null || v === void 0 ? "—" : `${(v / 1e8).toFixed(2)} 亿`;
var pct = (v) => v === null || v === void 0 ? "—" : `${v > 0 ? "+" : ""}${fmt(v)}%`;
var SYSTEM_STATE = { breakout: "今日突破入市", long: "持有中", exit: "今日退出", flat: "空仓等待" };
function describeAnalysis(a) {
  if (!a || a.insufficient) return "技术分析：K 线数据不足，无法计算。";
  const L = a.levels;
  const t = a.turtle;
  const lines = [
    `### 技术位（截至 ${a.asOf}）`,
    `MA20 ${fmt(L.ma20, 3)}｜MA60 ${fmt(L.ma60, 3)}｜MA250 ${fmt(L.ma250, 3)}｜MA50 ${fmt(L.ma50, 3)}｜MA300 ${fmt(L.ma300, 3)}`,
    `前20日最高 ${fmt(L.high20, 3)}、最低 ${fmt(L.low20, 3)}｜前55日最高 ${fmt(L.high55, 3)}、最低 ${fmt(L.low55, 3)}｜前10日最低 ${fmt(L.low10, 3)}｜52周 ${fmt(L.low52w, 3)}～${fmt(L.high52w, 3)}`,
    `涨跌幅：5日 ${pct(a.momentum.d5)}、20日 ${pct(a.momentum.d20)}、60日 ${pct(a.momentum.d60)}、250日 ${pct(a.momentum.d250)}`,
    `波动：日波动 ${fmt(a.volatility?.daily)}%、年化 ${fmt(a.volatility?.annual, 1)}%｜近1年最大回撤 ${fmt(a.maxDrawdown1y, 1)}%｜RSI14 ${fmt(a.rsi, 1)}｜MACD 柱 ${fmt(a.macd.hist, 4)}`,
    "### 海龟系统",
    `趋势过滤（50/300 日均线）：${t.trendFilter === "up" ? "向上，允许做多" : t.trendFilter === "down" ? "向下，不支持做多" : "数据不足"}`,
    `系统1（20日突破入市 / 10日低点退出）：${SYSTEM_STATE[t.system1.state]}${t.system1.entryDate ? `，入场 ${t.system1.entryDate} @${fmt(t.system1.entryPrice, 3)}` : ""}`,
    `系统2（55日突破入市 / 20日低点退出）：${SYSTEM_STATE[t.system2.state]}${t.system2.entryDate ? `，入场 ${t.system2.entryDate} @${fmt(t.system2.entryPrice, 3)}` : ""}`
  ];
  const p = t.plan;
  if (p) {
    lines.push(
      `N（20日真实波幅均值）= ${fmt(p.n, 4)}（约为价格的 ${fmt(p.nPct)}%）；加仓间隔 ½N = ${fmt(p.addStep, 4)}`,
      `现价买入：价 ${fmt(p.buyNow.price, 3)}，2N 止损 ${fmt(p.buyNow.stop, 3)}`,
      p.s1Entry ? `系统1 突破买入价 ${fmt(p.s1Entry.price, 3)}，对应止损 ${fmt(p.s1Entry.stop, 3)}` : "",
      p.s2Entry ? `系统2 突破买入价 ${fmt(p.s2Entry.price, 3)}，对应止损 ${fmt(p.s2Entry.stop, 3)}` : "",
      `头寸单位（账户权益 ${fmt(p.equity, 0)} × ${p.riskPct * 100}% ÷ N，按最小申报单位取整）：${p.unitShares} 股，市值约 ${fmt(p.unitValue, 0)}，打到 2N 止损约亏 ${fmt(p.riskAtStop, 0)}`
    );
  }
  lines.push(
    `### 量化评分：${a.score}（${formatReason("zh", `stance.${a.stance}`)}）`,
    ...a.reasons.map((r) => `- ${formatReason("zh", r.key, r.params)}`)
  );
  if (a.forecast) {
    lines.push("### 概率区间（历史波动率、零漂移的对数正态估计，不是预言）");
    for (const [h, v] of Object.entries(a.forecast)) {
      lines.push(`- ${h.slice(1)} 个交易日：约 68% 概率在 ${v.p68[0]}～${v.p68[1]}，约 95% 概率在 ${v.p95[0]}～${v.p95[1]}（1σ 波动 ±${v.move}%）`);
    }
  }
  const br = a.baseRates;
  if (br) {
    lines.push('### 这只证券自己历史上的同类信号（首次收盘突破后持有 20 个交易日；"过滤"指要求 50 日均线在 300 日均线之上）');
    for (const [name2, label] of [["system2", "55日突破（过滤）"], ["system1", "20日突破（过滤）"], ["system2Raw", "55日突破（不过滤）"]]) {
      const s = br[name2];
      if (!s) lines.push(`- ${label}：历史数据不足`);
      else if (s.count === 0) lines.push(`- ${label}：历史上没有出现过`);
      else lines.push(`- ${label}：共 ${s.count} 次，20日后上涨占 ${s.winRate}%，平均 ${pct(s.avg)}，中位数 ${pct(s.median)}，期间平均最大不利波动 ${pct(s.avgMae)}，触及 2N 止损 ${s.stopHitRate}%`);
    }
  }
  return lines.filter(Boolean).join("\n");
}
function describeQuote(q) {
  if (!q) return "";
  return [
    `### 实时行情`,
    `现价 ${fmt(q.price, 3)}（${pct(q.pct)}）｜今开 ${fmt(q.open, 3)} 最高 ${fmt(q.high, 3)} 最低 ${fmt(q.low, 3)} 昨收 ${fmt(q.prevClose, 3)}`,
    `成交额 ${yi(q.amount)}｜换手 ${fmt(q.turnover)}%｜量比 ${fmt(q.volRatio)}｜市盈率(动) ${fmt(q.pe)}｜市净率 ${fmt(q.pb)}｜总市值 ${yi(q.mcap)}`,
    q.limitUp ? `涨停价 ${fmt(q.limitUp, 3)}，跌停价 ${fmt(q.limitDown, 3)}` : ""
  ].filter(Boolean).join("\n");
}
function describeBars(bars) {
  if (!bars?.length) return "";
  const rows = bars.slice(-20).map((b) => `${b.date} 收${fmt(b.close, 3)} ${pct(b.pct)} 高${fmt(b.high, 3)} 低${fmt(b.low, 3)} 额${yi(b.amount)}`);
  return `### 最近 20 个交易日
${rows.join("\n")}`;
}
function describeAccount(account, position) {
  if (!account) return "";
  const lines = [
    "### 用户的模拟盘",
    `权益 ${fmt(account.equity, 0)}，可用资金 ${fmt(account.availableCash, 0)}，总盈亏 ${pct(account.totalPnlPct)}，持仓 ${account.positions.length} 只`
  ];
  if (position) {
    lines.push(`本证券持仓：${position.qty} 股（可卖 ${position.available}），成本 ${fmt(position.avgCost, 3)}，现价 ${fmt(position.price, 3)}，浮动盈亏 ${fmt(position.pnl, 0)}（${pct(position.pnlPct)}），止损位 ${position.stop ?? "未设置"}`);
  } else {
    lines.push("本证券：未持仓");
  }
  return lines.join("\n");
}
function describeFund(f) {
  const a = f.analysis;
  const lines = [
    `## 场外基金：${f.name}（${f.code}）`,
    `最新净值 ${fmt(a?.nav, 4)}（${a?.asOf ?? "—"}）｜申购费率 ${f.feeRate ?? "—"}%｜规模 ${f.scale?.value ?? "—"} 亿`,
    `基金经理：${f.managers.map((m) => `${m.name}（任职 ${m.workTime}）`).join("、") || "—"}`,
    f.holdings?.length ? `前十大持仓：${f.holdings.map((h) => `${h.name} ${fmt(h.weight)}%`).join("、")}` : ""
  ];
  if (a && !a.insufficient) {
    lines.push(
      `收益：近1月 ${pct(a.returns.m1)}、近3月 ${pct(a.returns.m3)}、近6月 ${pct(a.returns.m6)}、近1年 ${pct(a.returns.y1)}、近3年 ${pct(a.returns.y3)}`,
      `净值 MA60 ${fmt(a.levels.ma60, 4)}、MA250 ${fmt(a.levels.ma250, 4)}｜距1年高点 ${pct(a.fromPeak)}｜近1年最大回撤 ${fmt(a.maxDrawdown1y, 1)}%｜年化波动 ${fmt(a.volatility?.annual, 1)}%`,
      `### 量化评分：${a.score}（${formatReason("zh", `stance.${a.stance}`)}）`,
      ...a.reasons.map((r) => `- ${formatReason("zh", r.key, r.params)}`)
    );
    if (a.forecast) {
      for (const [h, v] of Object.entries(a.forecast)) {
        lines.push(`- ${h.slice(1)} 个交易日净值区间：68% 约 ${v.p68[0]}～${v.p68[1]}，95% 约 ${v.p95[0]}～${v.p95[1]}`);
      }
    }
  }
  return lines.filter(Boolean).join("\n");
}
var NEWS_KIND = { news: "新闻", notice: "公告", flash: "快讯", lhb: "龙虎榜", dividend: "分红送转", lift: "限售解禁", forecast: "业绩预告", report: "财报披露", holder: "股东增减持" };
function newsLine(i, { long = false } = {}) {
  const extra = long ? [i.summary, i.detail].filter(Boolean).join("；") : "";
  return `- ${i.time} [${NEWS_KIND[i.kind] ?? i.kind}${i.source && i.source !== NEWS_KIND[i.kind] ? `·${i.source}` : ""}] ${i.title}${extra ? `——${extra.slice(0, 260)}` : ""}`;
}
function describeNews(n) {
  if (!n || n.items.length === 0) return "";
  const past = n.items.filter((i) => !i.future).slice(0, 12);
  const lines = ["### 近期新闻、公告与事件（最新 12 条，标题仅供判断，未核实内容）", ...past.map((i) => newsLine(i, { long: i.kind !== "news" && i.kind !== "notice" }))];
  if (n.upcoming.length > 0) lines.push("### 即将发生的事件", ...n.upcoming.slice(0, 6).map((i) => newsLine(i, { long: true })));
  return lines.join("\n");
}
function describeFocus(f) {
  if (!f) return "";
  const b = f.bar;
  const head = b ? `### 用户关注的交易日：${f.date}（开 ${fmt(b.open, 3)} 高 ${fmt(b.high, 3)} 低 ${fmt(b.low, 3)} 收 ${fmt(b.close, 3)}，涨跌 ${pct(b.pct)}${f.prevClose ? `，前收 ${fmt(f.prevClose, 3)}` : ""}）` : `### 用户关注的日期：${f.date}`;
  if (f.items.length === 0) return `${head}
这段时间没有抓到相关新闻、公告或事件。请如实告诉用户，并从技术面、板块与大盘情绪等可能原因分析，说明这只是推测。`;
  return [`${head}
以下是前两个交易日盘后到当日收盘之间的新闻、公告与事件，请据此解释涨跌原因，区分"直接原因"和"可能相关"，并说明对后续趋势意味着什么：`, ...f.items.slice(0, 20).map((i) => newsLine(i, { long: true }))].join("\n");
}
var PRESET_LABEL = {
  turtle55: "海龟 55 日突破（系统2，趋势过滤向上）",
  turtle20: "海龟 20 日突破（系统1，趋势过滤向上）",
  strong: TEXT.strongLabel,
  etfTrend: "ETF 趋势（场内基金，系统2 持有中且趋势向上）",
  fundTrend: "场外基金趋势（指数/股票/混合型近 6 月排行前列，按净值跑趋势规则）"
};
var FUND_TYPE_LABEL = { zs: "指数型", gp: "股票型", hh: "混合型" };
function screenRow(c, i) {
  if (c.fund) {
    return `${i + 1}. ${c.name}（场外基金 ${c.code}，${FUND_TYPE_LABEL[c.fundType] ?? ""}）净值 ${fmt(c.price, 4)}（${c.navDate}，日涨 ${pct(c.pct)}），评分 ${c.score}，系统2 ${SYSTEM_STATE[c.s2]}，近3月 ${pct(c.returns?.m3)}、近6月 ${pct(c.returns?.m6)}、近1年 ${pct(c.returns?.y1)}，60日 ${pct(c.momentum60)}，近1年最大回撤 ${fmt(c.maxDrawdown1y, 1)}%，年化波动 ${fmt(c.volAnnual, 1)}%，N ${fmt(c.n, 4)}，3N 止损净值 ${fmt(c.stop, 4)}，按 1% 风险一个单位约占账户 ${fmt(c.unitPct, 1)}%${c.feeRate ? `，申购费率 ${c.feeRate}%` : ""}${c.similarCount ? `；另有 ${c.similarCount} 只走势几乎一样（日收益相关系数 ≥ 0.95，如 ${c.similar.slice(0, 3).map((x) => `${x.name} ${x.code}`).join("、")}），算同一个持仓` : ""}`;
  }
  return `${i + 1}. ${c.name}（${c.code}）现价 ${fmt(c.price, 3)}，评分 ${c.score}，系统2 ${SYSTEM_STATE[c.s2]}，系统1 ${SYSTEM_STATE[c.s1]}，60日 ${pct(c.momentum60)}，N ${fmt(c.n, 3)}，2N 止损 ${fmt(c.stop, 3)}，头寸单位 ${c.unitShares} 股`;
}
function describeScreen(s) {
  const label = PRESET_LABEL[s.presetLabel] ?? s.presetLabel;
  if (!Array.isArray(s.candidates)) return `## 选股结果：${label}
没有拿到结果（${s.status === "running" ? "还在运行，超过等待时间" : `失败：${s.error ?? s.status}`}）。`;
  if (s.candidates.length === 0) return `## 选股结果：${label}（${s.at}，初筛 ${s.scanned} 只）
当前没有满足条件的候选。`;
  const rows = s.candidates.slice(0, 15).map(screenRow);
  const hits = s.hits !== void 0 && s.hits !== s.candidates.length ? `${s.hits} 只，按走势合并成 ${s.candidates.length} 组` : `${s.candidates.length} 只`;
  return `## 选股结果：${label}（${s.at}，从 ${s.universe} 只中初筛 ${s.scanned} 只，命中 ${hits}，列出前 ${rows.length} 个）
${rows.join("\n")}`;
}
function describeContext(c) {
  if (c.kind === "fund") return [describeFund(c.fund), describeFocus(c.focus), describeNews(c.news), describeAccount(c.account)].filter(Boolean).join("\n\n");
  if (c.kind === "screen") return [describeScreen(c.screen), describeAccount(c.account)].join("\n\n");
  if (c.kind === "general") {
    const idx = (c.indices ?? []).map((i) => `${i.name} ${fmt(i.price)}（${pct(i.pct)}）`).join("｜");
    return [`## 市场概况
${idx}`, ...(c.screens ?? []).map(describeScreen), describeAccount(c.account)].join("\n\n");
  }
  return [
    `## 证券：${c.name}（${c.code}，${c.typeLabel}）`,
    describeQuote(c.quote),
    describeAnalysis(c.analysis),
    describeFocus(c.focus),
    describeBars(c.bars),
    describeNews(c.news),
    describeAccount(c.account, c.position)
  ].filter(Boolean).join("\n\n");
}
var HISTORY_BUDGET = 15e4;
var RECENT_KEEP = 4e4;
var RECENT_MIN_MESSAGES = 6;
var messageLine = (m) => {
  const files = m.attachments?.length ? `（附件：${m.attachments.map((a) => a.name).join("、")}）` : "";
  return `【${m.role === "user" ? "用户" : "顾问"}】${m.text}${files}`;
};
var historyChars = (messages) => messages.reduce((n, m) => n + messageLine(m).length + 2, 0);
function foldHistory(messages, { summary = null } = {}) {
  const parts = [];
  if (summary?.text) parts.push(`## 更早对话的摘要（前 ${summary.upto} 条消息已压缩，要点如下）

${summary.text}`);
  const recent = summary ? messages.slice(summary.upto) : messages;
  if (recent.length > 0) parts.push(recent.map(messageLine).join("\n\n"));
  return parts.join("\n\n");
}
function compactionCut(messages, from = 0, keepChars = RECENT_KEEP) {
  let cut = messages.length;
  let kept = 0;
  while (cut > from) {
    const len = messageLine(messages[cut - 1]).length + 2;
    if (messages.length - cut >= RECENT_MIN_MESSAGES && kept + len > keepChars) break;
    kept += len;
    cut--;
  }
  if (cut > from && messages[cut]?.role === "assistant") cut--;
  return Math.max(from, cut);
}
var COMPACT_SYSTEM = "你负责整理一位个人投资者与 AI 交易顾问之间的对话记录，供顾问以后继续对话时参考。只根据给出的内容整理，不要编造，不要给新的建议。";
function compactionPrompt(previousSummary, messages) {
  const prev = previousSummary ? `# 之前已有的摘要

${previousSummary}

` : "";
  return `${prev}# 需要压缩的对话

${messages.map(messageLine).join("\n\n")}

---

请把"之前已有的摘要"和"需要压缩的对话"合并整理，严格按下面两节输出：

## 对话摘要
（3000 字以内的要点：用户的目标与资金情况、偏好与限制、讨论过的证券和基金及结论、顾问给过的建议（买卖倾向、止损、仓位）和后来的情况、还没解决的问题。保留关键数字、价格和日期。）

## 长期记忆
（用"- "逐条列出值得在所有对话里长期记住的用户信息：偏好、目标、风险承受、长期计划、用户明确要求记住的事。每条一句话，不写一次性的行情判断；没有就写"- 无"。）`;
}
function parseCompaction(text2) {
  const t = String(text2 ?? "");
  const memIdx = t.search(/^##\s*长期记忆/m);
  const sumIdx = t.search(/^##\s*对话摘要/m);
  const summary = (sumIdx >= 0 ? t.slice(sumIdx, memIdx > sumIdx ? memIdx : void 0) : memIdx >= 0 ? t.slice(0, memIdx) : t).replace(/^##\s*对话摘要\s*/m, "").trim();
  const memories = memIdx >= 0 ? t.slice(memIdx).split("\n").slice(1).map((l) => l.replace(/^\s*[-*•]\s*/, "").trim()).filter((l) => l && l !== "无" && !/^（.*）$/.test(l)) : [];
  return { summary, memories };
}
function buildSystemPrompt(knowledge) {
  return knowledge.lite ? `${ROLE}

${TEXT.kbHeading}

${knowledge.lite}` : `${ROLE}

${TEXT.kbMissing}`;
}
function buildUserMessage({ contextText, question, history, retrieved, attachmentsText = "", memoryText = "" }) {
  const parts = [];
  if (memoryText) parts.push(memoryText);
  if (history) parts.push(`# 之前的对话（同一个对话框里的全部记录）

${history}`);
  if (retrieved.length > 0) {
    parts.push(`${TEXT.retrievedHeading}

${retrieved.map((r) => `## 〔${r.source}〕${r.title}
${r.text}`).join("\n\n")}`);
  }
  parts.push(`# 当前数据（${(/* @__PURE__ */ new Date()).toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" })}，北京时间）

${contextText}`);
  if (attachmentsText) parts.push(attachmentsText);
  parts.push(`# 用户的新问题

${question}`);
  return parts.join("\n\n---\n\n");
}
function pickReasoningEffort(reasoning, efforts) {
  if (!reasoning || reasoning === "auto") return void 0;
  return efforts.includes(reasoning) ? reasoning : void 0;
}
var MAX_CONTINUATIONS = 2;
async function streamOnce(llm, { provider, model, maxTokens, reasoning, system, user, images = [], signal, onDelta, onThinking }) {
  const messages = [{ role: "user", content: [{ type: "text", text: user }, ...images.map((attachment) => ({ type: "image", attachment }))] }];
  const limit2 = Number(maxTokens) > 0 ? { maxTokens: Number(maxTokens) } : {};
  let stream;
  if (typeof llm.prepareCall === "function") {
    const call = await llm.prepareCall({ provider, model, ...limit2 }, signal, (controls, info) => {
      const effort = pickReasoningEffort(reasoning, (info?.reasoning?.efforts ?? []).map((e) => e.id));
      return effort === void 0 ? controls : { ...controls, reasoningEffort: effort };
    });
    stream = call.stream({ ...call.config, system, messages, signal });
  } else {
    stream = llm.stream({ provider, model, ...limit2, system, messages, signal });
  }
  let text2 = "";
  let finish = null;
  for await (const chunk of stream) {
    if (chunk?.type === "text-delta" && typeof chunk.text === "string") {
      text2 += chunk.text;
      onDelta(chunk.text);
    } else if (typeof chunk?.type === "string" && /reason|think/.test(chunk.type)) {
      onThinking?.();
    } else if (chunk?.type === "finish") {
      finish = chunk.reason ?? null;
    }
  }
  return { text: text2, finish };
}
function continuationPrompt(user, written) {
  return `${user}

---

# 你上一轮已经写出的回答（因长度上限中断）

${written}

---

请从中断的地方直接接着写完。不要重复已经写过的内容，不要加开场白，也不要说明这是续写。`;
}
async function streamAnswer(llm, options) {
  let text2 = "";
  for (let round2 = 0; round2 <= MAX_CONTINUATIONS; round2++) {
    const user = round2 === 0 ? options.user : continuationPrompt(options.user, text2);
    const { text: part, finish } = await streamOnce(llm, { ...options, user });
    text2 += part;
    if (finish?.kind !== "max-tokens") return text2;
    if (part.trim() === "") break;
  }
  const note = text2.trim() === "" ? "（模型的思考用完了输出额度，没有写出回答。请把推理强度调低一档后重试，或者把问题拆小一些。）" : "\n\n（回答很长，自动续写后仍超出长度上限。可以把推理强度调低一档，或者把问题拆成几个小问题。）";
  text2 += note;
  options.onDelta(note);
  return text2;
}

// src/shared/events.js
var EVENT_PRIORITY = ["lhb", "forecast", "lift", "dividend", "notice", "holder", "report", "flash", "news"];
var EVENT_KINDS = new Set(EVENT_PRIORITY);
function itemsForBar(items, date, prevDate) {
  const end = `${date} 15:00`;
  const start = prevDate ? `${prevDate} 15:00` : `${date} 00:00`;
  return items.filter((i) => !i.future && i.time > start && i.time <= end);
}

// src/host/news.js
var DATACENTER = "https://datacenter-web.eastmoney.com/api/data/v1/get";
var pad = (s) => String(s ?? "");
function normTime(value, defaultTime = "09:00") {
  const s = pad(value).replace("T", " ").trim();
  const m = /^(\d{4}-\d{2}-\d{2})(?:\s+(\d{2}:\d{2}))?/.exec(s);
  if (m === null) return null;
  return `${m[1]} ${m[2] && m[2] !== "00:00" ? m[2] : defaultTime}`;
}
var stripTags = (s) => pad(s).replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').trim();
function parseSinaNews(html) {
  const out = [];
  const re = /(\d{4}-\d{2}-\d{2})&nbsp;(\d{2}:\d{2})&nbsp;&nbsp;<a[^>]*href='([^']+)'[^>]*>([^<]+)<\/a>/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    out.push({ id: `s:${m[3]}`, time: `${m[1]} ${m[2]}`, kind: "news", title: stripTags(m[4]), source: "新浪财经", url: m[3] });
  }
  return out;
}
async function sinaNews(secid, pages = 3) {
  const [market, code] = secid.split(".");
  if (market !== "1" && market !== "0") return [];
  const symbol = `${market === "1" ? "sh" : /^(4|8|92)/.test(code) ? "bj" : "sz"}${code}`;
  const out = [];
  for (let page = 1; page <= pages; page++) {
    const html = await fetchText(`https://vip.stock.finance.sina.com.cn/corp/view/vCB_AllNewsStock.php?symbol=${symbol}&Page=${page}`, { encoding: "gbk" });
    const items = parseSinaNews(html);
    out.push(...items);
    if (items.length < 30) break;
  }
  return out;
}
function parseSinaHkNews(html) {
  const out = [];
  const re = /<a[^>]*href="([^"]+)"[^>]*title="([^"]+)"[^>]*>[^<]*<\/a>\s*<span class="rt">(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2})/g;
  let m;
  while ((m = re.exec(html)) !== null) out.push({ id: `s:${m[1]}`, time: `${m[3]} ${m[4]}`, kind: "news", title: stripTags(m[2]), source: "新浪财经", url: m[1] });
  return out;
}
async function sinaHkNews(code) {
  return parseSinaHkNews(await fetchText(`https://stock.finance.sina.com.cn/hkstock/news/${code}.html`, { encoding: "gbk" }));
}
function parseSinaUsNews(html) {
  const out = [];
  const re = /<span class="xb_list_r">([^|<]*)\|\s*(\d{4})年(\d{1,2})月(\d{1,2})日\s*(\d{2}:\d{2})<\/span>\s*<a[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    const date = `${m[2]}-${m[3].padStart(2, "0")}-${m[4].padStart(2, "0")}`;
    out.push({ id: `s:${m[6]}`, time: `${date} ${m[5]}`, kind: "news", title: stripTags(m[7]), source: m[1].trim() || "新浪财经", url: m[6] });
  }
  return out;
}
async function sinaUsNews(code) {
  return parseSinaUsNews(await fetchText(`https://biz.finance.sina.com.cn/usstock/usstock_news.php?symbol=${encodeURIComponent(code)}`, { encoding: "gbk" }));
}
async function notices(code, annType = "A", size = 100) {
  const qs = new URLSearchParams({ sr: "-1", page_size: String(size), page_index: "1", ann_type: annType, client_source: "web", stock_list: code, f_node: "0", s_node: "0" });
  const json2 = await fetchJson(`https://np-anotice-stock.eastmoney.com/api/security/ann?${qs}`);
  return (json2?.data?.list ?? []).map((r) => ({
    id: `a:${r.art_code}`,
    time: normTime(r.display_time ?? r.notice_date, "16:00"),
    kind: "notice",
    title: pad(r.title_ch || r.title).replace(/^[^:：]{1,12}[:：]/, ""),
    source: r.columns?.[0]?.column_name ?? "公告",
    url: `https://data.eastmoney.com/notices/detail/${code}/${r.art_code}.html`
  })).filter((r) => r.time);
}
async function fundNotices(code, size = 50) {
  const qs = new URLSearchParams({ fundcode: code, pageIndex: "1", pageSize: String(size), type: "0" });
  const json2 = await fetchJson(`https://api.fund.eastmoney.com/f10/JJGG?${qs}`, { referer: "https://fundf10.eastmoney.com/" });
  return (json2?.Data ?? []).map((r) => ({
    id: `fa:${r.ID}`,
    time: normTime(r.PUBLISHDATE, "16:00"),
    kind: "notice",
    title: pad(r.TITLE),
    source: "基金公告",
    url: `https://fund.eastmoney.com/gonggao/${code},${r.ID}.html`
  })).filter((r) => r.time);
}
async function flash(secid, size = 100) {
  const qs = new URLSearchParams({ client: "web", biz: "web_724", fastColumn: "102", sortEnd: "", pageSize: String(size), req_trace: String(Date.now()) });
  const json2 = await fetchJson(`https://np-weblist.eastmoney.com/comm/web/getFastNewsList?${qs}`);
  return (json2?.data?.fastNewsList ?? []).filter((r) => secid === void 0 || pad(r.stockList).includes(`'${secid}'`)).map((r) => ({
    id: `f:${r.code}`,
    time: normTime(r.showTime),
    kind: "flash",
    title: stripTags(r.title) || stripTags(r.summary).slice(0, 60),
    summary: stripTags(r.summary).slice(0, 200),
    source: "东方财富快讯",
    url: `https://finance.eastmoney.com/a/${r.code}.html`
  })).filter((r) => r.time);
}
async function report(name2, code, sortColumn, pageSize = 30) {
  const qs = new URLSearchParams({
    reportName: name2,
    columns: "ALL",
    filter: `(SECURITY_CODE="${code}")`,
    pageNumber: "1",
    pageSize: String(pageSize),
    sortColumns: sortColumn,
    sortTypes: "-1",
    source: "WEB",
    client: "WEB"
  });
  const json2 = await fetchJson(`${DATACENTER}?${qs}`);
  return json2?.result?.data ?? [];
}
var yi2 = (v) => v === null || v === void 0 ? "—" : Math.abs(v) >= 1e8 ? `${(v / 1e8).toFixed(2)} 亿` : `${(v / 1e4).toFixed(0)} 万`;
var today = () => new Date(Date.now() + 8 * 36e5).toISOString().slice(0, 10);
async function stockEvents(code) {
  const now = today();
  const settle = (p) => p.catch(() => []);
  const [lhb, bonus, lift, forecast, appoint, holder] = await Promise.all([
    settle(report("RPT_DAILYBILLBOARD_DETAILSNEW", code, "TRADE_DATE", 30)),
    settle(report("RPT_SHAREBONUS_DET", code, "EX_DIVIDEND_DATE", 12)),
    settle(report("RPT_LIFT_STAGE", code, "FREE_DATE", 12)),
    settle(report("RPT_PUBLIC_OP_NEWPREDICT", code, "NOTICE_DATE", 12)),
    settle(report("RPT_PUBLIC_BS_APPOIN", code, "REPORT_DATE", 6)),
    settle(report("RPT_SHARE_HOLDER_INCREASE", code, "END_DATE", 20))
  ]);
  const out = [];
  const seenLhb = /* @__PURE__ */ new Set();
  for (const r of lhb) {
    const key = `${r.TRADE_DATE}|${r.EXPLANATION}`;
    if (seenLhb.has(key)) continue;
    seenLhb.add(key);
    out.push({
      id: `l:${key}`,
      time: normTime(r.TRADE_DATE, "09:30"),
      kind: "lhb",
      title: pad(r.EXPLANATION),
      detail: `当日涨跌 ${r.CHANGE_RATE === null ? "—" : `${Number(r.CHANGE_RATE).toFixed(2)}%`}，龙虎榜净买入 ${yi2(r.BILLBOARD_NET_AMT)}`,
      source: "龙虎榜",
      url: `https://data.eastmoney.com/stock/lhb/${code}.html`
    });
  }
  for (const r of bonus) {
    const date = r.EX_DIVIDEND_DATE ?? r.PLAN_NOTICE_DATE;
    if (!date) continue;
    out.push({
      id: `d:${r.REPORT_DATE}`,
      time: normTime(date, "09:00"),
      kind: "dividend",
      title: `${r.EX_DIVIDEND_DATE ? "除权除息" : "分红预案"}：${pad(r.IMPL_PLAN_PROFILE) || "方案见公告"}`,
      detail: `${pad(r.ASSIGN_PROGRESS)}${r.EQUITY_RECORD_DATE ? `，股权登记日 ${pad(r.EQUITY_RECORD_DATE).slice(0, 10)}` : ""}`,
      source: "分红送转",
      url: `https://data.eastmoney.com/yjfp/detail/${code}.html`
    });
  }
  for (const r of lift) {
    if (!r.FREE_DATE) continue;
    out.push({
      id: `u:${r.FREE_DATE}`,
      time: normTime(r.FREE_DATE, "09:00"),
      kind: "lift",
      title: `${r.CURRENT_FREE_SHARES === null ? "—" : `${Number(r.CURRENT_FREE_SHARES).toFixed(0)} 万股`}（${pad(r.FREE_SHARES_TYPE)}）`,
      detail: `解禁市值约 ${yi2((r.LIFT_MARKET_CAP ?? 0) * 1e4)}${r.B20_ADJCHRATE !== null && r.B20_ADJCHRATE !== void 0 ? `；解禁前 20 日涨跌 ${Number(r.B20_ADJCHRATE).toFixed(1)}%` : ""}${r.A20_ADJCHRATE !== null && r.A20_ADJCHRATE !== void 0 ? `，解禁后 20 日 ${Number(r.A20_ADJCHRATE).toFixed(1)}%` : ""}`,
      source: "限售解禁",
      url: `https://data.eastmoney.com/dxf/q/${code}.html`
    });
  }
  for (const r of forecast) {
    if (!r.NOTICE_DATE) continue;
    out.push({
      id: `p:${r.NOTICE_DATE}|${r.PREDICT_FINANCE}`,
      time: normTime(r.NOTICE_DATE, "16:00"),
      kind: "forecast",
      title: `${pad(r.REPORT_DATE).slice(0, 10)} ${pad(r.PREDICT_TYPE)}：${pad(r.PREDICT_FINANCE)}`,
      summary: pad(r.PREDICT_CONTENT).slice(0, 160),
      detail: pad(r.CHANGE_REASON_EXPLAIN).slice(0, 300),
      source: "业绩预告",
      url: `https://data.eastmoney.com/bbsj/yjyg/${code}.html`
    });
  }
  for (const r of appoint) {
    const date = r.ACTUAL_PUBLISH_DATE ?? r.APPOINT_PUBLISH_DATE ?? r.FIRST_APPOINT_DATE;
    if (!date) continue;
    out.push({
      id: `r:${r.REPORT_DATE}`,
      time: normTime(date, "16:00"),
      kind: "report",
      title: `${pad(r.REPORT_TYPE_NAME)}${r.IS_PUBLISH === "1" ? "已披露" : "预约披露"}`,
      source: "财报披露",
      url: `https://data.eastmoney.com/bbsj/yjyg/${code}.html`
    });
  }
  for (const r of holder) {
    if (!r.NOTICE_DATE) continue;
    out.push({
      id: `h:${r.NOTICE_DATE}|${r.HOLDER_NAME}|${r.CHANGE_NUM}`,
      time: normTime(r.NOTICE_DATE, "16:00"),
      kind: "holder",
      title: `${pad(r.HOLDER_NAME)} ${pad(r.DIRECTION) || (r.CHANGE_NUM > 0 ? "增持" : "减持")} ${Math.abs(Number(r.CHANGE_NUM) || 0).toFixed(2)} 万股`,
      detail: r.TRADE_AVERAGE_PRICE ? `成交均价 ${Number(r.TRADE_AVERAGE_PRICE).toFixed(2)}，变动后持股 ${r.HOLD_RATIO ?? "—"}%` : "",
      source: "股东增减持",
      url: `https://data.eastmoney.com/executive/gdzjc/${code}.html`
    });
  }
  for (const e of out) if (e.time && e.time.slice(0, 10) > now) e.future = true;
  return out.filter((e) => e.time);
}
function mergeItems(...lists) {
  const seen = /* @__PURE__ */ new Set();
  const out = [];
  for (const item of lists.flat()) {
    const key = item.title.replace(/\s+/g, "").slice(0, 40);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out.sort((a, b) => a.time < b.time ? 1 : a.time > b.time ? -1 : 0);
}

// src/shared/semver.js
function compareVersions(a, b) {
  const parse = (v) => {
    const [core, pre = ""] = String(v).split("-");
    return { nums: core.split(".").map((n) => Number.parseInt(n, 10) || 0), pre };
  };
  const x = parse(a);
  const y = parse(b);
  for (let i = 0; i < 3; i++) {
    const d = (x.nums[i] ?? 0) - (y.nums[i] ?? 0);
    if (d !== 0) return d;
  }
  if (x.pre === y.pre) return 0;
  if (x.pre === "") return 1;
  if (y.pre === "") return -1;
  return x.pre < y.pre ? -1 : 1;
}
function latestVersion(versions) {
  const sorted = [...versions].sort(compareVersions);
  const stable = sorted.filter((v) => !String(v).includes("-"));
  return (stable.length ? stable : sorted).at(-1) ?? null;
}

// src/host/service.js
var ServiceError = class extends Error {
  constructor(code, params = {}, status2 = 400) {
    super(code);
    this.code = code;
    this.params = params;
    this.status = status2;
  }
};
var FUND_INTENT = /基金|定投|ETF|LOF|场外|场内/i;
var PICK_INTENT = [
  /(哪些|哪只|哪个|哪几只?|什么)(.{0,6})(基金|股票|个股|ETF|LOF|板块|行业|标的)/i,
  /推荐|(买|投|选|定投)(点|些)?(什么|哪)|适合.{0,8}(买|投|定投)|值得.{0,6}(买|投|关注)|选股|候选|买入机会/
];
var OWN_POSITIONS = /持仓|实盘|模拟盘|仓位|手里|已经买/;
function screensForQuestion(question) {
  const q = String(question ?? "");
  if (!PICK_INTENT.some((re) => re.test(q))) return [];
  if (OWN_POSITIONS.test(q) && !/推荐|(买|投)(点|些)?(什么|哪)|新(买|开仓)/.test(q)) return [];
  return FUND_INTENT.test(q) ? ["fundTrend", "etfTrend"] : ["turtle55", "strong"];
}
var KIND_LABEL = { stock: "股票", etf: "场内基金", index: "指数", fund: "场外基金" };
var REGION_LABEL = { cn: "A股", hk: "港股", us: "美股", global: "全球" };
var PERIODS2 = /* @__PURE__ */ new Set(["day", "week", "month", "m1", "m5", "m15", "m30", "m60"]);
var intIn = (v, min, max, dflt) => {
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : dflt;
};
var ATTACH_LIMITS = { images: 4, imageBytes: 8 * 1024 * 1024, files: 5, fileChars: 6e4, totalFileChars: 15e4 };
var IMAGE_TYPES = /* @__PURE__ */ new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);
function describeFiles(files) {
  if (!files.length) return "";
  const parts = files.map((f) => {
    const cut = f.text.length > ATTACH_LIMITS.fileChars;
    const body = cut ? f.text.slice(0, ATTACH_LIMITS.fileChars) : f.text;
    return `## 文件：${f.name}${cut ? `（共 ${f.text.length} 字，只附上前 ${ATTACH_LIMITS.fileChars} 字）` : ""}

\`\`\`
${body}
\`\`\``;
  });
  return `# 用户附上的文件（原样内容，可能包含金额等个人信息，只用于回答这个问题）

${parts.join("\n\n")}`;
}
async function createMarketService({ store, knowledge, getLlm, getAttachments = () => void 0, config, log }) {
  const cache = createCache();
  const marketById = new Map(MARKETS.map((m) => [m.id, m]));
  const tracking = await store.load("tracking", createTracking);
  const account = await store.load("paper", () => createAccount(config.initialCash));
  const fees = { ...DEFAULT_FEES, ...config.fees };
  let lastEquity = account.initialCash;
  const screens = /* @__PURE__ */ new Map();
  async function fundList() {
    return cache.get("fundlist", 24 * 36e5, async () => {
      const saved = await store.load("fundlist", () => null);
      if (saved !== null && Date.now() - Date.parse(saved.at) < 24 * 36e5) return saved.rows;
      try {
        const rows = await fetchFundList();
        store.save("fundlist", { at: (/* @__PURE__ */ new Date()).toISOString(), rows });
        return rows;
      } catch (error) {
        if (saved !== null) return saved.rows;
        throw error;
      }
    });
  }
  const infoOf = (symbol, name2 = "") => isFundSymbol(symbol) ? { kind: "fund", region: "cn", board: "otc" } : classify(symbol, name2);
  async function resolve(text2) {
    const q = String(text2 ?? "").trim();
    if (q === "") throw new ServiceError("symbol.empty");
    if (isFundSymbol(q)) return { symbol: q, code: q.slice(FUND_PREFIX.length) };
    if (isSecid(q)) return { symbol: q, code: q.split(".")[1] };
    const hits = await search4(q);
    const exact = hits.find((h) => h.code.toUpperCase() === q.toUpperCase());
    if (exact) return exact;
    if (/^\d{6}$/.test(q)) {
      const guess = guessCnSecid(q);
      if (guess) return { symbol: guess, code: q };
    }
    if (hits.length > 0) return hits[0];
    throw new ServiceError("symbol.notFound", { query: q }, 404);
  }
  let fundListLoaded = null;
  fundList().then((list5) => {
    fundListLoaded = list5;
  }, (error) => log.debug("基金代码表加载失败", error));
  async function search4(query) {
    const q = String(query ?? "").trim().slice(0, 20);
    if (q === "") return [];
    return cache.get(`search:${q}`, 6e4, async () => {
      const quotes4 = await search3(q).catch(() => []);
      const fundRows = fundListLoaded === null ? [] : searchFundList(fundListLoaded, q, 8);
      const out = quotes4.map((r) => ({ symbol: r.symbol, code: r.code, name: r.name, type: r.type }));
      for (const f of fundRows) if (!out.some((o) => o.symbol === f.symbol)) out.push(f);
      return out.slice(0, 16);
    });
  }
  async function list4({ market = "a", sort, order = "desc", page, size, type } = {}) {
    const m = marketById.get(market);
    if (m === void 0) throw new ServiceError("market.unknown", { market });
    const p = intIn(page, 1, 2e3, 1);
    const s = intIn(size, 10, 100, 50);
    const o = order === "asc" ? "asc" : "desc";
    if (m.source === "fund") {
      const fundType = FUND_TYPES.has(type) ? type : "all";
      const fundSort = FUND_SORTS.has(sort) ? sort : "1nzf";
      const r2 = await cache.get(
        `frank:${fundType}:${fundSort}:${o}:${p}:${s}`,
        3e5,
        () => fundRank({ type: fundType, sort: fundSort, order: o, page: p, size: s })
      );
      return { market, kind: "fund", total: r2.total, rows: r2.rows };
    }
    const field = SORT_FIELDS.has(sort) ? sort : "f3";
    const r = await cache.get(
      `list:${market}:${field}:${o}:${p}:${s}`,
      3e3,
      () => list3({ market, fs: m.fs, sort: field, order: o, page: p, size: s })
    );
    return { market, kind: "quote", total: r.total, rows: r.rows };
  }
  const indices = () => cache.get("indices", 3e3, async () => {
    const rows = await quotes3(INDICES);
    return INDICES.map((id) => rows.find((r) => r.secid === id)).filter(Boolean);
  });
  async function quotesMap(secids) {
    const unique = [...new Set(secids.filter(isSecid))];
    const map = /* @__PURE__ */ new Map();
    if (unique.length === 0) return map;
    const rows = await cache.get(`quotes:${unique.slice().sort().join(",")}`, 2e3, () => quotes3(unique));
    for (const r of rows) map.set(r.secid, r);
    return map;
  }
  async function dailyBars(secid, limit2) {
    const key = `bars/${secid.replace(/[^A-Za-z0-9.-]/g, "_")}`;
    const record = await store.load(key, () => null);
    const today2 = beijingDate();
    const fresh = record !== null && record.limit >= limit2 && Date.now() - Date.parse(record.fullAt) < 7 * 864e5;
    if (fresh && record.checkedOn === today2 && !isMarketOpen(infoOf(secid).region === "cn" ? "cn" : infoOf(secid).region)) {
      return record.bars.slice(-limit2);
    }
    if (fresh) {
      try {
        const recent = (await kline4(secid, { period: "day", limit: 10 })).bars;
        const first = recent[0];
        const overlap = record.bars.find((b) => b.date === first?.date);
        if (first && overlap && Math.abs(overlap.close / first.close - 1) < 5e-3) {
          const merged = [...record.bars.filter((b) => b.date < first.date), ...recent].slice(-Math.max(limit2, record.limit));
          store.save(key, { ...record, bars: merged, checkedOn: today2 });
          return merged.slice(-limit2);
        }
      } catch {
        return record.bars.slice(-limit2);
      }
    }
    const full = await kline4(secid, { period: "day", limit: limit2 });
    store.save(key, { secid, limit: limit2, bars: full.bars, fullAt: (/* @__PURE__ */ new Date()).toISOString(), checkedOn: today2, source: full.source, unadjusted: full.unadjusted === true });
    return full.bars;
  }
  const bars = (secid, limit2 = 1e3, ttl = 6e4) => cache.get(`bars:${secid}:${limit2}`, ttl, () => dailyBars(secid, limit2));
  async function fund(code) {
    const detail = await cache.get(`fund:${code}`, 6e5, () => fundDetail(code));
    const holdings = await cache.get(`fundhold:${code}`, 36e5, async () => {
      const rows = await fundHoldings(code);
      if (rows.length > 0 || detail.holdingSecids.length === 0) return rows;
      const quotes4 = await quotes3(detail.holdingSecids.slice(0, 10)).catch(() => []);
      return detail.holdingSecids.slice(0, 10).map((secid) => {
        const q = quotes4.find((r) => r.secid === secid);
        return { secid, code: secid.split(".")[1], name: q?.name ?? secid, weight: null, price: q?.price ?? null, pct: q?.pct ?? null };
      });
    });
    const adjusted = fundSeries(detail.navs).map((b) => ({ date: b.date, nav: b.close, pct: b.pct }));
    const analysis2 = analyzeNav(adjusted);
    return { ...detail, holdings, analysis: analysis2, navs: detail.navs.slice(-1500) };
  }
  async function quote3(symbol) {
    if (isFundSymbol(symbol)) {
      const f = await fund(symbol.slice(FUND_PREFIX.length));
      const last = f.navs[f.navs.length - 1];
      return { symbol, code: f.code, name: f.name, price: last?.nav ?? null, pct: last?.pct ?? null, date: last?.date ?? null, kind: "fund" };
    }
    if (!isSecid(symbol)) throw new ServiceError("symbol.invalid");
    const q = await cache.get(`quote:${symbol}`, 2e3, () => quote2(symbol));
    return { ...q, symbol, ...infoOf(symbol, q.name), paperTradable: paperTradable(infoOf(symbol, q.name)) };
  }
  async function kline5(symbol, { period = "day", limit: limit2 = 250 } = {}) {
    if (!isSecid(symbol)) throw new ServiceError("symbol.invalid");
    const p = PERIODS2.has(period) ? period : "day";
    const l = intIn(limit2, 20, 1e3, 250);
    if (p === "day") {
      const series = await bars(symbol, Math.max(l, 1e3));
      return { secid: symbol, name: "", bars: series.slice(-l) };
    }
    return cache.get(`kline:${symbol}:${p}:${l}`, p.startsWith("m") ? 1e4 : 3e4, () => kline4(symbol, { period: p, limit: l }));
  }
  async function trends3(symbol) {
    if (!isSecid(symbol)) throw new ServiceError("symbol.invalid");
    return cache.get(`trends:${symbol}`, 5e3, () => trends2(symbol));
  }
  async function analysis(symbol) {
    if (isFundSymbol(symbol)) return (await fund(symbol.slice(FUND_PREFIX.length))).analysis;
    if (!isSecid(symbol)) throw new ServiceError("symbol.invalid");
    const equity = Math.round(lastEquity);
    return cache.get(`analysis:${symbol}:${equity}`, 6e4, async () => {
      const series = await bars(symbol);
      const q = await quote3(symbol).catch(() => null);
      return analyzeBars(series, { equity, riskPct: config.riskPct, lot: buyLotRule(infoOf(symbol, q?.name ?? "")) });
    });
  }
  async function paperView() {
    const secids = [...Object.keys(account.positions), ...account.orders.filter((o) => o.status === "pending").map((o) => o.secid)];
    const quotes4 = await quotesMap(secids).catch(() => /* @__PURE__ */ new Map());
    const filled = matchPending(account, (id) => quotes4.get(id), (id, name2) => classify(id, name2), { fees });
    for (const o of filled) {
      pushEvent(tracking, { kind: "fill", symbol: o.secid, code: o.code, name: o.name, type: o.side, value: o.qty, price: o.fillPrice, pct: null });
    }
    const summary = summarize(account, (id) => quotes4.get(id));
    recordEquity(account, summary.equity);
    lastEquity = summary.equity;
    store.save("paper", account);
    if (filled.length > 0) store.save("tracking", tracking);
    return summary;
  }
  async function placeOrder2({ symbol, side, qty, type = "market", price, stop }) {
    const { symbol: secid } = await resolve(symbol);
    if (!isSecid(secid)) throw new ServiceError("paper.notTradable");
    const q = await quote2(secid);
    const info = classify(secid, q.name);
    const result = placeOrder(account, {
      secid,
      code: q.code,
      name: q.name,
      side,
      type,
      qty: Number(qty),
      price: price === void 0 || price === null || price === "" ? void 0 : Number(price),
      stop: stop === void 0 || stop === null || stop === "" ? void 0 : Number(stop)
    }, q, info, { fees });
    if (!result.ok) throw new ServiceError(result.code, result.params);
    store.save("paper", account);
    return { order: result.order, account: await paperView() };
  }
  async function cancelOrder2(orderId) {
    const r = cancelOrder(account, orderId);
    if (!r.ok) throw new ServiceError(r.code);
    store.save("paper", account);
    return paperView();
  }
  async function resetPaper(cash) {
    const amount = intIn(cash, 1e4, 1e10, config.initialCash);
    Object.assign(account, createAccount(amount));
    store.save("paper", account);
    return paperView();
  }
  async function setStop3(symbol, stop) {
    const r = setStop(account, symbol, stop === null || stop === "" ? null : Number(stop));
    if (!r.ok) throw new ServiceError(r.code);
    store.save("paper", account);
    return paperView();
  }
  async function nameOf(symbol) {
    if (isFundSymbol(symbol)) {
      const code = symbol.slice(FUND_PREFIX.length);
      const hit = (await fundList()).find((f) => f.code === code);
      return { code, name: hit?.name ?? code };
    }
    const q = await quote3(symbol);
    return { code: q.code, name: q.name };
  }
  async function watchlistView() {
    const items = tracking.watchlist;
    const quotes4 = await quotesMap(items.map((i) => i.symbol)).catch(() => /* @__PURE__ */ new Map());
    const fundItems = await Promise.all(items.filter((i) => isFundSymbol(i.symbol)).map(async (i) => {
      try {
        return [i.symbol, await quote3(i.symbol)];
      } catch {
        return [i.symbol, null];
      }
    }));
    const fundQuotes = new Map(fundItems);
    return items.map((i) => {
      const q = isFundSymbol(i.symbol) ? fundQuotes.get(i.symbol) : quotes4.get(i.symbol);
      return { ...i, price: q?.price ?? null, pct: q?.pct ?? null, amount: q?.amount ?? null, date: q?.date ?? null };
    });
  }
  async function watch({ action, symbol }) {
    const { symbol: resolved } = await resolve(symbol);
    if (action === "remove") removeWatch(tracking, resolved);
    else addWatch(tracking, { symbol: resolved, ...await nameOf(resolved) });
    store.save("tracking", tracking);
    return watchlistView();
  }
  const alertsView = () => ({
    alerts: tracking.alerts,
    events: tracking.events.slice(0, 100),
    unread: tracking.events.filter((e) => !e.read).length,
    liveUrgent
  });
  async function alert({ action, id, ids, symbol, type, value }) {
    if (action === "remove") removeAlert(tracking, id);
    else if (action === "read") markRead(tracking, ids);
    else if (action === "clearEvents") tracking.events = [];
    else {
      const { symbol: resolved } = await resolve(symbol);
      if (isFundSymbol(resolved)) throw new ServiceError("alert.fundUnsupported");
      const r = addAlert(tracking, { symbol: resolved, ...await nameOf(resolved), type, value: Number(value) });
      if (!r.ok) throw new ServiceError(r.code);
    }
    store.save("tracking", tracking);
    return alertsView();
  }
  function screenStatus(preset) {
    const job = screens.get(preset);
    if (job === void 0) return { preset, status: "idle" };
    const { promise, ...rest } = job;
    return rest;
  }
  function startScreen(preset, { force = false, maxAgeMs = 6e5 } = {}) {
    if (PRESETS[preset] === void 0) throw new ServiceError("screen.unknown", { preset });
    const job = screens.get(preset);
    if (job?.status === "running") return screenStatus(preset);
    if (job?.status === "done" && !force && Date.now() - Date.parse(job.result.at) < maxAgeMs) return screenStatus(preset);
    const next = { preset, status: "running", done: 0, total: 0, startedAt: (/* @__PURE__ */ new Date()).toISOString() };
    screens.set(preset, next);
    const run = PRESETS[preset].kind === "fund" ? runFundScreen(preset, {
      rank: (type, sort) => cache.get(`frank:${type}:${sort}:desc:1:50`, 3e5, () => fundRank({ type, sort, order: "desc", page: 1, size: 50 })),
      fund: (code) => fund(code),
      equity: lastEquity,
      riskPct: config.riskPct,
      onProgress: (done, total) => {
        next.done = done;
        next.total = total;
      }
    }) : runScreen(preset, {
      rows: (preset2) => cache.get(
        `top:${preset2.universe}:${preset2.sortField}:${preset2.pages}`,
        3e5,
        () => topRows({ market: preset2.universe, fs: marketById.get(preset2.universe).fs, sort: preset2.sortField, pages: preset2.pages })
      ),
      bars: (secid) => bars(secid, 400, 18e5),
      equity: lastEquity,
      onProgress: (done, total) => {
        next.done = done;
        next.total = total;
      }
    });
    next.promise = run.then((result) => {
      Object.assign(next, { status: "done", result });
    }, (error) => {
      Object.assign(next, { status: "error", error: String(error?.message ?? error) });
      log.warn("选股失败", error);
    });
    return screenStatus(preset);
  }
  async function waitScreen(preset) {
    startScreen(preset);
    await screens.get(preset).promise;
    return screenStatus(preset);
  }
  async function screensFor(presets, { timeoutMs = 12e4 } = {}) {
    for (const p of presets) startScreen(p, { maxAgeMs: 2 * 36e5 });
    let timer;
    const timeout = new Promise((resolve2) => {
      timer = setTimeout(resolve2, timeoutMs);
    });
    await Promise.race([Promise.allSettled(presets.map((p) => screens.get(p).promise)), timeout]);
    clearTimeout(timer);
    return presets.map((p) => {
      const job = screens.get(p);
      return job?.status === "done" ? { ...job.result, presetLabel: p } : { preset: p, presetLabel: p, status: job?.status ?? "idle", error: job?.error, candidates: null };
    });
  }
  function finalizeNews(items) {
    const list5 = items.slice(0, 300);
    const newsTimes = list5.filter((i) => i.kind === "news" || i.kind === "flash").map((i) => i.time);
    return {
      items: list5,
      upcoming: list5.filter((i) => i.future).sort((a, b) => a.time < b.time ? -1 : 1),
      coverage: newsTimes.length ? { from: newsTimes[newsTimes.length - 1].slice(0, 10), to: newsTimes[0].slice(0, 10) } : null
    };
  }
  async function news(symbol) {
    return cache.get(`news:${symbol}`, 6e5, async () => {
      const settle = (p) => Promise.resolve(p).catch((error) => {
        log.debug("新闻源失败", error);
        return [];
      });
      if (isFundSymbol(symbol)) {
        const code2 = symbol.slice(FUND_PREFIX.length);
        const lists2 = await Promise.all([settle(fundNotices(code2))]);
        return finalizeNews(mergeItems(...lists2));
      }
      if (!isSecid(symbol)) throw new ServiceError("symbol.invalid");
      const q = await quote3(symbol).catch(() => null);
      const info = infoOf(symbol, q?.name ?? "");
      const code = symbol.split(".")[1];
      let tasks;
      if (info.kind === "index") tasks = [flash(void 0, 100)];
      else if (info.region === "cn") {
        tasks = [sinaNews(symbol), notices(code, "A"), flash(symbol)];
        if (info.kind === "stock") tasks.push(stockEvents(code));
      } else if (info.region === "hk") tasks = [sinaHkNews(code), notices(code, "H"), flash(symbol)];
      else tasks = [sinaUsNews(code), flash(symbol)];
      const lists = await Promise.all(tasks.map(settle));
      return finalizeNews(mergeItems(...lists));
    });
  }
  async function focusOf(symbol, date) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(date ?? ""))) return null;
    const [series, n] = await Promise.all([isFundSymbol(symbol) ? [] : bars(symbol).catch(() => []), news(symbol).catch(() => null)]);
    const i = series.findIndex((b) => b.date === date);
    const bar = i >= 0 ? series[i] : null;
    const prev = i > 0 ? series[i - 1].date : null;
    const prev2 = i > 1 ? series[i - 2].date : null;
    const items = n === null ? [] : itemsForBar(n.items, date, prev2 ?? prev);
    return { date, bar, prevClose: i > 0 ? series[i - 1].close : null, items };
  }
  async function contextFor(symbol, { focusDate } = {}) {
    const summary = await paperView().catch(() => null);
    if (symbol === "general") return { kind: "general", indices: await indices().catch(() => []), account: summary };
    if (symbol.startsWith("screen:")) {
      const job = screens.get(symbol.slice(7));
      if (job?.status !== "done") throw new ServiceError("screen.notReady");
      return { kind: "screen", screen: { ...job.result, presetLabel: symbol.slice(7) }, account: summary };
    }
    const [newsData, focus] = await Promise.all([news(symbol).catch(() => null), focusDate ? focusOf(symbol, focusDate).catch(() => null) : null]);
    if (isFundSymbol(symbol)) return { kind: "fund", fund: await fund(symbol.slice(FUND_PREFIX.length)), account: summary, news: newsData, focus };
    if (!isSecid(symbol)) throw new ServiceError("symbol.invalid");
    const [q, a, series] = await Promise.all([quote3(symbol), analysis(symbol), bars(symbol)]);
    const info = infoOf(symbol, q.name);
    return {
      kind: "security",
      name: q.name,
      code: q.code,
      typeLabel: `${REGION_LABEL[info.region] ?? ""}${KIND_LABEL[info.kind] ?? ""}`,
      quote: q,
      analysis: a,
      bars: series.slice(-20),
      account: summary,
      position: summary?.positions.find((p) => p.secid === symbol),
      news: newsData,
      focus
    };
  }
  const chatKey = (symbol) => `chats/${symbol.replace(/[^A-Za-z0-9.-]/g, "_")}`;
  async function chatHistory(symbol) {
    const record = await store.load(chatKey(symbol), () => ({ symbol, messages: [] }));
    const head = record.summary?.text ? [{ role: "summary", text: record.summary.text, upto: record.summary.upto, at: record.summary.at }] : [];
    return [...head, ...record.messages.slice(-200)];
  }
  const MEMORY_MAX = 60;
  const memory = await store.load("memory", () => ({ items: [] }));
  const memoryId = () => `m${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  function memoryView() {
    return memory.items;
  }
  function memoryAdd(text2, source = "manual", from = null) {
    const t = String(text2 ?? "").replace(/\s+/g, " ").trim().slice(0, 300);
    if (t === "") throw new ServiceError("memory.empty");
    if (memory.items.some((i) => i.text === t)) return memory.items;
    if (memory.items.length >= MEMORY_MAX) {
      const oldestAuto = memory.items.findIndex((i) => i.source === "auto");
      if (source !== "auto" && oldestAuto < 0) throw new ServiceError("memory.full", { max: MEMORY_MAX });
      if (oldestAuto < 0) return memory.items;
      memory.items.splice(oldestAuto, 1);
    }
    memory.items.push({ id: memoryId(), text: t, source, from, at: (/* @__PURE__ */ new Date()).toISOString() });
    store.save("memory", memory);
    return memory.items;
  }
  function memoryRemove(id) {
    memory.items = memory.items.filter((i) => i.id !== id);
    store.save("memory", memory);
    return memory.items;
  }
  function memoryAction({ action, id, text: text2 } = {}) {
    if (action === "add") return memoryAdd(text2, "manual");
    if (action === "remove") return memoryRemove(String(id ?? ""));
    if (action === "clear") {
      memory.items = [];
      store.save("memory", memory);
      return memory.items;
    }
    throw new ServiceError("memory.badAction");
  }
  function memoryText() {
    if (memory.items.length === 0) return "";
    return `# 关于用户的长期记忆（所有对话共用，回答时要记得并遵守；与当前数据冲突时以当前数据为准）

${memory.items.map((i) => `- ${i.text}`).join("\n")}`;
  }
  const REMEMBER = /记住|记一下|帮我记|请记得|以后(都|请|别|不要|只)|今后(都|请|别|不要|只)/;
  function rememberFromQuestion(q, symbol) {
    if (REMEMBER.test(q)) {
      try {
        memoryAdd(q, "said", symbol);
      } catch {
      }
    }
  }
  const compactions = /* @__PURE__ */ new Map();
  const historyBudget = () => Number(config.historyBudget) > 0 ? Number(config.historyBudget) : HISTORY_BUDGET;
  const recentKeep = () => Math.round(historyBudget() * 0.27);
  function scheduleCompaction(symbol, record) {
    const from = record.summary?.upto ?? 0;
    if (compactions.has(symbol) || historyChars(record.messages.slice(from)) <= historyBudget()) return;
    const run = (async () => {
      const cut = compactionCut(record.messages, from, recentKeep());
      if (cut <= from) return;
      const llm = getLlm();
      if (llm === void 0) return;
      const text2 = await streamAnswer(llm, {
        ...currentCall(),
        reasoning: "auto",
        system: COMPACT_SYSTEM,
        user: compactionPrompt(record.summary?.text ?? "", record.messages.slice(from, cut)),
        onDelta() {
        }
      });
      const { summary, memories } = parseCompaction(text2);
      if (summary === "") return;
      record.summary = { text: summary, upto: cut, at: (/* @__PURE__ */ new Date()).toISOString() };
      store.save(chatKey(symbol), record);
      for (const m of memories) {
        try {
          memoryAdd(m, "auto", symbol);
        } catch {
        }
      }
    })().catch((error) => log.warn("对话压缩失败", error)).finally(() => compactions.delete(symbol));
    compactions.set(symbol, run);
  }
  async function prepareAttachments(images, files, call) {
    const imgs = Array.isArray(images) ? images : [];
    const docs = Array.isArray(files) ? files : [];
    if (imgs.length > ATTACH_LIMITS.images) throw new ServiceError("ai.tooManyImages", { max: ATTACH_LIMITS.images });
    if (docs.length > ATTACH_LIMITS.files) throw new ServiceError("ai.tooManyFiles", { max: ATTACH_LIMITS.files });
    const cleanFiles = docs.map((f) => ({ name: String(f?.name ?? "文件").slice(0, 120), text: String(f?.text ?? "") }));
    if (cleanFiles.reduce((s, f) => s + Math.min(f.text.length, ATTACH_LIMITS.fileChars), 0) > ATTACH_LIMITS.totalFileChars) {
      throw new ServiceError("ai.filesTooLarge", { max: ATTACH_LIMITS.totalFileChars });
    }
    let refs = [];
    if (imgs.length > 0) {
      const decoded = imgs.map((i) => {
        const mediaType = String(i?.mediaType ?? "");
        if (!IMAGE_TYPES.has(mediaType) || typeof i?.data !== "string") throw new ServiceError("ai.badImage", { name: String(i?.name ?? "") });
        const data = Buffer.from(i.data, "base64");
        if (data.length === 0 || data.length > ATTACH_LIMITS.imageBytes) throw new ServiceError("ai.badImage", { name: String(i?.name ?? "") });
        return { data, mediaType, name: String(i?.name ?? "image").slice(0, 120) };
      });
      const llm = getLlm();
      const info = typeof llm?.resolveModelInfo === "function" ? await llm.resolveModelInfo(call.provider, call.model).catch(() => null) : null;
      if (Array.isArray(info?.inputModalities) && !info.inputModalities.includes("image")) {
        throw new ServiceError("ai.noImageModel", { model: info.name ?? call.model });
      }
      const attachments = getAttachments();
      if (attachments === void 0 || typeof attachments.saveImages !== "function") throw new ServiceError("ai.noAttachments", {}, 503);
      try {
        refs = await attachments.saveImages(decoded);
      } catch (error) {
        throw new ServiceError("ai.imageRejected", { message: String(error?.message ?? error) });
      }
    }
    const names = [
      ...imgs.map((i) => ({ kind: "image", name: String(i?.name ?? "image").slice(0, 120) })),
      ...cleanFiles.map((f) => ({ kind: "file", name: f.name }))
    ];
    const imageNote = refs.length ? `# 用户附上的图片

用户附上了 ${refs.length} 张图片（${names.filter((n) => n.kind === "image").map((n) => n.name).join("、")}），见本消息末尾。先说清楚从图里读到了什么，再结合数据回答；看不清或无法判断的地方如实说明，不要猜。` : "";
    return { refs, names, text: [imageNote, describeFiles(cleanFiles)].filter(Boolean).join("\n\n") };
  }
  async function chat({ symbol, question, focusDate, images, files }, { onDelta, onThinking, onStatus, signal }) {
    const llm = getLlm();
    if (llm === void 0) throw new ServiceError("ai.unavailable", {}, 503);
    const q = String(question ?? "").trim().slice(0, 4e3);
    if (q === "") throw new ServiceError("ai.emptyQuestion");
    const attached = await prepareAttachments(images, files, currentCall());
    const context = await contextFor(symbol, { focusDate });
    if (context.kind === "general") {
      const wanted = screensForQuestion(q);
      if (wanted.length > 0) {
        onStatus?.("screening", { presets: wanted });
        context.screens = await screensFor(wanted);
      }
    }
    await compactions.get(symbol);
    const record = await store.load(chatKey(symbol), () => ({ symbol, messages: [] }));
    rememberFromQuestion(q, symbol);
    const retrieved = knowledge.retrieve(`${q} ${context.name ?? ""}`);
    const liveText = await liveContextText().catch(() => "");
    const text2 = await streamAnswer(llm, {
      ...currentCall(),
      system: buildSystemPrompt(knowledge),
      user: buildUserMessage({
        contextText: [describeContext(context), liveText].filter(Boolean).join("\n\n"),
        question: q,
        history: foldHistory(record.messages, { summary: record.summary }),
        retrieved,
        attachmentsText: attached.text,
        memoryText: memoryText()
      }),
      images: attached.refs,
      signal,
      onDelta,
      onThinking
    });
    const at2 = (/* @__PURE__ */ new Date()).toISOString();
    record.messages.push({ role: "user", text: q, at: at2, ...attached.names.length ? { attachments: attached.names } : {} }, { role: "assistant", text: text2, at: at2, sources: retrieved.map((r) => `${r.source}·${r.title}`) });
    const excess = record.messages.length - 2e3;
    if (excess > 0 && record.summary) {
      const drop = Math.min(excess, record.summary.upto);
      record.messages.splice(0, drop);
      record.summary.upto -= drop;
    }
    store.save(chatKey(symbol), record);
    scheduleCompaction(symbol, record);
    return { text: text2, sources: retrieved.map((r) => `${r.source}·${r.title}`) };
  }
  async function chatClear(symbol) {
    await compactions.get(symbol);
    await store.remove(chatKey(symbol));
    return [];
  }
  const liveState = await store.load("live", createLive);
  let liveUrgent = 0;
  let liveCheckedAt = 0;
  async function liveSnapshot() {
    const ids = Object.keys(liveState.positions);
    const quotes4 = await quotesMap(ids).catch(() => /* @__PURE__ */ new Map());
    await Promise.all(ids.filter(isFundSymbol).map(async (id) => {
      const q = await quote3(id).catch(() => null);
      if (q?.price) quotes4.set(id, q);
    }));
    const summary = liveSummary(liveState, (id) => quotes4.get(id));
    return { summary, quotes: quotes4 };
  }
  async function fundBars(symbol) {
    const f = await fund(symbol.slice(FUND_PREFIX.length));
    return fundSeries(f.navs);
  }
  async function liveTarget(symbol) {
    const { symbol: id } = await resolve(symbol);
    if (isFundSymbol(id)) {
      const f = await fund(id.slice(FUND_PREFIX.length));
      const last = f.navs[f.navs.length - 1];
      return {
        id,
        info: { kind: "fund", region: "cn", board: "fund", feeRate: Number.parseFloat(f.feeRate) || 0, minPurchase: Number.parseFloat(f.minPurchase) || 0 },
        q: { code: f.code, name: f.name, price: last?.nav ?? null, pct: last?.pct ?? null, date: last?.date ?? null }
      };
    }
    if (!isSecid(id)) throw new ServiceError("live.notTradable");
    const q = await quote3(id);
    const info = infoOf(id, q.name);
    if (!paperTradable(info)) throw new ServiceError("live.notTradable");
    return { id, info, q };
  }
  async function upcomingEvents(secids) {
    const out = /* @__PURE__ */ new Map();
    const limit2 = beijingDate(new Date(Date.now() + 7 * 864e5));
    await Promise.all(secids.map(async (id) => {
      try {
        const n = await news(id);
        out.set(id, n.upcoming.filter((e) => e.time.slice(0, 10) <= limit2 && (e.kind === "lift" || e.kind === "report" || e.kind === "dividend")));
      } catch {
        out.set(id, []);
      }
    }));
    return out;
  }
  async function liveView({ withEvents = true } = {}) {
    const { summary } = await liveSnapshot();
    if (liveState.plan) recordLiveEquity(liveState, summary.equity);
    const ids = summary.positions.map((p) => p.secid);
    const [levels, events] = await Promise.all([levelsOf(ids), withEvents ? upcomingEvents(ids) : /* @__PURE__ */ new Map()]);
    const stats = liveStats(liveState);
    const todos = computeTodos(liveState, { summary, levelsOf: (id) => levels.get(id), eventsOf: (id) => events.get(id) ?? [], stats });
    liveUrgent = todos.filter((t) => t.priority <= 2).length;
    liveCheckedAt = Date.now();
    store.save("live", liveState);
    return {
      profile: liveState.profile,
      plan: liveState.plan,
      summary,
      todos,
      stats,
      trades: liveState.trades.slice(0, 200),
      fills: liveState.fills.slice(0, 100),
      lessons: liveState.lessons,
      equityHistory: liveState.equityHistory.slice(-500),
      mistakes: MISTAKES,
      signals: SIGNALS,
      exitReasons: EXIT_REASONS
    };
  }
  function livePlanPreview(profile) {
    return capitalPlan(profile ?? {});
  }
  async function liveAdopt({ profile, overrides = {} }) {
    const plan = capitalPlan(profile ?? {});
    if (overrides.startCapital !== void 0) plan.startCapital = Math.max(0, Math.round(Number(overrides.startCapital) || 0));
    if (overrides.riskPerTrade !== void 0) {
      const r = Number(overrides.riskPerTrade);
      if (!(r > 0 && r <= 0.02)) throw new ServiceError("live.badRisk");
      plan.riskPerTrade = r;
    }
    if (!(plan.startCapital > 0)) throw new ServiceError("live.notReady");
    adoptPlan(liveState, profile, plan);
    store.save("live", liveState);
    return liveView();
  }
  async function liveCapital(amount) {
    const r = moveCapital(liveState, amount);
    if (!r.ok) throw new ServiceError(r.code);
    store.save("live", liveState);
    return liveView();
  }
  async function livePlanTrade(symbol) {
    const { id: secid, info, q } = await liveTarget(symbol);
    const isFund = info.kind === "fund";
    const plan = liveState.plan;
    const { summary } = await liveSnapshot();
    const a = isFund ? analyzeBars(await fundBars(secid), { lot: { min: 1, step: 1 } }) : await analysis(secid);
    const checks = [];
    const add = (key, level, params = {}) => checks.push({ key, level, params });
    if (!plan) add("noPlan", "block");
    const n = a.turtle?.plan?.n ?? null;
    const entry = q.price;
    const stop = n ? round(entry - stopMultiple(isFund) * n, isFund ? 4 : 3) : null;
    let qty = 0;
    let amount = null;
    if (isFund) add("fundNav", "info", { date: q.date ?? "—" });
    if (isFund && n) add("fundStop", "info");
    if (plan && n && entry > stop && isFund) {
      const reduce = summary.drawdown <= -plan.reduceAt * 100 ? 0.8 : 1;
      amount = niceFloor(summary.equity * plan.riskPerTrade / (entry - stop) * entry * reduce);
      const affordable = niceFloor(summary.cash / (1 + info.feeRate / 100));
      if (amount > affordable) {
        amount = affordable;
        add("cash", "warn");
      }
      if (amount < Math.max(info.minPurchase, 1)) amount = 0;
      qty = amount > 0 ? round(amount / entry, 2) : 0;
      if (reduce < 1) add("reduced", "warn", { drawdown: summary.drawdown });
      if (info.feeRate > 0) add("fundFee", "info", { rate: info.feeRate });
    } else if (plan && n && entry > stop) {
      const lot = buyLotRule(info);
      const raw = summary.equity * plan.riskPerTrade / (entry - stop);
      const reduce = summary.drawdown <= -plan.reduceAt * 100 ? 0.8 : 1;
      qty = lot.step > 1 ? Math.floor(raw * reduce / lot.step) * lot.step : Math.floor(raw * reduce);
      if (qty < lot.min) qty = 0;
      const affordable = Math.floor(summary.cash / (entry * 1.001) / lot.step) * lot.step;
      if (qty > affordable) {
        qty = affordable >= lot.min ? affordable : 0;
        add("cash", "warn");
      }
      if (reduce < 1) add("reduced", "warn", { drawdown: summary.drawdown });
    }
    if (!isFund && qty > 0) {
      const value = qty * entry;
      const roundTrip = feesFor("buy", value, info).total + feesFor("sell", value, info).total;
      const feePct = round(roundTrip / value * 100, 2);
      if (feePct >= 1) add("feeHeavy", "warn", { pct: feePct });
    }
    if (!n) add("noN", "block");
    if (plan && summary.drawdown <= -plan.pauseAt * 100) add("paused", "block", { drawdown: summary.drawdown });
    if (a.turtle?.trendFilter === "up") add("trendUp", "ok");
    else add("trendDown", "warn");
    const s1 = a.turtle?.system1?.state;
    const s2 = a.turtle?.system2?.state;
    if (s2 === "breakout" || s1 === "breakout") add("breakoutToday", "ok");
    else if (s2 === "long" || s1 === "long") add("inTrend", "ok");
    else add("noSignal", "warn");
    const riskAmount = stop ? round(qty * (entry - stop), 2) : 0;
    const openRiskAfter = summary.equity > 0 ? round((summary.openRiskPct / 100 * summary.equity + riskAmount) / summary.equity * 100, 2) : 0;
    if (plan && openRiskAfter > plan.maxOpenRisk * 100) add("openRisk", "block", { after: openRiskAfter, limit: plan.maxOpenRisk * 100 });
    else if (plan) add("openRiskOk", "ok", { after: openRiskAfter, limit: plan.maxOpenRisk * 100 });
    if (plan && !liveState.positions[secid] && summary.positions.length >= plan.maxPositions) add("maxPositions", "block", { max: plan.maxPositions });
    if (!isFund && q.pct !== null && q.limitUp && entry >= q.limitUp) add("limitUp", "block");
    else if (!isFund && q.pct !== null && q.pct >= 7) add("bigMove", "warn", { pct: q.pct });
    const ev = isFund ? [] : (await upcomingEvents([secid])).get(secid) ?? [];
    for (const e of ev) add("event", "warn", { date: e.time.slice(0, 10), title: e.title });
    if (qty === 0 && plan && n) add("tooSmall", "block");
    const verdict = checks.some((c) => c.level === "block") ? "block" : checks.some((c) => c.level === "warn") ? "warn" : "ok";
    return {
      secid,
      code: q.code,
      name: q.name,
      fund: isFund,
      navDate: isFund ? q.date : null,
      price: entry,
      n,
      stop,
      qty,
      amount,
      riskAmount,
      riskPct: summary.equity > 0 ? round(riskAmount / summary.equity * 100, 2) : 0,
      positionPct: summary.equity > 0 ? round(qty * entry / summary.equity * 100, 2) : 0,
      checks,
      verdict,
      holding: liveState.positions[secid] !== void 0
    };
  }
  async function liveRecord(fill3) {
    const { id: secid, info, q } = await liveTarget(fill3.symbol);
    let n = fill3.n;
    if (fill3.side === "buy" && !(Number(n) > 0)) {
      const a = info.kind === "fund" ? await fundBars(secid).then((b) => analyzeBars(b), () => null) : await analysis(secid).catch(() => null);
      n = a?.turtle?.plan?.n;
    }
    const r = recordFill(liveState, { ...fill3, secid, code: q?.code ?? secid.split(".")[1], name: q?.name ?? secid, n }, info);
    if (!r.ok) throw new ServiceError(r.code, r.params ?? {});
    store.save("live", liveState);
    return { trade: r.trade, warnings: r.warnings, live: await liveView() };
  }
  async function liveSetStop(symbol, stop) {
    const r = setStop2(liveState, symbol, stop);
    if (!r.ok) throw new ServiceError(r.code);
    store.save("live", liveState);
    return liveView();
  }
  async function liveUpdateTrade(id, patchFields) {
    const r = updateTrade(liveState, id, patchFields ?? {});
    if (!r.ok) throw new ServiceError(r.code);
    store.save("live", liveState);
    return liveView();
  }
  async function liveTodo(id, action) {
    setTodo(liveState, String(id), action);
    if (String(id).startsWith("scaleUp:") && action === "done" && liveState.plan) liveState.plan.stage = "normal";
    store.save("live", liveState);
    return liveView();
  }
  async function liveReset() {
    const archive = `live-archive/${(/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-")}`;
    store.save(archive, liveState);
    Object.assign(liveState, createLive());
    store.save("live", liveState);
    return liveView();
  }
  async function liveContextText() {
    if (!liveState.plan) return liveForAi(liveState, null, null);
    const { summary } = await liveSnapshot();
    const text2 = liveForAi(liveState, summary, liveStats(liveState));
    const lessons = liveState.lessons?.text ? `

## 用户的个人交易规则（来自实盘复盘，回答时要遵守并引用）
${liveState.lessons.text.slice(0, 3500)}` : "";
    return text2 + lessons;
  }
  async function liveReview({ onDelta, onThinking, signal }) {
    const llm = getLlm();
    if (llm === void 0) throw new ServiceError("ai.unavailable", {}, 503);
    if (!liveState.plan) throw new ServiceError("live.noPlan");
    const stats = liveStats(liveState);
    if (stats.n === 0) throw new ServiceError("live.noClosed");
    const { summary } = await liveSnapshot();
    const data = liveForAi(liveState, summary, stats);
    const previous = liveState.lessons?.text ? `

# 之前的个人交易规则
${liveState.lessons.text}` : "";
    const question = `请根据我的实盘记录做一次复盘，并更新我的个人交易规则。严格按下面三节输出：
## 本期复盘
（用数据说话：期望值、胜率、盈亏比、最伤钱的失误和信号，按计划与没按计划的差别）
## 个人交易规则
（更新后的完整版，5～10 条。每条写成可执行的规则，${TEXT.reviewBasis}。保留仍然有效的旧规则，删除被数据否定的）
## 下阶段建议
（资金规模：维持、加大、减小还是暂停，以及理由；下一阶段重点练习什么）`;
    const retrieved = knowledge.retrieve(`复盘 期望值 止损 头寸 ${stats.byMistake ? Object.keys(stats.byMistake).join(" ") : ""}`);
    const text2 = await streamAnswer(llm, {
      ...currentCall(),
      system: buildSystemPrompt(knowledge),
      user: buildUserMessage({ contextText: data + previous, question, history: "", retrieved, memoryText: memoryText() }),
      signal,
      onDelta,
      onThinking
    });
    liveState.lessons = { text: text2, at: (/* @__PURE__ */ new Date()).toISOString(), basedOn: closedTrades(liveState).length };
    store.save("live", liveState);
    return { text: text2, sources: retrieved.map((r) => `${r.source}·${r.title}`) };
  }
  function knowledgeSearch(query) {
    return knowledge.retrieve(String(query ?? ""), { k: 5, budget: 9e3 });
  }
  const aiSettings = await store.load("ai-settings", () => ({ provider: null, model: null, reasoning: null }));
  const defaultModel = () => ({ provider: config.provider, model: config.model, reasoning: config.reasoning ?? "auto" });
  function currentModel() {
    const d = defaultModel();
    const custom = aiSettings.provider !== null && aiSettings.model !== null;
    return {
      provider: custom ? aiSettings.provider : d.provider,
      model: custom ? aiSettings.model : d.model,
      reasoning: custom ? aiSettings.reasoning ?? "auto" : d.reasoning,
      custom,
      defaults: d
    };
  }
  const currentCall = () => {
    const m = currentModel();
    return { provider: m.provider, model: m.model, maxTokens: config.maxTokens, reasoning: m.reasoning };
  };
  const within = (promise, ms) => Promise.race([promise, new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), ms))]);
  let modelsCache = null;
  async function aiModels({ refresh = false } = {}) {
    const llm = getLlm();
    if (llm === void 0) throw new ServiceError("ai.unavailable", {}, 503);
    if (!refresh && modelsCache && Date.now() - modelsCache.at < 6e5) return { ...modelsCache.data, current: currentModel() };
    const providers = typeof llm.listProviders === "function" ? llm.listProviders() : [];
    const groups = await Promise.all(providers.map(async (p) => {
      let list5 = [];
      try {
        list5 = typeof llm.listModels === "function" ? await within(llm.listModels(p.id), 8e3) : [];
      } catch (error) {
        log.debug(`读取 ${p.id} 的模型列表失败`, error);
        return [];
      }
      const infos = await Promise.all(list5.map((m) => typeof llm.resolveModelInfo === "function" ? within(llm.resolveModelInfo(p.id, m.id), 8e3).catch(() => null) : null));
      return list5.map((m, i) => ({
        provider: p.id,
        providerName: p.name,
        id: m.id,
        name: m.name,
        description: m.description ?? null,
        images: (() => {
          const mods = infos[i]?.inputModalities ?? m.inputModalities;
          return Array.isArray(mods) ? mods.includes("image") : null;
        })(),
        efforts: (infos[i]?.reasoning?.efforts ?? []).map((e) => ({ id: e.id, name: e.name, description: e.description ?? null })),
        defaultEffort: infos[i]?.reasoning?.defaultEffort ?? null
      }));
    }));
    const data = { providers: providers.map((p) => ({ id: p.id, name: p.name })), models: groups.flat() };
    modelsCache = { at: Date.now(), data };
    return { ...data, current: currentModel() };
  }
  async function setAiModel({ provider, model, reasoning, reset } = {}) {
    if (reset) {
      Object.assign(aiSettings, { provider: null, model: null, reasoning: null });
    } else {
      if (typeof provider !== "string" || typeof model !== "string" || provider === "" || model === "") throw new ServiceError("ai.badModel", { model: String(model ?? "") });
      const effort = reasoning === void 0 || reasoning === null || reasoning === "" ? "auto" : String(reasoning);
      const llm = getLlm();
      if (llm && typeof llm.listProviders === "function" && !llm.listProviders().some((p) => p.id === provider)) {
        throw new ServiceError("ai.badModel", { model: `${provider}/${model}` });
      }
      if (effort !== "auto" && llm && typeof llm.resolveModelInfo === "function") {
        const info = await within(llm.resolveModelInfo(provider, model), 8e3).catch(() => null);
        const ids = info?.reasoning?.efforts?.map((e) => e.id);
        if (ids && !ids.includes(effort)) throw new ServiceError("ai.badReasoning", { reasoning: effort });
      }
      Object.assign(aiSettings, { provider, model, reasoning: effort });
    }
    store.save("ai-settings", aiSettings);
    return currentModel();
  }
  let updateState = { latest: null, checkedAt: 0, at: null };
  let updatePending = null;
  function updateInfo() {
    if (!UPDATE_INDEX_URL) return null;
    const age = Date.now() - updateState.checkedAt;
    if (updatePending === null && age > (updateState.latest ? 6 : 1) * 36e5) {
      updatePending = fetchJson(UPDATE_INDEX_URL, { timeoutMs: 15e3 }).then((index) => {
        const entry = (index?.plugins ?? []).find((p) => p.name === PACKAGE_NAME);
        const versions = (entry?.versions ?? []).map((v) => v.version).filter(Boolean);
        const latest = latestVersion(versions);
        const at2 = entry?.versions?.find((v) => v.version === latest)?.publishTimestamp ?? null;
        updateState = { latest, checkedAt: Date.now(), at: at2 };
      }, (error) => {
        log.debug("检查新版本失败", error);
        updateState = { ...updateState, checkedAt: Date.now() };
      }).finally(() => {
        updatePending = null;
      });
    }
    return { latest: updateState.latest, publishedAt: updateState.at, indexUrl: UPDATE_INDEX_URL };
  }
  const levelCache = /* @__PURE__ */ new Map();
  async function levelsOf(symbols) {
    const out = /* @__PURE__ */ new Map();
    await Promise.all(symbols.map(async (s) => {
      const hit = levelCache.get(s);
      if (hit && hit.date === beijingDate()) {
        out.set(s, hit.levels);
        return;
      }
      try {
        const series = isFundSymbol(s) ? await fundBars(s) : await bars(s, 80, 18e5);
        const i = series.length - 1;
        const levels = {
          high20: donchian(series, 20).upper[i],
          low20: donchian(series, 20).lower[i],
          high55: donchian(series, 55).upper[i],
          low10: donchian(series, 10).lower[i],
          n: turtleN(series)[i]
        };
        levelCache.set(s, { date: beijingDate(), levels });
        out.set(s, levels);
      } catch {
      }
    }));
    return out;
  }
  async function tick() {
    const anyOpen = ["cn", "hk", "us"].some((r) => isMarketOpen(r));
    const pending = account.orders.some((o) => o.status === "pending");
    const livePositions = Object.keys(liveState.positions).length > 0;
    if (livePositions && (isMarketOpen("cn") || Date.now() - liveCheckedAt > 30 * 6e4)) {
      await liveView({ withEvents: false }).catch((error) => log.debug("实盘待办计算失败", error));
    }
    if (!anyOpen && !pending) return;
    const active = tracking.alerts.filter((a) => a.active);
    const summary = await paperView();
    const quotes4 = await quotesMap([...active.map((a) => a.symbol), ...summary.positions.map((p) => p.secid)]);
    const breakoutSymbols = active.filter((a) => /^break/.test(a.type)).map((a) => a.symbol);
    const levels = await levelsOf([...new Set(breakoutSymbols)]);
    const fired = [
      ...checkAlerts(tracking, (s) => quotes4.get(s), (s) => levels.get(s)),
      ...checkStops(tracking, summary.positions, (s) => quotes4.get(s), beijingDate())
    ];
    if (fired.length > 0) store.save("tracking", tracking);
  }
  return {
    markets: () => MARKETS.map(({ id, region, source }) => ({ id, region, source: source ?? "quote" })),
    presets: () => Object.keys(PRESETS),
    resolve,
    search: search4,
    list: list4,
    indices,
    quote: quote3,
    kline: kline5,
    trends: trends3,
    analysis,
    fund,
    news,
    focusOf,
    paper: paperView,
    placeOrder: placeOrder2,
    cancelOrder: cancelOrder2,
    resetPaper,
    setStop: setStop3,
    watchlist: watchlistView,
    watch,
    alerts: alertsView,
    alert,
    screenStatus,
    startScreen,
    waitScreen,
    contextFor,
    chat,
    chatHistory,
    chatClear,
    memory: memoryView,
    memoryAction,
    tick,
    live: liveView,
    livePlanPreview,
    liveAdopt,
    liveCapital,
    livePlanTrade,
    liveRecord,
    liveSetStop,
    liveUpdateTrade,
    liveTodo,
    liveReset,
    liveReview,
    liveContextText,
    knowledgeSearch,
    updateInfo,
    modelInfo: currentModel,
    aiModels,
    setAiModel,
    knowledgeInfo: () => ({ dir: knowledge.dir, sections: knowledge.sections, liteChars: knowledge.lite.length }),
    sourceStatus: () => status(),
    aiReady: () => getLlm() !== void 0
  };
}

// src/host/routes.js
var API_PATH = "/stock-market/api";
var VERSION = true ? "0.8.0" : "dev";
var MAX_BODY = 256 * 1024;
var MAX_CHAT_BODY = 24 * 1024 * 1024;
function sendJson(res, status2, body) {
  res.statusCode = status2;
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.setHeader("cache-control", "no-store");
  res.end(JSON.stringify(body));
}
function sendError(res, error, log) {
  if (error instanceof ServiceError) {
    sendJson(res, error.status, { error: { code: error.code, params: error.params } });
    return;
  }
  log.warn("请求失败", error);
  sendJson(res, 502, { error: { code: "upstream", params: { message: String(error?.message ?? error) } } });
}
function readJson(req, max = MAX_BODY) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > max) {
        reject(new ServiceError("request.tooLarge", {}, 413));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      if (chunks.length === 0) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
      } catch {
        reject(new ServiceError("request.badJson"));
      }
    });
    req.on("error", reject);
  });
}
async function streamSse(res, run, log) {
  res.writeHead(200, {
    "content-type": "text/event-stream; charset=utf-8",
    "cache-control": "no-cache, no-transform",
    "x-accel-buffering": "no"
  });
  const controller = new AbortController();
  res.on("close", () => {
    if (!res.writableEnded) controller.abort();
  });
  const send = (event) => {
    if (!res.writableEnded) res.write(`data: ${JSON.stringify(event)}

`);
  };
  const ping = setInterval(() => {
    if (!res.writableEnded) res.write(": ping\n\n");
  }, 15e3);
  let thinkingSent = false;
  try {
    send({ type: "start" });
    const result = await run({
      signal: controller.signal,
      onDelta: (text2) => send({ type: "delta", text: text2 }),
      onThinking: () => {
        if (!thinkingSent) {
          thinkingSent = true;
          send({ type: "thinking" });
        }
      },
      onStatus: (key, params) => send({ type: "status", key, params })
    });
    send({ type: "done", sources: result.sources });
  } catch (error) {
    if (!controller.signal.aborted) {
      if (!(error instanceof ServiceError)) log.warn("AI 对话失败", error);
      send({ type: "error", code: error instanceof ServiceError ? error.code : "ai.failed", message: String(error?.message ?? error) });
    }
  } finally {
    clearInterval(ping);
    res.end();
  }
}
function registerRoutes(ctx, ready, log) {
  const handler = async (req, res) => {
    const rejection = ctx.connection.requestRejection(req);
    if (rejection !== void 0) {
      res.statusCode = rejection;
      res.end();
      return;
    }
    const url = new URL(String(req.url), "http://localhost");
    const route = url.pathname.slice(API_PATH.length).replace(/^\/+/, "");
    const q = Object.fromEntries(url.searchParams);
    try {
      const service = await ready;
      if (req.method === "GET") {
        switch (route) {
          case "meta":
            return sendJson(res, 200, {
              version: VERSION,
              markets: service.markets(),
              presets: service.presets(),
              ai: service.aiReady(),
              knowledge: service.knowledgeInfo(),
              update: service.updateInfo(),
              model: service.modelInfo()
            });
          case "indices":
            return sendJson(res, 200, await service.indices());
          case "list":
            return sendJson(res, 200, await service.list(q));
          case "search":
            return sendJson(res, 200, await service.search(q.q));
          case "quote":
            return sendJson(res, 200, await service.quote(q.symbol));
          case "kline":
            return sendJson(res, 200, await service.kline(q.symbol, q));
          case "trends":
            return sendJson(res, 200, await service.trends(q.symbol));
          case "analysis":
            return sendJson(res, 200, await service.analysis(q.symbol));
          case "fund":
            return sendJson(res, 200, await service.fund(q.code));
          case "news":
            return sendJson(res, 200, await service.news(q.symbol));
          case "watchlist":
            return sendJson(res, 200, await service.watchlist());
          case "alerts":
            return sendJson(res, 200, service.alerts());
          case "paper":
            return sendJson(res, 200, await service.paper());
          case "screen":
            return sendJson(res, 200, service.screenStatus(q.preset));
          case "chat/history":
            return sendJson(res, 200, await service.chatHistory(q.symbol));
          case "memory":
            return sendJson(res, 200, service.memory());
          case "ai/models":
            return sendJson(res, 200, await service.aiModels({ refresh: q.refresh === "1" }));
          case "live":
            return sendJson(res, 200, await service.live());
          case "live/plan-trade":
            return sendJson(res, 200, await service.livePlanTrade(q.symbol));
          default:
            return sendJson(res, 404, { error: { code: "route.notFound", params: { route } } });
        }
      }
      if (req.method === "POST") {
        const body = await readJson(req, route === "chat" ? MAX_CHAT_BODY : MAX_BODY);
        switch (route) {
          case "watchlist":
            return sendJson(res, 200, await service.watch(body));
          case "alerts":
            return sendJson(res, 200, await service.alert(body));
          case "paper/order":
            return sendJson(res, 200, await service.placeOrder(body));
          case "paper/cancel":
            return sendJson(res, 200, await service.cancelOrder(body.orderId));
          case "paper/reset":
            return sendJson(res, 200, await service.resetPaper(body.cash));
          case "paper/stop":
            return sendJson(res, 200, await service.setStop(body.symbol, body.stop));
          case "screen":
            return sendJson(res, 200, service.startScreen(body.preset, { force: body.force === true }));
          case "chat":
            return streamSse(res, (opts) => service.chat(body, opts), log);
          case "memory":
            return sendJson(res, 200, service.memoryAction(body));
          case "ai/model":
            return sendJson(res, 200, await service.setAiModel(body));
          case "live/preview":
            return sendJson(res, 200, service.livePlanPreview(body.profile));
          case "live/adopt":
            return sendJson(res, 200, await service.liveAdopt(body));
          case "live/capital":
            return sendJson(res, 200, await service.liveCapital(body.amount));
          case "live/fill":
            return sendJson(res, 200, await service.liveRecord(body));
          case "live/stop":
            return sendJson(res, 200, await service.liveSetStop(body.symbol, body.stop));
          case "live/trade":
            return sendJson(res, 200, await service.liveUpdateTrade(body.id, body));
          case "live/todo":
            return sendJson(res, 200, await service.liveTodo(body.id, body.action));
          case "live/reset":
            return sendJson(res, 200, await service.liveReset());
          case "live/review":
            return streamSse(res, (opts) => service.liveReview(opts), log);
          case "chat/clear":
            return sendJson(res, 200, await service.chatClear(body.symbol));
          default:
            return sendJson(res, 404, { error: { code: "route.notFound", params: { route } } });
        }
      }
      res.setHeader("allow", "GET, POST");
      return sendJson(res, 405, { error: { code: "route.method" } });
    } catch (error) {
      if (!res.headersSent) sendError(res, error, log);
      else res.end();
    }
  };
  ctx.effect(() => ctx.webServer.register({ kind: "prefix", path: API_PATH, handler }), `stock-market: ${API_PATH}`);
}

// src/host/tools.js
function toJsonSchema(spec) {
  const { required: _required, items, ...rest } = spec;
  return items === void 0 ? rest : { ...rest, items: toJsonSchema(items) };
}
function shimDefineTool(options) {
  const properties = {};
  const required = [];
  for (const [key, spec] of Object.entries(options.parameters)) {
    properties[key] = toJsonSchema(spec);
    if (spec.required) required.push(key);
  }
  return {
    name: options.name,
    description: options.description,
    parameters: { type: "object", properties, required, additionalProperties: false },
    output: { schema: { type: "string" }, render: (args, value) => options.output.render(args, value) },
    ...options.deferLoading ? { deferLoading: true } : {},
    ...options.timeoutMs ? { timeoutMs: options.timeoutMs } : {},
    async execute(args, exec) {
      for (const key of required) {
        if (args?.[key] === void 0) throw new Error(`缺少参数 ${key}`);
      }
      return options.execute(args ?? {}, exec);
    }
  };
}
var json = (value) => JSON.stringify(value);
var text = { schema: { type: "string" }, render: (_args, value) => [{ type: "text", text: value }] };
function compactBars(bars, limit2) {
  return bars.slice(-limit2).map((b) => [b.date, b.open, b.high, b.low, b.close, b.pct, Math.round(b.amount / 1e4)]);
}
function toolSpecs(service) {
  return [
    {
      name: "market_search",
      description: '在"市场"插件中搜索证券：A股、场内基金、指数、港股、美股、场外基金。返回 symbol，供其他 market_* 工具使用。',
      parameters: { query: { type: "string", required: true, description: "代码、名称或拼音，如 600519、茅台、AAPL、00700、易方达蓝筹" } },
      async execute({ query }) {
        return json(await service.search(query));
      }
    },
    {
      name: "market_quote",
      description: "查询实时行情。symbols 可以是代码、名称、secid（如 1.600519）或场外基金（fund:005827）。",
      parameters: { symbols: { type: "array", items: { type: "string" }, required: true, description: "1 到 20 个证券" } },
      async execute({ symbols }) {
        const out = [];
        for (const s of (symbols ?? []).slice(0, 20)) {
          try {
            const { symbol } = await service.resolve(s);
            const q = await service.quote(symbol);
            out.push({ symbol, code: q.code, name: q.name, price: q.price, pct: q.pct, high: q.high, low: q.low, amount: q.amount, turnover: q.turnover, pe: q.pe, date: q.date });
          } catch (error) {
            out.push({ query: s, error: error.code ?? String(error.message ?? error) });
          }
        }
        return json(out);
      }
    },
    {
      name: "market_analysis",
      description: "对一只证券做完整的量化分析并附用户模拟盘信息：海龟系统1/2状态、50/300日均线趋势过滤、N 与 2N 止损、1% 风险头寸单位、动量与波动、历史波动率价格区间、该证券历史上同类突破信号的统计。场外基金给出净值趋势、收益、回撤与持仓。" + TEXT.toolAnalysisTail,
      parameters: { symbol: { type: "string", required: true, description: "代码、名称、secid 或 fund:代码" } },
      async execute({ symbol }) {
        const { symbol: resolved } = await service.resolve(symbol);
        return describeContext(await service.contextFor(resolved));
      }
    },
    {
      name: "market_kline",
      description: "获取 K 线。每行为 [日期, 开, 高, 低, 收, 涨跌幅%, 成交额(万元)]。",
      parameters: {
        symbol: { type: "string", required: true },
        period: { type: "string", enum: ["day", "week", "month", "m60", "m30", "m15", "m5"], description: "默认 day" },
        limit: { type: "integer", description: "根数，默认 60，最多 250" }
      },
      async execute({ symbol, period = "day", limit: limit2 = 60 }) {
        const { symbol: resolved } = await service.resolve(symbol);
        const k = await service.kline(resolved, { period, limit: Math.min(Number(limit2) || 60, 250) });
        return json({ symbol: resolved, name: k.name, period, bars: compactBars(k.bars, 250) });
      }
    },
    {
      name: "market_news",
      description: "获取一只证券或基金的近期新闻、公告与事件（龙虎榜、分红送转、限售解禁、业绩预告含变动原因、财报披露、股东增减持、关联快讯），以及即将发生的事件。传 date（YYYY-MM-DD）时只返回该交易日前后的消息与当天行情，用于解释某天为什么涨跌。每条带原文链接。",
      parameters: {
        symbol: { type: "string", required: true, description: "代码、名称、secid 或 fund:代码" },
        date: { type: "string", description: "可选，YYYY-MM-DD" }
      },
      async execute({ symbol, date }) {
        const { symbol: resolved } = await service.resolve(symbol);
        if (date) return json(await service.focusOf(resolved, date));
        const n = await service.news(resolved);
        return json({ coverage: n.coverage, upcoming: n.upcoming.slice(0, 10), items: n.items.filter((i) => !i.future).slice(0, 30) });
      }
    },
    {
      name: "market_live",
      description: '只读查看用户在"市场"插件里记录的实盘（A股、场内基金、场外基金）。为保护隐私只返回比例、R 倍数和价格，不含金额与股数。action=summary 账户与持仓概况、个人交易规则与统计；todos 当前待办（止损、离场、加仓、上移止损、回撤、复盘）；plan 某只证券的买入计划单（按单笔风险算出的仓位占比、2N 止损、逐项检查）。插件不会替用户下单。',
      parameters: {
        action: { type: "string", enum: ["summary", "todos", "plan"], required: true },
        symbol: { type: "string", description: "action=plan 时必填" }
      },
      async execute({ action, symbol }) {
        if (action === "summary") return await service.liveContextText() || "用户还没有制定实盘资金计划。";
        if (action === "todos") {
          const v = await service.live();
          return json(v.todos.map(({ qty: qty2, amount: amount2, ...rest }) => rest));
        }
        if (symbol === void 0) throw new Error("action=plan 需要 symbol");
        const p = await service.livePlanTrade(symbol);
        const { qty, riskAmount, amount, ...safe } = p;
        return json(safe);
      }
    },
    {
      name: "trading_knowledge_search",
      description: TEXT.toolKnowledge,
      parameters: { query: { type: "string", required: true, description: '问题或关键词，如"海龟加仓规则"、"期望值怎么算"、"止损放在哪里"' } },
      async execute({ query }) {
        const hits = service.knowledgeSearch(query);
        if (hits.length === 0) return "知识库里没有找到相关章节。";
        return hits.map((h) => `## 〔${h.source}〕${h.title}
${h.text}`).join("\n\n");
      }
    },
    {
      name: "market_screen",
      description: '运行规则选股并返回候选清单（含入选理由、止损、头寸单位）。preset：turtle55 海龟55日突破；turtle20 海龟20日突破；strong 强势趋势（择强汰弱）；etfTrend ETF 趋势；fundTrend 场外基金趋势（指数/股票/混合型排行前列，按净值跑趋势规则，3N 止损，给出申购金额）。用户问"有哪些基金/股票适合买"时先调用它。耗时约 10–60 秒。',
      parameters: { preset: { type: "string", enum: ["turtle55", "turtle20", "strong", "etfTrend", "fundTrend"], required: true } },
      timeoutMs: 18e4,
      async execute({ preset }) {
        const status2 = await service.waitScreen(preset);
        if (status2.status !== "done") return json(status2);
        return describeContext(await service.contextFor(`screen:${preset}`));
      }
    },
    {
      name: "market_watchlist",
      description: '查看或修改用户在"市场"插件中的自选列表。',
      parameters: {
        action: { type: "string", enum: ["list", "add", "remove"], required: true },
        symbol: { type: "string", description: "add/remove 时必填" }
      },
      async execute({ action, symbol }) {
        if (action === "list") return json(await service.watchlist());
        if (symbol === void 0) throw new Error("add/remove 需要 symbol");
        return json(await service.watch({ action, symbol }));
      }
    },
    {
      name: "market_paper",
      description: '查看或操作用户在"市场"插件中的模拟盘（A股与场内基金，T+1、100股一手、含手续费）。action=summary 查看账户；order 下单；cancel 撤单。下单前应先告诉用户你打算做什么。',
      parameters: {
        action: { type: "string", enum: ["summary", "order", "cancel"], required: true },
        symbol: { type: "string" },
        side: { type: "string", enum: ["buy", "sell"] },
        qty: { type: "integer", description: "股数" },
        type: { type: "string", enum: ["market", "limit"], description: "默认 market" },
        price: { type: "number", description: "限价单价格" },
        stop: { type: "number", description: "可选：为持仓设置止损位" },
        orderId: { type: "string", description: "cancel 时必填" }
      },
      async execute(args) {
        if (args.action === "summary") {
          const s = await service.paper();
          return json({ ...s, orders: s.orders.slice(0, 20), trades: s.trades.slice(0, 20), equityHistory: s.equityHistory.slice(-30) });
        }
        if (args.action === "cancel") return json(await service.cancelOrder(args.orderId));
        const r = await service.placeOrder(args);
        return json({ order: r.order, cash: r.account.cash, equity: r.account.equity });
      }
    }
  ];
}
async function registerTools(ctx, ready, log) {
  let defineTool = shimDefineTool;
  try {
    const mod = await import("@deepseek-ai/dsh-tools");
    if (typeof mod.defineTool === "function") defineTool = mod.defineTool;
  } catch {
  }
  const service = await ready;
  for (const spec of toolSpecs(service)) {
    const { execute, ...rest } = spec;
    const options = {
      ...rest,
      deferLoading: true,
      output: text,
      async execute(args) {
        try {
          return await execute(args);
        } catch (error) {
          return `错误：${error.code ?? ""} ${error.message ?? error}`.trim();
        }
      }
    };
    let tool;
    try {
      tool = defineTool(options);
    } catch (error) {
      if (defineTool === shimDefineTool) throw error;
      tool = shimDefineTool(options);
    }
    try {
      ctx.effect(() => ctx.tools.register(tool), `stock-market: tool ${spec.name}`);
    } catch (error) {
      log.warn(`注册工具 ${spec.name} 失败`, error);
    }
  }
}

// src/host/index.js
var name = "stock-market";
var inject = ["webServer", "connection"];
var DEFAULTS = {
  initialCash: 1e6,
  riskPct: 0.01,
  provider: "deepseek-account",
  model: "deepseek-flash",
  maxTokens: null,
  // 不限制：用 DSH 给模型的默认输出上限
  reasoning: "auto",
  tickSeconds: 20,
  fees: {}
};
function makeLog(ctx) {
  let base;
  try {
    base = typeof ctx.logger === "function" ? ctx.logger("stock-market") : ctx.logger;
  } catch {
    base = void 0;
  }
  const pick = (level) => (...args) => {
    const fn = base?.[level];
    if (typeof fn === "function") fn.call(base, ...args);
    else console[level === "debug" ? "log" : level]?.("[stock-market]", ...args);
  };
  return { info: pick("info"), warn: pick("warn"), debug: pick("debug") };
}
function apply(ctx, config = {}) {
  const log = makeLog(ctx);
  const dshHome = process.env.DSH_HOME || join3(homedir(), ".dsh");
  const cfg = { ...DEFAULTS, dataDir: join3(dshHome, "plugin-data", "stock-market"), ...config };
  const pluginDir = dirname2(fileURLToPath(import.meta.url));
  let llm;
  ctx.inject(["llm"], (sub) => {
    llm = sub.llm;
    sub.effect(() => () => {
      if (llm === sub.llm) llm = void 0;
    }, "stock-market: llm");
  });
  let attachments;
  ctx.inject(["attachments"], (sub) => {
    attachments = sub.attachments;
    sub.effect(() => () => {
      if (attachments === sub.attachments) attachments = void 0;
    }, "stock-market: attachments");
  });
  const store = createStore(cfg.dataDir);
  const ready = (async () => {
    const knowledge = await loadKnowledge(knowledgeDirs({ configured: cfg.knowledgeDir, dshHome, home: homedir(), pluginDir, join: join3 }), KB_LAYOUT);
    if (knowledge.dir === null) log.warn(TEXT.missingKnowledgeLog);
    return createMarketService({ store, knowledge, getLlm: () => llm, getAttachments: () => attachments, config: cfg, log });
  })();
  ready.catch((error) => log.warn("初始化失败", error));
  registerRoutes(ctx, ready, log);
  ctx.inject(["tools"], (sub) => {
    registerTools(sub, ready, log).catch((error) => log.warn("注册工具失败", error));
  });
  ctx.effect(() => {
    const id = setInterval(() => {
      ready.then((service) => service.tick()).catch((error) => log.debug("定时任务失败", error));
    }, Math.max(5, cfg.tickSeconds) * 1e3);
    return () => clearInterval(id);
  }, "stock-market: tick");
  ctx.effect(() => () => store.flush(), "stock-market: flush");
}
export {
  DEFAULTS,
  apply,
  inject,
  name
};
