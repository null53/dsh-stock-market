# 市场 · DSH 插件

[DeepSeek Harness](https://github.com/deepseek-ai)（DSH）左侧栏插件：A 股、ETF/LOF、港美股和场外基金行情，海龟量化信号、模拟盘、实盘跟踪、规则选股、提醒，以及内置交易规则库的 AI 顾问。

当前版本：**v0.6.0**（2026-11-16）

## 安装（推荐：通过插件索引，之后可以一键更新）

1. 打开 DSH 的 **插件**，在 **实验性插件** 里打开 **自定义插件索引**。
2. 进入 **发现** → **索引源** → **添加索引源**，粘贴下面的地址：

   ```
   https://null53.github.io/dsh-stock-market/index.json
   ```

3. 在「发现」里搜索 **市场**，点 **安装**，按提示启用，然后重启 DSH。左侧栏会出现「市场」图标。
4. 以后有新版本时，「市场」页面顶部会提示；到 **插件 → 发现**，在「市场」上点 **更新**，完成后重启 DSH。

## 直接用 Git 地址安装

在 **插件 → 添加插件** 里输入：

```
git+https://github.com/null53/dsh-stock-market.git#path:/plugin
```

这种方式装上的插件没有「更新」按钮，换新版本需要先卸载再安装。推荐用上面的插件索引。

## 功能

- **行情**：A 股（沪深北）、ETF、LOF、港股、美股、场外基金；分时、日/周/月/60 分 K 线，滚轮缩放、拖动平移；K 线上悬停查看当天的新闻、公告和事件。
- **量化信号**：海龟系统 1/2 状态、50/300 日趋势过滤、N 与 2N 止损、1% 风险头寸单位、概率区间，以及这只证券自己历史上同类信号的统计。
- **模拟盘**：按 A 股规则（T+1、100 股一手、涨跌停、手续费）。
- **实盘跟踪**：插件不下单。先按你能承受的亏损给出起步资金；买前给出计划单（数量、止损、逐项检查）；之后提醒止损、退出、加仓、回撤；按 R 倍数统计并让 AI 复盘出你的个人交易规则。金额和股数只保存在你的电脑上，发给 AI 的只有比例和 R 倍数。
- **规则选股**：海龟 55/20 日突破、强势趋势、ETF 趋势、场外基金趋势。
- **AI 顾问**：针对当前证券、选股结果或整体市场多轮对话，给出明确的买卖倾向、止损位和仓位。使用你在 DSH 里配置的 DeepSeek 模型。
- **智能体工具**：在任何 DSH 对话里都能调用 `market_*` 工具查行情、做分析、看实盘待办，以及用 `trading_knowledge_search` 查交易规则。

## 说明

- 安装和更新需要能访问 GitHub。
- 行情来自东方财富、腾讯、新浪的公开接口，可能延迟或限流，插件会自动切换数据源。
- 数据保存在 `~/.dsh/plugin-data/stock-market/`；关闭插件即停止所有轮询。
- 内容仅供参考，不构成投资建议。

---

Market is a DeepSeek Harness sidebar plugin with China A-share, ETF, Hong Kong, US and mutual fund quotes, Turtle-style signals, a paper account, live-trade tracking, screeners, alerts and an AI advisor. Install it by adding `https://null53.github.io/dsh-stock-market/index.json` as a plugin index under Plugins → Discover, then search for "Market". For reference only; not investment advice.
