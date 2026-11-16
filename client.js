// 由 scripts/build.mjs 从 src/client/ 生成，不要直接修改。
window.__ModuleLoader__.load({
  id: "@local/dsh-stock-market",
  factory(require) {
    var module = { exports: {} };
    var exports = module.exports;
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client/index.jsx
var index_exports = {};
__export(index_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(index_exports);
var React10 = __toESM(require("react"), 1);

// src/client/api.js
var BASE = "stock-market/api/";
var ApiError = class extends Error {
  constructor(code, params = {}) {
    super(code);
    this.code = code;
    this.params = params;
  }
};
async function request(path2, { method = "GET", body, signal, query } = {}) {
  const qs = query ? `?${new URLSearchParams(Object.entries(query).filter(([, v]) => v !== void 0 && v !== null && v !== ""))}` : "";
  let res;
  try {
    res = await fetch(`${BASE}${path2}${qs}`, {
      method,
      credentials: "same-origin",
      headers: body === void 0 ? void 0 : { "content-type": "application/json" },
      body: body === void 0 ? void 0 : JSON.stringify(body),
      signal
    });
  } catch (error) {
    if (error?.name === "AbortError") throw error;
    throw new ApiError("network");
  }
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(data?.error?.code ?? (res.status === 404 ? "notInstalled" : "http"), data?.error?.params ?? { status: res.status });
  return data;
}
var get = (path2, query, signal) => request(path2, { query, signal });
var post = (path2, body) => request(path2, { method: "POST", body });
async function sseStream(path2, body, { onEvent, signal }) {
  let res;
  try {
    res = await fetch(`${BASE}${path2}`, {
      method: "POST",
      credentials: "same-origin",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      signal
    });
  } catch (error) {
    if (error?.name === "AbortError") return;
    throw new ApiError("network");
  }
  if (!res.ok || res.body === null) {
    const data = await res.json().catch(() => null);
    throw new ApiError(data?.error?.code ?? "http", data?.error?.params ?? {});
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  for (; ; ) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    let idx;
    while ((idx = buf.indexOf("\n\n")) >= 0) {
      const block = buf.slice(0, idx);
      buf = buf.slice(idx + 2);
      for (const line of block.split("\n")) {
        if (!line.startsWith("data: ")) continue;
        try {
          onEvent(JSON.parse(line.slice(6)));
        } catch {
        }
      }
    }
  }
}
var api = {
  meta: () => get("meta"),
  indices: (signal) => get("indices", void 0, signal),
  list: (query, signal) => get("list", query, signal),
  search: (q, signal) => get("search", { q }, signal),
  quote: (symbol, signal) => get("quote", { symbol }, signal),
  kline: (symbol, period, limit, signal) => get("kline", { symbol, period, limit }, signal),
  trends: (symbol, signal) => get("trends", { symbol }, signal),
  analysis: (symbol, signal) => get("analysis", { symbol }, signal),
  fund: (code, signal) => get("fund", { code }, signal),
  news: (symbol, signal) => get("news", { symbol }, signal),
  watchlist: (signal) => get("watchlist", void 0, signal),
  watch: (action, symbol) => post("watchlist", { action, symbol }),
  alerts: (signal) => get("alerts", void 0, signal),
  alert: (body) => post("alerts", body),
  paper: (signal) => get("paper", void 0, signal),
  order: (body) => post("paper/order", body),
  cancel: (orderId) => post("paper/cancel", { orderId }),
  resetPaper: (cash) => post("paper/reset", { cash }),
  setStop: (symbol, stop) => post("paper/stop", { symbol, stop }),
  screen: (preset) => get("screen", { preset }),
  runScreen: (preset, force) => post("screen", { preset, force }),
  chatHistory: (symbol) => get("chat/history", { symbol }),
  chatClear: (symbol) => post("chat/clear", { symbol }),
  chatStream: (body, opts) => sseStream("chat", body, opts),
  aiModels: (refresh) => get("ai/models", { refresh: refresh ? "1" : void 0 }),
  setAiModel: (body) => post("ai/model", body),
  live: (signal) => get("live", void 0, signal),
  livePreview: (profile) => post("live/preview", { profile }),
  liveAdopt: (body) => post("live/adopt", body),
  liveCapital: (amount) => post("live/capital", { amount }),
  livePlanTrade: (symbol) => get("live/plan-trade", { symbol }),
  liveFill: (body) => post("live/fill", body),
  liveStop: (symbol, stop) => post("live/stop", { symbol, stop }),
  liveTrade: (id, fields) => post("live/trade", { ...fields, id }),
  liveTodo: (id, action) => post("live/todo", { id, action }),
  liveReset: () => post("live/reset", {}),
  liveReviewStream: (opts) => sseStream("live/review", {}, opts)
};

// src/client/common.js
var React = __toESM(require("react"), 1);
var isFund = (symbol) => typeof symbol === "string" && symbol.startsWith("fund:");
function price(v, digits) {
  if (v === null || v === void 0 || Number.isNaN(v)) return "—";
  const d = digits ?? (Math.abs(v) < 10 ? 3 : 2);
  return Number(v).toFixed(d);
}
function pct(v, digits = 2) {
  if (v === null || v === void 0 || Number.isNaN(v)) return "—";
  return `${v > 0 ? "+" : ""}${Number(v).toFixed(digits)}%`;
}
function big(v, t) {
  if (v === null || v === void 0 || Number.isNaN(v)) return "—";
  const a = Math.abs(v);
  if (t("unit.style") === "cn") {
    if (a >= 1e8) return `${(v / 1e8).toFixed(2)}${t("unit.yi")}`;
    if (a >= 1e4) return `${(v / 1e4).toFixed(2)}${t("unit.wan")}`;
    return String(Math.round(v));
  }
  if (a >= 1e9) return `${(v / 1e9).toFixed(2)}B`;
  if (a >= 1e6) return `${(v / 1e6).toFixed(2)}M`;
  if (a >= 1e3) return `${(v / 1e3).toFixed(1)}K`;
  return String(Math.round(v));
}
function money(v) {
  if (v === null || v === void 0 || Number.isNaN(v)) return "—";
  return Number(v).toLocaleString(void 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
var tone = (v) => v > 0 ? "sm-up" : v < 0 ? "sm-down" : "";
function timeOf(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}
function usePoll(fn, intervalMs, deps) {
  const key = JSON.stringify(deps);
  const [state, setState] = React.useState({ key, data: void 0, error: void 0 });
  const fnRef = React.useRef(fn);
  fnRef.current = fn;
  const [nonce, setNonce] = React.useState(0);
  React.useEffect(() => {
    let alive = true;
    let timer;
    const controller = new AbortController();
    const run = async () => {
      if (document.visibilityState !== "hidden") {
        try {
          const data = await fnRef.current(controller.signal);
          if (alive) setState({ key, data, error: void 0 });
        } catch (error) {
          if (alive && error?.name !== "AbortError") setState((s) => ({ key, data: s.key === key ? s.data : void 0, error }));
        }
      }
      if (alive && intervalMs > 0) timer = setTimeout(run, intervalMs);
    };
    run();
    return () => {
      alive = false;
      clearTimeout(timer);
      controller.abort();
    };
  }, [key, nonce, intervalMs]);
  const current = state.key === key;
  return [current ? state.data : void 0, current ? state.error : void 0, () => setNonce((n) => n + 1)];
}
function createSharedState(initial) {
  let value = initial;
  const listeners = /* @__PURE__ */ new Set();
  return {
    get: () => value,
    set(next) {
      if (next === value) return;
      value = next;
      for (const l of listeners) l();
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }
  };
}
function useShared(shared) {
  return React.useSyncExternalStore(shared.subscribe, shared.get, shared.get);
}
function usePref(key, initial) {
  const [value, setValue] = React.useState(() => {
    try {
      const raw = window.localStorage.getItem(`stock-market:${key}`);
      return raw === null ? initial : JSON.parse(raw);
    } catch {
      return initial;
    }
  });
  const update = React.useCallback((next) => {
    setValue(next);
    try {
      window.localStorage.setItem(`stock-market:${key}`, JSON.stringify(next));
    } catch {
    }
  }, [key]);
  return [value, update];
}
function errorText(t, error) {
  if (!error) return "";
  const code = error.code ?? "unknown";
  const key = `err.${code}`;
  const text = t(key, error.params ?? {});
  return text === key ? t("err.generic", { code }) : text;
}

// src/client/page.jsx
var React9 = __toESM(require("react"), 1);

// src/client/styles.js
var CSS = `
.sm-root {
  --sm-up: var(--dsw-alias-state-error-primary, #e5484d);
  --sm-down: var(--dsw-alias-state-success-primary, #2e9e5b);
  --sm-line: var(--dsw-alias-border-l2, rgba(127,127,127,.25));
  --sm-card: var(--dsw-alias-bg-layer-1, transparent);
  --sm-hover: var(--dsw-alias-interactive-bg-hover, rgba(127,127,127,.08));
  --sm-brand: var(--dsw-alias-brand-primary, #4d6bfe);
  --sm-warn: var(--dsw-alias-state-warn-primary, #d9822b);
  container-type: inline-size;
  box-sizing: border-box; height: 100%; overflow: auto; padding: 16px 20px 24px;
  color: var(--dsw-alias-label-primary); background: var(--dsw-alias-bg-base, transparent);
  font-size: 13px; line-height: 1.5;
}
.sm-root.sm-green-up { --sm-up: var(--dsw-alias-state-success-primary, #2e9e5b); --sm-down: var(--dsw-alias-state-error-primary, #e5484d); }
.sm-root *, .sm-root *::before, .sm-root *::after { box-sizing: border-box; }
.sm-root h1 { font-size: 20px; font-weight: 600; margin: 0; }
.sm-root h2 { font-size: 18px; font-weight: 600; margin: 0; }
.sm-root h3 { font-size: 14px; font-weight: 600; margin: 0; }
.sm-subhead { font-size: 13px; font-weight: 600; margin: 16px 0 6px; color: var(--dsw-alias-label-secondary); }
.sm-up { color: var(--sm-up); }
.sm-down { color: var(--sm-down); }
.sm-bg-up { background: var(--sm-up) !important; color: #fff !important; border-color: transparent !important; }
.sm-bg-down { background: var(--sm-down) !important; color: #fff !important; border-color: transparent !important; }
.sm-muted { color: var(--dsw-alias-label-tertiary); }
.sm-small { font-size: 11px; }
.sm-grow { flex: 1; }
.sm-hint { color: var(--dsw-alias-label-tertiary); font-size: 12px; margin: 8px 0 0; }
.sm-notice { margin: 8px 0; padding: 8px 12px; border-radius: 8px; background: var(--dsw-alias-state-warn-tertiary, rgba(217,130,43,.12)); color: var(--dsw-alias-state-warn-label, var(--dsw-alias-label-primary)); }
.sm-error { color: var(--dsw-alias-state-error-primary, #e5484d); margin: 6px 0; }
.sm-ok { color: var(--dsw-alias-state-success-primary, #2e9e5b); margin: 6px 0; }
.sm-empty { padding: 24px 0; text-align: center; }

.sm-head { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 10px; }
.sm-foot { margin-top: 20px; color: var(--dsw-alias-label-tertiary); font-size: 11px; }

.sm-btn { font: inherit; padding: 5px 12px; border-radius: 8px; border: 1px solid var(--sm-line); background: transparent; color: var(--dsw-alias-label-primary); cursor: pointer; white-space: nowrap; }
.sm-btn:hover:not(:disabled) { background: var(--sm-hover); }
.sm-btn:disabled { opacity: .5; cursor: default; }
.sm-btn:focus-visible, .sm-seg button:focus-visible, .sm-tabs button:focus-visible, .sm-link:focus-visible, .sm-chip:focus-visible, .sm-index:focus-visible, .sm-preset:focus-visible { outline: 2px solid var(--sm-brand); outline-offset: 1px; }
.sm-btn-ghost { border-color: transparent; color: var(--dsw-alias-label-secondary); }
.sm-btn-primary { background: var(--dsw-alias-button-primary-fill, var(--sm-brand)); border-color: transparent; color: var(--dsw-alias-label-primary-inverted, #fff); }
.sm-btn-primary:hover:not(:disabled) { background: var(--dsw-alias-button-primary-fill, var(--sm-brand)); filter: brightness(1.08); }
.sm-link { font: inherit; padding: 0; border: 0; background: none; color: var(--dsw-alias-label-primary); cursor: pointer; text-align: left; font-weight: 500; }
.sm-link:hover { color: var(--dsw-alias-link, var(--sm-brand)); }

.sm-search { position: relative; width: min(340px, 100%); }
.sm-search input { width: 100%; font: inherit; padding: 6px 12px; border-radius: 8px; border: 1px solid var(--sm-line); background: var(--sm-card); color: var(--dsw-alias-label-primary); }
.sm-search input:focus { outline: 2px solid var(--sm-brand); outline-offset: -1px; }
.sm-search-list { position: absolute; z-index: 20; left: 0; right: 0; top: calc(100% + 4px); margin: 0; padding: 4px; list-style: none; border-radius: 10px; border: 1px solid var(--sm-line); background: var(--dsw-alias-bg-layer-2, var(--dsw-alias-bg-base)); box-shadow: 0 8px 24px rgba(0,0,0,.18); max-height: 360px; overflow: auto; }
.sm-search-list li { display: flex; gap: 8px; align-items: center; padding: 6px 8px; border-radius: 6px; cursor: pointer; }
.sm-search-list li.sm-on, .sm-search-list li:hover { background: var(--sm-hover); }
.sm-search-list li span:first-child { flex: 1; }
.sm-tag { font-size: 11px; padding: 0 6px; border-radius: 4px; border: 1px solid var(--sm-line); color: var(--dsw-alias-label-secondary); }

.sm-indices { display: flex; gap: 6px; overflow-x: auto; padding-bottom: 6px; margin-bottom: 8px; scrollbar-width: thin; }
.sm-index { flex: none; display: flex; flex-direction: column; align-items: flex-start; gap: 0; font: inherit; padding: 6px 10px; border-radius: 8px; border: 1px solid var(--sm-line); background: var(--sm-card); color: var(--dsw-alias-label-primary); cursor: pointer; min-width: 104px; }
.sm-index:hover { background: var(--sm-hover); }
.sm-index-name { font-size: 11px; color: var(--dsw-alias-label-secondary); }

.sm-tabs { display: flex; gap: 2px; border-bottom: 1px solid var(--sm-line); margin-bottom: 12px; overflow-x: auto; }
.sm-tabs button { font: inherit; padding: 8px 14px; border: 0; border-bottom: 2px solid transparent; background: none; color: var(--dsw-alias-label-secondary); cursor: pointer; white-space: nowrap; display: inline-flex; align-items: center; gap: 6px; }
.sm-tabs button:hover { color: var(--dsw-alias-label-primary); }
.sm-tabs button.sm-on { color: var(--dsw-alias-label-primary); border-bottom-color: var(--sm-brand); font-weight: 600; }
.sm-badge { min-width: 18px; height: 18px; padding: 0 5px; border-radius: 9px; background: var(--dsw-alias-state-error-primary, #e5484d); color: #fff; font-size: 11px; line-height: 18px; text-align: center; }
.sm-count { font-size: 11px; color: var(--dsw-alias-label-tertiary); }

.sm-body { display: grid; grid-template-columns: minmax(0, 1fr) minmax(380px, 46%); gap: 16px; align-items: start; }
.sm-main { min-width: 0; }
.sm-detail { min-width: 0; position: sticky; top: 0; max-height: calc(100vh - 120px); overflow: auto; }
@container (max-width: 980px) {
  .sm-body { grid-template-columns: minmax(0, 1fr); }
  .sm-detail { position: static; max-height: none; overflow: visible; }
}
.sm-detail-inner { display: flex; flex-direction: column; gap: 12px; }

.sm-seg { display: inline-flex; gap: 2px; padding: 2px; border-radius: 8px; border: 1px solid var(--sm-line); margin-bottom: 10px; flex-wrap: wrap; }
.sm-seg-scroll { flex-wrap: nowrap; overflow-x: auto; max-width: 100%; }
.sm-seg button { font: inherit; padding: 4px 10px; border: 0; border-radius: 6px; background: none; color: var(--dsw-alias-label-secondary); cursor: pointer; white-space: nowrap; }
.sm-seg button:hover { background: var(--sm-hover); }
.sm-seg button.sm-on { background: var(--dsw-alias-interactive-bg-active, var(--sm-hover)); color: var(--dsw-alias-label-primary); font-weight: 600; }

.sm-toolbar { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 8px; }
.sm-toolbar .sm-seg { margin-bottom: 0; }
.sm-inline { display: inline-flex; align-items: center; gap: 6px; }
.sm-root select, .sm-root input[type=number], .sm-root textarea { font: inherit; color: var(--dsw-alias-label-primary); background: var(--sm-card); border: 1px solid var(--sm-line); border-radius: 6px; padding: 4px 8px; }
.sm-input-sm { width: 84px; }

.sm-table-wrap { overflow-x: auto; }
.sm-table { width: 100%; border-collapse: collapse; font-variant-numeric: tabular-nums; }
.sm-table th { text-align: right; font-weight: 500; color: var(--dsw-alias-label-tertiary); padding: 6px 8px; border-bottom: 1px solid var(--sm-line); white-space: nowrap; }
.sm-table td { text-align: right; padding: 6px 8px; border-bottom: 1px solid var(--dsw-alias-border-l1, var(--sm-line)); white-space: nowrap; }
.sm-table th:first-child, .sm-table td:first-child { text-align: left; }
.sm-table-hover tbody tr { cursor: pointer; }
.sm-table-hover tbody tr:hover { background: var(--sm-hover); }
.sm-row-on { background: var(--dsw-alias-interactive-bg-active, var(--sm-hover)); }
.sm-table-compact td, .sm-table-compact th { padding: 4px 6px; }
.sm-th-btn { font: inherit; color: inherit; background: none; border: 0; padding: 0; cursor: pointer; }
.sm-pager { display: flex; align-items: center; justify-content: flex-end; gap: 8px; margin-top: 8px; }

.sm-card { border: 1px solid var(--sm-line); border-radius: 12px; background: var(--sm-card); padding: 12px 14px; }
.sm-card-head { display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; margin-bottom: 8px; }
.sm-grid-stats { display: grid; grid-template-columns: repeat(auto-fill, minmax(112px, 1fr)); gap: 8px 12px; margin: 10px 0 4px; }
.sm-grid-wide { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); margin-bottom: 12px; }
.sm-stat { display: flex; flex-direction: column; min-width: 0; }
.sm-stat-label { font-size: 11px; color: var(--dsw-alias-label-tertiary); }
.sm-stat-value { font-variant-numeric: tabular-nums; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.sm-actions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px; }

.sm-quote-title { display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; }
.sm-quote-price { display: flex; align-items: baseline; gap: 12px; margin-top: 4px; font-variant-numeric: tabular-nums; }
.sm-quote-price strong { font-size: 28px; font-weight: 600; }

.sm-score-row { display: flex; align-items: baseline; gap: 10px; }
.sm-stance { font-size: 16px; }
.sm-stance-bullish, .sm-stance-leanBull { color: var(--sm-up); }
.sm-stance-bearish, .sm-stance-leanBear { color: var(--sm-down); }
.sm-score { position: relative; height: 6px; border-radius: 3px; background: var(--dsw-alias-bg-skeleton, var(--sm-hover)); margin: 8px 0 10px; overflow: hidden; }
.sm-score-mid { position: absolute; left: 50%; top: 0; bottom: 0; width: 1px; background: var(--dsw-alias-label-tertiary); }
.sm-score-fill { position: absolute; top: 0; bottom: 0; border-radius: 3px; }
.sm-reasons { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 4px; }
.sm-reasons li { display: flex; gap: 8px; align-items: baseline; }
.sm-reason-dot { flex: none; width: 6px; height: 6px; border-radius: 50%; transform: translateY(-1px); background: var(--dsw-alias-label-tertiary); }
.sm-reason-bull .sm-reason-dot { background: var(--sm-up); }
.sm-reason-bear .sm-reason-dot { background: var(--sm-down); }

.sm-form-row { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 8px; }
.sm-form-row label { display: flex; flex-direction: column; gap: 2px; font-size: 12px; color: var(--dsw-alias-label-secondary); }
.sm-form-row input, .sm-form-row select { width: 120px; }
.sm-form-actions { display: flex; gap: 8px; margin-top: 10px; }

.sm-chart { position: relative; width: 100%; }
.sm-chart svg { display: block; }
.sm-chart-legend { display: flex; gap: 10px; flex-wrap: wrap; font-size: 11px; color: var(--dsw-alias-label-secondary); margin-bottom: 4px; font-variant-numeric: tabular-nums; }
.sm-chart-empty { padding: 40px 0; text-align: center; color: var(--dsw-alias-label-tertiary); }
.sm-key::before { content: ''; display: inline-block; width: 10px; height: 2px; margin-right: 4px; vertical-align: middle; background: currentColor; }
.sm-key-ma20 { color: var(--sm-brand); }
.sm-key-ma60 { color: var(--sm-warn); }
.sm-key-dc55, .sm-key-dc20 { color: var(--dsw-alias-label-tertiary); }
.sm-chart .sm-grid { stroke: var(--dsw-alias-border-l1, var(--sm-line)); stroke-width: 1; }
.sm-chart .sm-axis { fill: var(--dsw-alias-label-tertiary); font-size: 10px; }
.sm-candle-up line, .sm-candle-up rect { stroke: var(--sm-up); fill: var(--sm-up); }
.sm-candle-down line, .sm-candle-down rect { stroke: var(--sm-down); fill: var(--sm-down); }
.sm-chart .sm-vol { opacity: .35; stroke: none; }
.sm-line-ma20, .sm-line-ma60, .sm-line-dc55, .sm-line-dc20, .sm-line-up, .sm-line-down, .sm-line-main, .sm-line-base, .sm-line-stop { fill: none; stroke-width: 1.4; }
.sm-line-ma20 { stroke: var(--sm-brand); }
.sm-line-ma60 { stroke: var(--sm-warn); }
.sm-line-dc55, .sm-line-dc20 { stroke: var(--dsw-alias-label-tertiary); stroke-dasharray: 4 3; }
.sm-line-up { stroke: var(--sm-up); stroke-width: 1.6; }
.sm-line-down { stroke: var(--sm-down); stroke-width: 1.6; }
.sm-line-main { stroke: var(--sm-brand); stroke-width: 1.6; }
.sm-line-base { stroke: var(--dsw-alias-label-tertiary); stroke-dasharray: 2 3; }
.sm-line-stop { stroke: var(--sm-down); stroke-dasharray: 6 3; }
.sm-cross { stroke: var(--dsw-alias-label-tertiary); stroke-dasharray: 2 2; }

.sm-preset-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 8px; margin-bottom: 10px; }
.sm-preset { font: inherit; text-align: left; display: flex; flex-direction: column; gap: 4px; padding: 10px 12px; border-radius: 10px; border: 1px solid var(--sm-line); background: var(--sm-card); color: var(--dsw-alias-label-primary); cursor: pointer; }
.sm-preset span { font-size: 12px; color: var(--dsw-alias-label-tertiary); }
.sm-preset.sm-on { border-color: var(--sm-brand); box-shadow: inset 0 0 0 1px var(--sm-brand); }

.sm-events { list-style: none; margin: 0; padding: 0; }
.sm-events li { display: flex; gap: 10px; align-items: baseline; padding: 6px 0; border-bottom: 1px solid var(--dsw-alias-border-l1, var(--sm-line)); flex-wrap: wrap; }
.sm-events li.sm-unread { font-weight: 600; }
.sm-events li.sm-unread::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: var(--dsw-alias-state-error-primary, #e5484d); }

.sm-advisor { display: flex; flex-direction: column; }
.sm-chat { max-height: 520px; min-height: 120px; overflow: auto; display: flex; flex-direction: column; gap: 10px; padding: 4px 2px 8px; }
.sm-chat-empty { margin: auto 0; text-align: center; }
.sm-msg { border-radius: 10px; padding: 8px 12px; max-width: 100%; }
.sm-msg p { margin: 0; white-space: pre-wrap; }
.sm-msg-user { align-self: flex-end; background: var(--dsw-alias-interactive-bg-active, var(--sm-hover)); max-width: 88%; }
.sm-msg-assistant { align-self: stretch; border: 1px solid var(--dsw-alias-border-l1, var(--sm-line)); }
.sm-msg-meta { margin-top: 4px; font-size: 11px; color: var(--dsw-alias-label-tertiary); }
.sm-sources { margin-top: 6px; font-size: 12px; color: var(--dsw-alias-label-secondary); }
.sm-sources summary { cursor: pointer; }
.sm-sources ul { margin: 4px 0 0; padding-left: 18px; }
.sm-quick { display: flex; gap: 6px; flex-wrap: wrap; margin: 6px 0; }
.sm-chip { font: inherit; font-size: 12px; padding: 3px 10px; border-radius: 999px; border: 1px solid var(--sm-line); background: none; color: var(--dsw-alias-label-secondary); cursor: pointer; }
.sm-chip:hover:not(:disabled) { background: var(--sm-hover); color: var(--dsw-alias-label-primary); }
.sm-chip:disabled { opacity: .5; cursor: default; }
.sm-chat-input { display: flex; gap: 8px; align-items: flex-end; }
.sm-chat-input textarea { flex: 1; resize: vertical; min-height: 40px; }
.sm-disclaimer { margin: 6px 0 0; font-size: 11px; color: var(--dsw-alias-label-tertiary); }

.sm-md { overflow-wrap: anywhere; }
.sm-md > :first-child { margin-top: 0; }
.sm-md p { margin: 6px 0; white-space: normal; }
.sm-md h3, .sm-md h4, .sm-md h5, .sm-md h6 { margin: 10px 0 4px; font-size: 13px; font-weight: 600; }
.sm-md ul, .sm-md ol { margin: 4px 0; padding-left: 20px; }
.sm-md li { margin: 2px 0; }
.sm-md .sm-md-sub { margin-left: 16px; }
.sm-md code { font-family: var(--dsw-font-mono, ui-monospace, monospace); font-size: 12px; padding: 0 4px; border-radius: 4px; background: var(--dsw-alias-markdown-code-block, var(--sm-hover)); }
.sm-md pre { overflow: auto; padding: 8px; border-radius: 8px; background: var(--dsw-alias-markdown-code-block, var(--sm-hover)); }
.sm-md blockquote { margin: 6px 0; padding-left: 10px; border-left: 3px solid var(--sm-line); color: var(--dsw-alias-label-secondary); }
.sm-md hr { border: 0; border-top: 1px solid var(--sm-line); margin: 10px 0; }
.sm-md-table { overflow-x: auto; margin: 6px 0; }
.sm-md table { border-collapse: collapse; font-size: 12px; }
.sm-md th, .sm-md td { border: 1px solid var(--sm-line); padding: 3px 8px; text-align: left; }
.sm-cite { color: var(--dsw-alias-link, var(--sm-brand)); }

.sm-clickable { cursor: pointer; }
.sm-chart .sm-picked { fill: var(--dsw-alias-interactive-bg-active, rgba(77,107,254,.12)); }
.sm-candle-big line { stroke-width: 1.6; }
.sm-ev { stroke: var(--dsw-alias-bg-base, #fff); stroke-width: 1; }
.sm-ev-news, .sm-ev-flash { fill: var(--dsw-alias-label-tertiary, #8a94a6); }
.sm-ev-notice { fill: #5b6cff; }
.sm-ev-lhb { fill: #a855f7; }
.sm-ev-forecast, .sm-ev-report { fill: #0ea5e9; }
.sm-ev-lift { fill: var(--sm-warn); }
.sm-ev-dividend { fill: #22a06b; }
.sm-ev-holder { fill: #d946ef; }
.sm-ev-tag { display: inline-block; font-size: 11px; line-height: 16px; padding: 0 6px; margin-right: 6px; border-radius: 4px; color: #fff; background: var(--dsw-alias-label-tertiary, #8a94a6); white-space: nowrap; }
.sm-ev-tag-notice { background: #5b6cff; }
.sm-ev-tag-lhb { background: #a855f7; }
.sm-ev-tag-forecast, .sm-ev-tag-report { background: #0ea5e9; }
.sm-ev-tag-lift { background: var(--sm-warn); }
.sm-ev-tag-dividend { background: #22a06b; }
.sm-ev-tag-holder { background: #d946ef; }
.sm-tip { position: absolute; top: 24px; z-index: 5; width: 290px; max-width: calc(100% - 16px); padding: 8px 10px; border-radius: 10px; border: 1px solid var(--sm-line); background: var(--dsw-alias-bg-layer-2, var(--dsw-alias-bg-base)); box-shadow: 0 8px 24px rgba(0,0,0,.18); pointer-events: none; font-size: 12px; }
.sm-tip-head { display: flex; gap: 8px; align-items: baseline; margin-bottom: 4px; }
.sm-tip ul { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 4px; }
.sm-tip li { overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.sm-news { list-style: none; margin: 4px 0 0; padding: 0; }
.sm-news-item { padding: 8px 0; border-bottom: 1px solid var(--dsw-alias-border-l1, var(--sm-line)); }
.sm-news-item:last-child { border-bottom: 0; }
.sm-news-meta { display: flex; gap: 8px; align-items: center; font-size: 11px; flex-wrap: wrap; }
.sm-news-title { display: block; margin-top: 2px; color: var(--dsw-alias-label-primary); text-decoration: none; font-weight: 500; }
.sm-news-title:hover { color: var(--dsw-alias-link, var(--sm-brand)); text-decoration: underline; }
.sm-news-summary { margin: 2px 0 0; color: var(--dsw-alias-label-secondary); font-size: 12px; }
.sm-news-detail { margin: 4px 0 0; padding: 6px 8px; border-radius: 6px; background: var(--sm-hover); color: var(--dsw-alias-label-secondary); font-size: 12px; }
.sm-day { border-color: var(--sm-brand); }

.sm-chart-tools { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; font-size: 11px; margin: 2px 0 4px; }
.sm-chart-range { font-variant-numeric: tabular-nums; color: var(--dsw-alias-label-secondary); }
.sm-icon-btn { font: inherit; font-size: 14px; line-height: 1; width: 26px; height: 24px; border-radius: 6px; border: 1px solid var(--sm-line); background: transparent; color: var(--dsw-alias-label-primary); cursor: pointer; }
.sm-icon-btn:hover:not(:disabled) { background: var(--sm-hover); }
.sm-icon-btn:disabled { opacity: .4; cursor: default; }
.sm-icon-btn:focus-visible { outline: 2px solid var(--sm-brand); outline-offset: 1px; }
.sm-btn-sm { padding: 2px 8px; font-size: 12px; }
.sm-grab { cursor: crosshair; touch-action: none; user-select: none; }
.sm-grabbing { cursor: grabbing; touch-action: none; user-select: none; }

.sm-market-groups { display: flex; flex-wrap: wrap; gap: 6px 16px; margin-bottom: 10px; }
.sm-market-group { display: flex; align-items: center; gap: 8px; min-width: 0; }
.sm-market-group .sm-seg { margin-bottom: 0; }
.sm-market-group-label { font-size: 12px; color: var(--dsw-alias-label-tertiary); white-space: nowrap; }

.sm-detail:focus { outline: none; }
.sm-back { margin-bottom: 8px; }
@keyframes sm-flash { from { box-shadow: 0 0 0 2px var(--sm-brand); } to { box-shadow: 0 0 0 2px transparent; } }
.sm-detail-inner > .sm-card:first-child { animation: sm-flash 1.2s ease-out; }
@media (prefers-reduced-motion: reduce) { .sm-detail-inner > .sm-card:first-child { animation: none; } }
.sm-model-row { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 12px; margin: -2px 0 8px; }
.sm-model-row select { max-width: 240px; }
/* 实盘 */
.sm-panel > .sm-card + .sm-card, .sm-panel > .sm-card + .sm-form, .sm-panel .sm-form + .sm-hint { margin-top: 10px; }
.sm-root input[type=text], .sm-root input[type=date] { font: inherit; color: var(--dsw-alias-label-primary); background: var(--sm-card); border: 1px solid var(--sm-line); border-radius: 6px; padding: 4px 8px; }
.sm-form-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px 14px; align-items: end; }
.sm-form-grid .sm-form-actions { grid-column: 1 / -1; }
.sm-field { display: flex; flex-direction: column; gap: 3px; font-size: 12px; color: var(--dsw-alias-label-secondary); min-width: 0; }
.sm-field input, .sm-field select { width: 100%; box-sizing: border-box; }
.sm-form-row .sm-field input, .sm-form-row .sm-field select { width: 130px; }
.sm-form > .sm-field { margin-top: 8px; }
.sm-form > .sm-field input { width: 100%; box-sizing: border-box; }
.sm-check { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--dsw-alias-label-primary); cursor: pointer; }
.sm-reason-neutral .sm-reason-dot { background: var(--sm-brand); }
.sm-plan { margin: 8px 0; padding: 10px 12px; border-radius: 10px; border: 1px solid var(--sm-line); border-left-width: 4px; }
.sm-plan-ok { border-left-color: var(--dsw-alias-state-success-primary, #2e9e5b); }
.sm-plan-warn { border-left-color: var(--dsw-alias-state-warn-primary, #d9822b); }
.sm-plan-block { border-left-color: var(--dsw-alias-state-error-primary, #e5484d); }
.sm-plan-head { display: flex; flex-wrap: wrap; gap: 4px 12px; align-items: baseline; margin-bottom: 6px; }
.sm-checks { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 3px; font-size: 12px; }
.sm-checks li { padding-left: 18px; position: relative; color: var(--dsw-alias-label-secondary); }
.sm-checks li::before { position: absolute; left: 0; width: 14px; text-align: center; font-weight: 700; }
.sm-check-ok::before { content: '✓'; color: var(--dsw-alias-state-success-primary, #2e9e5b); }
.sm-check-warn::before { content: '!'; color: var(--dsw-alias-state-warn-primary, #d9822b); }
.sm-check-block::before { content: '×'; color: var(--dsw-alias-state-error-primary, #e5484d); }
.sm-check-info::before { content: 'i'; color: var(--dsw-alias-label-tertiary); font-style: italic; }
.sm-checks li.sm-check-block { color: var(--dsw-alias-label-primary); }
.sm-todos { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
.sm-todo { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 12px; padding: 8px 10px; border-radius: 8px; border: 1px solid var(--sm-line); border-left-width: 4px; }
.sm-todo-p1 { border-left-color: var(--dsw-alias-state-error-primary, #e5484d); }
.sm-todo-p2 { border-left-color: var(--dsw-alias-state-warn-primary, #d9822b); }
.sm-todo-p3 { border-left-color: var(--sm-brand); }
.sm-todo-p4, .sm-todo-p5 { border-left-color: var(--sm-line); }
.sm-todo-text { flex: 1 1 260px; min-width: 0; }
.sm-todo-actions { display: flex; flex-wrap: wrap; gap: 6px; }
.sm-journal { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.sm-journal > li { padding: 8px 10px; border-radius: 8px; border: 1px solid var(--sm-line); }
.sm-journal > li.sm-unreviewed { border-style: dashed; }
.sm-journal-head { display: flex; flex-wrap: wrap; gap: 4px 10px; align-items: baseline; }
.sm-journal-body { font-size: 12px; margin: 4px 0; }
.sm-journal-tags { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
.sm-journal-tags .sm-seg { margin-bottom: 0; }
.sm-chip-on { background: var(--dsw-alias-interactive-bg-active, var(--sm-hover)); color: var(--dsw-alias-label-primary); border-color: var(--dsw-alias-label-tertiary); }
.sm-dist { display: flex; align-items: flex-end; gap: 4px; height: 110px; padding-bottom: 18px; }
.sm-dist-col { flex: 1; height: 100%; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; gap: 2px; position: relative; min-width: 0; }
.sm-dist-bar { width: 100%; min-height: 1px; border-radius: 3px 3px 0 0; }
.sm-dist-col span { position: absolute; bottom: -18px; font-size: 10px; color: var(--dsw-alias-label-tertiary); white-space: nowrap; }
`;

// src/client/detail.jsx
var React6 = __toESM(require("react"), 1);

// src/client/charts.jsx
var React2 = __toESM(require("react"), 1);

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

// src/shared/events.js
var EVENT_PRIORITY = ["lhb", "forecast", "lift", "dividend", "notice", "holder", "report", "flash", "news"];
var EVENT_KINDS = new Set(EVENT_PRIORITY);
function itemsForBar(items, date, prevDate) {
  const end = `${date} 15:00`;
  const start = prevDate ? `${prevDate} 15:00` : `${date} 00:00`;
  return items.filter((i) => !i.future && i.time > start && i.time <= end);
}
function topKind(items) {
  let best = null;
  for (const i of items) {
    if (best === null || EVENT_PRIORITY.indexOf(i.kind) < EVENT_PRIORITY.indexOf(best)) best = i.kind;
  }
  return best;
}
function bucketByBar(items, bars) {
  return bars.map((b, i) => itemsForBar(items, b.date, i > 0 ? bars[i - 1].date : null));
}

// src/client/range.js
var DEFAULT_COUNT = 120;
var MIN_COUNT = 20;
var ZOOM_STEP = 1.2;
var clampNum = (v, min, max) => Math.min(max, Math.max(min, v));
function zoomRange({ count, end }, total, factor, anchor = 1) {
  const minCount = Math.min(MIN_COUNT, total);
  const nextCount = clampNum(Math.round(count * factor), minCount, total);
  const start = total - end - count;
  const pivot = start + anchor * count;
  const nextStart = clampNum(Math.round(pivot - anchor * nextCount), 0, total - nextCount);
  return { count: nextCount, end: total - nextStart - nextCount };
}
function panRange({ count, end }, total, shift) {
  return { count, end: clampNum(end + shift, 0, Math.max(0, total - count)) };
}

// src/client/charts.jsx
function useWidth() {
  const [width, setWidth] = React2.useState(600);
  const observer = React2.useRef(null);
  const ref = React2.useCallback((el) => {
    observer.current?.disconnect();
    observer.current = null;
    if (el === null || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((entries) => {
      const w = Math.floor(entries[0].contentRect.width);
      if (w > 0) setWidth(w);
    });
    ro.observe(el);
    observer.current = ro;
  }, []);
  return [ref, width];
}
var PAD = { l: 8, r: 56, t: 10, b: 18 };
function scaleY(min, max, top, bottom) {
  const span = max - min || Math.abs(max) || 1;
  return (v) => bottom - (v - min) / span * (bottom - top);
}
function path(points) {
  let d = "";
  let pen = false;
  for (const [x, y] of points) {
    if (y === null || y === void 0 || Number.isNaN(y)) {
      pen = false;
      continue;
    }
    d += `${pen ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
    pen = true;
  }
  return d;
}
function ticks(min, max, n = 4) {
  const out = [];
  for (let i = 0; i <= n; i++) out.push(min + (max - min) * i / n);
  return out;
}
function CandleChart({ bars, height = 300, overlays = { ma20: true, ma60: true, dc55: true }, stop, events, picked, onPick, resetKey, t }) {
  const [ref, width] = useWidth();
  const [hover, setHover] = React2.useState(null);
  const [range, setRange] = React2.useState({ count: DEFAULT_COUNT, end: 0 });
  const [dragging, setDragging] = React2.useState(false);
  React2.useEffect(() => {
    setRange({ count: DEFAULT_COUNT, end: 0 });
  }, [resetKey]);
  const total = bars.length;
  const count = clampNum(range.count, Math.min(MIN_COUNT, total), Math.max(1, total));
  const end = clampNum(range.end, 0, Math.max(0, total - count));
  const startIdx = Math.max(0, total - end - count);
  const view = bars.slice(startIdx, startIdx + count);
  const innerW = width - PAD.l - PAD.r;
  const step = view.length > 0 ? innerW / view.length : 1;
  const series = React2.useMemo(() => {
    const closes = bars.map((b) => b.close);
    const d20 = donchian(bars, 20);
    const d55 = donchian(bars, 55);
    return { ma20: sma(closes, 20), ma60: sma(closes, 60), up20: d20.upper, lo20: d20.lower, up55: d55.upper };
  }, [bars]);
  const allBuckets = React2.useMemo(() => events && events.length > 0 ? bucketByBar(events, bars) : null, [bars, events]);
  const buckets = allBuckets ? allBuckets.slice(startIdx, startIdx + view.length) : null;
  const live = React2.useRef({});
  live.current = { total, count, end, innerW, step, range: { count, end } };
  const wheelTarget = React2.useRef(null);
  const onWheel = React2.useCallback((e) => {
    const s = live.current;
    if (s.total === 0) return;
    e.preventDefault();
    setHover(null);
    const norm = (prev) => {
      const c = clampNum(prev.count, Math.min(MIN_COUNT, s.total), s.total);
      return { count: c, end: clampNum(prev.end, 0, Math.max(0, s.total - c)) };
    };
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      const shift = -Math.round(e.deltaX / Math.max(1, s.step));
      setRange((prev) => panRange(norm(prev), s.total, shift));
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const anchor = clampNum((e.clientX - rect.left - PAD.l) / Math.max(1, s.innerW), 0, 1);
    const factor = e.deltaY > 0 ? ZOOM_STEP : 1 / ZOOM_STEP;
    setRange((prev) => zoomRange(norm(prev), s.total, factor, anchor));
  }, []);
  const svgRef = React2.useCallback((el) => {
    wheelTarget.current?.removeEventListener("wheel", onWheel);
    wheelTarget.current = el;
    el?.addEventListener("wheel", onWheel, { passive: false });
  }, [onWheel]);
  const drag = React2.useRef(null);
  const suppressClick = React2.useRef(false);
  const onMouseDown = (e) => {
    if (e.button !== 0) return;
    drag.current = { x: e.clientX, range: live.current.range, moved: false };
    const move = (ev) => {
      const d = drag.current;
      if (d === null) return;
      const dx = ev.clientX - d.x;
      if (!d.moved && Math.abs(dx) > 3) {
        d.moved = true;
        setDragging(true);
        setHover(null);
      }
      if (d.moved) setRange(panRange(d.range, live.current.total, Math.round(dx / Math.max(1, live.current.step))));
    };
    const up = () => {
      suppressClick.current = drag.current?.moved === true;
      setTimeout(() => {
        suppressClick.current = false;
      }, 0);
      drag.current = null;
      setDragging(false);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };
  if (view.length === 0) return /* @__PURE__ */ React2.createElement("div", { className: "sm-chart-empty" }, t("chart.empty"));
  const priceTop = PAD.t + (buckets ? 10 : 0);
  const priceBottom = height * 0.76;
  const volTop = height * 0.8;
  const bw = Math.max(1, Math.min(12, step * 0.7));
  const at = (arr, i) => arr[startIdx + i];
  const vals = view.flatMap((b) => [b.high, b.low]);
  for (let i = 0; i < view.length; i++) {
    for (const k of ["ma20", "ma60", "up55"]) {
      const v = at(series[k], i);
      if (v !== null && v !== void 0) vals.push(v);
    }
  }
  if (stop) vals.push(stop);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const y = scaleY(min, max, priceTop, priceBottom);
  const vmax = Math.max(...view.map((b) => b.volume || 0)) || 1;
  const vy = (v) => height - PAD.b - v / vmax * (height - PAD.b - volTop);
  const x = (i) => PAD.l + step * i + step / 2;
  const line = (key) => path(view.map((_, i) => {
    const v = at(series[key], i);
    return [x(i), v === null || v === void 0 ? null : y(v)];
  }));
  const indexAt = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const i = Math.floor((e.clientX - rect.left - PAD.l) / step);
    return i >= 0 && i < view.length ? i : null;
  };
  const hoverIdx = hover !== null && hover >= 0 && hover < view.length ? hover : null;
  const h = hoverIdx === null ? view.length - 1 : hoverIdx;
  const hb = view[h];
  const hoverItems = hoverIdx !== null && buckets ? buckets[hoverIdx] ?? [] : [];
  const tipLeft = hoverIdx === null ? 0 : Math.min(Math.max(8, x(hoverIdx) - 140), Math.max(8, width - 300));
  const pickedIndex = picked ? view.findIndex((b) => b.date === picked) : -1;
  const dateTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(f * (view.length - 1))).filter((v, i, a) => a.indexOf(v) === i);
  const zoom = (factor) => setRange(zoomRange({ count, end }, total, factor, 1));
  const canZoomIn = count > Math.min(MIN_COUNT, total);
  const canZoomOut = count < total;
  const isDefault = end === 0 && count === Math.min(DEFAULT_COUNT, total);
  return /* @__PURE__ */ React2.createElement("div", { ref, className: "sm-chart" }, /* @__PURE__ */ React2.createElement("div", { className: "sm-chart-legend" }, /* @__PURE__ */ React2.createElement("span", null, hb.date), /* @__PURE__ */ React2.createElement("span", null, t("chart.open"), " ", price(hb.open)), /* @__PURE__ */ React2.createElement("span", null, t("chart.high"), " ", price(hb.high)), /* @__PURE__ */ React2.createElement("span", null, t("chart.low"), " ", price(hb.low)), /* @__PURE__ */ React2.createElement("span", null, t("chart.close"), " ", price(hb.close)), hb.pct !== null && hb.pct !== void 0 && /* @__PURE__ */ React2.createElement("span", { className: hb.pct > 0 ? "sm-up" : hb.pct < 0 ? "sm-down" : "" }, pct(hb.pct)), overlays.ma20 && /* @__PURE__ */ React2.createElement("span", { className: "sm-key sm-key-ma20" }, "MA20"), overlays.ma60 && /* @__PURE__ */ React2.createElement("span", { className: "sm-key sm-key-ma60" }, "MA60"), overlays.dc55 && /* @__PURE__ */ React2.createElement("span", { className: "sm-key sm-key-dc55" }, t("chart.dc55")), overlays.dc20 && /* @__PURE__ */ React2.createElement("span", { className: "sm-key sm-key-dc20" }, t("chart.dc20"))), /* @__PURE__ */ React2.createElement("div", { className: "sm-chart-tools" }, /* @__PURE__ */ React2.createElement("span", { className: "sm-chart-range" }, t("chart.range", { from: view[0].date, to: view[view.length - 1].date, n: view.length })), /* @__PURE__ */ React2.createElement("span", { className: "sm-muted" }, t("chart.zoomHint"), buckets ? ` · ${t("chart.eventsHint")}` : ""), /* @__PURE__ */ React2.createElement("span", { className: "sm-grow" }), /* @__PURE__ */ React2.createElement("button", { type: "button", className: "sm-icon-btn", "aria-label": t("chart.zoomOut"), title: t("chart.zoomOut"), disabled: !canZoomOut, onClick: () => zoom(ZOOM_STEP * ZOOM_STEP) }, "−"), /* @__PURE__ */ React2.createElement("button", { type: "button", className: "sm-icon-btn", "aria-label": t("chart.zoomIn"), title: t("chart.zoomIn"), disabled: !canZoomIn, onClick: () => zoom(1 / (ZOOM_STEP * ZOOM_STEP)) }, "＋"), /* @__PURE__ */ React2.createElement("button", { type: "button", className: "sm-btn sm-btn-ghost sm-btn-sm", disabled: isDefault, onClick: () => setRange({ count: DEFAULT_COUNT, end: 0 }) }, t("chart.reset"))), /* @__PURE__ */ React2.createElement(
    "svg",
    {
      ref: svgRef,
      width,
      height,
      role: "img",
      "aria-label": t("chart.aria"),
      className: dragging ? "sm-grabbing" : "sm-grab",
      onMouseDown,
      onMouseMove: (e) => {
        if (!drag.current?.moved) setHover(indexAt(e));
      },
      onMouseLeave: () => setHover(null),
      onDoubleClick: () => setRange({ count: DEFAULT_COUNT, end: 0 }),
      onClick: (e) => {
        if (suppressClick.current) {
          suppressClick.current = false;
          return;
        }
        const i = indexAt(e);
        if (i !== null && onPick) onPick(view[i].date);
      }
    },
    ticks(min, max).map((v) => /* @__PURE__ */ React2.createElement("g", { key: v }, /* @__PURE__ */ React2.createElement("line", { x1: PAD.l, x2: width - PAD.r, y1: y(v), y2: y(v), className: "sm-grid" }), /* @__PURE__ */ React2.createElement("text", { x: width - PAD.r + 4, y: y(v) + 4, className: "sm-axis" }, price(v)))),
    pickedIndex >= 0 && /* @__PURE__ */ React2.createElement("rect", { x: x(pickedIndex) - step / 2, y: PAD.t, width: step, height: height - PAD.b - PAD.t, className: "sm-picked" }),
    view.map((b, i) => {
      const up = b.close >= b.open;
      const big2 = b.pct !== null && b.pct !== void 0 && Math.abs(b.pct) >= 5;
      const cls = `${up ? "sm-candle-up" : "sm-candle-down"}${big2 ? " sm-candle-big" : ""}`;
      const top = y(Math.max(b.open, b.close));
      const bh = Math.max(1, Math.abs(y(b.open) - y(b.close)));
      return /* @__PURE__ */ React2.createElement("g", { key: b.date, className: cls }, /* @__PURE__ */ React2.createElement("line", { x1: x(i), x2: x(i), y1: y(b.high), y2: y(b.low) }), step >= 2 && /* @__PURE__ */ React2.createElement("rect", { x: x(i) - bw / 2, y: top, width: bw, height: bh }), /* @__PURE__ */ React2.createElement("rect", { x: x(i) - bw / 2, y: vy(b.volume || 0), width: bw, height: height - PAD.b - vy(b.volume || 0), className: "sm-vol" }));
    }),
    buckets && step >= 3 && buckets.map((items, i) => {
      if (items.length === 0) return null;
      const kind = topKind(items);
      return /* @__PURE__ */ React2.createElement("circle", { key: `ev${view[i].date}`, cx: x(i), cy: y(view[i].high) - 7, r: kind === "news" || kind === "flash" ? 2.2 : 3.2, className: `sm-ev sm-ev-${kind}` });
    }),
    overlays.ma20 && /* @__PURE__ */ React2.createElement("path", { d: line("ma20"), className: "sm-line-ma20" }),
    overlays.ma60 && /* @__PURE__ */ React2.createElement("path", { d: line("ma60"), className: "sm-line-ma60" }),
    overlays.dc55 && /* @__PURE__ */ React2.createElement("path", { d: line("up55"), className: "sm-line-dc55" }),
    overlays.dc20 && /* @__PURE__ */ React2.createElement("path", { d: line("up20"), className: "sm-line-dc20" }),
    overlays.dc20 && /* @__PURE__ */ React2.createElement("path", { d: line("lo20"), className: "sm-line-dc20" }),
    stop ? /* @__PURE__ */ React2.createElement("g", null, /* @__PURE__ */ React2.createElement("line", { x1: PAD.l, x2: width - PAD.r, y1: y(stop), y2: y(stop), className: "sm-line-stop" }), /* @__PURE__ */ React2.createElement("text", { x: PAD.l + 4, y: y(stop) - 4, className: "sm-axis sm-down" }, t("chart.stop"), " ", price(stop))) : null,
    hoverIdx !== null && /* @__PURE__ */ React2.createElement("line", { x1: x(hoverIdx), x2: x(hoverIdx), y1: PAD.t, y2: height - PAD.b, className: "sm-cross" }),
    dateTicks.map((idx, k) => /* @__PURE__ */ React2.createElement("text", { key: idx, x: x(idx), y: height - 4, className: "sm-axis", textAnchor: k === 0 ? "start" : k === dateTicks.length - 1 ? "end" : "middle" }, view[idx].date))
  ), hoverItems.length > 0 && !dragging && /* @__PURE__ */ React2.createElement("div", { className: "sm-tip", style: { left: tipLeft }, role: "tooltip" }, /* @__PURE__ */ React2.createElement("div", { className: "sm-tip-head" }, /* @__PURE__ */ React2.createElement("strong", null, hb.date), hb.pct !== null && hb.pct !== void 0 && /* @__PURE__ */ React2.createElement("span", { className: hb.pct > 0 ? "sm-up" : hb.pct < 0 ? "sm-down" : "" }, pct(hb.pct)), /* @__PURE__ */ React2.createElement("span", { className: "sm-muted" }, t("chart.eventsCount", { n: hoverItems.length }))), /* @__PURE__ */ React2.createElement("ul", null, hoverItems.slice(0, 4).map((item) => /* @__PURE__ */ React2.createElement("li", { key: item.id }, /* @__PURE__ */ React2.createElement("span", { className: `sm-ev-tag sm-ev-tag-${item.kind}` }, t(`ev.${item.kind}`)), item.title))), onPick && /* @__PURE__ */ React2.createElement("div", { className: "sm-muted sm-small" }, t("chart.clickToPin"))));
}
function LineChart({ points, height = 220, baseline, avg, t, colorByBaseline = true, valueFormat = price }) {
  const [ref, width] = useWidth();
  const [hover, setHover] = React2.useState(null);
  if (points.length < 2) return /* @__PURE__ */ React2.createElement("div", { className: "sm-chart-empty" }, t("chart.empty"));
  const vals = points.map((p) => p.value);
  if (baseline !== void 0 && baseline !== null) vals.push(baseline);
  if (avg) avg.forEach((v) => {
    if (v !== null) vals.push(v);
  });
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const y = scaleY(min, max, PAD.t, height - PAD.b);
  const innerW = width - PAD.l - PAD.r;
  const x = (i) => PAD.l + innerW * i / (points.length - 1);
  const last = points[points.length - 1].value;
  const ref0 = baseline ?? points[0].value;
  const cls = !colorByBaseline ? "sm-line-main" : last >= ref0 ? "sm-line-up" : "sm-line-down";
  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const i = Math.round((e.clientX - rect.left - PAD.l) / innerW * (points.length - 1));
    setHover(i >= 0 && i < points.length ? i : null);
  };
  const hoverIdx = hover !== null && hover >= 0 && hover < points.length ? hover : null;
  const hp = points[hoverIdx ?? points.length - 1];
  return /* @__PURE__ */ React2.createElement("div", { ref, className: "sm-chart" }, /* @__PURE__ */ React2.createElement("div", { className: "sm-chart-legend" }, /* @__PURE__ */ React2.createElement("span", null, hp.label), /* @__PURE__ */ React2.createElement("span", null, valueFormat(hp.value)), baseline !== void 0 && baseline !== null && /* @__PURE__ */ React2.createElement("span", { className: tonePct(hp.value, baseline) }, pct((hp.value / baseline - 1) * 100))), /* @__PURE__ */ React2.createElement("svg", { width, height, role: "img", "aria-label": t("chart.aria"), onMouseMove: onMove, onMouseLeave: () => setHover(null) }, ticks(min, max).map((v) => /* @__PURE__ */ React2.createElement("g", { key: v }, /* @__PURE__ */ React2.createElement("line", { x1: PAD.l, x2: width - PAD.r, y1: y(v), y2: y(v), className: "sm-grid" }), /* @__PURE__ */ React2.createElement("text", { x: width - PAD.r + 4, y: y(v) + 4, className: "sm-axis" }, valueFormat(v)))), baseline !== void 0 && baseline !== null && /* @__PURE__ */ React2.createElement("line", { x1: PAD.l, x2: width - PAD.r, y1: y(baseline), y2: y(baseline), className: "sm-line-base" }), avg && /* @__PURE__ */ React2.createElement("path", { d: path(avg.map((v, i) => [x(i), v === null ? null : y(v)])), className: "sm-line-ma60" }), /* @__PURE__ */ React2.createElement("path", { d: path(points.map((p, i) => [x(i), y(p.value)])), className: cls }), hoverIdx !== null && /* @__PURE__ */ React2.createElement("line", { x1: x(hoverIdx), x2: x(hoverIdx), y1: PAD.t, y2: height - PAD.b, className: "sm-cross" }), /* @__PURE__ */ React2.createElement("text", { x: PAD.l, y: height - 4, className: "sm-axis" }, points[0].label), /* @__PURE__ */ React2.createElement("text", { x: width - PAD.r, y: height - 4, className: "sm-axis", textAnchor: "end" }, points[points.length - 1].label)));
}
var tonePct = (v, base) => v > base ? "sm-up" : v < base ? "sm-down" : "";
function ScoreBar({ score }) {
  const left = Math.min(50, 50 + score / 2);
  const w = Math.abs(score) / 2;
  return /* @__PURE__ */ React2.createElement("div", { className: "sm-score", role: "meter", "aria-valuemin": -100, "aria-valuemax": 100, "aria-valuenow": score }, /* @__PURE__ */ React2.createElement("div", { className: "sm-score-mid" }), /* @__PURE__ */ React2.createElement("div", { className: `sm-score-fill ${score >= 0 ? "sm-bg-up" : "sm-bg-down"}`, style: { left: `${left}%`, width: `${w}%` } }));
}

// src/client/advisor.jsx
var React4 = __toESM(require("react"), 1);

// src/client/markdown.jsx
var React3 = __toESM(require("react"), 1);
function inline(text, keyBase) {
  const out = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*\s][^*]*\*|〔[^〕]{1,40}〕)/g;
  let last = 0;
  let m;
  let i = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const tok = m[0];
    const key = `${keyBase}-${i++}`;
    if (tok.startsWith("**")) out.push(/* @__PURE__ */ React3.createElement("strong", { key }, tok.slice(2, -2)));
    else if (tok.startsWith("`")) out.push(/* @__PURE__ */ React3.createElement("code", { key }, tok.slice(1, -1)));
    else if (tok.startsWith("〔")) out.push(/* @__PURE__ */ React3.createElement("span", { key, className: "sm-cite" }, tok));
    else out.push(/* @__PURE__ */ React3.createElement("em", { key }, tok.slice(1, -1)));
    last = m.index + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}
var isTableRow = (line) => /^\s*\|.*\|\s*$/.test(line);
var cells = (line) => line.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
function Markdown({ text }) {
  const lines = String(text ?? "").replace(/\r/g, "").split("\n");
  const blocks = [];
  let i = 0;
  let k = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === "") {
      i++;
      continue;
    }
    if (line.startsWith("```")) {
      const body = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) body.push(lines[i++]);
      i++;
      blocks.push(/* @__PURE__ */ React3.createElement("pre", { key: k++ }, /* @__PURE__ */ React3.createElement("code", null, body.join("\n"))));
      continue;
    }
    const h = /^(#{1,4})\s+(.*)$/.exec(line);
    if (h) {
      const Tag = `h${Math.min(6, h[1].length + 2)}`;
      blocks.push(/* @__PURE__ */ React3.createElement(Tag, { key: k++ }, inline(h[2], k)));
      i++;
      continue;
    }
    if (isTableRow(line) && i + 1 < lines.length && /^\s*\|[\s:|-]+\|\s*$/.test(lines[i + 1])) {
      const head = cells(line);
      i += 2;
      const rows = [];
      while (i < lines.length && isTableRow(lines[i])) rows.push(cells(lines[i++]));
      blocks.push(
        /* @__PURE__ */ React3.createElement("div", { key: k++, className: "sm-md-table" }, /* @__PURE__ */ React3.createElement("table", null, /* @__PURE__ */ React3.createElement("thead", null, /* @__PURE__ */ React3.createElement("tr", null, head.map((c, j) => /* @__PURE__ */ React3.createElement("th", { key: j }, inline(c, `${k}h${j}`))))), /* @__PURE__ */ React3.createElement("tbody", null, rows.map((r, ri) => /* @__PURE__ */ React3.createElement("tr", { key: ri }, r.map((c, j) => /* @__PURE__ */ React3.createElement("td", { key: j }, inline(c, `${k}r${ri}${j}`))))))))
      );
      continue;
    }
    if (/^\s*([-*+]|\d+[.)])\s+/.test(line)) {
      const ordered = /^\s*\d+[.)]/.test(line);
      const items = [];
      while (i < lines.length && /^\s*([-*+]|\d+[.)])\s+/.test(lines[i])) {
        const depth = /^(\s*)/.exec(lines[i])[1].length >= 2 ? 1 : 0;
        items.push({ depth, text: lines[i].replace(/^\s*([-*+]|\d+[.)])\s+/, "") });
        i++;
      }
      const List = ordered ? "ol" : "ul";
      blocks.push(/* @__PURE__ */ React3.createElement(List, { key: k++ }, items.map((it, j) => /* @__PURE__ */ React3.createElement("li", { key: j, className: it.depth ? "sm-md-sub" : void 0 }, inline(it.text, `${k}l${j}`)))));
      continue;
    }
    if (line.startsWith(">")) {
      const body = [];
      while (i < lines.length && lines[i].startsWith(">")) body.push(lines[i++].replace(/^>\s?/, ""));
      blocks.push(/* @__PURE__ */ React3.createElement("blockquote", { key: k++ }, inline(body.join(" "), k)));
      continue;
    }
    if (/^-{3,}$/.test(line.trim())) {
      blocks.push(/* @__PURE__ */ React3.createElement("hr", { key: k++ }));
      i++;
      continue;
    }
    const para = [];
    while (i < lines.length && lines[i].trim() !== "" && !/^(#{1,4}\s|```|>|\s*([-*+]|\d+[.)])\s)/.test(lines[i]) && !isTableRow(lines[i])) para.push(lines[i++]);
    if (para.length === 0) {
      para.push(lines[i++]);
    }
    blocks.push(/* @__PURE__ */ React3.createElement("p", { key: k++ }, inline(para.join("\n"), k)));
  }
  return /* @__PURE__ */ React3.createElement("div", { className: "sm-md" }, blocks);
}

// src/client/advisor.jsx
var modelState = createSharedState(null);
var modelLoad = null;
function loadModels(api2, refresh = false) {
  if (!refresh && modelLoad) return modelLoad;
  modelLoad = api2.aiModels(refresh).then((data) => {
    modelState.set(data);
    return data;
  }, (error) => {
    modelLoad = null;
    throw error;
  });
  return modelLoad;
}
var SEP = "";
function ModelPicker({ t, api: api2, disabled }) {
  const data = useShared(modelState);
  const [error, setError] = React4.useState(null);
  const [saving, setSaving] = React4.useState(false);
  React4.useEffect(() => {
    loadModels(api2).catch(setError);
  }, []);
  if (!data) return error ? /* @__PURE__ */ React4.createElement("div", { className: "sm-model-row" }, /* @__PURE__ */ React4.createElement("span", { className: "sm-muted sm-small" }, t("advisor.modelUnavailable"))) : null;
  const { models, current } = data;
  const find = (provider, id) => models.find((m) => m.provider === provider && m.id === id);
  const model = find(current.provider, current.model);
  const efforts = model?.efforts ?? [];
  const effortName = (id) => efforts.find((e) => e.id === id)?.name ?? id;
  const defaultModel = find(current.defaults.provider, current.defaults.model);
  const selected = current.custom ? `${current.provider}${SEP}${current.model}` : "";
  const groups = [];
  for (const m of models) {
    const g = groups.find((x) => x.provider === m.provider);
    if (g) g.list.push(m);
    else groups.push({ provider: m.provider, label: m.providerName || m.provider, list: [m] });
  }
  const save = async (body) => {
    setSaving(true);
    setError(null);
    try {
      const next = await api2.setAiModel(body);
      modelState.set({ ...modelState.get(), current: next });
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  };
  const onModel = (e) => {
    const value = e.target.value;
    if (value === "") return save({ reset: true });
    const [provider, id] = value.split(SEP);
    const next = find(provider, id);
    const keep = current.reasoning !== "auto" && next?.efforts.some((x) => x.id === current.reasoning) ? current.reasoning : "auto";
    return save({ provider, model: id, reasoning: keep });
  };
  const onReasoning = (e) => save({ provider: current.provider, model: current.model, reasoning: e.target.value });
  const refresh = async () => {
    setError(null);
    try {
      await loadModels(api2, true);
    } catch (err) {
      setError(err);
    }
  };
  return /* @__PURE__ */ React4.createElement("div", { className: "sm-model-row" }, /* @__PURE__ */ React4.createElement("label", { className: "sm-inline" }, /* @__PURE__ */ React4.createElement("span", { className: "sm-muted sm-small" }, t("advisor.modelLabel")), /* @__PURE__ */ React4.createElement("select", { value: selected, disabled: saving || disabled, onChange: onModel, "aria-label": t("advisor.modelLabel") }, /* @__PURE__ */ React4.createElement("option", { value: "" }, t("advisor.modelDefault", { model: defaultModel?.name ?? current.defaults.model })), groups.map((g) => /* @__PURE__ */ React4.createElement("optgroup", { key: g.provider, label: g.label }, g.list.map((m) => /* @__PURE__ */ React4.createElement("option", { key: `${m.provider}${SEP}${m.id}`, value: `${m.provider}${SEP}${m.id}`, title: m.description ?? m.id }, m.name)))), current.custom && !model && /* @__PURE__ */ React4.createElement("option", { value: selected }, current.model))), /* @__PURE__ */ React4.createElement("label", { className: "sm-inline" }, /* @__PURE__ */ React4.createElement("span", { className: "sm-muted sm-small" }, t("advisor.reasoningLabel")), /* @__PURE__ */ React4.createElement("select", { value: current.reasoning, disabled: saving || disabled || efforts.length === 0, onChange: onReasoning, "aria-label": t("advisor.reasoningLabel") }, /* @__PURE__ */ React4.createElement("option", { value: "auto" }, model?.defaultEffort ? t("advisor.reasoningAutoWith", { effort: effortName(model.defaultEffort) }) : t("advisor.reasoningAuto")), efforts.map((e) => /* @__PURE__ */ React4.createElement("option", { key: e.id, value: e.id, title: e.description ?? "" }, e.name)), current.reasoning !== "auto" && !efforts.some((e) => e.id === current.reasoning) && /* @__PURE__ */ React4.createElement("option", { value: current.reasoning }, current.reasoning))), /* @__PURE__ */ React4.createElement("button", { type: "button", className: "sm-btn sm-btn-ghost sm-btn-sm", title: t("advisor.modelRefresh"), "aria-label": t("advisor.modelRefresh"), onClick: refresh }, "↻"), error && /* @__PURE__ */ React4.createElement("span", { className: "sm-error sm-small" }, errorText(t, error)));
}
var QUICK = {
  security: ["quick.canBuy", "quick.holding", "quick.turtlePlan", "quick.threeBooks", "quick.outlook"],
  fund: ["quick.fundBuy", "quick.fundRisk", "quick.fundTrend"],
  screen: ["quick.screenPick", "quick.screenRisk"],
  general: ["quick.market", "quick.funds", "quick.stocks", "quick.live", "quick.portfolio", "quick.lesson"]
};
function AdvisorChat({ t, api: api2, symbol, kind, title, startSession, aiReady, request: request2 }) {
  const [messages, setMessages] = React4.useState([]);
  const [draft, setDraft] = React4.useState("");
  const [busy, setBusy] = React4.useState(false);
  const [error, setError] = React4.useState(null);
  const controllerRef = React4.useRef(null);
  const listRef = React4.useRef(null);
  const sectionRef = React4.useRef(null);
  React4.useEffect(() => {
    let alive = true;
    setMessages([]);
    setError(null);
    api2.chatHistory(symbol).then((m) => {
      if (alive) setMessages(m);
    }, () => {
    });
    return () => {
      alive = false;
      controllerRef.current?.abort();
    };
  }, [symbol]);
  React4.useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);
  const ask = async (question, focusDate) => {
    const q = question.trim();
    if (q === "" || busy) return;
    setDraft("");
    setError(null);
    setBusy(true);
    const controller = new AbortController();
    controllerRef.current = controller;
    const at = (/* @__PURE__ */ new Date()).toISOString();
    setMessages((m) => [...m, { role: "user", text: q, at }, { role: "assistant", text: "", at, pending: true }]);
    const patchLast = (fn) => setMessages((m) => {
      const copy = m.slice();
      copy[copy.length - 1] = fn(copy[copy.length - 1]);
      return copy;
    });
    try {
      await api2.chatStream({ symbol, question: q, focusDate }, {
        signal: controller.signal,
        onEvent: (ev) => {
          if (ev.type === "delta") patchLast((last) => ({ ...last, text: last.text + ev.text, thinking: false, status: null }));
          else if (ev.type === "status") patchLast((last) => ({ ...last, status: ev }));
          else if (ev.type === "thinking") patchLast((last) => ({ ...last, thinking: true }));
          else if (ev.type === "done") patchLast((last) => ({ ...last, pending: false, sources: ev.sources }));
          else if (ev.type === "error") {
            setError({ code: ev.code, params: { message: ev.message } });
            patchLast((last) => ({ ...last, pending: false, failed: true }));
          }
        }
      });
    } catch (err) {
      setError(err);
      patchLast((last) => ({ ...last, pending: false, failed: true }));
    } finally {
      setBusy(false);
      patchLast((last) => last.pending ? { ...last, pending: false } : last);
    }
  };
  React4.useEffect(() => {
    if (!request2) return;
    sectionRef.current?.scrollIntoView?.({ block: "nearest", behavior: "smooth" });
    ask(request2.question, request2.focusDate);
  }, [request2?.id]);
  const stop = () => controllerRef.current?.abort();
  const clear = async () => {
    stop();
    await api2.chatClear(symbol).catch(() => {
    });
    setMessages([]);
  };
  const toSession = () => {
    const q = draft.trim() || [...messages].reverse().find((m) => m.role === "user")?.text || t("quick.canBuy");
    if (startSession(t("advisor.sessionPrompt", { title, symbol, question: q })) === false) setError({ code: "session.unavailable" });
  };
  return /* @__PURE__ */ React4.createElement("section", { ref: sectionRef, className: "sm-card sm-advisor", "aria-label": t("advisor.title") }, /* @__PURE__ */ React4.createElement("header", { className: "sm-card-head" }, /* @__PURE__ */ React4.createElement("h3", null, t("advisor.title")), /* @__PURE__ */ React4.createElement("span", { className: "sm-muted" }, t("advisor.subtitle")), /* @__PURE__ */ React4.createElement("span", { className: "sm-grow" }), startSession && /* @__PURE__ */ React4.createElement("button", { type: "button", className: "sm-btn sm-btn-ghost", onClick: toSession }, t("advisor.toSession")), messages.length > 0 && /* @__PURE__ */ React4.createElement("button", { type: "button", className: "sm-btn sm-btn-ghost", onClick: clear }, t("advisor.clear"))), aiReady && /* @__PURE__ */ React4.createElement(ModelPicker, { t, api: api2, disabled: busy }), !aiReady && /* @__PURE__ */ React4.createElement("p", { className: "sm-notice" }, t("advisor.unavailable")), /* @__PURE__ */ React4.createElement("div", { className: "sm-chat", ref: listRef }, messages.length === 0 && /* @__PURE__ */ React4.createElement("p", { className: "sm-muted sm-chat-empty" }, t("advisor.empty")), messages.map((m, i) => /* @__PURE__ */ React4.createElement("div", { key: i, className: `sm-msg sm-msg-${m.role}` }, m.role === "user" ? /* @__PURE__ */ React4.createElement("p", null, m.text) : /* @__PURE__ */ React4.createElement(React4.Fragment, null, m.text === "" && m.pending ? /* @__PURE__ */ React4.createElement("p", { className: "sm-muted" }, m.thinking ? t("advisor.thinking") : m.status?.key === "screening" ? t("advisor.status.screening", { presets: (m.status.params?.presets ?? []).map((p) => t(`screen.${p}`)).join("、") }) : t("advisor.waiting")) : /* @__PURE__ */ React4.createElement(Markdown, { text: m.text }), m.sources?.length > 0 && /* @__PURE__ */ React4.createElement("details", { className: "sm-sources" }, /* @__PURE__ */ React4.createElement("summary", null, t("advisor.sources", { n: m.sources.length })), /* @__PURE__ */ React4.createElement("ul", null, m.sources.map((s) => /* @__PURE__ */ React4.createElement("li", { key: s }, s)))), !m.pending && /* @__PURE__ */ React4.createElement("div", { className: "sm-msg-meta" }, timeOf(m.at)))))), error && /* @__PURE__ */ React4.createElement("p", { className: "sm-error", role: "alert" }, errorText(t, error)), /* @__PURE__ */ React4.createElement("div", { className: "sm-quick" }, (QUICK[kind] ?? QUICK.security).map((key) => /* @__PURE__ */ React4.createElement("button", { key, type: "button", className: "sm-chip", disabled: busy || !aiReady, onClick: () => ask(t(key)) }, t(key)))), /* @__PURE__ */ React4.createElement("form", { className: "sm-chat-input", onSubmit: (e) => {
    e.preventDefault();
    ask(draft);
  } }, /* @__PURE__ */ React4.createElement(
    "textarea",
    {
      value: draft,
      onChange: (e) => setDraft(e.target.value),
      onKeyDown: (e) => {
        if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
          e.preventDefault();
          ask(draft);
        }
      },
      placeholder: t("advisor.placeholder"),
      "aria-label": t("advisor.placeholder"),
      rows: 2,
      disabled: !aiReady
    }
  ), busy ? /* @__PURE__ */ React4.createElement("button", { type: "button", className: "sm-btn", onClick: stop }, t("advisor.stop")) : /* @__PURE__ */ React4.createElement("button", { type: "submit", className: "sm-btn sm-btn-primary", disabled: !aiReady || draft.trim() === "" }, t("advisor.send"))), /* @__PURE__ */ React4.createElement("p", { className: "sm-disclaimer" }, t("advisor.disclaimer")));
}

// src/client/news.jsx
var React5 = __toESM(require("react"), 1);
var EVENT_GROUP = /* @__PURE__ */ new Set(["lhb", "dividend", "lift", "forecast", "report", "holder"]);
var FILTERS = {
  all: (i) => !i.future,
  news: (i) => !i.future && (i.kind === "news" || i.kind === "flash"),
  notice: (i) => !i.future && i.kind === "notice",
  event: (i) => !i.future && EVENT_GROUP.has(i.kind),
  upcoming: (i) => i.future === true
};
function NewsItem({ t, item, compact }) {
  return /* @__PURE__ */ React5.createElement("li", { className: "sm-news-item" }, /* @__PURE__ */ React5.createElement("div", { className: "sm-news-meta" }, /* @__PURE__ */ React5.createElement("span", { className: `sm-ev-tag sm-ev-tag-${item.kind}` }, t(`ev.${item.kind}`)), /* @__PURE__ */ React5.createElement("span", { className: "sm-muted" }, item.time), item.source && item.source !== t(`ev.${item.kind}`) && /* @__PURE__ */ React5.createElement("span", { className: "sm-muted" }, item.source)), /* @__PURE__ */ React5.createElement("a", { className: "sm-news-title", href: item.url, target: "_blank", rel: "noopener noreferrer" }, item.title), !compact && item.summary && /* @__PURE__ */ React5.createElement("p", { className: "sm-news-summary" }, item.summary), !compact && item.detail && /* @__PURE__ */ React5.createElement("p", { className: "sm-news-detail" }, item.detail));
}
function NewsCard({ t, data, error }) {
  const [filter, setFilter] = React5.useState("all");
  const [limit, setLimit] = React5.useState(20);
  React5.useEffect(() => {
    setLimit(20);
  }, [filter]);
  if (error && !data) return /* @__PURE__ */ React5.createElement("section", { className: "sm-card" }, /* @__PURE__ */ React5.createElement("p", { className: "sm-error" }, errorText(t, error)));
  const items = data?.items ?? [];
  const counts = Object.fromEntries(Object.entries(FILTERS).map(([k, f]) => [k, items.filter(f).length]));
  const shown = items.filter(FILTERS[filter]);
  const list = filter === "upcoming" ? [...shown].reverse() : shown;
  return /* @__PURE__ */ React5.createElement("section", { className: "sm-card", "aria-label": t("news.title") }, /* @__PURE__ */ React5.createElement("header", { className: "sm-card-head" }, /* @__PURE__ */ React5.createElement("h3", null, t("news.title")), data?.coverage && /* @__PURE__ */ React5.createElement("span", { className: "sm-muted" }, t("news.coverage", { from: data.coverage.from, to: data.coverage.to }))), /* @__PURE__ */ React5.createElement("div", { className: "sm-seg", role: "tablist", "aria-label": t("news.filter") }, Object.keys(FILTERS).map((k) => /* @__PURE__ */ React5.createElement("button", { key: k, type: "button", role: "tab", "aria-selected": filter === k, className: filter === k ? "sm-on" : "", onClick: () => setFilter(k) }, t(`news.f.${k}`), counts[k] > 0 ? ` ${counts[k]}` : ""))), !data && !error && /* @__PURE__ */ React5.createElement("p", { className: "sm-muted" }, t("common.loading")), data && list.length === 0 && /* @__PURE__ */ React5.createElement("p", { className: "sm-muted" }, t("news.empty")), /* @__PURE__ */ React5.createElement("ul", { className: "sm-news" }, list.slice(0, limit).map((item) => /* @__PURE__ */ React5.createElement(NewsItem, { key: item.id, t, item }))), list.length > limit && /* @__PURE__ */ React5.createElement("button", { type: "button", className: "sm-btn sm-btn-ghost", onClick: () => setLimit(limit + 30) }, t("news.more", { n: list.length - limit })), /* @__PURE__ */ React5.createElement("p", { className: "sm-hint" }, t("news.note")));
}
function DayEvents({ t, date, bars, news, onAsk, onClose }) {
  const i = bars.findIndex((b) => b.date === date);
  const bar = i >= 0 ? bars[i] : null;
  const items = news ? itemsForBar(news.items, date, i > 0 ? bars[i - 1].date : null) : [];
  const move = bar?.pct ?? null;
  const size = move === null ? "" : `${Math.abs(move).toFixed(2)}%`;
  const direction = move === null ? t("day.moved") : move >= 0 ? t("day.rose", { pct: size }) : t("day.fell", { pct: size });
  return /* @__PURE__ */ React5.createElement("section", { className: "sm-card sm-day", "aria-label": t("day.title", { date }) }, /* @__PURE__ */ React5.createElement("header", { className: "sm-card-head" }, /* @__PURE__ */ React5.createElement("h3", null, t("day.title", { date })), bar && /* @__PURE__ */ React5.createElement("span", { className: move > 0 ? "sm-up" : move < 0 ? "sm-down" : "" }, t("day.bar", { close: price(bar.close), pct: pct(move) })), /* @__PURE__ */ React5.createElement("span", { className: "sm-grow" }), /* @__PURE__ */ React5.createElement("button", { type: "button", className: "sm-btn sm-btn-ghost", onClick: onClose }, t("day.close"))), items.length === 0 ? /* @__PURE__ */ React5.createElement("p", { className: "sm-muted" }, news ? t("day.none") : t("common.loading")) : /* @__PURE__ */ React5.createElement("ul", { className: "sm-news" }, items.map((item) => /* @__PURE__ */ React5.createElement(NewsItem, { key: item.id, t, item }))), /* @__PURE__ */ React5.createElement("div", { className: "sm-form-actions" }, /* @__PURE__ */ React5.createElement("button", { type: "button", className: "sm-btn sm-btn-primary", onClick: () => onAsk(t("day.askQuestion", { date, direction }), date) }, t("day.ask", { direction }))), /* @__PURE__ */ React5.createElement("p", { className: "sm-hint" }, t("day.window")));
}

// src/client/detail.jsx
var STATE_KEY = { breakout: "sys.breakout", long: "sys.long", exit: "sys.exit", flat: "sys.flat" };
function Stat({ label, value, className }) {
  return /* @__PURE__ */ React6.createElement("div", { className: "sm-stat" }, /* @__PURE__ */ React6.createElement("span", { className: "sm-stat-label" }, label), /* @__PURE__ */ React6.createElement("span", { className: `sm-stat-value ${className ?? ""}` }, value));
}
function Reasons({ t, reasons }) {
  return /* @__PURE__ */ React6.createElement("ul", { className: "sm-reasons" }, reasons.map((r, i) => /* @__PURE__ */ React6.createElement("li", { key: i, className: `sm-reason-${r.tone}` }, /* @__PURE__ */ React6.createElement("span", { className: "sm-reason-dot", "aria-hidden": "true" }), t(`r.${r.key}`, r.params))));
}
function SignalCard({ t, a }) {
  if (!a) return /* @__PURE__ */ React6.createElement("section", { className: "sm-card" }, /* @__PURE__ */ React6.createElement("p", { className: "sm-muted" }, t("common.loading")));
  if (a.insufficient) return /* @__PURE__ */ React6.createElement("section", { className: "sm-card" }, /* @__PURE__ */ React6.createElement("p", { className: "sm-muted" }, t("signal.insufficient", { n: a.bars })));
  const plan = a.turtle?.plan;
  return /* @__PURE__ */ React6.createElement("section", { className: "sm-card", "aria-label": t("signal.title") }, /* @__PURE__ */ React6.createElement("header", { className: "sm-card-head" }, /* @__PURE__ */ React6.createElement("h3", null, t("signal.title")), /* @__PURE__ */ React6.createElement("span", { className: "sm-muted" }, t("signal.asOf", { date: a.asOf }))), /* @__PURE__ */ React6.createElement("div", { className: "sm-score-row" }, /* @__PURE__ */ React6.createElement("strong", { className: `sm-stance sm-stance-${a.stance}` }, t(`r.stance.${a.stance}`)), /* @__PURE__ */ React6.createElement("span", { className: "sm-muted" }, t("signal.score", { score: a.score }))), /* @__PURE__ */ React6.createElement(ScoreBar, { score: a.score }), /* @__PURE__ */ React6.createElement(Reasons, { t, reasons: a.reasons }), a.turtle && /* @__PURE__ */ React6.createElement("div", { className: "sm-grid-stats" }, /* @__PURE__ */ React6.createElement(Stat, { label: t("signal.trendFilter"), value: a.turtle.trendFilter === "up" ? t("signal.filterUp") : a.turtle.trendFilter === "down" ? t("signal.filterDown") : "—", className: a.turtle.trendFilter === "up" ? "sm-up" : a.turtle.trendFilter === "down" ? "sm-down" : "" }), /* @__PURE__ */ React6.createElement(Stat, { label: t("signal.system1"), value: t(STATE_KEY[a.turtle.system1.state]) }), /* @__PURE__ */ React6.createElement(Stat, { label: t("signal.system2"), value: t(STATE_KEY[a.turtle.system2.state]) }), plan && /* @__PURE__ */ React6.createElement(Stat, { label: "N", value: `${price(plan.n, 3)}（${plan.nPct}%）` }), plan && /* @__PURE__ */ React6.createElement(Stat, { label: t("signal.stopNow"), value: price(plan.buyNow.stop), className: "sm-down" }), plan?.s2Entry && /* @__PURE__ */ React6.createElement(Stat, { label: t("signal.s2Entry"), value: price(plan.s2Entry.price) }), plan && /* @__PURE__ */ React6.createElement(Stat, { label: t("signal.unit"), value: t("signal.shares", { n: plan.unitShares }) }), plan && /* @__PURE__ */ React6.createElement(Stat, { label: t("signal.riskAtStop"), value: big(plan.riskAtStop, t) }), a.volatility && /* @__PURE__ */ React6.createElement(Stat, { label: t("signal.volAnnual"), value: `${a.volatility.annual}%` }), /* @__PURE__ */ React6.createElement(Stat, { label: t("signal.mdd1y"), value: `${a.maxDrawdown1y}%`, className: "sm-down" }), a.rsi !== null && /* @__PURE__ */ React6.createElement(Stat, { label: "RSI14", value: a.rsi }), /* @__PURE__ */ React6.createElement(Stat, { label: t("signal.mom60"), value: pct(a.momentum?.d60), className: tone(a.momentum?.d60) })), plan && /* @__PURE__ */ React6.createElement("p", { className: "sm-hint" }, t("signal.planHint", { equity: big(plan.equity, t), risk: plan.riskPct * 100 })));
}
function BaseRate({ t, label, s }) {
  if (!s) return /* @__PURE__ */ React6.createElement("tr", null, /* @__PURE__ */ React6.createElement("td", null, label), /* @__PURE__ */ React6.createElement("td", { colSpan: 5, className: "sm-muted" }, t("forecast.noHistory")));
  if (s.count === 0) return /* @__PURE__ */ React6.createElement("tr", null, /* @__PURE__ */ React6.createElement("td", null, label), /* @__PURE__ */ React6.createElement("td", { colSpan: 5, className: "sm-muted" }, t("forecast.never")));
  return /* @__PURE__ */ React6.createElement("tr", null, /* @__PURE__ */ React6.createElement("td", null, label), /* @__PURE__ */ React6.createElement("td", null, s.count), /* @__PURE__ */ React6.createElement("td", null, s.winRate, "%"), /* @__PURE__ */ React6.createElement("td", { className: tone(s.avg) }, pct(s.avg)), /* @__PURE__ */ React6.createElement("td", { className: tone(s.median) }, pct(s.median)), /* @__PURE__ */ React6.createElement("td", null, s.stopHitRate, "%"));
}
function ForecastCard({ t, a, fund }) {
  if (!a || a.insufficient || !a.forecast) return null;
  return /* @__PURE__ */ React6.createElement("section", { className: "sm-card", "aria-label": t("forecast.title") }, /* @__PURE__ */ React6.createElement("header", { className: "sm-card-head" }, /* @__PURE__ */ React6.createElement("h3", null, t("forecast.title")), /* @__PURE__ */ React6.createElement("span", { className: "sm-muted" }, t("forecast.subtitle"))), /* @__PURE__ */ React6.createElement("table", { className: "sm-table sm-table-compact" }, /* @__PURE__ */ React6.createElement("thead", null, /* @__PURE__ */ React6.createElement("tr", null, /* @__PURE__ */ React6.createElement("th", null, t("forecast.horizon")), /* @__PURE__ */ React6.createElement("th", null, t("forecast.p68")), /* @__PURE__ */ React6.createElement("th", null, t("forecast.p95")), /* @__PURE__ */ React6.createElement("th", null, t("forecast.move")))), /* @__PURE__ */ React6.createElement("tbody", null, Object.entries(a.forecast).map(([h, v]) => /* @__PURE__ */ React6.createElement("tr", { key: h }, /* @__PURE__ */ React6.createElement("td", null, t("forecast.days", { n: h.slice(1) })), /* @__PURE__ */ React6.createElement("td", null, price(v.p68[0]), " ～ ", price(v.p68[1])), /* @__PURE__ */ React6.createElement("td", null, price(v.p95[0]), " ～ ", price(v.p95[1])), /* @__PURE__ */ React6.createElement("td", null, "±", v.move, "%"))))), !fund && a.baseRates && /* @__PURE__ */ React6.createElement(React6.Fragment, null, /* @__PURE__ */ React6.createElement("h4", { className: "sm-subhead" }, t("forecast.baseTitle")), /* @__PURE__ */ React6.createElement("table", { className: "sm-table sm-table-compact" }, /* @__PURE__ */ React6.createElement("thead", null, /* @__PURE__ */ React6.createElement("tr", null, /* @__PURE__ */ React6.createElement("th", null, t("forecast.signal")), /* @__PURE__ */ React6.createElement("th", null, t("forecast.count")), /* @__PURE__ */ React6.createElement("th", null, t("forecast.win")), /* @__PURE__ */ React6.createElement("th", null, t("forecast.avg")), /* @__PURE__ */ React6.createElement("th", null, t("forecast.median")), /* @__PURE__ */ React6.createElement("th", null, t("forecast.stopHit")))), /* @__PURE__ */ React6.createElement("tbody", null, /* @__PURE__ */ React6.createElement(BaseRate, { t, label: t("forecast.s2f"), s: a.baseRates.system2 }), /* @__PURE__ */ React6.createElement(BaseRate, { t, label: t("forecast.s1f"), s: a.baseRates.system1 }), /* @__PURE__ */ React6.createElement(BaseRate, { t, label: t("forecast.s2raw"), s: a.baseRates.system2Raw })))), /* @__PURE__ */ React6.createElement("p", { className: "sm-hint" }, t("forecast.note")));
}
function OrderForm({ t, api: api2, symbol, quote, plan, position, onDone }) {
  const [side, setSide] = React6.useState(position ? "sell" : "buy");
  const [type, setType] = React6.useState("market");
  const [qty, setQty] = React6.useState(String(position ? position.available || position.qty : plan?.unitShares || 100));
  const [limit, setLimit] = React6.useState(quote?.price ? String(quote.price) : "");
  const [stop, setStop] = React6.useState(plan?.buyNow?.stop ? String(plan.buyNow.stop) : "");
  const [busy, setBusy] = React6.useState(false);
  const [result, setResult] = React6.useState(null);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setResult(null);
    try {
      const r = await api2.order({ symbol, side, qty: Number(qty), type, price: type === "limit" ? Number(limit) : void 0, stop: side === "buy" && stop !== "" ? Number(stop) : void 0 });
      setResult({ ok: true, text: t(r.order.status === "filled" ? "order.filled" : "order.pending", { qty: r.order.qty, price: price(r.order.fillPrice ?? r.order.price) }) });
      onDone?.();
    } catch (error) {
      setResult({ ok: false, text: errorText(t, error) });
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ React6.createElement("form", { className: "sm-card sm-form", onSubmit: submit, "aria-label": t("order.title") }, /* @__PURE__ */ React6.createElement("header", { className: "sm-card-head" }, /* @__PURE__ */ React6.createElement("h3", null, t("order.title")), /* @__PURE__ */ React6.createElement("span", { className: "sm-muted" }, t("order.rules"))), /* @__PURE__ */ React6.createElement("div", { className: "sm-seg", role: "group", "aria-label": t("order.side") }, /* @__PURE__ */ React6.createElement("button", { type: "button", className: side === "buy" ? "sm-on sm-bg-up" : "", onClick: () => setSide("buy") }, t("order.buy")), /* @__PURE__ */ React6.createElement("button", { type: "button", className: side === "sell" ? "sm-on sm-bg-down" : "", onClick: () => setSide("sell") }, t("order.sell"))), /* @__PURE__ */ React6.createElement("div", { className: "sm-form-row" }, /* @__PURE__ */ React6.createElement("label", null, t("order.type"), /* @__PURE__ */ React6.createElement("select", { value: type, onChange: (e) => setType(e.target.value) }, /* @__PURE__ */ React6.createElement("option", { value: "market" }, t("order.market")), /* @__PURE__ */ React6.createElement("option", { value: "limit" }, t("order.limit")))), /* @__PURE__ */ React6.createElement("label", null, t("order.qty"), /* @__PURE__ */ React6.createElement("input", { type: "number", min: "1", step: "1", value: qty, onChange: (e) => setQty(e.target.value) })), type === "limit" && /* @__PURE__ */ React6.createElement("label", null, t("order.price"), /* @__PURE__ */ React6.createElement("input", { type: "number", step: "0.001", value: limit, onChange: (e) => setLimit(e.target.value) })), side === "buy" && /* @__PURE__ */ React6.createElement("label", null, t("order.stop"), /* @__PURE__ */ React6.createElement("input", { type: "number", step: "0.001", value: stop, onChange: (e) => setStop(e.target.value) }))), plan && side === "buy" && /* @__PURE__ */ React6.createElement("p", { className: "sm-hint" }, t("order.planHint", { n: plan.unitShares, stop: price(plan.buyNow.stop) })), position && /* @__PURE__ */ React6.createElement("p", { className: "sm-hint" }, t("order.positionHint", { qty: position.qty, avail: position.available, cost: price(position.avgCost) })), /* @__PURE__ */ React6.createElement("div", { className: "sm-form-actions" }, /* @__PURE__ */ React6.createElement("button", { type: "submit", className: "sm-btn sm-btn-primary", disabled: busy }, busy ? t("common.working") : t("order.submit"))), result && /* @__PURE__ */ React6.createElement("p", { className: result.ok ? "sm-ok" : "sm-error", role: "status" }, result.text));
}
var ALERT_TYPES = ["priceAbove", "priceBelow", "pctAbove", "pctBelow", "breakout20", "breakout55", "breakdown10", "breakdown20"];
function AlertForm({ t, api: api2, symbol, quote, onDone }) {
  const [type, setType] = React6.useState("priceAbove");
  const [value, setValue] = React6.useState(quote?.price ? String(quote.price) : "");
  const [result, setResult] = React6.useState(null);
  const needsValue = type.startsWith("price") || type.startsWith("pct");
  const submit = async (e) => {
    e.preventDefault();
    try {
      await api2.alert({ symbol, type, value: needsValue ? Number(value) : void 0 });
      setResult({ ok: true, text: t("alert.added") });
      onDone?.();
    } catch (error) {
      setResult({ ok: false, text: errorText(t, error) });
    }
  };
  return /* @__PURE__ */ React6.createElement("form", { className: "sm-card sm-form", onSubmit: submit, "aria-label": t("alert.title") }, /* @__PURE__ */ React6.createElement("header", { className: "sm-card-head" }, /* @__PURE__ */ React6.createElement("h3", null, t("alert.title"))), /* @__PURE__ */ React6.createElement("div", { className: "sm-form-row" }, /* @__PURE__ */ React6.createElement("label", null, t("alert.type"), /* @__PURE__ */ React6.createElement("select", { value: type, onChange: (e) => setType(e.target.value) }, ALERT_TYPES.map((k) => /* @__PURE__ */ React6.createElement("option", { key: k, value: k }, t(`alert.t.${k}`))))), needsValue && /* @__PURE__ */ React6.createElement("label", null, type.startsWith("pct") ? t("alert.pct") : t("alert.price"), /* @__PURE__ */ React6.createElement("input", { type: "number", step: "0.01", value, onChange: (e) => setValue(e.target.value) }))), /* @__PURE__ */ React6.createElement("div", { className: "sm-form-actions" }, /* @__PURE__ */ React6.createElement("button", { type: "submit", className: "sm-btn sm-btn-primary" }, t("alert.add"))), result && /* @__PURE__ */ React6.createElement("p", { className: result.ok ? "sm-ok" : "sm-error", role: "status" }, result.text));
}
var PERIODS = ["trends", "day", "week", "month", "m60"];
function SecurityDetail({ t, api: api2, symbol, watched, onToggleWatch, paper, onPaperChange, onRecordLive, startSession, aiReady }) {
  const [period, setPeriod] = React6.useState("day");
  const [panel, setPanel] = React6.useState(null);
  const [quote, qErr] = usePoll((signal) => api2.quote(symbol, signal), 5e3, [symbol]);
  const [analysis] = usePoll((signal) => api2.analysis(symbol, signal), 6e4, [symbol]);
  const [chart, cErr] = usePoll(
    (signal) => period === "trends" ? api2.trends(symbol, signal) : api2.kline(symbol, period, { day: 1e3, week: 600, month: 300, m60: 500 }[period] ?? 300, signal),
    period === "trends" || period === "m60" ? 15e3 : 6e4,
    [symbol, period]
  );
  const [news, newsErr] = usePoll((signal) => api2.news(symbol, signal), 6e5, [symbol]);
  const [picked, setPicked] = React6.useState(null);
  const [askReq, setAskReq] = React6.useState(null);
  React6.useEffect(() => {
    setPanel(null);
    setPicked(null);
  }, [symbol]);
  React6.useEffect(() => {
    setPicked(null);
  }, [period]);
  const position = paper?.positions?.find((p) => p.secid === symbol);
  const plan = analysis?.turtle?.plan;
  if (qErr && !quote) return /* @__PURE__ */ React6.createElement("section", { className: "sm-card" }, /* @__PURE__ */ React6.createElement("p", { className: "sm-error" }, errorText(t, qErr)));
  if (!quote) return /* @__PURE__ */ React6.createElement("section", { className: "sm-card" }, /* @__PURE__ */ React6.createElement("p", { className: "sm-muted" }, t("common.loading")));
  const title = `${quote.name}（${quote.code}）`;
  return /* @__PURE__ */ React6.createElement("div", { className: "sm-detail-inner" }, /* @__PURE__ */ React6.createElement("section", { className: "sm-card sm-quote-head" }, /* @__PURE__ */ React6.createElement("div", { className: "sm-quote-title" }, /* @__PURE__ */ React6.createElement("h2", null, quote.name), /* @__PURE__ */ React6.createElement("span", { className: "sm-muted" }, quote.code, " · ", t(`kind.${quote.region}.${quote.kind}`))), /* @__PURE__ */ React6.createElement("div", { className: `sm-quote-price ${tone(quote.pct)}` }, /* @__PURE__ */ React6.createElement("strong", null, price(quote.price)), /* @__PURE__ */ React6.createElement("span", null, pct(quote.pct)), /* @__PURE__ */ React6.createElement("span", null, quote.change > 0 ? "+" : "", price(quote.change))), /* @__PURE__ */ React6.createElement("div", { className: "sm-grid-stats" }, /* @__PURE__ */ React6.createElement(Stat, { label: t("q.open"), value: price(quote.open) }), /* @__PURE__ */ React6.createElement(Stat, { label: t("q.high"), value: price(quote.high), className: "sm-up" }), /* @__PURE__ */ React6.createElement(Stat, { label: t("q.low"), value: price(quote.low), className: "sm-down" }), /* @__PURE__ */ React6.createElement(Stat, { label: t("q.prevClose"), value: price(quote.prevClose) }), /* @__PURE__ */ React6.createElement(Stat, { label: t("q.amount"), value: big(quote.amount, t) }), /* @__PURE__ */ React6.createElement(Stat, { label: t("q.turnover"), value: quote.turnover === null ? "—" : `${quote.turnover}%` }), /* @__PURE__ */ React6.createElement(Stat, { label: t("q.pe"), value: quote.pe ?? "—" }), /* @__PURE__ */ React6.createElement(Stat, { label: t("q.mcap"), value: big(quote.mcap, t) }), quote.limitUp ? /* @__PURE__ */ React6.createElement(Stat, { label: t("q.limits"), value: `${price(quote.limitUp)} / ${price(quote.limitDown)}` }) : null), /* @__PURE__ */ React6.createElement("div", { className: "sm-actions" }, /* @__PURE__ */ React6.createElement("button", { type: "button", className: "sm-btn", "aria-pressed": watched, onClick: onToggleWatch }, watched ? t("action.unwatch") : t("action.watch")), quote.paperTradable && /* @__PURE__ */ React6.createElement("button", { type: "button", className: "sm-btn", "aria-expanded": panel === "order", onClick: () => setPanel(panel === "order" ? null : "order") }, t("action.trade")), quote.paperTradable && onRecordLive && /* @__PURE__ */ React6.createElement("button", { type: "button", className: "sm-btn", onClick: () => onRecordLive(symbol) }, t("action.live")), /* @__PURE__ */ React6.createElement("button", { type: "button", className: "sm-btn", "aria-expanded": panel === "alert", onClick: () => setPanel(panel === "alert" ? null : "alert") }, t("action.alert")))), panel === "order" && /* @__PURE__ */ React6.createElement(OrderForm, { t, api: api2, symbol, quote, plan, position, onDone: onPaperChange }), panel === "alert" && /* @__PURE__ */ React6.createElement(AlertForm, { t, api: api2, symbol, quote }), /* @__PURE__ */ React6.createElement("section", { className: "sm-card" }, /* @__PURE__ */ React6.createElement("div", { className: "sm-seg", role: "tablist", "aria-label": t("chart.period") }, PERIODS.map((p) => /* @__PURE__ */ React6.createElement("button", { key: p, type: "button", role: "tab", "aria-selected": period === p, className: period === p ? "sm-on" : "", onClick: () => setPeriod(p) }, t(`period.${p}`)))), cErr && !chart && /* @__PURE__ */ React6.createElement("p", { className: "sm-error" }, errorText(t, cErr)), chart && period === "trends" && /* @__PURE__ */ React6.createElement(LineChart, { t, baseline: chart.preClose, avg: chart.points.map((p) => p.avg), points: chart.points.map((p) => ({ label: p.time, value: p.price })) }), chart && period !== "trends" && /* @__PURE__ */ React6.createElement(
    CandleChart,
    {
      t,
      bars: chart.bars ?? [],
      stop: position?.stop ?? void 0,
      overlays: { ma20: true, ma60: true, dc55: period === "day", dc20: false },
      events: ["day", "week", "month"].includes(period) ? news?.items : void 0,
      picked,
      onPick: setPicked,
      resetKey: `${symbol}:${period}`
    }
  )), picked && chart?.bars && /* @__PURE__ */ React6.createElement(
    DayEvents,
    {
      t,
      date: picked,
      bars: chart.bars,
      news,
      onAsk: (question, focusDate) => setAskReq({ id: Date.now(), question, focusDate }),
      onClose: () => setPicked(null)
    }
  ), /* @__PURE__ */ React6.createElement(SignalCard, { t, a: analysis }), /* @__PURE__ */ React6.createElement(ForecastCard, { t, a: analysis }), /* @__PURE__ */ React6.createElement(NewsCard, { t, data: news, error: newsErr }), /* @__PURE__ */ React6.createElement(AdvisorChat, { t, api: api2, symbol, kind: "security", title, startSession, aiReady, request: askReq }));
}
var NAV_RANGES = { y1: 250, y3: 750, all: Infinity };
function FundDetail({ t, api: api2, symbol, watched, onToggleWatch, onRecordLive, startSession, aiReady }) {
  const code = symbol.slice(5);
  const [range, setRange] = React6.useState("y1");
  const [fund, err] = usePoll((signal) => api2.fund(code, signal), 6e5, [code]);
  const [news, newsErr] = usePoll((signal) => api2.news(symbol, signal), 6e5, [symbol]);
  if (err && !fund) return /* @__PURE__ */ React6.createElement("section", { className: "sm-card" }, /* @__PURE__ */ React6.createElement("p", { className: "sm-error" }, errorText(t, err)));
  if (!fund) return /* @__PURE__ */ React6.createElement("section", { className: "sm-card" }, /* @__PURE__ */ React6.createElement("p", { className: "sm-muted" }, t("common.loading")));
  const a = fund.analysis;
  const last = fund.navs[fund.navs.length - 1];
  const navs = fund.navs.slice(-NAV_RANGES[range]);
  return /* @__PURE__ */ React6.createElement("div", { className: "sm-detail-inner" }, /* @__PURE__ */ React6.createElement("section", { className: "sm-card sm-quote-head" }, /* @__PURE__ */ React6.createElement("div", { className: "sm-quote-title" }, /* @__PURE__ */ React6.createElement("h2", null, fund.name), /* @__PURE__ */ React6.createElement("span", { className: "sm-muted" }, fund.code, " · ", t("kind.fund"))), /* @__PURE__ */ React6.createElement("div", { className: `sm-quote-price ${tone(last?.pct)}` }, /* @__PURE__ */ React6.createElement("strong", null, price(last?.nav, 4)), /* @__PURE__ */ React6.createElement("span", null, pct(last?.pct)), /* @__PURE__ */ React6.createElement("span", { className: "sm-muted" }, last?.date)), a && !a.insufficient && /* @__PURE__ */ React6.createElement("div", { className: "sm-grid-stats" }, ["m1", "m3", "m6", "y1", "y3"].map((k) => /* @__PURE__ */ React6.createElement(Stat, { key: k, label: t(`fund.${k}`), value: pct(a.returns[k]), className: tone(a.returns[k]) })), /* @__PURE__ */ React6.createElement(Stat, { label: t("fund.fromPeak"), value: pct(a.fromPeak), className: tone(a.fromPeak) }), /* @__PURE__ */ React6.createElement(Stat, { label: t("fund.mdd"), value: `${a.maxDrawdown1y}%`, className: "sm-down" }), /* @__PURE__ */ React6.createElement(Stat, { label: t("fund.fee"), value: fund.feeRate ? `${fund.feeRate}%` : "—" }), /* @__PURE__ */ React6.createElement(Stat, { label: t("fund.scale"), value: fund.scale?.value ? `${fund.scale.value}${t("unit.yi")}` : "—" })), /* @__PURE__ */ React6.createElement("p", { className: "sm-hint" }, t("fund.managers"), "：", fund.managers.map((m) => `${m.name}（${m.workTime}）`).join("、") || "—"), /* @__PURE__ */ React6.createElement("div", { className: "sm-actions" }, /* @__PURE__ */ React6.createElement("button", { type: "button", className: "sm-btn", "aria-pressed": watched, onClick: onToggleWatch }, watched ? t("action.unwatch") : t("action.watch")), onRecordLive && /* @__PURE__ */ React6.createElement("button", { type: "button", className: "sm-btn", onClick: () => onRecordLive(symbol) }, t("action.live"))), /* @__PURE__ */ React6.createElement("p", { className: "sm-hint" }, t("fund.noRealtime"))), /* @__PURE__ */ React6.createElement("section", { className: "sm-card" }, /* @__PURE__ */ React6.createElement("div", { className: "sm-seg", role: "tablist", "aria-label": t("chart.period") }, Object.keys(NAV_RANGES).map((r) => /* @__PURE__ */ React6.createElement("button", { key: r, type: "button", role: "tab", "aria-selected": range === r, className: range === r ? "sm-on" : "", onClick: () => setRange(r) }, t(`fund.range.${r}`)))), /* @__PURE__ */ React6.createElement(LineChart, { t, points: navs.map((p) => ({ label: p.date, value: p.nav })), valueFormat: (v) => price(v, 4) })), fund.holdings?.length > 0 && /* @__PURE__ */ React6.createElement("section", { className: "sm-card" }, /* @__PURE__ */ React6.createElement("header", { className: "sm-card-head" }, /* @__PURE__ */ React6.createElement("h3", null, t("fund.holdings"))), /* @__PURE__ */ React6.createElement("table", { className: "sm-table sm-table-compact" }, /* @__PURE__ */ React6.createElement("thead", null, /* @__PURE__ */ React6.createElement("tr", null, /* @__PURE__ */ React6.createElement("th", null, t("col.name")), /* @__PURE__ */ React6.createElement("th", null, t("col.code")), /* @__PURE__ */ React6.createElement("th", null, t("fund.weight")))), /* @__PURE__ */ React6.createElement("tbody", null, fund.holdings.map((h) => /* @__PURE__ */ React6.createElement("tr", { key: h.code }, /* @__PURE__ */ React6.createElement("td", null, h.name), /* @__PURE__ */ React6.createElement("td", null, h.code), /* @__PURE__ */ React6.createElement("td", null, h.weight === null ? "—" : `${h.weight}%`)))))), a && !a.insufficient && /* @__PURE__ */ React6.createElement("section", { className: "sm-card" }, /* @__PURE__ */ React6.createElement("header", { className: "sm-card-head" }, /* @__PURE__ */ React6.createElement("h3", null, t("signal.title")), /* @__PURE__ */ React6.createElement("span", { className: "sm-muted" }, t("signal.asOf", { date: a.asOf }))), /* @__PURE__ */ React6.createElement("div", { className: "sm-score-row" }, /* @__PURE__ */ React6.createElement("strong", { className: `sm-stance sm-stance-${a.stance}` }, t(`r.stance.${a.stance}`)), /* @__PURE__ */ React6.createElement("span", { className: "sm-muted" }, t("signal.score", { score: a.score }))), /* @__PURE__ */ React6.createElement(ScoreBar, { score: a.score }), /* @__PURE__ */ React6.createElement(Reasons, { t, reasons: a.reasons })), /* @__PURE__ */ React6.createElement(ForecastCard, { t, a, fund: true }), /* @__PURE__ */ React6.createElement(NewsCard, { t, data: news, error: newsErr }), /* @__PURE__ */ React6.createElement(AdvisorChat, { t, api: api2, symbol, kind: "fund", title: `${fund.name}（${fund.code}）`, startSession, aiReady }));
}
function Detail(props) {
  return isFund(props.symbol) ? /* @__PURE__ */ React6.createElement(FundDetail, { ...props }) : /* @__PURE__ */ React6.createElement(SecurityDetail, { ...props });
}

// src/client/panels.jsx
var React7 = __toESM(require("react"), 1);
var MARKET_GROUPS = [
  { id: "stock", markets: ["a", "sh", "sz", "cyb", "kcb", "bj", "hk", "us"] },
  { id: "fund", markets: ["etf", "lof", "fund"] }
];
var QUOTE_COLS = [
  { key: "price", field: "f2", fmt: (r) => price(r.price), toneBy: "pct" },
  { key: "pct", field: "f3", fmt: (r) => pct(r.pct), toneBy: "pct" },
  { key: "amount", field: "f6", fmt: (r, t) => big(r.amount, t) },
  { key: "turnover", field: "f8", fmt: (r) => r.turnover === null ? "—" : `${r.turnover}%` },
  { key: "mcap", field: "f20", fmt: (r, t) => big(r.mcap, t) },
  { key: "pct60", field: "f24", fmt: (r) => pct(r.pct60), toneBy: "pct60" }
];
function Pager({ t, page, total, size, onPage }) {
  const pages = Math.max(1, Math.ceil(total / size));
  return /* @__PURE__ */ React7.createElement("div", { className: "sm-pager" }, /* @__PURE__ */ React7.createElement("button", { type: "button", className: "sm-btn sm-btn-ghost", disabled: page <= 1, onClick: () => onPage(page - 1) }, t("pager.prev")), /* @__PURE__ */ React7.createElement("span", { className: "sm-muted" }, t("pager.info", { page, pages, total })), /* @__PURE__ */ React7.createElement("button", { type: "button", className: "sm-btn sm-btn-ghost", disabled: page >= pages, onClick: () => onPage(page + 1) }, t("pager.next")));
}
function SortHeader({ t, col, sort, order, onSort }) {
  const active = sort === col.field;
  return /* @__PURE__ */ React7.createElement("th", { "aria-sort": active ? order === "asc" ? "ascending" : "descending" : "none" }, /* @__PURE__ */ React7.createElement("button", { type: "button", className: "sm-th-btn", onClick: () => onSort(col.field) }, t(`col.${col.key}`), active ? order === "asc" ? " ↑" : " ↓" : ""));
}
function QuoteList({ t, api: api2, market, onSelect, selected }) {
  const [sort, setSort] = React7.useState("f3");
  const [order, setOrder] = React7.useState("desc");
  const [page, setPage] = React7.useState(1);
  React7.useEffect(() => {
    setPage(1);
  }, [market, sort, order]);
  const [data, error] = usePoll((signal) => api2.list({ market, sort, order, page, size: 50 }, signal), 5e3, [market, sort, order, page]);
  const onSort = (field) => {
    if (field === sort) setOrder(order === "desc" ? "asc" : "desc");
    else {
      setSort(field);
      setOrder("desc");
    }
  };
  return /* @__PURE__ */ React7.createElement("div", { className: "sm-panel" }, error && /* @__PURE__ */ React7.createElement("p", { className: "sm-error", role: "alert" }, errorText(t, error)), /* @__PURE__ */ React7.createElement("div", { className: "sm-table-wrap" }, /* @__PURE__ */ React7.createElement("table", { className: "sm-table sm-table-hover" }, /* @__PURE__ */ React7.createElement("thead", null, /* @__PURE__ */ React7.createElement("tr", null, /* @__PURE__ */ React7.createElement("th", null, t("col.name")), QUOTE_COLS.map((c) => /* @__PURE__ */ React7.createElement(SortHeader, { key: c.key, t, col: c, sort, order, onSort })))), /* @__PURE__ */ React7.createElement("tbody", null, (data?.rows ?? []).map((r) => /* @__PURE__ */ React7.createElement("tr", { key: r.secid, className: selected === r.secid ? "sm-row-on" : "", onClick: () => onSelect(r.secid) }, /* @__PURE__ */ React7.createElement("td", null, /* @__PURE__ */ React7.createElement("button", { type: "button", className: "sm-link", onClick: (e) => {
    e.stopPropagation();
    onSelect(r.secid);
  } }, r.name), /* @__PURE__ */ React7.createElement("div", { className: "sm-muted sm-small" }, r.code)), QUOTE_COLS.map((c) => /* @__PURE__ */ React7.createElement("td", { key: c.key, className: c.toneBy ? tone(r[c.toneBy]) : "" }, c.fmt(r, t))))), data && data.rows.length === 0 && /* @__PURE__ */ React7.createElement("tr", null, /* @__PURE__ */ React7.createElement("td", { colSpan: 7, className: "sm-muted" }, t("common.empty"))), !data && !error && /* @__PURE__ */ React7.createElement("tr", null, /* @__PURE__ */ React7.createElement("td", { colSpan: 7, className: "sm-muted" }, t("common.loading")))))), data && /* @__PURE__ */ React7.createElement(Pager, { t, page, total: data.total, size: 50, onPage: setPage }));
}
var FUND_TYPES = ["all", "gp", "hh", "zq", "zs", "qdii", "fof"];
var FUND_SORTS = [["rzdf", "day"], ["zzf", "week"], ["1yzf", "month"], ["3yzf", "month3"], ["6yzf", "month6"], ["1nzf", "year1"], ["3nzf", "year3"], ["jnzf", "ytd"]];
function FundList({ t, api: api2, onSelect, selected }) {
  const [type, setType] = React7.useState("all");
  const [sort, setSort] = React7.useState("1nzf");
  const [page, setPage] = React7.useState(1);
  React7.useEffect(() => {
    setPage(1);
  }, [type, sort]);
  const [data, error] = usePoll((signal) => api2.list({ market: "fund", type, sort, page, size: 50 }, signal), 3e5, [type, sort, page]);
  return /* @__PURE__ */ React7.createElement("div", { className: "sm-panel" }, /* @__PURE__ */ React7.createElement("div", { className: "sm-toolbar" }, /* @__PURE__ */ React7.createElement("div", { className: "sm-seg", role: "group", "aria-label": t("fundList.type") }, FUND_TYPES.map((k) => /* @__PURE__ */ React7.createElement("button", { key: k, type: "button", className: type === k ? "sm-on" : "", onClick: () => setType(k) }, t(`fundType.${k}`)))), /* @__PURE__ */ React7.createElement("label", { className: "sm-inline" }, t("fundList.sort"), /* @__PURE__ */ React7.createElement("select", { value: sort, onChange: (e) => setSort(e.target.value) }, FUND_SORTS.map(([k, label]) => /* @__PURE__ */ React7.createElement("option", { key: k, value: k }, t(`fundCol.${label}`)))))), error && /* @__PURE__ */ React7.createElement("p", { className: "sm-error", role: "alert" }, errorText(t, error)), /* @__PURE__ */ React7.createElement("div", { className: "sm-table-wrap" }, /* @__PURE__ */ React7.createElement("table", { className: "sm-table sm-table-hover" }, /* @__PURE__ */ React7.createElement("thead", null, /* @__PURE__ */ React7.createElement("tr", null, /* @__PURE__ */ React7.createElement("th", null, t("col.name")), /* @__PURE__ */ React7.createElement("th", null, t("fundCol.nav")), ["day", "month", "month3", "year1", "ytd"].map((k) => /* @__PURE__ */ React7.createElement("th", { key: k }, t(`fundCol.${k}`))))), /* @__PURE__ */ React7.createElement("tbody", null, (data?.rows ?? []).map((r) => /* @__PURE__ */ React7.createElement("tr", { key: r.code, className: selected === r.symbol ? "sm-row-on" : "", onClick: () => onSelect(r.symbol) }, /* @__PURE__ */ React7.createElement("td", null, /* @__PURE__ */ React7.createElement("button", { type: "button", className: "sm-link", onClick: (e) => {
    e.stopPropagation();
    onSelect(r.symbol);
  } }, r.name), /* @__PURE__ */ React7.createElement("div", { className: "sm-muted sm-small" }, r.code, " · ", r.date)), /* @__PURE__ */ React7.createElement("td", null, price(r.nav, 4)), ["day", "month", "month3", "year1", "ytd"].map((k) => /* @__PURE__ */ React7.createElement("td", { key: k, className: tone(r[k]) }, pct(r[k]))))), !data && !error && /* @__PURE__ */ React7.createElement("tr", null, /* @__PURE__ */ React7.createElement("td", { colSpan: 7, className: "sm-muted" }, t("common.loading")))))), data && /* @__PURE__ */ React7.createElement(Pager, { t, page, total: data.total, size: 50, onPage: setPage }), /* @__PURE__ */ React7.createElement("p", { className: "sm-hint" }, t("fundList.note")));
}
function Watchlist({ t, items, error, onSelect, onRemove, selected }) {
  if (error && !items) return /* @__PURE__ */ React7.createElement("p", { className: "sm-error" }, errorText(t, error));
  if (!items) return /* @__PURE__ */ React7.createElement("p", { className: "sm-muted" }, t("common.loading"));
  if (items.length === 0) return /* @__PURE__ */ React7.createElement("p", { className: "sm-muted sm-empty" }, t("watch.empty"));
  return /* @__PURE__ */ React7.createElement("div", { className: "sm-table-wrap" }, /* @__PURE__ */ React7.createElement("table", { className: "sm-table sm-table-hover" }, /* @__PURE__ */ React7.createElement("thead", null, /* @__PURE__ */ React7.createElement("tr", null, /* @__PURE__ */ React7.createElement("th", null, t("col.name")), /* @__PURE__ */ React7.createElement("th", null, t("col.price")), /* @__PURE__ */ React7.createElement("th", null, t("col.pct")), /* @__PURE__ */ React7.createElement("th", null, t("col.amount")), /* @__PURE__ */ React7.createElement("th", null))), /* @__PURE__ */ React7.createElement("tbody", null, items.map((i) => /* @__PURE__ */ React7.createElement("tr", { key: i.symbol, className: selected === i.symbol ? "sm-row-on" : "", onClick: () => onSelect(i.symbol) }, /* @__PURE__ */ React7.createElement("td", null, /* @__PURE__ */ React7.createElement("button", { type: "button", className: "sm-link", onClick: (e) => {
    e.stopPropagation();
    onSelect(i.symbol);
  } }, i.name), /* @__PURE__ */ React7.createElement("div", { className: "sm-muted sm-small" }, i.code, isFund(i.symbol) ? ` · ${t("kind.fund")}` : "")), /* @__PURE__ */ React7.createElement("td", { className: tone(i.pct) }, price(i.price, isFund(i.symbol) ? 4 : void 0)), /* @__PURE__ */ React7.createElement("td", { className: tone(i.pct) }, pct(i.pct)), /* @__PURE__ */ React7.createElement("td", null, big(i.amount, t)), /* @__PURE__ */ React7.createElement("td", null, /* @__PURE__ */ React7.createElement("button", { type: "button", className: "sm-btn sm-btn-ghost", "aria-label": t("watch.remove", { name: i.name }), onClick: (e) => {
    e.stopPropagation();
    onRemove(i.symbol);
  } }, t("watch.removeShort"))))))));
}
function StopEditor({ t, api: api2, position, onDone }) {
  const [value, setValue] = React7.useState(position.stop ?? "");
  const [err, setErr] = React7.useState(null);
  const save = async () => {
    try {
      await api2.setStop(position.secid, value === "" ? null : Number(value));
      setErr(null);
      onDone();
    } catch (error) {
      setErr(errorText(t, error));
    }
  };
  return /* @__PURE__ */ React7.createElement("span", { className: "sm-inline" }, /* @__PURE__ */ React7.createElement("input", { className: "sm-input-sm", type: "number", step: "0.001", value, "aria-label": t("paper.stopFor", { name: position.name }), onChange: (e) => setValue(e.target.value), onClick: (e) => e.stopPropagation() }), /* @__PURE__ */ React7.createElement("button", { type: "button", className: "sm-btn sm-btn-ghost", onClick: (e) => {
    e.stopPropagation();
    save();
  } }, t("common.save")), err && /* @__PURE__ */ React7.createElement("span", { className: "sm-error" }, err));
}
function PaperPanel({ t, api: api2, paper, error, refresh, onSelect }) {
  const [busy, setBusy] = React7.useState(false);
  const [msg, setMsg] = React7.useState(null);
  if (error && !paper) return /* @__PURE__ */ React7.createElement("p", { className: "sm-error" }, errorText(t, error));
  if (!paper) return /* @__PURE__ */ React7.createElement("p", { className: "sm-muted" }, t("common.loading"));
  const act = async (fn) => {
    setBusy(true);
    setMsg(null);
    try {
      await fn();
      refresh();
    } catch (e) {
      setMsg(errorText(t, e));
    } finally {
      setBusy(false);
    }
  };
  const sellAll = (p) => act(() => api2.order({ symbol: p.secid, side: "sell", qty: p.available, type: "market" }));
  const pending = paper.orders.filter((o) => o.status === "pending");
  return /* @__PURE__ */ React7.createElement("div", { className: "sm-panel" }, /* @__PURE__ */ React7.createElement("div", { className: "sm-grid-stats sm-grid-wide" }, /* @__PURE__ */ React7.createElement("div", { className: "sm-stat" }, /* @__PURE__ */ React7.createElement("span", { className: "sm-stat-label" }, t("paper.equity")), /* @__PURE__ */ React7.createElement("span", { className: "sm-stat-value" }, money(paper.equity))), /* @__PURE__ */ React7.createElement("div", { className: "sm-stat" }, /* @__PURE__ */ React7.createElement("span", { className: "sm-stat-label" }, t("paper.pnl")), /* @__PURE__ */ React7.createElement("span", { className: `sm-stat-value ${tone(paper.totalPnl)}` }, money(paper.totalPnl), "（", pct(paper.totalPnlPct), "）")), /* @__PURE__ */ React7.createElement("div", { className: "sm-stat" }, /* @__PURE__ */ React7.createElement("span", { className: "sm-stat-label" }, t("paper.cash")), /* @__PURE__ */ React7.createElement("span", { className: "sm-stat-value" }, money(paper.availableCash))), /* @__PURE__ */ React7.createElement("div", { className: "sm-stat" }, /* @__PURE__ */ React7.createElement("span", { className: "sm-stat-label" }, t("paper.value")), /* @__PURE__ */ React7.createElement("span", { className: "sm-stat-value" }, money(paper.marketValue))), /* @__PURE__ */ React7.createElement("div", { className: "sm-stat" }, /* @__PURE__ */ React7.createElement("span", { className: "sm-stat-label" }, t("paper.realized")), /* @__PURE__ */ React7.createElement("span", { className: `sm-stat-value ${tone(paper.realized)}` }, money(paper.realized))), /* @__PURE__ */ React7.createElement("div", { className: "sm-stat" }, /* @__PURE__ */ React7.createElement("span", { className: "sm-stat-label" }, t("paper.fees")), /* @__PURE__ */ React7.createElement("span", { className: "sm-stat-value" }, money(paper.feesPaid)))), paper.equityHistory.length >= 2 && /* @__PURE__ */ React7.createElement("section", { className: "sm-card" }, /* @__PURE__ */ React7.createElement("header", { className: "sm-card-head" }, /* @__PURE__ */ React7.createElement("h3", null, t("paper.curve"))), /* @__PURE__ */ React7.createElement(LineChart, { t, baseline: paper.initialCash, points: paper.equityHistory.map((p) => ({ label: p.date, value: p.equity })), height: 160, valueFormat: (v) => big(v, t) })), msg && /* @__PURE__ */ React7.createElement("p", { className: "sm-error", role: "alert" }, msg), /* @__PURE__ */ React7.createElement("h4", { className: "sm-subhead" }, t("paper.positions")), paper.positions.length === 0 ? /* @__PURE__ */ React7.createElement("p", { className: "sm-muted" }, t("paper.noPositions")) : /* @__PURE__ */ React7.createElement("div", { className: "sm-table-wrap" }, /* @__PURE__ */ React7.createElement("table", { className: "sm-table sm-table-hover" }, /* @__PURE__ */ React7.createElement("thead", null, /* @__PURE__ */ React7.createElement("tr", null, /* @__PURE__ */ React7.createElement("th", null, t("col.name")), /* @__PURE__ */ React7.createElement("th", null, t("paper.qty")), /* @__PURE__ */ React7.createElement("th", null, t("paper.cost")), /* @__PURE__ */ React7.createElement("th", null, t("col.price")), /* @__PURE__ */ React7.createElement("th", null, t("paper.pnl")), /* @__PURE__ */ React7.createElement("th", null, t("paper.stop")), /* @__PURE__ */ React7.createElement("th", null))), /* @__PURE__ */ React7.createElement("tbody", null, paper.positions.map((p) => /* @__PURE__ */ React7.createElement("tr", { key: p.secid, onClick: () => onSelect(p.secid) }, /* @__PURE__ */ React7.createElement("td", null, /* @__PURE__ */ React7.createElement("button", { type: "button", className: "sm-link", onClick: (e) => {
    e.stopPropagation();
    onSelect(p.secid);
  } }, p.name), /* @__PURE__ */ React7.createElement("div", { className: "sm-muted sm-small" }, p.code)), /* @__PURE__ */ React7.createElement("td", null, p.qty, /* @__PURE__ */ React7.createElement("div", { className: "sm-muted sm-small" }, t("paper.avail", { n: p.available }))), /* @__PURE__ */ React7.createElement("td", null, price(p.avgCost)), /* @__PURE__ */ React7.createElement("td", { className: tone(p.pct) }, price(p.price)), /* @__PURE__ */ React7.createElement("td", { className: tone(p.pnl) }, money(p.pnl), /* @__PURE__ */ React7.createElement("div", { className: "sm-small" }, pct(p.pnlPct))), /* @__PURE__ */ React7.createElement("td", null, /* @__PURE__ */ React7.createElement(StopEditor, { t, api: api2, position: p, onDone: refresh })), /* @__PURE__ */ React7.createElement("td", null, /* @__PURE__ */ React7.createElement("button", { type: "button", className: "sm-btn sm-btn-ghost", disabled: busy || p.available === 0, onClick: (e) => {
    e.stopPropagation();
    sellAll(p);
  } }, t("paper.sellAll")))))))), pending.length > 0 && /* @__PURE__ */ React7.createElement(React7.Fragment, null, /* @__PURE__ */ React7.createElement("h4", { className: "sm-subhead" }, t("paper.pending")), /* @__PURE__ */ React7.createElement("table", { className: "sm-table sm-table-compact" }, /* @__PURE__ */ React7.createElement("tbody", null, pending.map((o) => /* @__PURE__ */ React7.createElement("tr", { key: o.id }, /* @__PURE__ */ React7.createElement("td", null, o.name), /* @__PURE__ */ React7.createElement("td", null, t(`order.${o.side}`)), /* @__PURE__ */ React7.createElement("td", null, o.qty), /* @__PURE__ */ React7.createElement("td", null, price(o.price)), /* @__PURE__ */ React7.createElement("td", { className: "sm-muted" }, o.tradeDate), /* @__PURE__ */ React7.createElement("td", null, /* @__PURE__ */ React7.createElement("button", { type: "button", className: "sm-btn sm-btn-ghost", disabled: busy, onClick: () => act(() => api2.cancel(o.id)) }, t("paper.cancel")))))))), /* @__PURE__ */ React7.createElement("h4", { className: "sm-subhead" }, t("paper.trades")), paper.trades.length === 0 ? /* @__PURE__ */ React7.createElement("p", { className: "sm-muted" }, t("paper.noTrades")) : /* @__PURE__ */ React7.createElement("table", { className: "sm-table sm-table-compact" }, /* @__PURE__ */ React7.createElement("tbody", null, paper.trades.slice(0, 30).map((tr) => /* @__PURE__ */ React7.createElement("tr", { key: tr.id }, /* @__PURE__ */ React7.createElement("td", { className: "sm-muted" }, timeOf(tr.at)), /* @__PURE__ */ React7.createElement("td", null, tr.name), /* @__PURE__ */ React7.createElement("td", { className: tr.side === "buy" ? "sm-up" : "sm-down" }, t(`order.${tr.side}`)), /* @__PURE__ */ React7.createElement("td", null, tr.qty), /* @__PURE__ */ React7.createElement("td", null, price(tr.price)), /* @__PURE__ */ React7.createElement("td", null, t("paper.fee", { fee: money(tr.fee) })), /* @__PURE__ */ React7.createElement("td", { className: tone(tr.realized) }, tr.realized === null ? "" : money(tr.realized)))))), /* @__PURE__ */ React7.createElement("div", { className: "sm-form-actions" }, /* @__PURE__ */ React7.createElement("button", { type: "button", className: "sm-btn sm-btn-ghost", disabled: busy, onClick: () => {
    if (window.confirm(t("paper.resetConfirm"))) act(() => api2.resetPaper(paper.initialCash));
  } }, t("paper.reset"))), /* @__PURE__ */ React7.createElement("p", { className: "sm-hint" }, t("paper.rules")));
}
var PRESETS = ["turtle55", "turtle20", "strong", "etfTrend", "fundTrend"];
var FUND_TYPE = { zs: "fundType.zs", gp: "fundType.gp", hh: "fundType.hh" };
function ScreenPanel({ t, api: api2, onSelect, onDiscuss }) {
  const [preset, setPreset] = React7.useState("turtle55");
  const [status, setStatus] = React7.useState(null);
  const [error, setError] = React7.useState(null);
  React7.useEffect(() => {
    let alive = true;
    let timer;
    const poll = async () => {
      try {
        const s = await api2.screen(preset);
        if (!alive) return;
        setStatus(s);
        if (s.status === "running") timer = setTimeout(poll, 1e3);
      } catch (e) {
        if (alive) setError(e);
      }
    };
    setStatus(null);
    poll();
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [preset]);
  const run = async (force) => {
    setError(null);
    try {
      setStatus(await api2.runScreen(preset, force));
      const wait = async () => {
        const s = await api2.screen(preset);
        setStatus(s);
        if (s.status === "running") setTimeout(wait, 1e3);
      };
      setTimeout(wait, 800);
    } catch (e) {
      setError(e);
    }
  };
  const result = status?.status === "done" ? status.result : null;
  const fundPreset = preset === "fundTrend";
  return /* @__PURE__ */ React7.createElement("div", { className: "sm-panel" }, /* @__PURE__ */ React7.createElement("div", { className: "sm-preset-grid", role: "radiogroup", "aria-label": t("screen.presets") }, PRESETS.map((p) => /* @__PURE__ */ React7.createElement("button", { key: p, type: "button", role: "radio", "aria-checked": preset === p, className: `sm-preset ${preset === p ? "sm-on" : ""}`, onClick: () => setPreset(p) }, /* @__PURE__ */ React7.createElement("strong", null, t(`screen.${p}`)), /* @__PURE__ */ React7.createElement("span", null, t(`screen.${p}.desc`))))), /* @__PURE__ */ React7.createElement("div", { className: "sm-toolbar" }, /* @__PURE__ */ React7.createElement("button", { type: "button", className: "sm-btn sm-btn-primary", disabled: status?.status === "running", onClick: () => run(status?.status === "done") }, status?.status === "running" ? t("screen.running", { done: status.done, total: status.total || "…" }) : status?.status === "done" ? t("screen.rerun") : t("screen.run")), result && /* @__PURE__ */ React7.createElement("span", { className: "sm-muted" }, t("screen.summary", { at: timeOf(result.at), universe: result.universe, scanned: result.scanned, n: result.hits ?? result.candidates.length }), result.hits !== void 0 && result.hits !== result.candidates.length ? t("screen.grouped", { n: result.candidates.length }) : ""), result && result.candidates.length > 0 && /* @__PURE__ */ React7.createElement("button", { type: "button", className: "sm-btn", onClick: () => onDiscuss(`screen:${preset}`) }, t("screen.discuss"))), error && /* @__PURE__ */ React7.createElement("p", { className: "sm-error", role: "alert" }, errorText(t, error)), status?.status === "error" && /* @__PURE__ */ React7.createElement("p", { className: "sm-error", role: "alert" }, t("screen.failed", { message: status.error })), result && (result.candidates.length === 0 ? /* @__PURE__ */ React7.createElement("p", { className: "sm-muted" }, t("screen.none")) : /* @__PURE__ */ React7.createElement("div", { className: "sm-table-wrap" }, /* @__PURE__ */ React7.createElement("table", { className: "sm-table sm-table-hover" }, /* @__PURE__ */ React7.createElement("thead", null, /* @__PURE__ */ React7.createElement("tr", null, /* @__PURE__ */ React7.createElement("th", null, t("col.name")), /* @__PURE__ */ React7.createElement("th", null, t(fundPreset ? "fundCol.nav" : "col.price")), /* @__PURE__ */ React7.createElement("th", null, t("screen.score")), /* @__PURE__ */ React7.createElement("th", null, t("signal.system2")), /* @__PURE__ */ React7.createElement("th", null, t(fundPreset ? "screen.stopFund" : "signal.stopNow")), /* @__PURE__ */ React7.createElement("th", null, t(fundPreset ? "screen.unitPct" : "signal.unit")), /* @__PURE__ */ React7.createElement("th", null, t("screen.why")))), /* @__PURE__ */ React7.createElement("tbody", null, result.candidates.map((c) => /* @__PURE__ */ React7.createElement("tr", { key: c.secid, onClick: () => onSelect(c.secid) }, /* @__PURE__ */ React7.createElement("td", null, /* @__PURE__ */ React7.createElement("button", { type: "button", className: "sm-link", onClick: (e) => {
    e.stopPropagation();
    onSelect(c.secid);
  } }, c.name), /* @__PURE__ */ React7.createElement("div", { className: "sm-muted sm-small" }, c.code, c.fund && FUND_TYPE[c.fundType] ? ` · ${t(FUND_TYPE[c.fundType])}` : "", " · ", t("col.pct60"), " ", pct(c.momentum60)), c.similarCount > 0 && /* @__PURE__ */ React7.createElement("div", { className: "sm-muted sm-small", title: c.similar.map((x) => `${x.name} ${x.code}`).join("\n") }, t("screen.similar", { n: c.similarCount, names: c.similar.slice(0, 2).map((x) => x.name).join("、") }))), /* @__PURE__ */ React7.createElement("td", { className: tone(c.pct) }, price(c.price, c.fund ? 4 : void 0), /* @__PURE__ */ React7.createElement("div", { className: "sm-small" }, pct(c.pct), c.navDate ? /* @__PURE__ */ React7.createElement("span", { className: "sm-muted" }, " · ", c.navDate.slice(5)) : null)), /* @__PURE__ */ React7.createElement("td", null, c.score), /* @__PURE__ */ React7.createElement("td", null, t(`sys.${c.s2}`), c.s2EntryDate ? /* @__PURE__ */ React7.createElement("div", { className: "sm-muted sm-small" }, c.s2EntryDate) : null), /* @__PURE__ */ React7.createElement("td", { className: "sm-down" }, price(c.stop, c.fund ? 4 : void 0)), /* @__PURE__ */ React7.createElement("td", null, c.fund ? c.unitPct === null ? "—" : `${c.unitPct}%` : c.unitShares), /* @__PURE__ */ React7.createElement("td", { className: "sm-small" }, c.reasons.slice(0, 2).map((r) => t(`r.${r.key}`, r.params)).join("；")))))))), /* @__PURE__ */ React7.createElement("p", { className: "sm-hint" }, t(fundPreset ? "screen.noteFund" : "screen.note")));
}
function AlertsPanel({ t, api: api2, data, error, refresh, onSelect }) {
  if (error && !data) return /* @__PURE__ */ React7.createElement("p", { className: "sm-error" }, errorText(t, error));
  if (!data) return /* @__PURE__ */ React7.createElement("p", { className: "sm-muted" }, t("common.loading"));
  const run = async (body) => {
    try {
      await api2.alert(body);
    } finally {
      refresh();
    }
  };
  return /* @__PURE__ */ React7.createElement("div", { className: "sm-panel" }, /* @__PURE__ */ React7.createElement("div", { className: "sm-toolbar" }, /* @__PURE__ */ React7.createElement("h4", { className: "sm-subhead" }, t("alerts.events")), /* @__PURE__ */ React7.createElement("span", { className: "sm-grow" }), data.unread > 0 && /* @__PURE__ */ React7.createElement("button", { type: "button", className: "sm-btn sm-btn-ghost", onClick: () => run({ action: "read" }) }, t("alerts.markRead")), data.events.length > 0 && /* @__PURE__ */ React7.createElement("button", { type: "button", className: "sm-btn sm-btn-ghost", onClick: () => run({ action: "clearEvents" }) }, t("alerts.clear"))), data.events.length === 0 ? /* @__PURE__ */ React7.createElement("p", { className: "sm-muted" }, t("alerts.noEvents")) : /* @__PURE__ */ React7.createElement("ul", { className: "sm-events" }, data.events.map((e) => /* @__PURE__ */ React7.createElement("li", { key: e.id, className: e.read ? "" : "sm-unread" }, /* @__PURE__ */ React7.createElement("button", { type: "button", className: "sm-link", onClick: () => onSelect(e.symbol) }, e.name), /* @__PURE__ */ React7.createElement("span", null, t(`event.${e.kind}`, { type: t(`alert.t.${e.type}`), value: e.value, price: price(e.price), side: e.kind === "fill" ? t(`order.${e.type}`) : "" })), /* @__PURE__ */ React7.createElement("span", { className: "sm-muted sm-small" }, timeOf(e.at))))), /* @__PURE__ */ React7.createElement("h4", { className: "sm-subhead" }, t("alerts.rules")), data.alerts.length === 0 ? /* @__PURE__ */ React7.createElement("p", { className: "sm-muted" }, t("alerts.noRules")) : /* @__PURE__ */ React7.createElement("table", { className: "sm-table sm-table-compact" }, /* @__PURE__ */ React7.createElement("tbody", null, data.alerts.map((a) => /* @__PURE__ */ React7.createElement("tr", { key: a.id }, /* @__PURE__ */ React7.createElement("td", null, /* @__PURE__ */ React7.createElement("button", { type: "button", className: "sm-link", onClick: () => onSelect(a.symbol) }, a.name)), /* @__PURE__ */ React7.createElement("td", null, t(`alert.t.${a.type}`), a.value !== null ? ` ${a.value}` : ""), /* @__PURE__ */ React7.createElement("td", { className: "sm-muted" }, a.active ? t("alerts.active") : t("alerts.fired", { at: timeOf(a.triggeredAt) })), /* @__PURE__ */ React7.createElement("td", null, /* @__PURE__ */ React7.createElement("button", { type: "button", className: "sm-btn sm-btn-ghost", onClick: () => run({ action: "remove", id: a.id }) }, t("common.delete"))))))), /* @__PURE__ */ React7.createElement("p", { className: "sm-hint" }, t("alerts.note")));
}

// src/client/live.jsx
var React8 = __toESM(require("react"), 1);
var isFundId = (symbol) => typeof symbol === "string" && symbol.startsWith("fund:");
var qtyText = (q, fund) => fund ? Number(q).toFixed(2) : String(q);
var FUND_KEYS = /* @__PURE__ */ new Set(["sellStop", "exitSignal", "addUnit"]);
var rTone = (r) => r > 0 ? "sm-up" : r < 0 ? "sm-down" : "";
var rText = (r) => r === null || r === void 0 ? "—" : `${r > 0 ? "+" : ""}${r}R`;
function Field({ label, children, hint }) {
  return /* @__PURE__ */ React8.createElement("label", { className: "sm-field" }, /* @__PURE__ */ React8.createElement("span", null, label), children, hint && /* @__PURE__ */ React8.createElement("small", { className: "sm-muted" }, hint));
}
function PlanWizard({ t, api: api2, onAdopted, initial }) {
  const [form, setForm] = React8.useState(initial ?? { assets: "", monthlyExpense: "", emergencySaved: false, maxLoss: "", experience: "none", needIncome: false });
  const [plan, setPlan] = React8.useState(null);
  const [start, setStart] = React8.useState("");
  const [risk, setRisk] = React8.useState("");
  const [error, setError] = React8.useState(null);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const profile = () => ({ ...form, assets: Number(form.assets) || 0, monthlyExpense: Number(form.monthlyExpense) || 0, maxLoss: Number(form.maxLoss) || 0 });
  const preview = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const p = await api2.livePreview(profile());
      setPlan(p);
      setStart(String(p.startCapital));
      setRisk(String(p.riskPerTrade));
    } catch (err) {
      setError(err);
    }
  };
  const adopt = async () => {
    setError(null);
    try {
      await api2.liveAdopt({ profile: profile(), overrides: { startCapital: Number(start), riskPerTrade: Number(risk) } });
      onAdopted();
    } catch (err) {
      setError(err);
    }
  };
  return /* @__PURE__ */ React8.createElement("div", { className: "sm-panel" }, /* @__PURE__ */ React8.createElement("section", { className: "sm-card" }, /* @__PURE__ */ React8.createElement("header", { className: "sm-card-head" }, /* @__PURE__ */ React8.createElement("h3", null, t("live.wizard.title"))), /* @__PURE__ */ React8.createElement("p", { className: "sm-hint" }, t("live.wizard.intro")), /* @__PURE__ */ React8.createElement("form", { className: "sm-form-grid", onSubmit: preview }, /* @__PURE__ */ React8.createElement(Field, { label: t("live.f.assets"), hint: t("live.f.assetsHint") }, /* @__PURE__ */ React8.createElement("input", { type: "number", min: "0", step: "1000", required: true, value: form.assets, onChange: (e) => set("assets", e.target.value) })), /* @__PURE__ */ React8.createElement(Field, { label: t("live.f.expense") }, /* @__PURE__ */ React8.createElement("input", { type: "number", min: "0", step: "100", value: form.monthlyExpense, onChange: (e) => set("monthlyExpense", e.target.value) })), /* @__PURE__ */ React8.createElement(Field, { label: t("live.f.maxLoss"), hint: t("live.f.maxLossHint") }, /* @__PURE__ */ React8.createElement("input", { type: "number", min: "0", step: "1000", required: true, value: form.maxLoss, onChange: (e) => set("maxLoss", e.target.value) })), /* @__PURE__ */ React8.createElement(Field, { label: t("live.f.experience") }, /* @__PURE__ */ React8.createElement("select", { value: form.experience, onChange: (e) => set("experience", e.target.value) }, ["none", "some", "experienced"].map((k) => /* @__PURE__ */ React8.createElement("option", { key: k, value: k }, t(`live.exp.${k}`))))), /* @__PURE__ */ React8.createElement("label", { className: "sm-check" }, /* @__PURE__ */ React8.createElement("input", { type: "checkbox", checked: form.emergencySaved, onChange: (e) => set("emergencySaved", e.target.checked) }), t("live.f.emergency")), /* @__PURE__ */ React8.createElement("label", { className: "sm-check" }, /* @__PURE__ */ React8.createElement("input", { type: "checkbox", checked: form.needIncome, onChange: (e) => set("needIncome", e.target.checked) }), t("live.f.income")), /* @__PURE__ */ React8.createElement("div", { className: "sm-form-actions" }, /* @__PURE__ */ React8.createElement("button", { type: "submit", className: "sm-btn sm-btn-primary" }, t("live.wizard.calc")))), error && /* @__PURE__ */ React8.createElement("p", { className: "sm-error", role: "alert" }, errorText(t, error))), plan && /* @__PURE__ */ React8.createElement("section", { className: "sm-card" }, /* @__PURE__ */ React8.createElement("header", { className: "sm-card-head" }, /* @__PURE__ */ React8.createElement("h3", null, t("live.plan.title"))), /* @__PURE__ */ React8.createElement("div", { className: "sm-grid-stats sm-grid-wide" }, /* @__PURE__ */ React8.createElement("div", { className: "sm-stat" }, /* @__PURE__ */ React8.createElement("span", { className: "sm-stat-label" }, t("live.plan.max")), /* @__PURE__ */ React8.createElement("span", { className: "sm-stat-value" }, money(plan.maxCapital))), /* @__PURE__ */ React8.createElement("div", { className: "sm-stat" }, /* @__PURE__ */ React8.createElement("span", { className: "sm-stat-label" }, t("live.plan.start")), /* @__PURE__ */ React8.createElement("span", { className: "sm-stat-value sm-up" }, money(plan.startCapital))), /* @__PURE__ */ React8.createElement("div", { className: "sm-stat" }, /* @__PURE__ */ React8.createElement("span", { className: "sm-stat-label" }, t("live.plan.risk")), /* @__PURE__ */ React8.createElement("span", { className: "sm-stat-value" }, (plan.riskPerTrade * 100).toFixed(2), "%")), /* @__PURE__ */ React8.createElement("div", { className: "sm-stat" }, /* @__PURE__ */ React8.createElement("span", { className: "sm-stat-label" }, t("live.plan.perTrade")), /* @__PURE__ */ React8.createElement("span", { className: "sm-stat-value" }, money(plan.startCapital * plan.riskPerTrade)))), /* @__PURE__ */ React8.createElement("ul", { className: "sm-reasons" }, plan.reasons.map((r, i) => /* @__PURE__ */ React8.createElement("li", { key: i, className: "sm-reason-neutral" }, /* @__PURE__ */ React8.createElement("span", { className: "sm-reason-dot", "aria-hidden": "true" }), t(`live.plan.r.${r.key}`, r.params)))), /* @__PURE__ */ React8.createElement("div", { className: "sm-form-row" }, /* @__PURE__ */ React8.createElement(Field, { label: t("live.plan.adjustStart") }, /* @__PURE__ */ React8.createElement("input", { type: "number", min: "0", step: "1000", value: start, onChange: (e) => setStart(e.target.value) })), /* @__PURE__ */ React8.createElement(Field, { label: t("live.plan.adjustRisk") }, /* @__PURE__ */ React8.createElement("select", { value: risk, onChange: (e) => setRisk(e.target.value) }, ["0.0025", "0.005", "0.0075", "0.01", "0.015"].map((v) => /* @__PURE__ */ React8.createElement("option", { key: v, value: v }, (Number(v) * 100).toFixed(2), "%"))))), /* @__PURE__ */ React8.createElement("div", { className: "sm-form-actions" }, /* @__PURE__ */ React8.createElement("button", { type: "button", className: "sm-btn sm-btn-primary", disabled: !(Number(start) > 0), onClick: adopt }, t("live.plan.adopt"))), /* @__PURE__ */ React8.createElement("p", { className: "sm-hint" }, t(initial ? "live.plan.noteExisting" : "live.plan.note"))));
}
function PlanCard({ t, plan }) {
  if (!plan) return null;
  return /* @__PURE__ */ React8.createElement("div", { className: `sm-plan sm-plan-${plan.verdict}` }, /* @__PURE__ */ React8.createElement("div", { className: "sm-plan-head" }, /* @__PURE__ */ React8.createElement("strong", null, t(`live.verdict.${plan.verdict}`)), /* @__PURE__ */ React8.createElement("span", null, plan.fund ? t("live.planLineFund", { amount: money(plan.amount), qty: qtyText(plan.qty, true), price: price(plan.price, 4), stop: price(plan.stop, 4), risk: plan.riskPct, pos: plan.positionPct }) : t("live.planLine", { qty: plan.qty, price: price(plan.price), stop: price(plan.stop), risk: plan.riskPct, pos: plan.positionPct }))), /* @__PURE__ */ React8.createElement("ul", { className: "sm-checks" }, plan.checks.map((c, i) => /* @__PURE__ */ React8.createElement("li", { key: i, className: `sm-check-${c.level}` }, t(`live.check.${c.key}`, c.params)))));
}
function LiveTradeForm({ t, api: api2, symbol, side: initialSide = "buy", preset, holding, onDone }) {
  const fund = isFundId(symbol);
  const [side, setSide] = React8.useState(initialSide);
  const [plan, setPlan] = React8.useState(null);
  const [form, setForm] = React8.useState({ qty: preset?.qty ?? "", price: preset?.price ?? "", fee: "", date: "", stop: preset?.stop ?? "", signal: "s2", reason: preset?.reason ?? "manual", note: "" });
  const [busy, setBusy] = React8.useState(false);
  const [result, setResult] = React8.useState(null);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  React8.useEffect(() => {
    if (side !== "buy") return void 0;
    let alive = true;
    api2.livePlanTrade(symbol).then((p) => {
      if (!alive) return;
      setPlan(p);
      setForm((f) => ({ ...f, qty: f.qty || (p.qty > 0 ? String(p.qty) : ""), price: f.price || String(p.price), stop: f.stop || (p.stop ? String(p.stop) : ""), date: f.date || (p.fund && p.navDate ? p.navDate : "") }));
    }, (error) => {
      if (alive) setResult({ ok: false, text: errorText(t, error) });
    });
    return () => {
      alive = false;
    };
  }, [symbol, side]);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setResult(null);
    try {
      const r = await api2.liveFill({ symbol, side, qty: Number(form.qty), price: Number(form.price), fee: form.fee === "" ? void 0 : Number(form.fee), date: form.date || void 0, stop: side === "buy" ? Number(form.stop) : void 0, signal: form.signal, reason: form.reason, note: form.note });
      const warn = r.warnings.map((w) => t(`live.warn.${w.key}`)).join(" ");
      const text = `${r.trade.status === "closed" ? t("live.recorded.closed", { r: rText(r.trade.r) }) : t("live.recorded.ok")}${warn ? ` ${warn}` : ""}`;
      setResult({ ok: true, text });
      onDone?.(r, text);
    } catch (error) {
      setResult({ ok: false, text: errorText(t, error) });
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ React8.createElement("form", { className: "sm-card sm-form", onSubmit: submit, "aria-label": t("live.form.title") }, /* @__PURE__ */ React8.createElement("header", { className: "sm-card-head" }, /* @__PURE__ */ React8.createElement("h3", null, t("live.form.title")), /* @__PURE__ */ React8.createElement("span", { className: "sm-muted" }, t(fund ? "live.form.subFund" : "live.form.sub"))), /* @__PURE__ */ React8.createElement("div", { className: "sm-seg", role: "group", "aria-label": t("order.side") }, /* @__PURE__ */ React8.createElement("button", { type: "button", className: side === "buy" ? "sm-on sm-bg-up" : "", onClick: () => setSide("buy") }, holding ? t(fund ? "live.form.addFund" : "live.form.add") : t(fund ? "live.fund.buy" : "order.buy")), /* @__PURE__ */ React8.createElement("button", { type: "button", className: side === "sell" ? "sm-on sm-bg-down" : "", disabled: !holding, onClick: () => setSide("sell") }, t(fund ? "live.fund.sell" : "order.sell"))), side === "buy" && /* @__PURE__ */ React8.createElement(PlanCard, { t, plan }), /* @__PURE__ */ React8.createElement("div", { className: "sm-form-row" }, /* @__PURE__ */ React8.createElement(Field, { label: t(fund ? "live.form.qtyFund" : "live.form.qty") }, /* @__PURE__ */ React8.createElement("input", { type: "number", min: fund ? "0.01" : "1", step: fund ? "0.01" : "1", required: true, value: form.qty, onChange: (e) => set("qty", e.target.value) })), /* @__PURE__ */ React8.createElement(Field, { label: t(fund ? "live.form.priceFund" : "live.form.price") }, /* @__PURE__ */ React8.createElement("input", { type: "number", min: "0", step: fund ? "0.0001" : "0.001", required: true, value: form.price, onChange: (e) => set("price", e.target.value) })), side === "buy" && /* @__PURE__ */ React8.createElement(Field, { label: t(fund ? "live.form.stopFund" : "live.form.stop") }, /* @__PURE__ */ React8.createElement("input", { type: "number", min: "0", step: fund ? "0.0001" : "0.001", required: true, value: form.stop, onChange: (e) => set("stop", e.target.value) })), side === "buy" && !holding && /* @__PURE__ */ React8.createElement(Field, { label: t("live.form.signal") }, /* @__PURE__ */ React8.createElement("select", { value: form.signal, onChange: (e) => set("signal", e.target.value) }, ["s1", "s2", "trend", "other"].map((k) => /* @__PURE__ */ React8.createElement("option", { key: k, value: k }, t(`live.signal.${k}`))))), side === "sell" && /* @__PURE__ */ React8.createElement(Field, { label: t("live.form.reason") }, /* @__PURE__ */ React8.createElement("select", { value: form.reason, onChange: (e) => set("reason", e.target.value) }, ["stop", "exit", "target", "manual", "other"].map((k) => /* @__PURE__ */ React8.createElement("option", { key: k, value: k }, t(`live.reason.${k}`))))), /* @__PURE__ */ React8.createElement(Field, { label: t("live.form.fee"), hint: t(fund ? "live.form.feeHintFund" : "live.form.feeHint") }, /* @__PURE__ */ React8.createElement("input", { type: "number", min: "0", step: "0.01", value: form.fee, onChange: (e) => set("fee", e.target.value) })), /* @__PURE__ */ React8.createElement(Field, { label: t(fund ? "live.form.dateFund" : "live.form.date") }, /* @__PURE__ */ React8.createElement("input", { type: "date", value: form.date, onChange: (e) => set("date", e.target.value) }))), /* @__PURE__ */ React8.createElement(Field, { label: t("live.form.note") }, /* @__PURE__ */ React8.createElement("input", { type: "text", maxLength: 200, value: form.note, placeholder: t("live.form.notePh"), onChange: (e) => set("note", e.target.value) })), /* @__PURE__ */ React8.createElement("div", { className: "sm-form-actions" }, /* @__PURE__ */ React8.createElement("button", { type: "submit", className: "sm-btn sm-btn-primary", disabled: busy }, busy ? t("common.working") : t("live.form.submit"))), result && /* @__PURE__ */ React8.createElement("p", { className: result.ok ? "sm-ok" : "sm-error", role: "status" }, result.text));
}
function TodoList({ t, api: api2, todos, refresh, onRecord }) {
  if (todos.length === 0) return /* @__PURE__ */ React8.createElement("p", { className: "sm-muted" }, t("live.todo.none"));
  const act = async (id, action) => {
    await api2.liveTodo(id, action).catch(() => {
    });
    refresh();
  };
  const raise = async (todo) => {
    await api2.liveStop(todo.secid, todo.to).catch(() => {
    });
    await act(todo.id, "done");
  };
  return /* @__PURE__ */ React8.createElement("ul", { className: "sm-todos" }, todos.map((todo) => /* @__PURE__ */ React8.createElement("li", { key: todo.id, className: `sm-todo sm-todo-p${todo.priority}` }, /* @__PURE__ */ React8.createElement("span", { className: "sm-todo-text" }, t(`live.todo.${todo.type}${todo.fund && FUND_KEYS.has(todo.type) ? "Fund" : ""}`, { ...todo, qty: qtyText(todo.qty, todo.fund), amount: money(todo.amount), kind: todo.kind ? t(`ev.${todo.kind}`) : "" })), /* @__PURE__ */ React8.createElement("span", { className: "sm-todo-actions" }, (todo.type === "sellStop" || todo.type === "exitSignal") && /* @__PURE__ */ React8.createElement("button", { type: "button", className: "sm-btn sm-btn-sm", onClick: () => onRecord({ symbol: todo.secid, side: "sell", preset: { qty: todo.qty, price: todo.price, reason: todo.type === "sellStop" ? "stop" : "exit" } }) }, t("live.todo.recordSell")), todo.type === "addUnit" && /* @__PURE__ */ React8.createElement("button", { type: "button", className: "sm-btn sm-btn-sm", onClick: () => onRecord({ symbol: todo.secid, side: "buy", preset: { qty: todo.qty, price: todo.price, stop: todo.newStop } }) }, t("live.todo.recordAdd")), todo.type === "raiseStop" && /* @__PURE__ */ React8.createElement("button", { type: "button", className: "sm-btn sm-btn-sm", onClick: () => raise(todo) }, t("live.todo.applyStop")), /* @__PURE__ */ React8.createElement("button", { type: "button", className: "sm-btn sm-btn-ghost sm-btn-sm", onClick: () => act(todo.id, "done") }, t("live.todo.done")), /* @__PURE__ */ React8.createElement("button", { type: "button", className: "sm-btn sm-btn-ghost sm-btn-sm", onClick: () => act(todo.id, "dismiss") }, t("live.todo.dismiss"))))));
}
function StopCell({ t, api: api2, position, refresh }) {
  const [value, setValue] = React8.useState(position.stop);
  React8.useEffect(() => {
    setValue(position.stop);
  }, [position.stop]);
  return /* @__PURE__ */ React8.createElement("span", { className: "sm-inline", onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React8.createElement("input", { className: "sm-input-sm", type: "number", step: "0.001", value, "aria-label": t("paper.stopFor", { name: position.name }), onChange: (e) => setValue(e.target.value) }), Number(value) !== position.stop && /* @__PURE__ */ React8.createElement("button", { type: "button", className: "sm-btn sm-btn-ghost sm-btn-sm", onClick: async () => {
    await api2.liveStop(position.secid, Number(value)).catch(() => {
    });
    refresh();
  } }, t("common.save")));
}
function Journal({ t, api: api2, trades, mistakes, refresh }) {
  const closed = trades.filter((tr) => tr.status === "closed");
  const [limit, setLimit] = React8.useState(15);
  if (closed.length === 0) return /* @__PURE__ */ React8.createElement("p", { className: "sm-muted" }, t("live.journal.empty"));
  const update = async (tr, fields) => {
    await api2.liveTrade(tr.id, fields).catch(() => {
    });
    refresh();
  };
  return /* @__PURE__ */ React8.createElement("ul", { className: "sm-journal" }, closed.slice(0, limit).map((tr) => /* @__PURE__ */ React8.createElement("li", { key: tr.id, className: tr.reviewed ? "" : "sm-unreviewed" }, /* @__PURE__ */ React8.createElement("div", { className: "sm-journal-head" }, /* @__PURE__ */ React8.createElement("strong", null, tr.name), /* @__PURE__ */ React8.createElement("span", { className: "sm-muted" }, tr.code), /* @__PURE__ */ React8.createElement("span", { className: rTone(tr.r) }, rText(tr.r)), /* @__PURE__ */ React8.createElement("span", { className: "sm-muted" }, tr.openedAt, " → ", tr.closedAt, " · ", t("live.journal.days", { n: tr.holdingDays }), " · ", t(`live.signal.${tr.signal}`))), /* @__PURE__ */ React8.createElement("div", { className: "sm-journal-body" }, /* @__PURE__ */ React8.createElement("span", { className: "sm-muted" }, t("live.journal.path", { entry: price(tr.entries[0]?.price), stop: price(tr.initialStop), adds: tr.entries.length - 1, exit: price(tr.exits[tr.exits.length - 1]?.price), reason: t(`live.reason.${tr.exits[tr.exits.length - 1]?.reason ?? "other"}`) }))), /* @__PURE__ */ React8.createElement("div", { className: "sm-journal-tags" }, /* @__PURE__ */ React8.createElement("div", { className: "sm-seg", role: "group", "aria-label": t("live.journal.followed") }, /* @__PURE__ */ React8.createElement("button", { type: "button", className: tr.followed === true ? "sm-on" : "", onClick: () => update(tr, { followed: true }) }, t("live.journal.yes")), /* @__PURE__ */ React8.createElement("button", { type: "button", className: tr.followed === false ? "sm-on" : "", onClick: () => update(tr, { followed: false }) }, t("live.journal.no"))), mistakes.map((m) => /* @__PURE__ */ React8.createElement(
    "button",
    {
      key: m,
      type: "button",
      "aria-pressed": tr.mistakes.includes(m),
      className: `sm-chip ${tr.mistakes.includes(m) ? "sm-chip-on" : ""}`,
      onClick: () => update(tr, { mistakes: tr.mistakes.includes(m) ? tr.mistakes.filter((x) => x !== m) : [...tr.mistakes, m] })
    },
    t(`live.mistake.${m}`)
  )), !tr.reviewed && /* @__PURE__ */ React8.createElement("button", { type: "button", className: "sm-btn sm-btn-ghost sm-btn-sm", onClick: () => update(tr, {}) }, t("live.journal.markReviewed"))), tr.note && /* @__PURE__ */ React8.createElement("p", { className: "sm-hint" }, tr.note))), closed.length > limit && /* @__PURE__ */ React8.createElement("li", null, /* @__PURE__ */ React8.createElement("button", { type: "button", className: "sm-btn sm-btn-ghost", onClick: () => setLimit(limit + 30) }, t("news.more", { n: closed.length - limit }))));
}
function StatsCard({ t, stats }) {
  if (!stats || stats.n === 0) return /* @__PURE__ */ React8.createElement("p", { className: "sm-muted" }, t("live.stats.empty"));
  const maxCount = Math.max(1, ...stats.distribution.map((d) => d.count));
  return /* @__PURE__ */ React8.createElement("div", null, /* @__PURE__ */ React8.createElement("div", { className: "sm-grid-stats sm-grid-wide" }, /* @__PURE__ */ React8.createElement("div", { className: "sm-stat" }, /* @__PURE__ */ React8.createElement("span", { className: "sm-stat-label" }, t("live.stats.expectancy")), /* @__PURE__ */ React8.createElement("span", { className: `sm-stat-value ${rTone(stats.expectancy)}` }, rText(stats.expectancy))), /* @__PURE__ */ React8.createElement("div", { className: "sm-stat" }, /* @__PURE__ */ React8.createElement("span", { className: "sm-stat-label" }, t("live.stats.winRate")), /* @__PURE__ */ React8.createElement("span", { className: "sm-stat-value" }, stats.winRate, "%")), /* @__PURE__ */ React8.createElement("div", { className: "sm-stat" }, /* @__PURE__ */ React8.createElement("span", { className: "sm-stat-label" }, t("live.stats.avgWin")), /* @__PURE__ */ React8.createElement("span", { className: "sm-stat-value sm-up" }, rText(stats.avgWinR))), /* @__PURE__ */ React8.createElement("div", { className: "sm-stat" }, /* @__PURE__ */ React8.createElement("span", { className: "sm-stat-label" }, t("live.stats.avgLoss")), /* @__PURE__ */ React8.createElement("span", { className: "sm-stat-value sm-down" }, rText(stats.avgLossR))), /* @__PURE__ */ React8.createElement("div", { className: "sm-stat" }, /* @__PURE__ */ React8.createElement("span", { className: "sm-stat-label" }, t("live.stats.total")), /* @__PURE__ */ React8.createElement("span", { className: `sm-stat-value ${rTone(stats.totalR)}` }, rText(stats.totalR))), /* @__PURE__ */ React8.createElement("div", { className: "sm-stat" }, /* @__PURE__ */ React8.createElement("span", { className: "sm-stat-label" }, t("live.stats.streak")), /* @__PURE__ */ React8.createElement("span", { className: "sm-stat-value" }, stats.maxLossStreak)), /* @__PURE__ */ React8.createElement("div", { className: "sm-stat" }, /* @__PURE__ */ React8.createElement("span", { className: "sm-stat-label" }, t("live.stats.follow")), /* @__PURE__ */ React8.createElement("span", { className: "sm-stat-value" }, stats.followRate === null ? "—" : `${stats.followRate}%`)), /* @__PURE__ */ React8.createElement("div", { className: "sm-stat" }, /* @__PURE__ */ React8.createElement("span", { className: "sm-stat-label" }, t("live.stats.followVs")), /* @__PURE__ */ React8.createElement("span", { className: "sm-stat-value" }, rText(stats.followedExpectancy), " / ", rText(stats.brokenExpectancy)))), /* @__PURE__ */ React8.createElement("h4", { className: "sm-subhead" }, t("live.stats.dist")), /* @__PURE__ */ React8.createElement("div", { className: "sm-dist", role: "img", "aria-label": t("live.stats.dist") }, stats.distribution.map((d, i) => /* @__PURE__ */ React8.createElement("div", { key: i, className: "sm-dist-col" }, /* @__PURE__ */ React8.createElement("div", { className: `sm-dist-bar ${d.to !== null && d.to <= 0 ? "sm-bg-down" : "sm-bg-up"}`, style: { height: `${d.count / maxCount * 100}%` }, title: String(d.count) }), /* @__PURE__ */ React8.createElement("span", null, d.from === null ? `<${d.to}` : d.to === null ? `≥${d.from}` : `${d.from}~${d.to}`)))), Object.keys(stats.byMistake).length > 0 && /* @__PURE__ */ React8.createElement(React8.Fragment, null, /* @__PURE__ */ React8.createElement("h4", { className: "sm-subhead" }, t("live.stats.byMistake")), /* @__PURE__ */ React8.createElement("ul", { className: "sm-reasons" }, Object.entries(stats.byMistake).sort((a, b) => a[1].expectancy - b[1].expectancy).map(([k, v]) => /* @__PURE__ */ React8.createElement("li", { key: k, className: "sm-reason-bear" }, /* @__PURE__ */ React8.createElement("span", { className: "sm-reason-dot", "aria-hidden": "true" }), t("live.stats.mistakeLine", { name: t(`live.mistake.${k}`), n: v.n, r: rText(v.expectancy) }))))), Object.keys(stats.bySignal).length > 0 && /* @__PURE__ */ React8.createElement("p", { className: "sm-hint" }, t("live.stats.bySignal"), "：", Object.entries(stats.bySignal).map(([k, v]) => `${t(`live.signal.${k}`)} ${v.n} · ${rText(v.expectancy)}`).join("；")));
}
function AiReview({ t, api: api2, lessons, stats, aiReady, refresh }) {
  const [text, setText] = React8.useState("");
  const [busy, setBusy] = React8.useState(false);
  const [error, setError] = React8.useState(null);
  const run = async () => {
    setBusy(true);
    setError(null);
    setText("");
    try {
      await api2.liveReviewStream({
        onEvent: (ev) => {
          if (ev.type === "delta") setText((s) => s + ev.text);
          else if (ev.type === "error") setError({ code: ev.code, params: { message: ev.message } });
        }
      });
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
      refresh();
    }
  };
  const shown = busy || text ? text : lessons?.text;
  return /* @__PURE__ */ React8.createElement("section", { className: "sm-card" }, /* @__PURE__ */ React8.createElement("header", { className: "sm-card-head" }, /* @__PURE__ */ React8.createElement("h3", null, t("live.ai.title")), lessons && /* @__PURE__ */ React8.createElement("span", { className: "sm-muted" }, t("live.ai.updated", { at: timeOf(lessons.at), n: lessons.basedOn })), /* @__PURE__ */ React8.createElement("span", { className: "sm-grow" }), /* @__PURE__ */ React8.createElement("button", { type: "button", className: "sm-btn sm-btn-primary", disabled: busy || !aiReady || !stats || stats.n === 0, onClick: run }, busy ? t("advisor.thinking") : t("live.ai.run"))), error && /* @__PURE__ */ React8.createElement("p", { className: "sm-error", role: "alert" }, errorText(t, error)), shown ? /* @__PURE__ */ React8.createElement(Markdown, { text: shown }) : /* @__PURE__ */ React8.createElement("p", { className: "sm-muted" }, t("live.ai.empty")), /* @__PURE__ */ React8.createElement("p", { className: "sm-hint" }, t("live.ai.note")));
}
function LivePanel({ t, api: api2, live, error, refresh, onSelect, aiReady, recordRequest }) {
  const [record, setRecord] = React8.useState(null);
  const [replan, setReplan] = React8.useState(false);
  const [capital, setCapital] = React8.useState("");
  const [notice, setNotice] = React8.useState(null);
  const formRef = React8.useRef(null);
  React8.useEffect(() => {
    if (recordRequest) setRecord(recordRequest);
  }, [recordRequest?.id]);
  React8.useEffect(() => {
    if (!record) return;
    setNotice(null);
    formRef.current?.scrollIntoView?.({ block: "nearest", behavior: "smooth" });
  }, [record]);
  if (error && !live) return /* @__PURE__ */ React8.createElement("p", { className: "sm-error" }, errorText(t, error));
  if (!live) return /* @__PURE__ */ React8.createElement("p", { className: "sm-muted" }, t("common.loading"));
  if (!live.plan || replan) {
    return /* @__PURE__ */ React8.createElement(React8.Fragment, null, replan && /* @__PURE__ */ React8.createElement("button", { type: "button", className: "sm-btn sm-btn-ghost", onClick: () => setReplan(false) }, "← ", t("live.replanBack")), /* @__PURE__ */ React8.createElement(PlanWizard, { t, api: api2, initial: live.profile ? { ...live.profile } : void 0, onAdopted: () => {
      setReplan(false);
      refresh();
    } }));
  }
  const s = live.summary;
  const plan = live.plan;
  const trialDone = live.trades.filter((tr) => tr.status === "closed").length - (plan.closedAtAdopt ?? 0);
  const moveCapital = async (sign) => {
    const amount = Number(capital) * sign;
    if (!amount) return;
    await api2.liveCapital(amount).catch(() => {
    });
    setCapital("");
    refresh();
  };
  return /* @__PURE__ */ React8.createElement("div", { className: "sm-panel" }, /* @__PURE__ */ React8.createElement("p", { className: "sm-notice" }, t("live.banner")), /* @__PURE__ */ React8.createElement("div", { className: "sm-grid-stats sm-grid-wide" }, /* @__PURE__ */ React8.createElement("div", { className: "sm-stat" }, /* @__PURE__ */ React8.createElement("span", { className: "sm-stat-label" }, t("paper.equity")), /* @__PURE__ */ React8.createElement("span", { className: "sm-stat-value" }, money(s.equity))), /* @__PURE__ */ React8.createElement("div", { className: "sm-stat" }, /* @__PURE__ */ React8.createElement("span", { className: "sm-stat-label" }, t("live.deposited")), /* @__PURE__ */ React8.createElement("span", { className: "sm-stat-value" }, money(s.deposited))), /* @__PURE__ */ React8.createElement("div", { className: "sm-stat" }, /* @__PURE__ */ React8.createElement("span", { className: "sm-stat-label" }, t("paper.pnl")), /* @__PURE__ */ React8.createElement("span", { className: `sm-stat-value ${tone(s.totalPnl)}` }, money(s.totalPnl), "（", pct(s.totalPnlPct), "）")), /* @__PURE__ */ React8.createElement("div", { className: "sm-stat" }, /* @__PURE__ */ React8.createElement("span", { className: "sm-stat-label" }, t("live.drawdown")), /* @__PURE__ */ React8.createElement("span", { className: `sm-stat-value ${s.drawdown < 0 ? "sm-down" : ""}` }, s.drawdown, "%")), /* @__PURE__ */ React8.createElement("div", { className: "sm-stat" }, /* @__PURE__ */ React8.createElement("span", { className: "sm-stat-label" }, t("live.openRisk")), /* @__PURE__ */ React8.createElement("span", { className: "sm-stat-value" }, s.openRiskPct, "% / ", plan.maxOpenRisk * 100, "%")), /* @__PURE__ */ React8.createElement("div", { className: "sm-stat" }, /* @__PURE__ */ React8.createElement("span", { className: "sm-stat-label" }, t("live.stageLabel")), /* @__PURE__ */ React8.createElement("span", { className: "sm-stat-value" }, plan.stage === "trial" ? t("live.stage.trial", { done: Math.max(0, trialDone), total: plan.trialTrades }) : t("live.stage.normal"))), /* @__PURE__ */ React8.createElement("div", { className: "sm-stat" }, /* @__PURE__ */ React8.createElement("span", { className: "sm-stat-label" }, t("live.plan.risk")), /* @__PURE__ */ React8.createElement("span", { className: "sm-stat-value" }, (plan.riskPerTrade * 100).toFixed(2), "%")), /* @__PURE__ */ React8.createElement("div", { className: "sm-stat" }, /* @__PURE__ */ React8.createElement("span", { className: "sm-stat-label" }, t("paper.cash")), /* @__PURE__ */ React8.createElement("span", { className: "sm-stat-value" }, money(s.cash)))), /* @__PURE__ */ React8.createElement("h4", { className: "sm-subhead" }, t("live.todo.title")), /* @__PURE__ */ React8.createElement(TodoList, { t, api: api2, todos: live.todos, refresh, onRecord: (r) => setRecord({ ...r, id: Date.now() }) }), /* @__PURE__ */ React8.createElement("h4", { className: "sm-subhead" }, t("paper.positions")), s.positions.length === 0 ? /* @__PURE__ */ React8.createElement("p", { className: "sm-muted" }, t("live.noPositions")) : /* @__PURE__ */ React8.createElement("div", { className: "sm-table-wrap" }, /* @__PURE__ */ React8.createElement("table", { className: "sm-table sm-table-hover" }, /* @__PURE__ */ React8.createElement("thead", null, /* @__PURE__ */ React8.createElement("tr", null, /* @__PURE__ */ React8.createElement("th", null, t("col.name")), /* @__PURE__ */ React8.createElement("th", null, t("paper.qty")), /* @__PURE__ */ React8.createElement("th", null, t("paper.cost")), /* @__PURE__ */ React8.createElement("th", null, t("col.price")), /* @__PURE__ */ React8.createElement("th", null, t("live.unrealized")), /* @__PURE__ */ React8.createElement("th", null, t("paper.stop")), /* @__PURE__ */ React8.createElement("th", null, t("live.toStop")), /* @__PURE__ */ React8.createElement("th", null))), /* @__PURE__ */ React8.createElement("tbody", null, s.positions.map((p) => /* @__PURE__ */ React8.createElement("tr", { key: p.secid, onClick: () => onSelect(p.secid) }, /* @__PURE__ */ React8.createElement("td", null, /* @__PURE__ */ React8.createElement("button", { type: "button", className: "sm-link", onClick: (e) => {
    e.stopPropagation();
    onSelect(p.secid);
  } }, p.name), /* @__PURE__ */ React8.createElement("div", { className: "sm-muted sm-small" }, p.code, p.fund ? ` · ${t("kind.fund")}` : "", " · ", t(`live.signal.${p.signal}`), " · ", t("live.units", { n: p.units }))), /* @__PURE__ */ React8.createElement("td", null, qtyText(p.qty, p.fund), /* @__PURE__ */ React8.createElement("div", { className: "sm-muted sm-small" }, p.weight, "%")), /* @__PURE__ */ React8.createElement("td", null, price(p.avgCost)), /* @__PURE__ */ React8.createElement("td", { className: tone(p.pct) }, price(p.price)), /* @__PURE__ */ React8.createElement("td", { className: tone(p.pnl) }, money(p.pnl), /* @__PURE__ */ React8.createElement("div", { className: `sm-small ${rTone(p.unrealizedR)}` }, rText(p.unrealizedR))), /* @__PURE__ */ React8.createElement("td", null, /* @__PURE__ */ React8.createElement(StopCell, { t, api: api2, position: p, refresh })), /* @__PURE__ */ React8.createElement("td", null, p.stopDistancePct, "%", p.stopDistanceN !== null ? /* @__PURE__ */ React8.createElement("div", { className: "sm-muted sm-small" }, p.stopDistanceN, "N") : null), /* @__PURE__ */ React8.createElement("td", null, /* @__PURE__ */ React8.createElement("button", { type: "button", className: "sm-btn sm-btn-ghost sm-btn-sm", onClick: (e) => {
    e.stopPropagation();
    setRecord({ symbol: p.secid, side: "sell", preset: { qty: p.qty, price: p.price }, id: Date.now() });
  } }, t("live.recordTrade")))))))), /* @__PURE__ */ React8.createElement("div", { ref: formRef }, record && /* @__PURE__ */ React8.createElement(
    LiveTradeForm,
    {
      key: record.id,
      t,
      api: api2,
      symbol: record.symbol,
      side: record.side,
      preset: record.preset,
      holding: s.positions.some((p) => p.secid === record.symbol),
      onDone: (_r, text) => {
        setNotice(text);
        refresh();
        setRecord(null);
      }
    }
  ), !record && notice && /* @__PURE__ */ React8.createElement("p", { className: "sm-ok", role: "status" }, notice)), /* @__PURE__ */ React8.createElement("p", { className: "sm-hint" }, t("live.howToRecord")), /* @__PURE__ */ React8.createElement("h4", { className: "sm-subhead" }, t("live.journal.title")), /* @__PURE__ */ React8.createElement(Journal, { t, api: api2, trades: live.trades, mistakes: live.mistakes, refresh }), /* @__PURE__ */ React8.createElement("h4", { className: "sm-subhead" }, t("live.stats.title")), /* @__PURE__ */ React8.createElement(StatsCard, { t, stats: live.stats }), /* @__PURE__ */ React8.createElement(AiReview, { t, api: api2, lessons: live.lessons, stats: live.stats, aiReady, refresh }), /* @__PURE__ */ React8.createElement("h4", { className: "sm-subhead" }, t("live.capital.title")), /* @__PURE__ */ React8.createElement("div", { className: "sm-form-row" }, /* @__PURE__ */ React8.createElement(Field, { label: t("live.capital.amount") }, /* @__PURE__ */ React8.createElement("input", { type: "number", min: "0", step: "1000", value: capital, onChange: (e) => setCapital(e.target.value) })), /* @__PURE__ */ React8.createElement("div", { className: "sm-form-actions" }, /* @__PURE__ */ React8.createElement("button", { type: "button", className: "sm-btn", onClick: () => moveCapital(1) }, t("live.capital.deposit")), /* @__PURE__ */ React8.createElement("button", { type: "button", className: "sm-btn", onClick: () => moveCapital(-1) }, t("live.capital.withdraw")), /* @__PURE__ */ React8.createElement("button", { type: "button", className: "sm-btn sm-btn-ghost", onClick: () => setReplan(true) }, t("live.replan")), /* @__PURE__ */ React8.createElement("button", { type: "button", className: "sm-btn sm-btn-ghost", onClick: async () => {
    if (window.confirm(t("live.resetConfirm"))) {
      await api2.liveReset().catch(() => {
      });
      refresh();
    }
  } }, t("live.reset")))), /* @__PURE__ */ React8.createElement("p", { className: "sm-hint" }, t("live.privacy")));
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

// src/client/page.jsx
function IndexBar({ t, api: api2, onSelect }) {
  const [rows] = usePoll((signal) => api2.indices(signal), 1e4, []);
  return /* @__PURE__ */ React9.createElement("div", { className: "sm-indices", "aria-label": t("indices.label") }, (rows ?? []).map((r) => /* @__PURE__ */ React9.createElement("button", { key: r.secid, type: "button", className: "sm-index", onClick: () => onSelect(r.secid) }, /* @__PURE__ */ React9.createElement("span", { className: "sm-index-name" }, r.name), /* @__PURE__ */ React9.createElement("span", { className: tone(r.pct) }, price(r.price, 2)), /* @__PURE__ */ React9.createElement("span", { className: tone(r.pct) }, pct(r.pct)))));
}
function SearchBox({ t, api: api2, onSelect }) {
  const [q, setQ] = React9.useState("");
  const [rows, setRows] = React9.useState([]);
  const [open, setOpen] = React9.useState(false);
  const [active, setActive] = React9.useState(0);
  React9.useEffect(() => {
    const query = q.trim();
    if (query === "") {
      setRows([]);
      return void 0;
    }
    const controller = new AbortController();
    const timer = setTimeout(() => {
      api2.search(query, controller.signal).then((r) => {
        setRows(r);
        setActive(0);
        setOpen(true);
      }, () => {
      });
    }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [q]);
  const pick = (row) => {
    onSelect(row.symbol);
    setQ("");
    setRows([]);
    setOpen(false);
  };
  return /* @__PURE__ */ React9.createElement("div", { className: "sm-search", role: "combobox", "aria-expanded": open && rows.length > 0, "aria-haspopup": "listbox" }, /* @__PURE__ */ React9.createElement(
    "input",
    {
      type: "search",
      value: q,
      placeholder: t("search.placeholder"),
      "aria-label": t("search.placeholder"),
      "aria-autocomplete": "list",
      onChange: (e) => setQ(e.target.value),
      onFocus: () => setOpen(true),
      onBlur: () => setTimeout(() => setOpen(false), 150),
      onKeyDown: (e) => {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setActive((i) => Math.min(rows.length - 1, i + 1));
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setActive((i) => Math.max(0, i - 1));
        } else if (e.key === "Enter" && rows[active]) {
          e.preventDefault();
          pick(rows[active]);
        } else if (e.key === "Escape") setOpen(false);
      }
    }
  ), open && rows.length > 0 && /* @__PURE__ */ React9.createElement("ul", { className: "sm-search-list", role: "listbox" }, rows.map((r, i) => /* @__PURE__ */ React9.createElement("li", { key: r.symbol, role: "option", "aria-selected": i === active, className: i === active ? "sm-on" : "", onMouseDown: (e) => {
    e.preventDefault();
    pick(r);
  } }, /* @__PURE__ */ React9.createElement("span", null, r.name), /* @__PURE__ */ React9.createElement("span", { className: "sm-muted" }, r.code), /* @__PURE__ */ React9.createElement("span", { className: "sm-tag" }, r.type)))));
}
var TABS = ["market", "watch", "live", "paper", "screen", "alerts", "advisor"];
var CLIENT_VERSION = true ? "0.6.5" : "dev";
var Boundary = class extends React9.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, key: props.resetKey };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  static getDerivedStateFromProps(props, state) {
    return props.resetKey !== state.key ? { error: null, key: props.resetKey } : null;
  }
  render() {
    if (this.state.error === null) return this.props.children;
    const { t } = this.props;
    return /* @__PURE__ */ React9.createElement("section", { className: "sm-card", role: "alert" }, /* @__PURE__ */ React9.createElement("p", { className: "sm-error" }, t("err.render", { message: String(this.state.error?.message ?? this.state.error) })), /* @__PURE__ */ React9.createElement("button", { type: "button", className: "sm-btn", onClick: () => this.setState({ error: null }) }, t("common.retry")));
  }
};
function MarketPage(props) {
  const { t, api: api2, startSession, alertsState: alertsState2 } = props;
  const [tab, setTab] = usePref("tab", "market");
  const [market, setMarket] = usePref("market", "a");
  const [selected, setSelected] = usePref("selected", "1.000001");
  const [colors, setColors] = usePref("colors", "red-up");
  const [aside, setAside] = React9.useState(null);
  const [meta] = usePoll(() => props.api.meta(), 3e4, []);
  const [watch, watchErr, refreshWatch] = usePoll((signal) => api2.watchlist(signal), 1e4, []);
  const [paper, paperErr, refreshPaper] = usePoll((signal) => api2.paper(signal), 1e4, []);
  const [alerts, alertsErr, refreshAlerts] = usePoll((signal) => api2.alerts(signal), 15e3, []);
  const [liveData, liveErr, refreshLiveRaw] = usePoll((signal) => tab === "live" ? api2.live(signal) : Promise.resolve(null), 3e4, [tab]);
  const [liveRequest, setLiveRequest] = React9.useState(null);
  const refreshLive = () => {
    refreshLiveRaw();
    refreshAlerts();
  };
  React9.useEffect(() => {
    if (alerts) alertsState2.set(alerts.unread + (alerts.liveUrgent ?? 0));
  }, [alerts]);
  const rootRef = React9.useRef(null);
  const asideRef = React9.useRef(null);
  const [backTo, setBackTo] = React9.useState(null);
  const revealDetail = () => {
    const raf = window.requestAnimationFrame?.bind(window) ?? ((fn) => setTimeout(fn, 16));
    raf(() => {
      const page = rootRef.current;
      const el = asideRef.current;
      if (!page || !el) return;
      el.scrollTop = 0;
      const p = page.getBoundingClientRect();
      const a = el.getBoundingClientRect();
      const inView = a.top >= p.top - 4 && a.top <= p.top + p.height * 0.6;
      if (inView) return;
      const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;
      setBackTo(page.scrollTop);
      page.scrollTo({ top: page.scrollTop + a.top - p.top - 8, behavior: reduce ? "auto" : "smooth" });
      el.focus({ preventScroll: true });
    });
  };
  const backToList = () => {
    rootRef.current?.scrollTo({ top: backTo ?? 0, behavior: "smooth" });
    setBackTo(null);
  };
  const select = (symbol) => {
    setSelected(symbol);
    setAside(null);
    revealDetail();
  };
  const recordLive = (symbol) => {
    setTab("live");
    setLiveRequest({ symbol, side: "buy", id: Date.now() });
    rootRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };
  const discuss = (key) => {
    setAside(key);
    revealDetail();
  };
  const watched = (watch ?? []).some((w) => w.symbol === selected);
  const toggleWatch = async () => {
    try {
      await api2.watch(watched ? "remove" : "add", selected);
    } finally {
      refreshWatch();
    }
  };
  const removeWatch = async (symbol) => {
    try {
      await api2.watch("remove", symbol);
    } finally {
      refreshWatch();
    }
  };
  const aiReady = meta?.ai === true;
  return /* @__PURE__ */ React9.createElement("div", { ref: rootRef, className: `sm-root ${colors === "green-up" ? "sm-green-up" : ""}` }, /* @__PURE__ */ React9.createElement("style", null, CSS), /* @__PURE__ */ React9.createElement("header", { className: "sm-head" }, /* @__PURE__ */ React9.createElement("h1", null, t("title")), /* @__PURE__ */ React9.createElement(SearchBox, { t, api: api2, onSelect: select }), /* @__PURE__ */ React9.createElement("span", { className: "sm-grow" }), /* @__PURE__ */ React9.createElement("button", { type: "button", className: "sm-btn sm-btn-ghost", onClick: () => setColors(colors === "red-up" ? "green-up" : "red-up") }, colors === "red-up" ? t("colors.redUp") : t("colors.greenUp"))), /* @__PURE__ */ React9.createElement(IndexBar, { t, api: api2, onSelect: select }), meta === void 0 ? null : !meta.knowledge?.dir && /* @__PURE__ */ React9.createElement("p", { className: "sm-notice" }, t("notice.noKnowledge")), meta?.update?.latest && CLIENT_VERSION !== "dev" && compareVersions(meta.update.latest, CLIENT_VERSION) > 0 && /* @__PURE__ */ React9.createElement("p", { className: "sm-notice" }, t("notice.update", { version: meta.update.latest })), meta?.version && meta.version !== "dev" && CLIENT_VERSION !== "dev" && meta.version !== CLIENT_VERSION && /* @__PURE__ */ React9.createElement("p", { className: "sm-notice" }, t("notice.versionMismatch", { host: meta.version, client: CLIENT_VERSION })), /* @__PURE__ */ React9.createElement("nav", { className: "sm-tabs", role: "tablist", "aria-label": t("tabs.label") }, TABS.map((k) => /* @__PURE__ */ React9.createElement("button", { key: k, type: "button", role: "tab", "aria-selected": tab === k, className: tab === k ? "sm-on" : "", onClick: () => setTab(k) }, t(`tab.${k}`), k === "alerts" && alerts?.unread > 0 ? /* @__PURE__ */ React9.createElement("span", { className: "sm-badge" }, alerts.unread) : null, k === "live" && alerts?.liveUrgent > 0 ? /* @__PURE__ */ React9.createElement("span", { className: "sm-badge" }, alerts.liveUrgent) : null, k === "watch" && watch?.length ? /* @__PURE__ */ React9.createElement("span", { className: "sm-count" }, watch.length) : null))), /* @__PURE__ */ React9.createElement("div", { className: "sm-body" }, /* @__PURE__ */ React9.createElement("section", { className: "sm-main", role: "tabpanel", "aria-label": t(`tab.${tab}`) }, /* @__PURE__ */ React9.createElement(Boundary, { t, resetKey: `${tab}:${market}` }, tab === "market" && /* @__PURE__ */ React9.createElement(React9.Fragment, null, /* @__PURE__ */ React9.createElement("div", { className: "sm-market-groups" }, MARKET_GROUPS.map((group) => /* @__PURE__ */ React9.createElement("div", { key: group.id, className: "sm-market-group", role: "group", "aria-label": t(`market.group.${group.id}`) }, /* @__PURE__ */ React9.createElement("span", { className: "sm-market-group-label" }, t(`market.group.${group.id}`)), /* @__PURE__ */ React9.createElement("div", { className: "sm-seg" }, group.markets.map((id) => /* @__PURE__ */ React9.createElement("button", { key: id, type: "button", className: market === id ? "sm-on" : "", title: t(`market.tip.${id}`), onClick: () => setMarket(id) }, t(`market.${id}`))))))), market === "fund" ? /* @__PURE__ */ React9.createElement(FundList, { t, api: api2, onSelect: select, selected }) : /* @__PURE__ */ React9.createElement(QuoteList, { t, api: api2, market, onSelect: select, selected })), tab === "watch" && /* @__PURE__ */ React9.createElement(Watchlist, { t, items: watch, error: watchErr, onSelect: select, onRemove: removeWatch, selected }), tab === "live" && /* @__PURE__ */ React9.createElement(LivePanel, { t, api: api2, live: liveData, error: liveErr, refresh: refreshLive, onSelect: select, aiReady, recordRequest: liveRequest }), tab === "paper" && /* @__PURE__ */ React9.createElement(PaperPanel, { t, api: api2, paper, error: paperErr, refresh: refreshPaper, onSelect: select }), tab === "screen" && /* @__PURE__ */ React9.createElement(ScreenPanel, { t, api: api2, onSelect: select, onDiscuss: discuss }), tab === "alerts" && /* @__PURE__ */ React9.createElement(AlertsPanel, { t, api: api2, data: alerts, error: alertsErr, refresh: refreshAlerts, onSelect: select }), tab === "advisor" && /* @__PURE__ */ React9.createElement(AdvisorChat, { t, api: api2, symbol: "general", kind: "general", title: t("advisor.general"), startSession, aiReady }))), /* @__PURE__ */ React9.createElement("aside", { ref: asideRef, tabIndex: -1, className: "sm-detail", "aria-label": t("detail.label") }, backTo !== null && /* @__PURE__ */ React9.createElement("button", { type: "button", className: "sm-btn sm-btn-ghost sm-back", onClick: backToList }, "↑ ", t("detail.back")), /* @__PURE__ */ React9.createElement(Boundary, { t, resetKey: aside ?? selected }, aside ? /* @__PURE__ */ React9.createElement(AdvisorChat, { t, api: api2, symbol: aside, kind: "screen", title: t(`screen.${aside.slice(7)}`), startSession, aiReady }) : selected ? /* @__PURE__ */ React9.createElement(Detail, { key: selected, t, api: api2, symbol: selected, watched, onToggleWatch: toggleWatch, paper, onPaperChange: refreshPaper, onRecordLive: recordLive, startSession, aiReady }) : /* @__PURE__ */ React9.createElement("p", { className: "sm-muted" }, t("detail.empty"))))), /* @__PURE__ */ React9.createElement("footer", { className: "sm-foot" }, t("footer.version", { version: CLIENT_VERSION }), " · ", t("footer.disclaimer"), watchErr || paperErr ? ` · ${errorText(t, watchErr ?? paperErr)}` : ""));
}

// src/edition/public.js
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
var LOCALE = {
  zh: {
    "notice.noKnowledge": "没有找到插件自带的交易规则库，AI 顾问只能按通用原则回答。请重新安装插件。",
    "signal.planHint": "头寸单位按模拟盘权益 {equity} 的 {risk}% 除以 N 计算（海龟头寸单位），并按最小申报单位取整。",
    "screen.strong.desc": "择强汰弱：60日涨幅靠前，价格 > 60日线 > 250日线，趋势过滤向上",
    "advisor.subtitle": "结合实时数据与交易规则库",
    "advisor.waiting": "正在读取数据和相关规则…",
    "advisor.sources": "参考了 {n} 条规则",
    "advisor.sessionPrompt": "请先调用 market_analysis 工具获取 {title}（{symbol}）的最新数据；需要交易规则依据时调用 trading_knowledge_search；涉及我的实盘时用 market_live 查看（只有比例和 R 倍数）。然后回答我的问题：{question}",
    "quick.threeBooks": "从趋势、仓位风险和交易心理三个角度，分别怎么看这只？",
    "quick.lesson": "做趋势交易，我最该先学会哪三件事？",
    "live.banner": "插件不会替你下单。在券商 App 成交后，把成交记录到这里；插件按趋势跟踪和风险控制规则算仓位、盯止损、出待办，并用你的记录做复盘。",
    "live.plan.r.byLoss": "你最多能承受亏 {loss} 元；趋势跟踪要准备承受约 {dd}% 的回撤，所以交易资金上限约 {cap} 元",
    "live.plan.r.trial.none": "没有实盘经验：先投入上限的 {pct}% 试用，单笔风险 {risk}%（先在小仓位下证明能稳定执行，再逐步加大）",
    "live.plan.r.income": "要靠交易收入生活会带来很大心理压力，单笔风险降到 0.5%",
    "live.plan.r.guards": "护栏：所有持仓同时打到止损最多亏 {open}%；账户回撤 {reduce}% 缩小规模、{pause}% 暂停复盘；前 {trades} 笔是试用期",
    "live.check.paused": "账户回撤 {drawdown}% 已到暂停线：先复盘，暂不开新仓",
    "live.check.reduced": "账户回撤 {drawdown}%，数量按规则缩小 20%",
    "live.todo.addUnit": "{name} 涨过加仓价 {trigger}（现价 {price}）：可以加第 {unit} 个单位约 {qty} 股，加仓后止损上移到 {newStop}（每涨 ½N 加一个单位）",
    "live.todo.reduceSize": "账户回撤 {drawdown}% 超过 {limit}%：新开仓的规模缩小 20%",
    "live.ai.empty": "平仓之后可以让 AI 复盘。它会对照交易规则，从你的记录里总结出个人交易规则；之后 AI 顾问回答问题时会遵守这些规则。"
  },
  en: {
    "notice.noKnowledge": "The built-in rule library was not found; the AI advisor will answer from general principles only. Reinstall the plugin.",
    "signal.planHint": "Unit size is {risk}% of the paper equity {equity} divided by N (a Turtle unit), rounded down to the lot size.",
    "screen.strong.desc": "Keep the strong: top 60-day gainers with price > 60-day > 250-day average",
    "advisor.subtitle": "Live data plus a trading rule library",
    "advisor.waiting": "Reading data and related rules…",
    "advisor.sources": "Used {n} rules",
    "advisor.sessionPrompt": "First call market_analysis for {title} ({symbol}). Call trading_knowledge_search for rule references and market_live for my live account (ratios and R only). Then answer: {question}",
    "quick.threeBooks": "How does this look from the trend, risk and psychology angles?",
    "quick.lesson": "For trend trading, which three things should I learn first?",
    "live.banner": "This plugin never places orders. After a fill at your broker, record it here; the plugin sizes positions, watches stops and raises to-dos using trend-following and risk rules, and reviews your record.",
    "live.plan.r.byLoss": "You can lose at most {loss}; trend following must survive drawdowns of about {dd}%, so the capital ceiling is about {cap}",
    "live.plan.r.trial.none": "No live experience: start with {pct}% of the ceiling and {risk}% risk per trade (prove consistent execution at small size first)",
    "live.plan.r.income": "Needing trading income adds pressure, so risk per trade is capped at 0.5%",
    "live.plan.r.guards": "Guardrails: all stops hit together lose at most {open}%; cut size at a {reduce}% drawdown and pause at {pause}%; the first {trades} trades are a trial",
    "live.check.paused": "Drawdown {drawdown}% hit the pause line: review before opening new trades",
    "live.check.reduced": "Drawdown {drawdown}%: size cut by 20% per the rules",
    "live.todo.addUnit": "{name} passed the add price {trigger} (now {price}): add unit {unit}, about {qty} shares, then raise the stop to {newStop}",
    "live.todo.reduceSize": "Drawdown {drawdown}% exceeds {limit}%: cut new position size by 20%",
    "live.ai.empty": "After closing trades, ask the AI to review them against the trading rules and distil personal rules; the AI advisor follows them afterwards."
  }
};

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

// src/client/locales-live.js
var zhLive = {
  "tab.live": "实盘",
  "action.live": "记录实盘",
  "live.privacy": "隐私：金额和股数只保存在本机。AI 复盘和对话只拿到比例、R 倍数和价格，看不到你有多少钱。",
  "live.wizard.title": "第一步：定一个起步资金",
  "live.wizard.intro": '先回答几个问题。规则是"只用亏得起的钱"：按你能承受的最大亏损倒推交易资金上限，再先拿其中一小部分试用，证明自己能按计划执行、而且期望值为正之后再加大。',
  "live.f.assets": "可投资资产（元）",
  "live.f.assetsHint": "存款、理财等可以动用的钱，不含房产和生活必需",
  "live.f.expense": "每月生活支出（元）",
  "live.f.maxLoss": "最多能承受亏多少（元）",
  "live.f.maxLossHint": "亏掉这笔钱不会影响生活和睡眠",
  "live.f.experience": "实盘经验",
  "live.exp.none": "没有或很少",
  "live.exp.some": "做过一两年，有输有赢",
  "live.exp.experienced": "多年，有成形的系统",
  "live.f.emergency": "我已经另外存好了半年生活费的应急金",
  "live.f.income": "我需要靠交易收入维持生活",
  "live.wizard.calc": "算一下",
  "live.plan.title": "建议的资金计划",
  "live.plan.max": "交易资金上限",
  "live.plan.start": "建议起步资金",
  "live.plan.risk": "单笔风险",
  "live.plan.perTrade": "每笔最多亏",
  "live.plan.r.emergency": "先留出 {months} 个月生活费约 {amount} 元作应急金，这部分不进交易账户",
  "live.plan.r.capByAssets": "上限不超过扣除应急金后的可投资资产 {investable} 元",
  "live.plan.r.trial.some": "有一些经验：先投入上限的 {pct}% 试用，单笔风险 {risk}%",
  "live.plan.r.trial.experienced": "经验丰富：先投入上限的 {pct}%，单笔风险 {risk}%（海龟的 1N = 1%）",
  "live.plan.r.tooSmall": "起步资金 {amount} 元偏少：A 股一手起买，高价股按风险算常常不足一手，可以优先选价格较低的股票、ETF 或场外基金",
  "live.plan.r.notReady": "按你的情况，现在不建议投入真钱：先在模拟盘练习，或先存够应急金",
  "live.plan.adjustStart": "起步资金（可改）",
  "live.plan.adjustRisk": "单笔风险（可改）",
  "live.plan.adopt": "采用这个计划",
  "live.plan.note": "采用后，起步资金记为第一笔入金。实际转多少钱到券商由你决定，之后可以在页面底部入金或出金。",
  "live.plan.noteExisting": "账户已经有记录：采用新计划只更新单笔风险和资金上限，不改动现金；资金增减请用页面底部的入金或出金。",
  "live.replan": "重新评估资金计划",
  "live.replanBack": "返回实盘",
  "live.deposited": "累计入金",
  "live.drawdown": "距高点回撤",
  "live.openRisk": "持仓总风险",
  "live.stageLabel": "阶段",
  "live.stage.trial": "试用期 {done}/{total} 笔",
  "live.stage.normal": "正常",
  "live.noPositions": '还没有实盘持仓。在证券或基金详情里点"记录实盘"，先看买入计划单，成交后再录入。',
  "live.unrealized": "浮动盈亏",
  "live.toStop": "距止损",
  "live.units": "{n} 个单位",
  "live.recordTrade": "记录成交",
  "live.howToRecord": '记录新买入：打开证券或基金详情，点"记录实盘"。待办里的"记录卖出""记录加仓"会自动带上数量和价格。',
  "live.verdict.ok": "可以按计划买入",
  "live.verdict.warn": "可以买，但先看下面的提醒",
  "live.verdict.block": "不建议现在买入",
  "live.planLine": "建议 {qty} 股 @ {price}，止损 {stop}；打到止损亏权益的 {risk}%，仓位占 {pos}%",
  "live.planLineFund": "建议申购约 {amount} 元（约 {qty} 份 @ 净值 {price}），止损净值 {stop}；跌到止损亏权益的 {risk}%，仓位占 {pos}%",
  "live.check.noPlan": "还没有制定资金计划",
  "live.check.noN": "历史数据不足，算不出 N（平均波动），没法定止损和仓位",
  "live.check.trendUp": "趋势过滤向上（50 日均线在 300 日均线之上）",
  "live.check.trendDown": "趋势过滤向下：海龟只做顺势方向，逆势买入要格外谨慎",
  "live.check.breakoutToday": "今天出现海龟突破信号",
  "live.check.inTrend": "处在海龟系统的持有阶段（突破后尚未退出），属于追加入场",
  "live.check.noSignal": "当前没有海龟突破信号：没有信号的交易容易变成冲动交易",
  "live.check.openRisk": "买入后所有持仓的总风险 {after}%，超过上限 {limit}%",
  "live.check.openRiskOk": "买入后所有持仓的总风险 {after}%（上限 {limit}%）",
  "live.check.maxPositions": "已经持有 {max} 只，达到上限",
  "live.check.limitUp": "已涨停，大概率买不进，也不要追",
  "live.check.bigMove": "今天已经涨了 {pct}%，追高风险大，可以等回落或次日确认",
  "live.check.event": "{date} 有事件：{title}",
  "live.check.tooSmall": "按单笔风险算出来的数量不足最低买入单位：资金太少或波动太大，换一只或跳过",
  "live.check.cash": "现金不够按风险买满，数量已按现金下调",
  "live.check.fundNav": "场外基金按申购当天 15:00 后公布的净值成交（这里用的是 {date} 的净值），下单时看不到成交价；份额确认后再录入",
  "live.check.fundFee": "申购费率约 {rate}%（各平台常有折扣，以确认单为准）；持有不满 7 天赎回要收 1.5% 赎回费",
  "live.check.fundStop": "场外基金的止损放在 3N（股票是 2N）：只能按次日净值赎回，多留 1N 应对滞后，也避免 7 天内被止损白交赎回费",
  "live.form.title": "记录实盘成交",
  "live.form.sub": "在券商成交后填写；止损必填",
  "live.form.subFund": "份额确认后，按 App 确认单填写；止损净值必填",
  "live.form.add": "加仓",
  "live.form.addFund": "追加申购",
  "live.fund.buy": "申购",
  "live.fund.sell": "赎回",
  "live.form.qty": "成交数量（股）",
  "live.form.qtyFund": "确认份额",
  "live.form.price": "成交价",
  "live.form.priceFund": "确认净值",
  "live.form.stop": "止损价",
  "live.form.stopFund": "止损净值",
  "live.form.signal": "入场理由",
  "live.form.reason": "卖出原因",
  "live.form.fee": "手续费（元）",
  "live.form.feeHint": "留空按默认费率估算",
  "live.form.feeHintFund": "留空按申购费率估算",
  "live.form.date": "成交日期",
  "live.form.dateFund": "申购/赎回日（净值日期）",
  "live.form.note": "备注",
  "live.form.notePh": "为什么买或卖、当时的想法（复盘时有用）",
  "live.form.submit": "记录",
  "live.recorded.ok": "已记录。",
  "live.recorded.closed": "已清仓，这笔交易的结果是 {r}。记得在交易日志里复盘。",
  "live.warn.lot": "提示：数量不是 100 的整数倍。",
  "live.warn.cash": "提示：记录的现金不够，可能需要先入金。",
  "live.warn.tPlusOne": "提示：卖出了当天买入的股份（A 股 T+1），请确认日期。",
  "live.warn.fund7d": "提示：卖出了持有不满 7 天的份额，会被收取 1.5% 的赎回费。",
  "live.signal.s1": "海龟系统1（20日突破）",
  "live.signal.s2": "海龟系统2（55日突破）",
  "live.signal.trend": "趋势回调",
  "live.signal.other": "其他",
  "live.reason.stop": "止损",
  "live.reason.exit": "退出信号",
  "live.reason.target": "目标位",
  "live.reason.manual": "主观判断",
  "live.reason.other": "其他",
  "live.todo.title": "待办",
  "live.todo.none": "现在没有需要处理的事。",
  "live.todo.sellStop": "{name} 现价 {price} 已跌破止损 {stop}：按计划卖出全部 {qty} 股",
  "live.todo.sellStopFund": "{name} 最新净值 {price} 已跌破止损 {stop}：按计划赎回全部 {qty} 份",
  "live.todo.exitSignal": "{name} 跌破 {days} 日低点 {level}（现价 {price}）：海龟退出信号，卖出 {qty} 股",
  "live.todo.exitSignalFund": "{name} 净值跌破 {days} 日低点 {level}（最新 {price}）：趋势退出信号，赎回 {qty} 份",
  "live.todo.addUnitFund": "{name} 净值涨过加仓价 {trigger}（最新 {price}）：可以追加第 {unit} 个单位约 {amount} 元，之后止损上移到 {newStop}",
  "live.todo.raiseStop": "{name} 的止损可以从 {from} 上移到 {to}（按 N 计算的止损或通道低点），锁住部分利润",
  "live.todo.eventRisk": "{name} 在 {date} 有{kind}：{title}。持有过事件要接受跳空风险",
  "live.todo.pause": "账户回撤 {drawdown}% 已超过 {limit}%：暂停开新仓，先复盘最近的交易",
  "live.todo.scaleUp": '试用期 {trades} 笔：期望值 {expectancy}R、按计划执行率 {followRate}%。可以考虑加大资金（点"完成"进入正常阶段，加多少用入金记录）',
  "live.todo.negativeEdge": "最近 {trades} 笔的期望值是 {expectancy}R：这套做法目前在亏钱，先缩小规模，找出原因",
  "live.todo.reviewTrades": "有 {count} 笔已平仓交易还没复盘：标记是否按计划执行、有没有失误",
  "live.todo.aiReview": "又平仓了 {count} 笔，可以让 AI 复盘，更新你的个人交易规则",
  "live.todo.recordSell": "记录卖出",
  "live.todo.recordAdd": "记录加仓",
  "live.todo.applyStop": "上移止损",
  "live.todo.done": "完成",
  "live.todo.dismiss": "忽略",
  "live.journal.title": "交易日志",
  "live.journal.empty": "还没有平仓的交易。",
  "live.journal.days": "{n} 天",
  "live.journal.path": "入场 {entry}，初始止损 {stop}，加仓 {adds} 次 → 离场 {exit}（{reason}）",
  "live.journal.followed": "是否按计划执行",
  "live.journal.yes": "按计划",
  "live.journal.no": "没按计划",
  "live.journal.markReviewed": "标为已复盘",
  "live.mistake.chase": "追高",
  "live.mistake.noStop": "没按止损走",
  "live.mistake.earlyExit": "过早止盈",
  "live.mistake.againstTrend": "逆势",
  "live.mistake.oversize": "仓位过重",
  "live.mistake.noSignal": "没有信号",
  "live.mistake.averageDown": "亏损加仓",
  "live.mistake.news": "听消息",
  "live.stats.title": "统计（用 R 衡量：1R = 计划的单笔风险）",
  "live.stats.empty": "平仓几笔之后，这里会显示你的期望值、胜率和最伤钱的失误。",
  "live.stats.expectancy": "期望值（每笔）",
  "live.stats.winRate": "胜率",
  "live.stats.avgWin": "平均盈利",
  "live.stats.avgLoss": "平均亏损",
  "live.stats.total": "累计",
  "live.stats.streak": "最长连亏",
  "live.stats.follow": "按计划执行率",
  "live.stats.followVs": "按计划 / 没按计划",
  "live.stats.dist": "R 倍数分布",
  "live.stats.byMistake": "各类失误的代价",
  "live.stats.mistakeLine": "{name}：{n} 笔，平均 {r}",
  "live.stats.bySignal": "按入场理由",
  "live.ai.title": "AI 复盘与个人交易规则",
  "live.ai.updated": "{at} 更新，基于 {n} 笔已平仓交易",
  "live.ai.run": "让 AI 复盘",
  "live.ai.note": "AI 只读取比例、R 倍数和价格。规则来自你自己的数据，样本少时只能当作参考。",
  "live.capital.title": "资金",
  "live.capital.amount": "金额（元）",
  "live.capital.deposit": "入金",
  "live.capital.withdraw": "出金",
  "live.reset": "清空实盘记录",
  "live.resetConfirm": "确定清空实盘的计划、持仓和所有记录吗？旧记录会在本机另存一份归档。",
  "err.live.notTradable": "实盘跟踪支持 A 股、场内基金和场外基金",
  "err.live.badAmount": "请输入不为 0 的金额",
  "err.live.noCash": "出金金额超过了记录的现金",
  "err.live.badQty": "数量必须大于 0",
  "err.live.badPrice": "价格必须大于 0",
  "err.live.needStop": "买入必须填写止损，且止损要低于买入价",
  "err.live.noPosition": "实盘里没有这只的持仓",
  "err.live.overSell": "卖出数量超过持仓（共 {total}）",
  "err.live.badSide": "买卖方向不正确",
  "err.live.noTrade": "找不到这笔交易",
  "err.live.badRisk": "单笔风险要在 0 到 2% 之间",
  "err.live.notReady": "起步资金为 0：按现在的情况不建议投入真钱",
  "err.live.noPlan": "先制定资金计划",
  "err.live.noClosed": "还没有平仓的交易，暂时没法复盘"
};
var enLive = {
  "tab.live": "Live",
  "action.live": "Record live trade",
  "live.privacy": "Privacy: amounts and share counts stay on this computer. The AI review and chat only see ratios, R multiples and prices.",
  "live.wizard.title": "Step 1: choose a starting stake",
  "live.wizard.intro": 'Answer a few questions. The rule is "only trade money you can afford to lose": the maximum loss you can take sets the capital ceiling, and you start with part of it until you show that you follow your plan and have a positive expectancy.',
  "live.f.assets": "Investable assets",
  "live.f.assetsHint": "Savings you could use, excluding your home and living needs",
  "live.f.expense": "Monthly living expenses",
  "live.f.maxLoss": "Largest loss you can accept",
  "live.f.maxLossHint": "Losing it would not affect your life or sleep",
  "live.f.experience": "Live trading experience",
  "live.exp.none": "None or little",
  "live.exp.some": "A year or two, mixed results",
  "live.exp.experienced": "Several years with a working system",
  "live.f.emergency": "I already keep six months of expenses as a separate emergency fund",
  "live.f.income": "I need trading income to live on",
  "live.wizard.calc": "Calculate",
  "live.plan.title": "Suggested capital plan",
  "live.plan.max": "Capital ceiling",
  "live.plan.start": "Suggested start",
  "live.plan.risk": "Risk per trade",
  "live.plan.perTrade": "Max loss per trade",
  "live.plan.r.emergency": "Set aside {months} months of expenses (about {amount}) as an emergency fund outside the trading account",
  "live.plan.r.capByAssets": "The ceiling is capped at your investable assets after the emergency fund ({investable})",
  "live.plan.r.trial.some": "Some experience: start with {pct}% of the ceiling and {risk}% risk per trade",
  "live.plan.r.trial.experienced": "Experienced: start with {pct}% of the ceiling and {risk}% risk per trade (the Turtle 1N = 1%)",
  "live.plan.r.tooSmall": "A start of {amount} is small: A shares trade in 100-share lots, so pricier stocks often fall below one lot; prefer cheaper stocks, ETFs or mutual funds",
  "live.plan.r.notReady": "Given your answers, real money is not advised yet: practise on the paper account or build the emergency fund first",
  "live.plan.adjustStart": "Starting stake (editable)",
  "live.plan.adjustRisk": "Risk per trade (editable)",
  "live.plan.adopt": "Adopt this plan",
  "live.plan.note": "The starting stake is recorded as your first deposit. You decide how much to move to your broker; deposits and withdrawals are at the bottom of the page.",
  "live.plan.noteExisting": "This account already has records: a new plan only updates risk and the ceiling, not cash. Use deposit or withdraw at the bottom of the page.",
  "live.replan": "Redo capital plan",
  "live.replanBack": "Back to live",
  "live.deposited": "Deposited",
  "live.drawdown": "From peak",
  "live.openRisk": "Open risk",
  "live.stageLabel": "Stage",
  "live.stage.trial": "Trial {done}/{total}",
  "live.stage.normal": "Normal",
  "live.noPositions": "No live positions yet. Open a security or fund and choose Record live trade to see the plan first, then record the fill.",
  "live.unrealized": "Unrealized",
  "live.toStop": "To stop",
  "live.units": "{n} units",
  "live.recordTrade": "Record fill",
  "live.howToRecord": "To record a new buy, open a security or fund and choose Record live trade. Record sell and Record add in the to-dos prefill size and price.",
  "live.verdict.ok": "OK to buy per plan",
  "live.verdict.warn": "OK to buy, but read the notes below",
  "live.verdict.block": "Buying now is not advised",
  "live.planLine": "{qty} shares @ {price}, stop {stop}; a stop-out loses {risk}% of equity; position {pos}%",
  "live.planLineFund": "Buy about {amount} (≈{qty} units @ NAV {price}), stop NAV {stop}; a stop-out loses {risk}% of equity; position {pos}%",
  "live.check.noPlan": "No capital plan yet",
  "live.check.noN": "Not enough history to compute N, so no stop or size",
  "live.check.trendUp": "Trend filter up (50-day MA above 300-day MA)",
  "live.check.trendDown": "Trend filter down: Turtles only trade with the trend",
  "live.check.breakoutToday": "Turtle breakout today",
  "live.check.inTrend": "Turtle system is long (after a breakout, before exit): a late entry",
  "live.check.noSignal": "No Turtle breakout now: trades without a signal tend to be impulsive",
  "live.check.openRisk": "Total open risk after buying would be {after}%, above the {limit}% limit",
  "live.check.openRiskOk": "Total open risk after buying: {after}% (limit {limit}%)",
  "live.check.maxPositions": "Already holding {max} positions, the maximum",
  "live.check.limitUp": "Limit up: probably cannot fill, do not chase",
  "live.check.bigMove": "Up {pct}% today: chasing is risky, wait for a pullback or confirmation",
  "live.check.event": "Event on {date}: {title}",
  "live.check.tooSmall": "Risk-based size is below the minimum lot: too little capital or too volatile",
  "live.check.cash": "Not enough cash for the full size; reduced to fit cash",
  "live.check.fundNav": "Mutual funds fill at the NAV published after 15:00 on the order day (this uses the {date} NAV); record after units are confirmed",
  "live.check.fundFee": "Purchase fee about {rate}% (platforms often discount it); redeeming within 7 days costs 1.5%",
  "live.check.fundStop": "Mutual fund stops sit at 3N (stocks use 2N): redemptions fill at the next NAV, so 1N covers the lag and avoids paying the 7-day fee on a quick stop-out",
  "live.form.title": "Record live fill",
  "live.form.sub": "Fill in after your broker executes; stop is required",
  "live.form.subFund": "Fill in from the confirmation once units are confirmed; stop NAV is required",
  "live.form.add": "Add",
  "live.form.addFund": "Buy more",
  "live.fund.buy": "Purchase",
  "live.fund.sell": "Redeem",
  "live.form.qty": "Shares filled",
  "live.form.qtyFund": "Confirmed units",
  "live.form.price": "Fill price",
  "live.form.priceFund": "Confirmed NAV",
  "live.form.stop": "Stop price",
  "live.form.stopFund": "Stop NAV",
  "live.form.signal": "Entry reason",
  "live.form.reason": "Exit reason",
  "live.form.fee": "Fees",
  "live.form.feeHint": "Blank = default rates",
  "live.form.feeHintFund": "Blank = purchase fee rate",
  "live.form.date": "Fill date",
  "live.form.dateFund": "Order date (NAV date)",
  "live.form.note": "Note",
  "live.form.notePh": "Why you traded and what you were thinking",
  "live.form.submit": "Record",
  "live.recorded.ok": "Recorded.",
  "live.recorded.closed": "Position closed with a result of {r}. Review it in the journal.",
  "live.warn.lot": "Note: quantity is not a multiple of 100.",
  "live.warn.cash": "Note: recorded cash is short; you may need to record a deposit.",
  "live.warn.tPlusOne": "Note: shares bought the same day were sold (A shares are T+1); check the date.",
  "live.warn.fund7d": "Note: units held under 7 days were redeemed and incur a 1.5% fee.",
  "live.signal.s1": "Turtle System 1 (20-day breakout)",
  "live.signal.s2": "Turtle System 2 (55-day breakout)",
  "live.signal.trend": "Trend pullback",
  "live.signal.other": "Other",
  "live.reason.stop": "Stop",
  "live.reason.exit": "Exit signal",
  "live.reason.target": "Target",
  "live.reason.manual": "Discretion",
  "live.reason.other": "Other",
  "live.todo.title": "To-dos",
  "live.todo.none": "Nothing to do right now.",
  "live.todo.sellStop": "{name} at {price} is below the stop {stop}: sell all {qty} shares per plan",
  "live.todo.sellStopFund": "{name} NAV {price} is below the stop {stop}: redeem all {qty} units per plan",
  "live.todo.exitSignal": "{name} broke its {days}-day low {level} (now {price}): Turtle exit, sell {qty} shares",
  "live.todo.exitSignalFund": "{name} NAV broke its {days}-day low {level} (latest {price}): trend exit, redeem {qty} units",
  "live.todo.addUnitFund": "{name} NAV passed the add price {trigger} (latest {price}): add unit {unit}, about {amount}, then raise the stop to {newStop}",
  "live.todo.raiseStop": "Raise the stop on {name} from {from} to {to} (N-based stop or channel low) to lock in profit",
  "live.todo.eventRisk": "{name} has a {kind} on {date}: {title}. Holding through it means gap risk",
  "live.todo.pause": "Drawdown {drawdown}% exceeds {limit}%: stop opening trades and review",
  "live.todo.scaleUp": "Trial of {trades} trades: expectancy {expectancy}R, plan followed {followRate}%. Consider adding capital (Done moves you to the normal stage; record the deposit)",
  "live.todo.negativeEdge": "Expectancy over the last {trades} trades is {expectancy}R: the approach is losing money, cut size and find out why",
  "live.todo.reviewTrades": "{count} closed trades need review: mark whether you followed the plan and any mistakes",
  "live.todo.aiReview": "{count} more trades closed: ask the AI to review and update your personal rules",
  "live.todo.recordSell": "Record sell",
  "live.todo.recordAdd": "Record add",
  "live.todo.applyStop": "Raise stop",
  "live.todo.done": "Done",
  "live.todo.dismiss": "Dismiss",
  "live.journal.title": "Trade journal",
  "live.journal.empty": "No closed trades yet.",
  "live.journal.days": "{n} days",
  "live.journal.path": "Entry {entry}, initial stop {stop}, {adds} adds → exit {exit} ({reason})",
  "live.journal.followed": "Followed the plan?",
  "live.journal.yes": "Followed",
  "live.journal.no": "Broke plan",
  "live.journal.markReviewed": "Mark reviewed",
  "live.mistake.chase": "Chased",
  "live.mistake.noStop": "Ignored stop",
  "live.mistake.earlyExit": "Exited early",
  "live.mistake.againstTrend": "Against trend",
  "live.mistake.oversize": "Oversized",
  "live.mistake.noSignal": "No signal",
  "live.mistake.averageDown": "Averaged down",
  "live.mistake.news": "Traded a tip",
  "live.stats.title": "Statistics (in R: 1R = planned risk per trade)",
  "live.stats.empty": "After a few closed trades, your expectancy, win rate and costliest mistakes show here.",
  "live.stats.expectancy": "Expectancy / trade",
  "live.stats.winRate": "Win rate",
  "live.stats.avgWin": "Average win",
  "live.stats.avgLoss": "Average loss",
  "live.stats.total": "Total",
  "live.stats.streak": "Longest losing run",
  "live.stats.follow": "Plan followed",
  "live.stats.followVs": "Followed / broke plan",
  "live.stats.dist": "R-multiple distribution",
  "live.stats.byMistake": "Cost of each mistake",
  "live.stats.mistakeLine": "{name}: {n} trades, average {r}",
  "live.stats.bySignal": "By entry reason",
  "live.ai.title": "AI review and personal rules",
  "live.ai.updated": "Updated {at} from {n} closed trades",
  "live.ai.run": "Ask AI to review",
  "live.ai.note": "The AI only reads ratios, R multiples and prices. Rules come from your own data and are tentative while the sample is small.",
  "live.capital.title": "Capital",
  "live.capital.amount": "Amount",
  "live.capital.deposit": "Deposit",
  "live.capital.withdraw": "Withdraw",
  "live.reset": "Clear live records",
  "live.resetConfirm": "Clear the live plan, positions and all records? An archive copy is kept on this computer.",
  "err.live.notTradable": "Live tracking supports China A shares, listed funds and mutual funds",
  "err.live.badAmount": "Enter a non-zero amount",
  "err.live.noCash": "The withdrawal exceeds recorded cash",
  "err.live.badQty": "Quantity must be above 0",
  "err.live.badPrice": "Price must be above 0",
  "err.live.needStop": "A buy needs a stop below the buy price",
  "err.live.noPosition": "No live position in this security",
  "err.live.overSell": "The sell exceeds the position ({total})",
  "err.live.badSide": "Invalid side",
  "err.live.noTrade": "Trade not found",
  "err.live.badRisk": "Risk per trade must be between 0 and 2%",
  "err.live.notReady": "The starting stake is 0: real money is not advised yet",
  "err.live.noPlan": "Create a capital plan first",
  "err.live.noClosed": "No closed trades to review yet"
};

// src/client/locales.js
var prefixed = (dict) => Object.fromEntries(Object.entries(dict).map(([k, v]) => [`r.${k}`, v]));
var zhUi = {
  "title": "市场",
  "unit.style": "cn",
  "unit.yi": "亿",
  "unit.wan": "万",
  "common.loading": "加载中…",
  "common.empty": "没有数据",
  "common.working": "处理中…",
  "common.save": "保存",
  "common.delete": "删除",
  "common.retry": "重试",
  "err.render": "这部分界面出错了：{message}",
  "search.placeholder": "搜索代码、名称、拼音或基金",
  "indices.label": "主要指数",
  "tabs.label": "市场功能",
  "market.label": "市场分区",
  "detail.label": "证券详情",
  "detail.empty": "从左侧列表或搜索框选择一只证券",
  "detail.back": "返回列表",
  "colors.redUp": "红涨绿跌",
  "colors.greenUp": "绿涨红跌",
  "notice.versionMismatch": "插件后端是 v{host}，页面是 v{client}，版本不一致。请重启 DSH 让新版本完整生效。",
  "footer.version": "市场 v{version}",
  "notice.update": "「市场」有新版本 v{version}：打开 插件 → 发现，在「市场」上点「更新」，完成后重启 DSH。",
  "footer.disclaimer": "行情来自东方财富、腾讯、新浪等公开接口，可能延迟或中断；量化信号与 AI 意见仅供参考，不构成投资建议。",
  "tab.market": "行情",
  "tab.watch": "自选",
  "tab.paper": "模拟盘",
  "tab.screen": "选股",
  "tab.alerts": "提醒",
  "tab.advisor": "AI 顾问",
  "market.group.stock": "股票",
  "market.group.fund": "基金",
  "market.tip.a": "沪深北全部 A 股",
  "market.tip.sh": "上海证券交易所 A 股（含科创板）",
  "market.tip.sz": "深圳证券交易所 A 股（含创业板）",
  "market.tip.cyb": "创业板，涨跌幅 ±20%",
  "market.tip.kcb": "科创板，涨跌幅 ±20%，200 股起买",
  "market.tip.bj": "北京证券交易所，涨跌幅 ±30%",
  "market.tip.hk": "香港交易所股票",
  "market.tip.us": "纳斯达克、纽交所、美交所股票",
  "market.tip.etf": "场内交易型指数基金：在交易所像股票一样买卖，盘中实时价格，可模拟交易",
  "market.tip.lof": "上市型开放式基金：既能在交易所实时买卖，也能按净值申购赎回",
  "market.tip.fund": "场外基金：通过基金公司、银行、支付宝、天天基金等申购赎回，每天只有一个净值价格",
  "market.a": "A股",
  "market.sh": "沪A",
  "market.sz": "深A",
  "market.cyb": "创业板",
  "market.kcb": "科创板",
  "market.bj": "北交所",
  "market.etf": "ETF",
  "market.lof": "LOF",
  "market.hk": "港股",
  "market.us": "美股",
  "market.fund": "场外基金",
  "kind.cn.stock": "A股",
  "kind.cn.etf": "场内基金",
  "kind.cn.index": "指数",
  "kind.hk.stock": "港股",
  "kind.us.stock": "美股",
  "kind.global.index": "全球指数",
  "kind.fund": "场外基金",
  "col.name": "名称",
  "col.code": "代码",
  "col.price": "最新价",
  "col.pct": "涨跌幅",
  "col.amount": "成交额",
  "col.turnover": "换手率",
  "col.mcap": "总市值",
  "col.pct60": "60日",
  "pager.prev": "上一页",
  "pager.next": "下一页",
  "pager.info": "第 {page}/{pages} 页，共 {total} 只",
  "fundList.type": "基金类型",
  "fundList.sort": "排序",
  "fundList.note": "场外基金按每日净值申购赎回，没有盘中实时价格；净值通常在交易日晚间更新。",
  "fundType.all": "全部",
  "fundType.gp": "股票型",
  "fundType.hh": "混合型",
  "fundType.zq": "债券型",
  "fundType.zs": "指数型",
  "fundType.qdii": "QDII",
  "fundType.fof": "FOF",
  "fundCol.nav": "单位净值",
  "fundCol.day": "日涨幅",
  "fundCol.week": "近1周",
  "fundCol.month": "近1月",
  "fundCol.month3": "近3月",
  "fundCol.month6": "近6月",
  "fundCol.year1": "近1年",
  "fundCol.year3": "近3年",
  "fundCol.ytd": "今年来",
  "fund.m1": "近1月",
  "fund.m3": "近3月",
  "fund.m6": "近6月",
  "fund.y1": "近1年",
  "fund.y3": "近3年",
  "fund.fromPeak": "距1年高点",
  "fund.mdd": "近1年最大回撤",
  "fund.fee": "申购费率",
  "fund.scale": "基金规模",
  "fund.managers": "基金经理",
  "fund.noRealtime": "场外基金按每日净值申购赎回，没有盘中价格，因此不支持模拟交易和价格提醒；可以加自选并向 AI 顾问提问。",
  "fund.range.y1": "近1年",
  "fund.range.y3": "近3年",
  "fund.range.all": "全部",
  "fund.holdings": "前十大持仓",
  "fund.weight": "占净值",
  "chart.eventsHint": "圆点表示有新闻或事件，悬停查看，点击固定",
  "chart.range": "{from} ～ {to}，{n} 根",
  "chart.zoomHint": "滚轮缩放，按住拖动平移，双击复位",
  "chart.zoomIn": "放大（显示更少 K 线）",
  "chart.zoomOut": "缩小（显示更长时间）",
  "chart.reset": "复位",
  "chart.eventsCount": "{n} 条消息",
  "chart.clickToPin": "点击查看当天全部消息，并让 AI 分析原因",
  "ev.news": "新闻",
  "ev.notice": "公告",
  "ev.flash": "快讯",
  "ev.lhb": "龙虎榜",
  "ev.dividend": "分红送转",
  "ev.lift": "限售解禁",
  "ev.forecast": "业绩预告",
  "ev.report": "财报",
  "ev.holder": "增减持",
  "news.title": "新闻、公告与事件",
  "news.coverage": "新闻覆盖 {from} 至 {to}",
  "news.filter": "分类",
  "news.f.all": "全部",
  "news.f.news": "新闻",
  "news.f.notice": "公告",
  "news.f.event": "事件",
  "news.f.upcoming": "即将发生",
  "news.empty": "暂无相关内容",
  "news.more": "再显示 {n} 条",
  "news.note": "点击标题在新窗口打开原文。消息来自东方财富、新浪等公开渠道，标题不代表内容已被核实。",
  "day.title": "{date} 的消息",
  "day.bar": "收 {close}（{pct}）",
  "day.close": "关闭",
  "day.none": "这段时间没有抓到相关新闻、公告或事件。",
  "day.ask": "让 AI 分析这天为什么{direction}",
  "day.rose": "涨了 {pct}",
  "day.fell": "跌了 {pct}",
  "day.moved": "涨跌",
  "day.askQuestion": "请分析 {date} 这天为什么{direction}：结合当天前后的新闻、公告和事件，区分直接原因和可能相关的因素，再说明这对后续趋势和我的操作意味着什么。",
  "day.window": "统计窗口：前一交易日 15:00 到当日 15:00（盘后和周末的消息归到下一个交易日）。",
  "watch.empty": '还没有自选。打开任意证券，点"加自选"。',
  "watch.remove": "把 {name} 移出自选",
  "watch.removeShort": "移除",
  "q.open": "今开",
  "q.high": "最高",
  "q.low": "最低",
  "q.prevClose": "昨收",
  "q.amount": "成交额",
  "q.turnover": "换手率",
  "q.pe": "市盈率(动)",
  "q.mcap": "总市值",
  "q.limits": "涨停/跌停",
  "action.watch": "加自选",
  "action.unwatch": "取消自选",
  "action.trade": "模拟交易",
  "action.alert": "设提醒",
  "chart.period": "图表周期",
  "chart.empty": "暂无图表数据",
  "chart.aria": "价格走势图",
  "chart.open": "开",
  "chart.high": "高",
  "chart.low": "低",
  "chart.close": "收",
  "chart.dc55": "55日高点",
  "chart.dc20": "20日通道",
  "chart.stop": "止损",
  "period.trends": "分时",
  "period.day": "日K",
  "period.week": "周K",
  "period.month": "月K",
  "period.m60": "60分",
  "signal.title": "量化信号",
  "signal.asOf": "截至 {date}",
  "signal.score": "评分 {score}（−100～+100）",
  "signal.insufficient": "K 线只有 {n} 根，数据不足以计算信号。",
  "signal.trendFilter": "趋势过滤（50/300日）",
  "signal.filterUp": "向上",
  "signal.filterDown": "向下",
  "signal.system1": "海龟系统1",
  "signal.system2": "海龟系统2",
  "signal.stopNow": "现价买入的2N止损",
  "signal.s2Entry": "系统2突破价",
  "signal.unit": "头寸单位",
  "signal.shares": "{n} 股",
  "signal.riskAtStop": "打到止损约亏",
  "signal.volAnnual": "年化波动",
  "signal.mdd1y": "近1年最大回撤",
  "signal.mom60": "60日涨跌",
  "sys.breakout": "今日突破",
  "sys.long": "持有中",
  "sys.exit": "今日退出",
  "sys.flat": "空仓等待",
  "forecast.title": "概率区间与历史统计",
  "forecast.subtitle": "不是点位预言",
  "forecast.horizon": "期限",
  "forecast.p68": "约 68% 区间",
  "forecast.p95": "约 95% 区间",
  "forecast.move": "1σ 波动",
  "forecast.days": "{n} 个交易日",
  "forecast.baseTitle": "这只证券自己历史上的同类信号（之后持有 20 个交易日）",
  "forecast.signal": "信号",
  "forecast.count": "次数",
  "forecast.win": "上涨占比",
  "forecast.avg": "平均",
  "forecast.median": "中位数",
  "forecast.stopHit": "触及2N止损",
  "forecast.s2f": "55日突破 + 趋势过滤",
  "forecast.s1f": "20日突破 + 趋势过滤",
  "forecast.s2raw": "55日突破（不过滤）",
  "forecast.noHistory": "历史数据不足",
  "forecast.never": "历史上没有出现过",
  "forecast.note": "区间按最近 60 日波动率的对数正态分布估算，假设没有趋势；历史统计只反映过去，样本少时参考价值有限。",
  "order.title": "模拟交易",
  "order.rules": "A股规则：T+1，100股一手（科创板200股起），含佣金、印花税、过户费",
  "order.side": "买卖方向",
  "order.buy": "买入",
  "order.sell": "卖出",
  "order.type": "委托类型",
  "order.market": "市价",
  "order.limit": "限价（当日有效）",
  "order.qty": "数量（股）",
  "order.price": "委托价",
  "order.stop": "止损位（可选）",
  "order.submit": "提交委托",
  "order.planHint": "海龟头寸单位建议 {n} 股，2N 止损 {stop}。",
  "order.positionHint": "当前持有 {qty} 股，可卖 {avail} 股，成本 {cost}。",
  "order.filled": "已成交：{qty} 股 @ {price}",
  "order.pending": "委托已挂单：{qty} 股 @ {price}，当日有效",
  "alert.title": "设置提醒",
  "alert.type": "条件",
  "alert.price": "价格",
  "alert.pct": "涨跌幅（%）",
  "alert.add": "添加提醒",
  "alert.added": '已添加提醒，触发后会在"提醒"页和左侧栏图标显示。',
  "alert.t.priceAbove": "价格涨到",
  "alert.t.priceBelow": "价格跌到",
  "alert.t.pctAbove": "当日涨幅达到",
  "alert.t.pctBelow": "当日跌幅达到",
  "alert.t.breakout20": "突破20日高点（系统1入市）",
  "alert.t.breakout55": "突破55日高点（系统2入市）",
  "alert.t.breakdown10": "跌破10日低点（系统1退出）",
  "alert.t.breakdown20": "跌破20日低点（系统2退出）",
  "alert.t.paperStop": "跌破模拟盘止损位",
  "alerts.events": "触发记录",
  "alerts.markRead": "全部标为已读",
  "alerts.clear": "清空记录",
  "alerts.noEvents": "暂无触发记录",
  "alerts.rules": "提醒规则",
  "alerts.noRules": '还没有提醒规则。在证券详情里点"设提醒"。',
  "alerts.active": "监控中",
  "alerts.fired": "已于 {at} 触发",
  "alerts.note": "交易时段内每 20 秒检查一次；规则触发一次后失效。模拟盘持仓设置了止损位时，跌破也会提醒。",
  "event.alert": "{type} {value}，现价 {price}",
  "event.stop": "跌破止损位 {value}，现价 {price}",
  "event.fill": "限价单成交：{side} {value} 股 @ {price}",
  "paper.equity": "总权益",
  "paper.pnl": "总盈亏",
  "paper.cash": "可用资金",
  "paper.value": "持仓市值",
  "paper.realized": "已实现盈亏",
  "paper.fees": "累计费用",
  "paper.curve": "权益曲线",
  "paper.positions": "持仓",
  "paper.noPositions": '暂无持仓。打开证券详情，点"模拟交易"。',
  "paper.qty": "数量",
  "paper.cost": "成本",
  "paper.stop": "止损位",
  "paper.stopFor": "{name} 的止损位",
  "paper.avail": "可卖 {n}",
  "paper.sellAll": "全部卖出",
  "paper.pending": "未成交委托",
  "paper.cancel": "撤单",
  "paper.trades": "成交记录",
  "paper.noTrades": "暂无成交",
  "paper.fee": "费用 {fee}",
  "paper.reset": "重置模拟盘",
  "paper.resetConfirm": "确定清空所有持仓和记录，按初始资金重新开始吗？",
  "paper.rules": "简化：不处理分红送转；场内基金一律按 T+1；节假日按工作日处理（休市日的市价单会被拒绝或无法成交）。",
  "screen.presets": "选股方案",
  "screen.run": "开始选股",
  "screen.rerun": "重新选股",
  "screen.running": "扫描中 {done}/{total}…",
  "screen.summary": "{at}：取样 {universe} 只，初筛 {scanned} 只，命中 {n} 只",
  "screen.discuss": "让 AI 点评这批候选",
  "screen.failed": "选股失败：{message}",
  "screen.none": "当前没有满足条件的证券。",
  "screen.score": "评分",
  "screen.why": "入选理由",
  "screen.turtle55": "海龟 55 日突破",
  "screen.turtle55.desc": "系统2：收盘突破前55日最高价（近10日内），且50日均线在300日均线之上",
  "screen.turtle20": "海龟 20 日突破",
  "screen.turtle20.desc": "系统1：收盘突破前20日最高价（近5日内），且趋势过滤向上",
  "screen.strong": "强势趋势（择强汰弱）",
  "screen.etfTrend": "ETF 趋势",
  "screen.etfTrend.desc": "成交活跃的 ETF 中，系统2持有中且趋势向上，按60日动量排序",
  "screen.fundTrend": "场外基金趋势",
  "screen.fundTrend.desc": "指数型、股票型、混合型近 6 月排行前列中，净值在 60 日线上方、趋势过滤向上、系统2持有中的基金；走势几乎一样的合并成一组",
  "screen.noteFund": '场外基金按含分红的净值计算：止损用 3N（只能按次日净值赎回，多留 1N），"一个单位占账户"按模拟盘权益的 1% 风险计算。同组基金走势几乎一样（日收益相关系数 ≥ 0.95），只算一个持仓，按你常用平台的费率挑一只即可。',
  "screen.stopFund": "3N 止损净值",
  "screen.unitPct": "一个单位占账户",
  "screen.similar": "同类还有 {n} 只：{names}…",
  "screen.grouped": "，合并成 {n} 组",
  "screen.note": '规则选股只说明"符合这条规则"，不代表会上涨。成交额门槛：股票 1–2 亿、ETF 5000 万；排除 ST 与退市股。',
  "advisor.modelLabel": "模型",
  "advisor.reasoningLabel": "推理强度",
  "advisor.modelDefault": "插件默认（{model}）",
  "advisor.reasoningAuto": "默认",
  "advisor.reasoningAutoWith": "默认（{effort}）",
  "advisor.modelRefresh": "刷新模型列表",
  "advisor.modelUnavailable": "暂时读不到模型列表",
  "advisor.title": "AI 顾问",
  "advisor.general": "整体市场与我的模拟盘",
  "advisor.toSession": "转到 DSH 对话",
  "advisor.clear": "清空对话",
  "advisor.unavailable": "AI 服务暂不可用：请确认 DSH 已登录 DeepSeek 账号。",
  "advisor.empty": "可以直接问：现在能买吗？该止损吗？按海龟规则怎么做？",
  "advisor.thinking": "正在思考…",
  "advisor.placeholder": "问问 AI 顾问（Enter 发送，Shift+Enter 换行）",
  "advisor.stop": "停止",
  "advisor.send": "发送",
  "advisor.disclaimer": "AI 会给出买卖倾向、止损和仓位，但这是基于规则的参考意见，不承诺收益。",
  "quick.canBuy": "现在能买吗？请给出明确的买入或观望建议、止损位和仓位。",
  "quick.holding": "如果我持有它，现在该继续持有、减仓还是卖出？",
  "quick.turtlePlan": "按原版海龟规则，给我一个完整的交易计划。",
  "quick.outlook": "未来 20 个交易日可能怎么走？请给出概率情景。",
  "quick.fundBuy": "现在适合买入或定投这只基金吗？",
  "quick.fundRisk": "这只基金的风险有多大？回撤和波动怎么样？",
  "quick.fundTrend": "按趋势跟踪原则，它现在处于什么阶段？",
  "quick.screenPick": "这批候选里哪几只最值得关注？给出入场条件和止损。",
  "quick.screenRisk": "这批候选有什么共同风险？仓位怎么分配？",
  "quick.market": "现在的市场整体处于什么状态？",
  "quick.funds": "有哪些基金适合现在买入？",
  "quick.stocks": "有哪些股票值得关注、可以买入？",
  "advisor.status.screening": "正在运行选股：{presets}（第一次大约半分钟到一分钟）…",
  "quick.portfolio": "帮我检查模拟盘：仓位和止损合理吗？",
  "quick.live": "看看我的实盘：现在最该做什么？哪些持仓要处理？",
  "err.generic": "出错了（{code}）",
  "err.network": "网络连接失败，请检查网络。",
  "err.http": "请求失败（{status}）",
  "err.upstream": "行情接口暂时不可用：{message}",
  "err.notInstalled": '插件后端没有响应，请确认"市场"插件已启用。',
  "err.session.unavailable": "当前环境不能新建 DSH 对话。",
  "err.symbol.empty": "请输入证券代码或名称",
  "err.symbol.notFound": '找不到"{query}"',
  "err.symbol.invalid": "证券代码格式不正确",
  "err.market.unknown": "未知的市场分区",
  "err.paper.notTradable": "模拟盘只支持 A 股和场内基金",
  "err.paper.badSide": "买卖方向不正确",
  "err.paper.badType": "委托类型不正确",
  "err.paper.noPrice": "暂时拿不到价格（可能停牌）",
  "err.paper.badQty": "数量必须是正整数",
  "err.paper.minQty": "买入数量不能少于 {min} 股",
  "err.paper.lotStep": "买入数量必须是 {step} 的整数倍",
  "err.paper.tPlusOne": "T+1：今天买入的股份明天才能卖",
  "err.paper.noPosition": "没有这只证券的持仓",
  "err.paper.overSell": "可卖数量只有 {avail} 股",
  "err.paper.oddLot": "不足一手的零股要一次性卖出（可卖 {avail} 股）",
  "err.paper.marketClosed": "现在不是 A 股交易时间，市价单无法成交；可以改用限价单",
  "err.paper.badPrice": "请输入委托价",
  "err.paper.outOfLimit": "委托价超出涨跌停范围（{down}～{up}）",
  "err.paper.noCash": "可用资金不足：需要 {need}，可用 {cash}",
  "err.paper.limitUp": "已涨停，买不进",
  "err.paper.limitDown": "已跌停，卖不出",
  "err.paper.noOrder": "找不到这笔委托",
  "err.paper.notPending": "这笔委托已经不能撤销",
  "err.alert.badType": "提醒类型不正确",
  "err.alert.badValue": "请输入大于 0 的数值",
  "err.alert.fundUnsupported": "场外基金没有盘中价格，暂不支持提醒",
  "err.screen.unknown": "未知的选股方案",
  "err.screen.notReady": "先运行选股，再让 AI 点评",
  "err.ai.unavailable": "AI 服务不可用：请确认 DSH 已登录 DeepSeek 账号",
  "err.ai.badModel": "这个模型现在不可用：{model}",
  "err.ai.badReasoning": "这个模型不支持推理强度 {reasoning}",
  "err.ai.emptyQuestion": "请输入问题",
  "err.ai.failed": "AI 回答失败：{message}",
  "err.request.tooLarge": "请求内容太大",
  "err.request.badJson": "请求格式不正确",
  "err.route.notFound": "接口不存在",
  "err.route.method": "请求方法不支持"
};
var enUi = {
  "title": "Market",
  "unit.style": "en",
  "unit.yi": " ×100M",
  "unit.wan": " ×10K",
  "common.loading": "Loading…",
  "common.empty": "No data",
  "common.working": "Working…",
  "common.save": "Save",
  "common.delete": "Delete",
  "common.retry": "Retry",
  "err.render": "This part of the page failed: {message}",
  "search.placeholder": "Search code, name, pinyin or fund",
  "indices.label": "Major indices",
  "tabs.label": "Market sections",
  "market.label": "Markets",
  "detail.label": "Security details",
  "detail.empty": "Pick a security from the list or the search box",
  "detail.back": "Back to list",
  "colors.redUp": "Red is up",
  "colors.greenUp": "Green is up",
  "notice.versionMismatch": "The plugin backend is v{host} but the page is v{client}. Restart DSH so the new version fully loads.",
  "footer.version": "Market v{version}",
  "notice.update": "Market v{version} is available: open Plugins → Discover and click Update on Market, then restart DSH.",
  "footer.disclaimer": "Quotes come from public Eastmoney, Tencent and Sina endpoints and may be delayed or unavailable. Signals and AI opinions are for reference only and are not investment advice.",
  "tab.market": "Quotes",
  "tab.watch": "Watchlist",
  "tab.paper": "Paper trading",
  "tab.screen": "Screener",
  "tab.alerts": "Alerts",
  "tab.advisor": "AI advisor",
  "market.group.stock": "Stocks",
  "market.group.fund": "Funds",
  "market.tip.a": "All China A shares",
  "market.tip.sh": "Shanghai A shares, including STAR",
  "market.tip.sz": "Shenzhen A shares, including ChiNext",
  "market.tip.cyb": "ChiNext, ±20% daily limit",
  "market.tip.kcb": "STAR Market, ±20% daily limit, 200-share minimum",
  "market.tip.bj": "Beijing Stock Exchange, ±30% daily limit",
  "market.tip.hk": "Hong Kong Exchange stocks",
  "market.tip.us": "NASDAQ, NYSE and AMEX stocks",
  "market.tip.etf": "Exchange-traded funds: trade like stocks with live prices; paper trading supported",
  "market.tip.lof": "Listed open-end funds: trade on the exchange or subscribe at NAV",
  "market.tip.fund": "Mutual funds bought through fund companies, banks or apps at one NAV per day",
  "market.a": "China A",
  "market.sh": "Shanghai",
  "market.sz": "Shenzhen",
  "market.cyb": "ChiNext",
  "market.kcb": "STAR",
  "market.bj": "Beijing",
  "market.etf": "ETF",
  "market.lof": "LOF",
  "market.hk": "Hong Kong",
  "market.us": "US",
  "market.fund": "Mutual funds",
  "kind.cn.stock": "China A share",
  "kind.cn.etf": "Listed fund",
  "kind.cn.index": "Index",
  "kind.hk.stock": "Hong Kong stock",
  "kind.us.stock": "US stock",
  "kind.global.index": "Global index",
  "kind.fund": "Mutual fund",
  "col.name": "Name",
  "col.code": "Code",
  "col.price": "Price",
  "col.pct": "Change",
  "col.amount": "Turnover",
  "col.turnover": "Turnover rate",
  "col.mcap": "Market cap",
  "col.pct60": "60-day",
  "pager.prev": "Previous",
  "pager.next": "Next",
  "pager.info": "Page {page} of {pages}, {total} securities",
  "fundList.type": "Fund type",
  "fundList.sort": "Sort by",
  "fundList.note": "Mutual funds trade at the daily NAV and have no intraday price; NAVs usually update in the evening.",
  "fundType.all": "All",
  "fundType.gp": "Equity",
  "fundType.hh": "Hybrid",
  "fundType.zq": "Bond",
  "fundType.zs": "Index",
  "fundType.qdii": "QDII",
  "fundType.fof": "FOF",
  "fundCol.nav": "NAV",
  "fundCol.day": "Day",
  "fundCol.week": "1 week",
  "fundCol.month": "1 month",
  "fundCol.month3": "3 months",
  "fundCol.month6": "6 months",
  "fundCol.year1": "1 year",
  "fundCol.year3": "3 years",
  "fundCol.ytd": "Year to date",
  "fund.m1": "1 month",
  "fund.m3": "3 months",
  "fund.m6": "6 months",
  "fund.y1": "1 year",
  "fund.y3": "3 years",
  "fund.fromPeak": "From 1-year high",
  "fund.mdd": "1-year max drawdown",
  "fund.fee": "Purchase fee",
  "fund.scale": "Fund size",
  "fund.managers": "Managers",
  "fund.noRealtime": "Mutual funds trade at the daily NAV with no intraday price, so paper trading and price alerts are unavailable; you can still watch the fund and ask the AI advisor.",
  "fund.range.y1": "1 year",
  "fund.range.y3": "3 years",
  "fund.range.all": "All",
  "fund.holdings": "Top 10 holdings",
  "fund.weight": "Weight",
  "chart.eventsHint": "Dots mark news or events; hover to read, click to pin",
  "chart.range": "{from} to {to}, {n} bars",
  "chart.zoomHint": "Scroll to zoom, drag to pan, double-click to reset",
  "chart.zoomIn": "Zoom in (fewer bars)",
  "chart.zoomOut": "Zoom out (longer period)",
  "chart.reset": "Reset",
  "chart.eventsCount": "{n} items",
  "chart.clickToPin": "Click to see everything from that day and ask the AI why it moved",
  "ev.news": "News",
  "ev.notice": "Filing",
  "ev.flash": "Flash",
  "ev.lhb": "Billboard",
  "ev.dividend": "Dividend",
  "ev.lift": "Unlock",
  "ev.forecast": "Earnings preview",
  "ev.report": "Report",
  "ev.holder": "Holder trade",
  "news.title": "News, filings and events",
  "news.coverage": "News from {from} to {to}",
  "news.filter": "Category",
  "news.f.all": "All",
  "news.f.news": "News",
  "news.f.notice": "Filings",
  "news.f.event": "Events",
  "news.f.upcoming": "Upcoming",
  "news.empty": "Nothing found",
  "news.more": "Show {n} more",
  "news.note": "Click a headline to open the original article in a new window. Items come from public Eastmoney and Sina feeds; headlines are not verified.",
  "day.title": "What happened on {date}",
  "day.bar": "Close {close} ({pct})",
  "day.close": "Close",
  "day.none": "No news, filings or events were found for this window.",
  "day.ask": "Ask the AI why it {direction}",
  "day.rose": "rose {pct}",
  "day.fell": "fell {pct}",
  "day.moved": "moved",
  "day.askQuestion": "Explain why it {direction} on {date}: use the news, filings and events around that day, separate direct causes from possibly related factors, and say what it means for the trend and my next move.",
  "day.window": "Window: 15:00 on the previous trading day to 15:00 on this day (after-hours and weekend items count toward the next trading day).",
  "watch.empty": "Your watchlist is empty. Open any security and choose Add to watchlist.",
  "watch.remove": "Remove {name} from the watchlist",
  "watch.removeShort": "Remove",
  "q.open": "Open",
  "q.high": "High",
  "q.low": "Low",
  "q.prevClose": "Prev close",
  "q.amount": "Turnover",
  "q.turnover": "Turnover rate",
  "q.pe": "P/E",
  "q.mcap": "Market cap",
  "q.limits": "Limit up/down",
  "action.watch": "Add to watchlist",
  "action.unwatch": "Remove from watchlist",
  "action.trade": "Paper trade",
  "action.alert": "Set alert",
  "chart.period": "Chart period",
  "chart.empty": "No chart data",
  "chart.aria": "Price chart",
  "chart.open": "O",
  "chart.high": "H",
  "chart.low": "L",
  "chart.close": "C",
  "chart.dc55": "55-day high",
  "chart.dc20": "20-day channel",
  "chart.stop": "Stop",
  "period.trends": "Intraday",
  "period.day": "Daily",
  "period.week": "Weekly",
  "period.month": "Monthly",
  "period.m60": "60 min",
  "signal.title": "Quant signals",
  "signal.asOf": "As of {date}",
  "signal.score": "Score {score} (−100 to +100)",
  "signal.insufficient": "Only {n} bars available; not enough to compute signals.",
  "signal.trendFilter": "Trend filter (50/300)",
  "signal.filterUp": "Up",
  "signal.filterDown": "Down",
  "signal.system1": "Turtle System 1",
  "signal.system2": "Turtle System 2",
  "signal.stopNow": "2N stop if bought now",
  "signal.s2Entry": "System 2 breakout",
  "signal.unit": "Unit size",
  "signal.shares": "{n} shares",
  "signal.riskAtStop": "Loss at stop",
  "signal.volAnnual": "Annual volatility",
  "signal.mdd1y": "1-year max drawdown",
  "signal.mom60": "60-day change",
  "sys.breakout": "Breakout today",
  "sys.long": "Long",
  "sys.exit": "Exit today",
  "sys.flat": "Flat",
  "forecast.title": "Ranges and history",
  "forecast.subtitle": "Not a price target",
  "forecast.horizon": "Horizon",
  "forecast.p68": "≈68% range",
  "forecast.p95": "≈95% range",
  "forecast.move": "1σ move",
  "forecast.days": "{n} trading days",
  "forecast.baseTitle": "This security’s own past signals (held 20 trading days)",
  "forecast.signal": "Signal",
  "forecast.count": "Count",
  "forecast.win": "Up share",
  "forecast.avg": "Mean",
  "forecast.median": "Median",
  "forecast.stopHit": "Hit 2N stop",
  "forecast.s2f": "55-day breakout + filter",
  "forecast.s1f": "20-day breakout + filter",
  "forecast.s2raw": "55-day breakout (no filter)",
  "forecast.noHistory": "Not enough history",
  "forecast.never": "Never occurred",
  "forecast.note": "Ranges assume a driftless log-normal walk at the last 60 days’ volatility. History describes the past only; small samples say little.",
  "order.title": "Paper trade",
  "order.rules": "China A rules: T+1, 100-share lots (200 on STAR), commission, stamp duty and transfer fee",
  "order.side": "Side",
  "order.buy": "Buy",
  "order.sell": "Sell",
  "order.type": "Order type",
  "order.market": "Market",
  "order.limit": "Limit (day)",
  "order.qty": "Quantity (shares)",
  "order.price": "Limit price",
  "order.stop": "Stop (optional)",
  "order.submit": "Place order",
  "order.planHint": "Turtle unit: {n} shares, 2N stop {stop}.",
  "order.positionHint": "Holding {qty} shares, {avail} sellable, cost {cost}.",
  "order.filled": "Filled: {qty} shares @ {price}",
  "order.pending": "Order working: {qty} shares @ {price}, good for the day",
  "alert.title": "Set alert",
  "alert.type": "Condition",
  "alert.price": "Price",
  "alert.pct": "Change (%)",
  "alert.add": "Add alert",
  "alert.added": "Alert added. Triggers appear on the Alerts tab and the sidebar icon.",
  "alert.t.priceAbove": "Price rises to",
  "alert.t.priceBelow": "Price falls to",
  "alert.t.pctAbove": "Day gain reaches",
  "alert.t.pctBelow": "Day loss reaches",
  "alert.t.breakout20": "Breaks the 20-day high (System 1 entry)",
  "alert.t.breakout55": "Breaks the 55-day high (System 2 entry)",
  "alert.t.breakdown10": "Breaks the 10-day low (System 1 exit)",
  "alert.t.breakdown20": "Breaks the 20-day low (System 2 exit)",
  "alert.t.paperStop": "Falls below the paper stop",
  "alerts.events": "Triggered",
  "alerts.markRead": "Mark all as read",
  "alerts.clear": "Clear history",
  "alerts.noEvents": "Nothing triggered yet",
  "alerts.rules": "Alert rules",
  "alerts.noRules": "No alert rules yet. Choose Set alert on a security.",
  "alerts.active": "Watching",
  "alerts.fired": "Triggered {at}",
  "alerts.note": "Checked every 20 seconds during trading hours; each rule fires once. Paper positions with a stop also alert when breached.",
  "event.alert": "{type} {value}, now {price}",
  "event.stop": "Below stop {value}, now {price}",
  "event.fill": "Limit order filled: {side} {value} shares @ {price}",
  "paper.equity": "Equity",
  "paper.pnl": "Total P&L",
  "paper.cash": "Available cash",
  "paper.value": "Position value",
  "paper.realized": "Realized P&L",
  "paper.fees": "Fees paid",
  "paper.curve": "Equity curve",
  "paper.positions": "Positions",
  "paper.noPositions": "No positions. Open a security and choose Paper trade.",
  "paper.qty": "Shares",
  "paper.cost": "Cost",
  "paper.stop": "Stop",
  "paper.stopFor": "Stop for {name}",
  "paper.avail": "{n} sellable",
  "paper.sellAll": "Sell all",
  "paper.pending": "Working orders",
  "paper.cancel": "Cancel",
  "paper.trades": "Fills",
  "paper.noTrades": "No fills yet",
  "paper.fee": "Fee {fee}",
  "paper.reset": "Reset paper account",
  "paper.resetConfirm": "Clear all positions and history and start again with the initial cash?",
  "paper.rules": "Simplified: no dividends or splits; all listed funds settle T+1; holidays count as weekdays (market orders on closed days are rejected or never fill).",
  "screen.presets": "Screener presets",
  "screen.run": "Run screener",
  "screen.rerun": "Run again",
  "screen.running": "Scanning {done}/{total}…",
  "screen.summary": "{at}: sampled {universe}, pre-filtered {scanned}, matched {n}",
  "screen.discuss": "Ask AI about these candidates",
  "screen.failed": "Screener failed: {message}",
  "screen.none": "Nothing matches right now.",
  "screen.score": "Score",
  "screen.why": "Why",
  "screen.turtle55": "Turtle 55-day breakout",
  "screen.turtle55.desc": "System 2: closed above the prior 55-day high within 10 days, 50-day average above the 300-day",
  "screen.turtle20": "Turtle 20-day breakout",
  "screen.turtle20.desc": "System 1: closed above the prior 20-day high within 5 days, trend filter up",
  "screen.strong": "Strong trends",
  "screen.etfTrend": "ETF trends",
  "screen.etfTrend.desc": "Liquid ETFs long under System 2 with the trend filter up, ranked by 60-day momentum",
  "screen.fundTrend": "Mutual fund trends",
  "screen.fundTrend.desc": "Top index, equity and hybrid funds by 6-month return whose NAV is above the 60-day average, with the trend filter up and System 2 long; near-identical funds are grouped",
  "screen.noteFund": "Mutual funds use dividend-adjusted NAV. Stops sit at 3N because redemptions fill at the next NAV; unit size is 1% risk of the paper account. Funds in one group move almost identically (daily return correlation ≥ 0.95), so treat them as one position and pick the one with the lowest fee on your platform.",
  "screen.stopFund": "3N stop NAV",
  "screen.unitPct": "One unit of account",
  "screen.similar": "{n} near-identical: {names}…",
  "screen.grouped": ", grouped into {n}",
  "screen.note": "A match only means the rule is satisfied, not that the price will rise. Turnover floor: ¥100–200M for stocks, ¥50M for ETFs; ST and delisting stocks excluded.",
  "advisor.modelLabel": "Model",
  "advisor.reasoningLabel": "Reasoning",
  "advisor.modelDefault": "Plugin default ({model})",
  "advisor.reasoningAuto": "Default",
  "advisor.reasoningAutoWith": "Default ({effort})",
  "advisor.modelRefresh": "Refresh model list",
  "advisor.modelUnavailable": "Model list unavailable",
  "advisor.title": "AI advisor",
  "advisor.general": "Overall market and my paper account",
  "advisor.toSession": "Continue in a DSH session",
  "advisor.clear": "Clear chat",
  "advisor.unavailable": "AI is unavailable: make sure DSH is signed in to DeepSeek.",
  "advisor.empty": "Ask anything: Can I buy now? Should I stop out? What would the Turtle rules do?",
  "advisor.thinking": "Thinking…",
  "advisor.placeholder": "Ask the AI advisor (Enter to send, Shift+Enter for a new line)",
  "advisor.stop": "Stop",
  "advisor.send": "Send",
  "advisor.disclaimer": "The AI gives buy or sell leanings, stops and sizes as rule-based opinions; it promises no returns.",
  "quick.canBuy": "Can I buy now? Give a clear buy or wait call with a stop and a size.",
  "quick.holding": "If I hold it, should I keep holding, trim or sell?",
  "quick.turtlePlan": "Give me a complete trading plan under the original Turtle rules.",
  "quick.outlook": "How might the next 20 trading days go? Give probabilistic scenarios.",
  "quick.fundBuy": "Is now a good time to buy or start a regular plan in this fund?",
  "quick.fundRisk": "How risky is this fund? What about drawdown and volatility?",
  "quick.fundTrend": "By trend-following principles, which phase is it in?",
  "quick.screenPick": "Which candidates deserve the most attention? Give entries and stops.",
  "quick.screenRisk": "What risks do these candidates share, and how should I size them?",
  "quick.market": "What state is the overall market in now?",
  "quick.funds": "Which funds are worth buying now?",
  "quick.stocks": "Which stocks are worth watching or buying?",
  "advisor.status.screening": "Running screeners: {presets} (about 30–60 seconds the first time)…",
  "quick.portfolio": "Review my paper account: are the sizes and stops sensible?",
  "quick.live": "Look at my live account: what should I do now, and which positions need action?",
  "err.generic": "Something went wrong ({code})",
  "err.network": "Network connection failed.",
  "err.http": "Request failed ({status})",
  "err.upstream": "The market data source is unavailable: {message}",
  "err.notInstalled": "The plugin backend did not respond. Make sure the Market plugin is enabled.",
  "err.session.unavailable": "A DSH session cannot be started here.",
  "err.symbol.empty": "Enter a code or name",
  "err.symbol.notFound": 'Nothing found for "{query}"',
  "err.symbol.invalid": "Invalid security code",
  "err.market.unknown": "Unknown market",
  "err.paper.notTradable": "Paper trading supports China A shares and listed funds only",
  "err.paper.badSide": "Invalid side",
  "err.paper.badType": "Invalid order type",
  "err.paper.noPrice": "No price available (possibly suspended)",
  "err.paper.badQty": "Quantity must be a positive integer",
  "err.paper.minQty": "Buy at least {min} shares",
  "err.paper.lotStep": "Buy in multiples of {step} shares",
  "err.paper.tPlusOne": "T+1: shares bought today can be sold tomorrow",
  "err.paper.noPosition": "No position in this security",
  "err.paper.overSell": "Only {avail} shares are sellable",
  "err.paper.oddLot": "Odd lots must be sold all at once ({avail} sellable)",
  "err.paper.marketClosed": "The China A market is closed, so market orders cannot fill; use a limit order",
  "err.paper.badPrice": "Enter a limit price",
  "err.paper.outOfLimit": "Price is outside the daily limits ({down}–{up})",
  "err.paper.noCash": "Not enough cash: need {need}, have {cash}",
  "err.paper.limitUp": "Limit up: cannot buy",
  "err.paper.limitDown": "Limit down: cannot sell",
  "err.paper.noOrder": "Order not found",
  "err.paper.notPending": "This order can no longer be cancelled",
  "err.alert.badType": "Invalid alert type",
  "err.alert.badValue": "Enter a value above 0",
  "err.alert.fundUnsupported": "Mutual funds have no intraday price, so alerts are not supported",
  "err.screen.unknown": "Unknown screener preset",
  "err.screen.notReady": "Run the screener before asking the AI",
  "err.ai.unavailable": "AI is unavailable: make sure DSH is signed in to DeepSeek",
  "err.ai.badModel": "This model is not available: {model}",
  "err.ai.badReasoning": "This model does not support reasoning level {reasoning}",
  "err.ai.emptyQuestion": "Enter a question",
  "err.ai.failed": "The AI answer failed: {message}",
  "err.request.tooLarge": "Request too large",
  "err.request.badJson": "Malformed request",
  "err.route.notFound": "Unknown endpoint",
  "err.route.method": "Method not allowed"
};
var zh = { ...zhUi, ...zhLive, ...LOCALE.zh, ...prefixed(REASONS.zh) };
var en = { ...enUi, ...enLive, ...LOCALE.en, ...prefixed(REASONS.en) };

// src/client/index.jsx
var NAMESPACE = "stockMarket";
var PANEL_ID = "stock-market";
var alertsState = createSharedState(0);
function MarketIcon({ size = 20, active }) {
  const unread = useShared(alertsState);
  return /* @__PURE__ */ React10.createElement("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: active ? 2 : 1.7, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" }, /* @__PURE__ */ React10.createElement("path", { d: "M4 20h16" }), /* @__PURE__ */ React10.createElement("path", { d: "M7 6v10M7 8h0" }), /* @__PURE__ */ React10.createElement("rect", { x: "5.5", y: "9", width: "3", height: "5", rx: "0.6" }), /* @__PURE__ */ React10.createElement("path", { d: "M12 4v13" }), /* @__PURE__ */ React10.createElement("rect", { x: "10.5", y: "6.5", width: "3", height: "7", rx: "0.6" }), /* @__PURE__ */ React10.createElement("path", { d: "M17 8v9" }), /* @__PURE__ */ React10.createElement("rect", { x: "15.5", y: "10", width: "3", height: "4.5", rx: "0.6" }), unread > 0 && /* @__PURE__ */ React10.createElement("circle", { cx: "20", cy: "4.5", r: "3", fill: "var(--dsw-alias-state-error-primary, #e5484d)", stroke: "none" }));
}
var inject = ["slots", "locale"];
function apply(ctx) {
  ctx.effect(() => ctx.locale.register(NAMESPACE, { zh, en }), "stock-market: locale");
  const t = ctx.locale.bind(NAMESPACE);
  let startSession;
  ctx.inject(["uiWorkspace"], (sub) => {
    startSession = (prompt) => sub.uiWorkspace.startSession(void 0, { prompt, whenDraftExists: "append" });
    sub.effect(() => () => {
      startSession = void 0;
    }, "stock-market: session");
  });
  ctx.effect(() => {
    let alive = true;
    let timer;
    const poll = async () => {
      try {
        const data = await api.alerts();
        if (alive) alertsState.set(data.unread + (data.liveUrgent ?? 0));
      } catch {
      }
      if (alive) timer = setTimeout(poll, 3e4);
    };
    timer = setTimeout(poll, 3e3);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, "stock-market: alert badge");
  const openSession = (prompt) => {
    if (startSession === void 0) return false;
    startSession(prompt);
    return true;
  };
  ctx.effect(() => ctx.slots.inject("main", () => ctx.slots.register({
    name: "main",
    key: PANEL_ID,
    locale: NAMESPACE,
    inject: () => ({ api, alertsState, openSession })
  }, MarketPageSlot)), "stock-market: page");
  ctx.effect(() => ctx.slots.inject("sidebar.panellist", () => ctx.slots.register({
    name: "sidebar.panellist",
    id: PANEL_ID,
    order: 20,
    locale: NAMESPACE,
    label: () => t("title")
  }, MarketIcon)), "stock-market: sidebar entry");
}
function MarketPageSlot(props) {
  return /* @__PURE__ */ React10.createElement(MarketPage, { ...props, startSession: props.openSession });
}

    return module.exports;
  },
});
