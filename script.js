"use strict";

/* 本体（タブ・データの取得・グラフ）。データは data.js、画面の枠は frame.js */

const SECTION_TITLES = { tech: "ランキング", topics: "トピック", data: "データ" };

// トピックと「データ」のタブ。live は、開いたときにデータを取得するタブ
const LISTS = {
  news: NEWS_LIST,
  keywords: {
    live: true,
    title: "AI 関連キーワードの関心（Wikipedia の閲覧数）",
    source: { label: "Wikimedia Analytics API", url: "https://doc.wikimedia.org/generated-data-platform/aqs/analytics-api/" },
    scoreLabel: ["直近 7 日の", "閲覧数"],
    loadingText: "Wikipedia から閲覧数を取得しています…",
  },
  qiita: QIITA_LIST,
  video: VIDEO_LIST,
  ai: AI_USAGE,
  rates: ADOPTION_RATES,
  earnings: IT_REVENUE,
};

const FETCH_TIMEOUT_MS = 10000;
// グラフの右端の名前どうしの、縦の間隔
const LABEL_GAP = 14;
// 縦軸を省くとき：波線の場所の高さ、下の段の割合、省くすき間（最大値に対する割合）、下の段の最小の拡大率
const BREAK_GAP = 20;
const BREAK_LOWER_SHARE = 2 / 3;
const BREAK_MIN_GAP = 0.1;
const BREAK_MIN_ZOOM = 1.5;
const WEEKS = 8;
const DAY_MS = 86400000;
const SVG_NS = "http://www.w3.org/2000/svg";
// ratioAxis の目盛り（伸び率の %）
const RATIO_TICKS = [-50, 0, 50, 100, 200, 400, 800, 1600];

const state = {
  section: "tech",
  // 左のパネルの分類ごとに、開いているタブを覚える
  tab: { tech: "languages", topics: "news", data: "ai" },
  // タブごとに覚える：開いている表示（ranking か history）、推移で強調を固定した名前、期間（年数か期間の id）、出している内容の id
  view: {},
  pinned: {},
  period: {},
  content: {},
};

// 実データの取得の状態（idle → loading → ready か error）
const liveData = {
  keywords: { status: "idle" },
};

const $ = (selector) => document.querySelector(selector);

const elements = {
  sectionButtons: document.querySelectorAll(".app-rail [data-section]"),
  pageTitle: $("#page-title"),
  pageLead: $("#page-lead"),
  leadHeading: $("#lead-heading"),
  leadText: $("#lead-text"),
  leadSource: $("#lead-source"),
  pageNotice: $("#page-notice"),
  period: $("#period"),
  viewSwitch: $("#view-switch"),
  tabLists: document.querySelectorAll('[role="tablist"]'),
  tabs: document.querySelectorAll("[data-tab]"),
  tabPanel: $("#tab-panel"),
  status: $("#status"),
  viewCard: $("#view-card"),
  viewToggle: $("#view-toggle"),
  cardNote: $("#card-note"),
  cardMessage: $("#card-message"),
  cardMessageText: $("#card-message-text"),
  retryButton: $("#retry-button"),
  rankingPanel: $("#ranking-panel"),
  linkList: $("#link-list"),
  historyPanel: $("#history-panel"),
  rankingTitle: $("#ranking-title"),
  rankingTable: $("#ranking-table"),
  rankingHead: $("#ranking-head"),
  rankingBody: $("#ranking-body"),
  tableNote: $("#table-note"),
  chartTitle: $("#chart-title"),
  legendNote: $("#legend-note"),
  legend: $("#legend"),
  chart: $("#chart"),
  historyTable: $("#history-table"),
};

const listKey = () => state.tab[state.section];

const isRanking = (key) => Object.hasOwn(RANKINGS, key);

/* ---------- 共通 ---------- */

// 文字列は textContent で入れる（HTML として解釈させない）。外部から取得した文字列も同じ
function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function createSvg(tag, attributes = {}) {
  const element = document.createElementNS(SVG_NS, tag);
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
  return element;
}

const seriesColor = (item) => `var(--series-${item.color})`;
const formatNumber = (number) => number.toLocaleString("ja-JP");

function signed(number) {
  if (number > 0) return `+${formatNumber(number)}`;
  if (number < 0) return `−${formatNumber(Math.abs(number))}`;
  return "±0";
}

// "2026-11-26" を「11 月 26 日」にする
function formatDate(isoDate) {
  const [, month, day] = isoDate.split("-").map(Number);
  return `${month} 月 ${day} 日`;
}

// 出典のリンク（別のタブで開く）。name は、表示の文字だけでは分かりにくいときの読み上げ用の名前
function createSourceLink({ label, name, url }) {
  const link = createElement("a", "", label);
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  if (name) link.setAttribute("aria-label", name);
  return link;
}

// タブの下の解説（見出し・本文・出典のリンク）。notice はカードの下の注意書き
function renderLead(text, sources = [], heading = "", notice = "") {
  const links = sources.flatMap((source, index) => {
    const link = createSourceLink(source);
    return index === 0 ? [link] : ["・", link];
  });

  elements.leadHeading.textContent = heading;
  elements.leadHeading.hidden = !heading;
  elements.leadText.textContent = text;
  elements.leadSource.replaceChildren("ソース：", ...links);
  elements.leadSource.hidden = links.length === 0;
  elements.pageNotice.textContent = notice;
  elements.pageNotice.hidden = !notice;
  elements.pageLead.hidden = !text;
}

/* ---------- 「ランキング」の順位 ---------- */

// 点数が 1 年分しかないタブは、推移と前年比を出さない
const hasHistory = (config) => config.years.length > 1;

// 推移のグラフと表に出すのは、色を決めたものだけ
const chartItems = (config) => config.items.filter((item) => item.color);

function getRanking(config) {
  // scores は末尾がいちばん新しい年（表だけに出すものは、直近の分しか持たなくてよい）
  return [...config.items]
    .sort((a, b) => b.scores.at(-1) - a.scores.at(-1))
    .map((item, index) => {
      const score = item.scores.at(-1);
      const previous = item.scores.at(-2) ?? null;
      return { item, rank: index + 1, score, delta: previous === null ? null : score - previous };
    });
}

function getPeriod(key) {
  const { years, initialPeriod } = RANKINGS[key];
  // 選んでいなければ、最初の年数。指定がないタブは全部の年
  const start = years.length - (state.period[key] ?? initialPeriod ?? years.length);
  return { start, years: years.slice(start) };
}

// 「期間」の選択肢（短い順）。「企業の業績」は、同じ部品でグラフに出す値を切り替える
function getPeriodOptions(key) {
  if (!isRanking(key)) {
    const data = liveData[key]?.data ?? LISTS[key];
    const choices = data.chartValues ?? data.periods;
    if (!choices) return { current: "", options: [] };
    return {
      label: data.chartValues ? "グラフに出す値" : "期間",
      current: pickChoice(key, choices).id,
      options: choices.map(({ id, label }) => ({ value: id, label })),
    };
  }
  const { periods = [], years } = RANKINGS[key];
  return {
    current: String(getPeriod(key).years.length),
    options: periods.map((length) => ({
      value: String(length),
      label: length === years.length ? "全期間" : `${length} 年`,
    })),
  };
}

// カードの中の切り替えボタン（label は読み上げの名前）。同じタブでは作り直さず、キーボードの位置を保つ
function renderSwitch(container, key, { label = "期間", current, options }) {
  container.setAttribute("aria-label", label);
  if (container.dataset.key !== key) {
    container.dataset.key = key;
    container.replaceChildren(
      ...options.map(({ value, label }) => {
        const button = createElement("button", "period-button", label);
        button.type = "button";
        button.dataset.value = value;
        return button;
      }),
    );
  }
  container.hidden = options.length < 2;
  [...container.children].forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.value === current));
  });
}

// 内容を切り替えるタブ（views があるタブ）で、いま出しているもの。選んでいなければ最初のもの
function getViewId(key) {
  const ids = Object.keys(LISTS[key]?.views ?? {});
  return ids.includes(state.content[key]) ? state.content[key] : ids[0];
}
const getView = (key) => LISTS[key]?.views?.[getViewId(key)];

// 内容の切り替えのアイコン（SVG は index.html）。カードの題を、吹き出しと読み上げの名前に使う
function renderIconSwitch(key) {
  const current = getViewId(key);
  elements.viewSwitch.hidden = !current;
  if (!current) return;
  [...elements.viewSwitch.children].forEach((button) => {
    // 同じアイコンを使うタブは、data-for に並べる
    button.hidden = !button.dataset.for.split(" ").includes(key);
    if (button.hidden) return;
    const { title } = LISTS[key].views[button.dataset.value];
    button.setAttribute("aria-label", title);
    button.dataset.tip = title;
    button.setAttribute("aria-pressed", String(button.dataset.value === current));
  });
}

// 増減は、色だけでなく記号と数字でも分かるようにする
function describeChange(change, unit = "") {
  if (change === null) return { className: "delta-flat", text: "—" };
  const value = `${signed(change)}${unit}`;
  if (change > 0) return { className: "delta-up", text: `▲ ${value}` };
  if (change < 0) return { className: "delta-down", text: `▼ ${value}` };
  return { className: "delta-flat", text: `→ ${value}` };
}

/* ---------- カードの表（「ランキング」と「トピック」で同じ部品） ---------- */

// label が 2 つの並びのときは、狭い幅で 2 行にできるように分ける
function renderTableHead(columns) {
  const cells = columns.map(({ label, className }) => {
    const cell = createElement("th", className);
    cell.scope = "col";
    if (Array.isArray(label)) cell.append(...label.map((text) => createElement("span", "", text)));
    else cell.textContent = label;
    return cell;
  });
  elements.rankingHead.replaceChildren(...cells);
}

// 省略されたときだけ、全文を吹き出し（title）で出す。省略は幅で変わるので、マウスを当てたときに調べる
function showTitleWhenTruncated(element, text) {
  element.addEventListener("mouseenter", () => {
    if (element.scrollWidth > element.clientWidth) element.title = text;
    else element.removeAttribute("title");
  });
}

// 名前の欄。link があれば名前をリンクにし、sub は下に小さく出す。hint は名前と違う説明で、いつも吹き出しに出す
function createNameCell({ name, link, hint, sub }) {
  const cell = createElement("td", "name-cell");
  if (link) {
    const anchor = createSourceLink({ label: name, url: link });
    if (hint) anchor.title = hint;
    else showTitleWhenTruncated(anchor, name);
    cell.append(anchor);
  } else {
    cell.textContent = name;
  }
  if (sub) {
    const note = createElement("span", "name-sub", sub);
    showTitleWhenTruncated(note, sub);
    cell.append(note);
  }
  return cell;
}

// 「データ」の割合は小数第 1 位で出す。toFixed だけだと 19.95 が 19.9 になるので、先に 10 倍して四捨五入する
const formatRate = (value) => (Math.round(value * 10) / 10).toFixed(1);
// 伸び率は、増減の向きが分かるように符号を付ける
const formatGrowth = (value) =>
  `${value > 0 ? "+" : value < 0 ? "−" : ""}${Math.abs(value).toLocaleString("ja-JP", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;

// 値の欄。ratio は棒の長さ（0〜100）
function createScoreCell(text, ratio) {
  const cell = createElement("td", "score-cell");
  const wrapper = createElement("div", "score");
  const track = createElement("span", "score-track");
  track.setAttribute("aria-hidden", "true");
  const bar = createElement("span", "score-bar");
  bar.style.width = `${ratio}%`;
  track.append(bar);
  wrapper.append(createElement("span", "score-value", text), track);
  cell.append(wrapper);
  return cell;
}

function createDeltaCell(change, unit) {
  const { className, text } = describeChange(change, unit);
  return createElement("td", className, text);
}

function createRow(...cells) {
  const row = document.createElement("tr");
  row.append(...cells);
  return row;
}

// ニュースと動画のパネル。全体が元のページへのリンク。動画（channel があるもの）は、ドメインの代わりにチャンネル名を出す
function createLinkPanel(item) {
  const anchor = createSourceLink({ url: item.link });
  anchor.className = "news-panel";

  if (item.image) {
    const image = createElement("img", item.channel ? "news-image news-image--video" : "news-image");
    image.alt = "";
    image.loading = "lazy";
    image.width = 1200;
    image.height = item.channel ? 675 : 630;
    image.addEventListener("error", () => image.remove());
    image.src = item.image;
    anchor.append(image);
  }

  const time = createElement("time", "", formatDate(item.date));
  time.dateTime = item.date;
  const meta = createElement("span", "news-meta");
  meta.append(time, ` ／ ${item.channel ?? new URL(item.link).hostname.replace(/^www\./, "")}`);

  const body = createElement("span", "news-body");
  body.append(
    createElement("span", "news-title", item.title),
    createElement("span", "news-description", item.description),
    meta,
  );
  anchor.append(body);

  const row = document.createElement("li");
  row.append(anchor);
  return row;
}

function renderLinkList(key) {
  const items = [...LISTS[key].items].sort((a, b) => b.date.localeCompare(a.date));
  elements.linkList.replaceChildren(...items.map(createLinkPanel));
}

// タブごとの表の中身。kind は行の形（score＝名前が短い順位、text＝記事の順位）
function buildTable(key, data) {
  if (isRanking(key)) {
    const config = RANKINGS[key];
    const withDelta = hasHistory(config);
    return {
      kind: "score",
      columns: [
        { label: "順位" },
        { label: config.nameLabel },
        { label: [config.metric, "（0〜100）"], className: "score-head" },
        ...(withDelta ? [{ label: "前年比" }] : []),
      ],
      rows: getRanking(config).map(({ item, rank, score, delta }) =>
        createRow(
          createElement("td", "", rank),
          createNameCell({ name: item.name, sub: item.sub }),
          createScoreCell(score, score),
          ...(withDelta ? [createDeltaCell(delta)] : []),
        ),
      ),
    };
  }

  // 「生成 AI」の企業の業務と個人の目的。多い順に並べ、順位の番号は付けない。割合なので、棒の長さは 100% を端までにする
  if (key === "ai") {
    return {
      kind: "score",
      columns: [{ label: data.nameLabel }, { label: ["割合", "（%）"], className: "score-head" }],
      rows: data.items.map((item) => createRow(createNameCell({ name: item.name }), createScoreCell(item.value.toFixed(1), item.value))),
    };
  }

  // 「IT・AI 導入」の世界の国・地域ごとの表。世界順位の順に、前の期間の値と、新しい期間の値（棒は 100% を端までにする）を並べる
  if (key === "rates") {
    const [previousPeriod, latestPeriod] = data.yearLabels;
    return {
      kind: "score",
      modifier: "ranking--world",
      columns: [
        { label: "順位" },
        { label: data.nameLabel },
        { label: [...previousPeriod, "（%）"], className: "score-head period-head past-value" },
        { label: [...latestPeriod, "（%）"], className: "score-head period-head" },
      ],
      rows: data.items.map((item) => {
        const name = createNameCell({ name: item.name });
        name.classList.add("name-cell--short");
        return createRow(
          createElement("td", "", item.rank),
          name,
          createElement("td", "past-value", formatRate(item.previous)),
          createScoreCell(formatRate(item.value), item.value),
        );
      }),
    };
  }

  // キーワードと記事の一覧。棒の長さは、いちばん大きい値を端までにする
  const isKeywords = key === "keywords";
  const largest = Math.max(...data.items.map((item) => item.value), 1);
  return {
    kind: isKeywords ? "score" : "text",
    columns: [
      { label: "順位" },
      { label: isKeywords ? "キーワード" : "記事" },
      { label: LISTS[key].scoreLabel, className: "score-head" },
      ...(isKeywords ? [{ label: "前週比" }] : []),
    ],
    rows: data.items.map((item, index) =>
      createRow(
        createElement("td", "", index + 1),
        createNameCell({ name: item.title, link: item.link, hint: item.hint, sub: item.sub }),
        createScoreCell(formatNumber(item.value), (item.value / largest) * 100),
        ...(isKeywords ? [createDeltaCell(item.change, "%")] : []),
      ),
    ),
  };
}

/* ---------- 推移（「ランキング」は年ごと、「キーワード」は週・2 週間・月ごと） ---------- */

function getYearTrend(key) {
  const config = RANKINGS[key];
  const period = getPeriod(key);
  const items = chartItems(config);
  const labels = period.years.map((year) => `${year} 年`);
  return {
    nameLabel: config.nameLabel,
    title: `${config.nameLabel}${config.metric}の推移`,
    metric: config.metric,
    pointUnit: "年",
    caption: `${config.nameLabel}ごとの${config.metric}の推移`,
    legendNote: "",
    axisLabels: period.years.map(String),
    pointLabels: labels,
    columns: labels,
    series: items.map((item) => {
      const values = item.scores.slice(period.start);
      const texts = values.map((value) => value ?? "—");
      return { name: item.name, color: item.color, values, tips: texts, cells: texts };
    }),
  };
}

// 「ランキング」以外の、カードの中の切り替えで選んでいるもの。選んでいなければ最初のもの
const pickChoice = (key, choices) => choices.find((choice) => choice.id === state.period[key]) ?? choices[0];

// 「データ」の推移。total は線にせず、表の先頭にだけ出す。
// amounts がある行は、線が伸び率（showAmount なら金額）で、一覧には両方、表には金額を出す
function getSeriesTrend(view, showAmount = false) {
  const { title, note, growthNote = "", metric, nameLabel, years, yearUnit, fromZero, ratioAxis, series, total, amountUnit } = view;
  const labels = years.map((year) => `${year} ${yearUnit}`);
  const toRow = ({ name, color, values, amounts }) => {
    const texts = values.map(formatRate);
    // 百万円・百万ドルを、億の単位にする
    const money = amounts?.map((amount) => formatNumber(Math.round(amount / 100)));
    return {
      name,
      color,
      values: showAmount ? amounts.map((amount) => amount / 100) : values,
      tips: money ? values.map(formatGrowth) : texts.map((text) => `${text}%`),
      subs: money?.map((text) => `${text} ${amountUnit}`),
      cells: money ?? texts,
    };
  };
  return {
    nameLabel,
    tableHead: `${nameLabel}（${amountUnit ?? "%"}）`,
    title,
    metric: showAmount ? "売上高" : metric,
    // 金額の縦軸は 0 からの普通の目盛りで、単位を左上に出す
    fromZero: showAmount || fromZero,
    ratioAxis: !showAmount && ratioAxis,
    axisSuffix: amountUnit && !showAmount ? "%" : "",
    axisUnit: showAmount ? amountUnit : "",
    detailLegend: true,
    pointUnit: yearUnit,
    caption: `${yearUnit}ごと・${nameLabel}ごとの、${amountUnit ? `売上高（${amountUnit}）` : `${metric}（%）`}`,
    legendNote: showAmount ? note : `${note}${growthNote}`,
    // 横軸は年の数字だけ（狭い幅で重ならないように）
    axisLabels: years.map(String),
    pointLabels: labels,
    columns: labels,
    series: series.map(toRow),
    totals: total ? [toRow(total)] : [],
  };
}

function getViewTrend(data) {
  const period = pickChoice("keywords", data.periods);
  const { unit, buckets } = period;
  const isMonthly = unit === "月";
  const isTwoWeeks = unit === "2 週間";
  const ends = buckets.map((bucket) => toIsoDate(bucket.to));
  const yearMonths = ends.map((day) => day.split("-").slice(0, 2).map(Number));
  const short = isMonthly
    ? yearMonths.map(([year, month]) => `${year % 100}/${month}`)
    : ends.map((day) => day.slice(5).split("-").map(Number).join("/"));
  const hasBlank = data.items.some((item) => item.counts[period.id].includes(null));
  const monthName = ([year, month]) => `${year} 年 ${month} 月`;
  return {
    nameLabel: "キーワード",
    title: "日本語版 Wikipedia の閲覧数の推移",
    metric: "閲覧数",
    countAxis: true,
    detailLegend: true,
    pointUnit: isTwoWeeks ? "期間" : unit,
    caption: `キーワードごとの、${unit}ごとの閲覧数`,
    legendNote: hasBlank ? "記事の記録がない期間は空欄です。" : "",
    axisLabels: short,
    pointLabels: isMonthly ? yearMonths.map(monthName) : ends.map((day) => `${formatDate(day)}までの${isTwoWeeks ? " 2 週間" : "週"}`),
    columns: isMonthly ? yearMonths.map(([year, month]) => `${year}/${month}`) : short.map((label) => `〜${label}`),
    series: data.items.map((item) => {
      const counts = item.counts[period.id];
      const texts = counts.map((views) => (views === null ? "—" : formatNumber(views)));
      return {
        name: item.title,
        color: item.color,
        values: counts,
        tips: counts.map((views, index) => (views === null ? "—" : `${texts[index]} 回`)),
        cells: texts,
      };
    }),
  };
}

// 推移がないタブは null
function getTrend(key) {
  if (isRanking(key)) return hasHistory(RANKINGS[key]) ? getYearTrend(key) : null;
  // views があるタブは、年の列を持つ表示だけが推移のグラフ
  const view = getView(key);
  if (view) {
    const { chartValues } = LISTS[key];
    const showAmount = Boolean(chartValues) && pickChoice(key, chartValues).id === "amount";
    return view.years ? getSeriesTrend(view, showAmount) : null;
  }
  if (key !== "keywords" || liveData.keywords.status !== "ready") return null;
  return liveData.keywords.data.items.length > 0 ? getViewTrend(liveData.keywords.data) : null;
}

// マウスやキーで選んでいる名前。押して固定した名前より先に強調する
let hoveredName = null;

// 選んでいる線だけを濃くして、ほかは薄くする
function applyFocus() {
  const svg = elements.chart.querySelector("svg");
  if (!svg) return;
  const name = hoveredName ?? state.pinned[listKey()] ?? null;
  const marks = [...svg.querySelectorAll("[data-series]")];
  // 取り直して言葉が入れ替わると、固定した名前がないことがある。そのときは全部を同じ濃さにする
  svg.classList.toggle("has-focus", marks.some((mark) => mark.dataset.series === name));
  marks.forEach((mark) => mark.classList.toggle("is-focus", mark.dataset.series === name));
  // 濃くする線は、重なりの一番上にする
  const front = svg.querySelector(".series.is-focus");
  if (front && front !== front.parentNode.lastElementChild) front.parentNode.append(front);
}

function setHovered(name) {
  if (name === hoveredName) return;
  hoveredName = name;
  applyFocus();
}

function renderLegend(key, trend) {
  hoveredName = null;
  const buttons = trend.series.map((item) => {
    const button = createElement("button", "legend-button");
    button.type = "button";
    button.dataset.name = item.name;
    button.setAttribute("aria-pressed", String(state.pinned[key] === item.name));
    const line = createElement("span", "line-key");
    line.style.background = seriesColor(item);
    line.setAttribute("aria-hidden", "true");
    const text = createElement("span", "legend-text");
    text.append(createElement("span", "legend-name", item.name));
    button.append(line, text, createElement("span", "legend-value"));
    if (item.subs) button.append(createElement("span", "legend-sub"));
    return button;
  });
  elements.legend.setAttribute("aria-label", `線を強調する${trend.nameLabel}`);
  // 名前の長い一覧（キーワードと「データ」）は、列を減らす
  elements.legend.classList.toggle("legend--detail", Boolean(trend.detailLegend));
  elements.legend.replaceChildren(...buttons);
}

// 凡例の値は、グラフで選んでいる年や週に合わせる。ボタンは作り直さない（押している途中で消えないように）
function showLegendValues(trend, index) {
  [...elements.legend.children].forEach((button, i) => {
    button.querySelector(".legend-value").textContent = trend.series[i].tips[index];
    const sub = button.querySelector(".legend-sub");
    if (sub) sub.textContent = trend.series[i].subs[index];
  });
}

// 縦軸は、線の値に合わせる。目盛りは 10 か 25 の刻みで、区切りは 2〜4 個
function getScale(values) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const step = [10, 25].find((size) => Math.ceil(max / size) - Math.floor(min / size) <= 4);
  let low = Math.floor(min / step) * step;
  let high = Math.ceil(max / step) * step;
  // 小さい変化を大きく見せすぎないように、区切りは 2 個以上
  while (high - low < step * 2) {
    if (low > 0) low -= step;
    else high += step;
  }
  const ticks = Array.from({ length: (high - low) / step + 1 }, (_, i) => low + step * i);
  return { low, high, ticks };
}

// 閲覧数の縦軸は 0 から。刻みは 1・2・5 の 10 のべき乗倍
function getCountScale(values, intervals = 4) {
  const max = Math.max(...values, intervals);
  const rough = max / intervals;
  const unit = 10 ** Math.floor(Math.log10(rough));
  const step = unit * [1, 2, 5, 10].find((size) => unit * size >= rough);
  const high = Math.ceil(max / step) * step;
  const ticks = Array.from({ length: Math.round(high / step) + 1 }, (_, i) => step * i);
  return { low: 0, high, ticks };
}

// 会社どうしの差が大きいときは、起点からの倍率の対数で置く（同じ倍率の違いが、同じ高さになる）。下は、減った分が入る 10 刻み
function getRatioScale(values) {
  const max = Math.max(...values);
  const high = RATIO_TICKS.find((tick) => tick >= max) ?? Math.ceil(max / 100) * 100;
  const low = Math.min(0, Math.floor(Math.min(...values) / 10) * 10);
  return { low, high, ticks: RATIO_TICKS.filter((tick) => tick >= low && tick <= high) };
}

// 省略したときの上の段。両端はきりのいい数にして、目盛りは 3 本まで
function getUpperScale(min, max) {
  const unit = 10 ** Math.max(Math.floor(Math.log10(max)) - 1, 0);
  const low = Math.floor(min / unit) * unit;
  const high = Math.max(Math.ceil(max / unit) * unit, low + unit);
  const step = [1, 2, 5, 10, 20, 50, 100]
    .map((size) => size * unit)
    .find((size) => Math.floor(high / size) - Math.ceil(low / size) < 3);
  const first = Math.ceil(low / step) * step;
  const ticks = Array.from({ length: Math.floor((high - first) / step) + 1 }, (_, i) => first + step * i);
  return { low, high, ticks };
}

// どの線も横切らない大きなすき間があれば、閲覧数の縦軸のそこを省く。下の段が十分に大きくならなければ省かない（null）
function getAxisBreak(series, full) {
  const ranges = series
    .map((item) => item.values.filter((value) => value !== null))
    .filter((values) => values.length > 0)
    .map((values) => ({ min: Math.min(...values), max: Math.max(...values) }))
    .sort((a, b) => a.min - b.min);
  const top = Math.max(...ranges.map((range) => range.max));
  let best = null;
  let lowerMax = 0;
  for (let i = 1; i < ranges.length; i += 1) {
    lowerMax = Math.max(lowerMax, ranges[i - 1].max);
    const upperMin = ranges[i].min;
    if (upperMin - lowerMax < top * BREAK_MIN_GAP) continue;
    const lower = getCountScale([lowerMax], 5);
    const upper = getUpperScale(upperMin, top);
    const zoom = (BREAK_LOWER_SHARE * full.high) / lower.high;
    if (upper.low <= lower.high || zoom < BREAK_MIN_ZOOM) continue;
    if (!best || zoom > best.zoom) best = { lower, upper, zoom };
  }
  return best;
}

// 右端の名前が重ならないように、上から順に間をあける。下にはみ出す分は、上へ詰め直す
function spreadLabels(positions, top, bottom) {
  const order = positions.map((_, index) => index).sort((a, b) => positions[a] - positions[b]);
  const result = [...positions];
  let previous = top - LABEL_GAP;
  order.forEach((index) => {
    result[index] = Math.max(result[index], previous + LABEL_GAP);
    previous = result[index];
  });
  let next = bottom + LABEL_GAP;
  [...order].reverse().forEach((index) => {
    result[index] = Math.min(result[index], next - LABEL_GAP);
    next = result[index];
  });
  return result;
}

// 表が横にはみ出すときは、最新の列が見える右端を出す。閉じている間は幅がないので、開いたときにも合わせる
function showLatestColumn() {
  const wrap = elements.historyTable.parentElement;
  wrap.scrollLeft = wrap.scrollWidth;
}

// 列は、グラフの横軸と同じで、左が古い
function renderHistoryTable(trend) {
  const caption = createElement("caption", "visually-hidden", trend.caption);
  const head = document.createElement("thead");
  const headRow = document.createElement("tr");
  [trend.tableHead ?? trend.nameLabel, ...trend.columns].forEach((label) => {
    const cell = createElement("th", "", label);
    cell.scope = "col";
    headRow.append(cell);
  });
  head.append(headRow);

  const body = document.createElement("tbody");
  [...(trend.totals ?? []), ...trend.series].forEach((item) => {
    const name = createElement("th", "", item.name);
    name.scope = "row";
    body.append(createRow(name, ...item.cells.map((text) => createElement("td", "", text))));
  });

  elements.historyTable.replaceChildren(caption, head, body);
  showLatestColumn();
}

function renderChart() {
  const key = listKey();
  const trend = getTrend(key);
  if (!trend) return;

  const { series } = trend;
  const last = trend.axisLabels.length - 1;
  showLegendValues(trend, last);

  const width = elements.chart.clientWidth;
  if (width === 0) return; // 非表示のときは描かない

  // 8 本の線が詰まらないように、広い幅は高くする
  const height = width >= 520 ? 360 : 300;
  const plotted = series.flatMap((item) => item.values.filter((value) => value !== null));
  const toScale = trend.countAxis || trend.fromZero ? getCountScale : getScale;
  const scale = trend.ratioAxis ? getRatioScale(plotted) : toScale(plotted);
  const axisBreak = trend.countAxis ? getAxisBreak(series, scale) : null;

  // 線の右端の名前は、幅に余裕があるときだけ
  const showEndLabels = width >= 520;
  // 上の余白は、マウスを当てた年や週の名前を出す場所
  const margin = { top: 28, right: 16, bottom: 28, left: 32 };
  const plotHeight = height - margin.top - margin.bottom;
  // 左右の余白は、いちばん大きい目盛りといちばん長い名前に合わせる（12px の文字を、英数字は 1 字 7.2px、日本語は 12px と見積もる）
  const labelWidth = (name) => [...name].reduce((sum, char) => sum + (char.codePointAt(0) < 256 ? 7.2 : 12), 0);
  const axisText = (value) => `${formatNumber(value)}${trend.axisSuffix ?? ""}`;
  // % は、ほかの英数字より幅が広い
  const percentExtra = trend.axisSuffix ? 6 : 0;
  margin.left = Math.max(margin.left, Math.ceil(labelWidth(axisText((axisBreak?.upper ?? scale).high))) + 10 + percentExtra);
  if (showEndLabels) margin.right = Math.max(88, Math.ceil(Math.max(...series.map((item) => labelWidth(item.name)))) + 20);
  const plotWidth = width - margin.left - margin.right;
  const x = (index) => margin.left + (plotWidth * index) / last;
  // 段は上から順。省略しないときは 1 段
  const upperHeight = Math.round((plotHeight - BREAK_GAP) * (1 - BREAK_LOWER_SHARE));
  const bands = axisBreak
    ? [
        { ...axisBreak.upper, top: margin.top, height: upperHeight },
        { ...axisBreak.lower, top: margin.top + upperHeight + BREAK_GAP, height: plotHeight - upperHeight - BREAK_GAP },
      ]
    : [{ ...scale, top: margin.top, height: plotHeight }];
  const y = (value) => {
    const band = bands.find(({ low }) => value >= low) ?? bands.at(-1);
    // 伸び率（%）は、100 を足すと起点からの倍率の 100 倍になる
    const position = trend.ratioAxis ? (number) => Math.log(number + 100) : (number) => number;
    return band.top + band.height * (1 - (position(value) - position(band.low)) / (position(band.high) - position(band.low)));
  };

  const svg = createSvg("svg", {
    width,
    height,
    viewBox: `0 0 ${width} ${height}`,
    tabindex: "0",
    role: "img",
    "aria-label": `${series.map((s) => s.name).join("、")} の${trend.metric}の推移。${axisBreak ? "縦軸は途中を省いています。" : ""}左右の矢印キーで${trend.pointUnit}を選べます。値は下の一覧と表でも確認できます。`,
  });

  bands.flatMap((band) => band.ticks).forEach((value) => {
    svg.append(
      createSvg("line", {
        x1: margin.left,
        x2: margin.left + plotWidth,
        y1: y(value),
        y2: y(value),
        stroke: value === 0 ? "var(--axis-zero)" : "var(--border)",
      }),
    );
    const label = createSvg("text", { x: margin.left - 8, y: y(value) + 4, "text-anchor": "end" });
    label.textContent = axisText(value);
    svg.append(label);
  });

  if (trend.axisUnit) {
    const unit = createSvg("text", { x: 0, y: 12 });
    unit.textContent = trend.axisUnit;
    svg.append(unit);
  }

  // 縦軸を省いた所には、横幅いっぱいに 2 本の波線を引く
  if (axisBreak) {
    const middle = bands[1].top - BREAK_GAP / 2;
    [-3, 3].forEach((offset) => {
      svg.append(
        createSvg("path", {
          d: `M ${margin.left} ${middle + offset} q 4 -4 8 0${" t 8 0".repeat(Math.max(Math.floor(plotWidth / 8) - 1, 0))}`,
          fill: "none",
          stroke: "var(--muted)",
          "stroke-width": 1,
        }),
      );
    });
  }

  // 幅が狭くて年や週の名前が重なるときは、最新から間をあけて出す
  const labelStep = Math.max(1, Math.ceil(52 / (plotWidth / last)));
  trend.axisLabels.forEach((text, index) => {
    if ((last - index) % labelStep !== 0) return;
    let anchor = "middle";
    if (index === 0) anchor = "start";
    if (index === last) anchor = "end";
    const label = createSvg("text", { x: x(index), y: height - 8, "text-anchor": anchor });
    label.textContent = text;
    svg.append(label);
  });

  const crosshair = createSvg("line", {
    y1: margin.top,
    y2: margin.top + plotHeight,
    stroke: "var(--muted)",
    visibility: "hidden",
  });
  svg.append(crosshair);

  const createDot = (cx, cy, item) =>
    createSvg("circle", { cx, cy, r: 4, fill: seriesColor(item), stroke: "var(--surface)", "stroke-width": 1 });

  // 点は、年や週を選んだときだけ出す
  const lines = createSvg("g");
  svg.append(lines);
  const labelY = spreadLabels(series.map((item) => y(item.values[last])), margin.top, margin.top + plotHeight);
  series.forEach((item, seriesIndex) => {
    const group = createSvg("g", { class: "series", "data-series": item.name });
    // null は提供前の年（先頭にだけある）。その年は線を引かない
    const points = item.values.flatMap((value, index) => (value === null ? [] : [`${x(index)},${y(value)}`]));
    group.append(
      createSvg("polyline", {
        points: points.join(" "),
        fill: "none",
        stroke: seriesColor(item),
        "stroke-width": 1.75,
        "stroke-linejoin": "round",
        "stroke-linecap": "round",
      }),
    );
    // 値が最新の 1 つだけのものは線にならないので、点を打つ
    if (points.length === 1) group.append(createDot(x(last), y(item.values[last]), item));
    if (showEndLabels) {
      // ずらした名前と線の右端を、細い点線でつなぐ
      const link = createSvg("line", {
        x1: x(last) + 3,
        y1: y(item.values[last]),
        x2: x(last) + 13,
        y2: labelY[seriesIndex],
        stroke: seriesColor(item),
        "stroke-width": 1,
        "stroke-dasharray": "2 2",
      });
      const label = createSvg("text", { x: x(last) + 16, y: labelY[seriesIndex] + 4, class: "end-label" });
      label.textContent = item.name;
      group.append(link, label);
    }
    lines.append(group);
  });

  const markers = createSvg("g");
  svg.append(markers);

  // 選んでいる年や週の名前。値は下の凡例に出す
  const pill = createElement("div", "chart-pill");
  pill.hidden = true;
  let activeIndex = last;

  function showPoint(index, announce = false) {
    activeIndex = index;

    crosshair.setAttribute("x1", x(index));
    crosshair.setAttribute("x2", x(index));
    crosshair.setAttribute("visibility", "visible");
    markers.replaceChildren(
      ...series
        .filter((item) => item.values[index] !== null)
        .map((item) => {
          const dot = createDot(x(index), y(item.values[index]), item);
          dot.setAttribute("data-series", item.name);
          return dot;
        }),
    );
    applyFocus();

    showLegendValues(trend, index);

    // 縦線の真上に出し、左右の端でははみ出さない位置にする
    pill.textContent = trend.pointLabels[index];
    pill.hidden = false;
    pill.style.left = `${Math.max(0, Math.min(width - pill.offsetWidth, x(index) - pill.offsetWidth / 2))}px`;

    // 読み上げは、キーボードで操作したときだけ
    if (announce) {
      elements.status.textContent = `${trend.pointLabels[index]}。${series
        .map((item) => `${item.name} ${item.values[index] === null ? "値なし" : [item.tips[index], item.subs?.[index]].filter(Boolean).join(" ")}`)
        .join("、")}`;
    }
  }

  function hidePoint() {
    pill.hidden = true;
    crosshair.setAttribute("visibility", "hidden");
    markers.replaceChildren();
    showLegendValues(trend, last);
  }

  // マウスの下の線の名前。どの線からも 12px より離れていれば null
  function findLine(event) {
    const box = svg.getBoundingClientRect();
    const position = Math.min(last, Math.max(0, ((event.clientX - box.left - margin.left) / plotWidth) * last));
    const from = Math.floor(position);
    const to = Math.ceil(position);
    let found = null;
    let nearest = 12;
    series.forEach((item) => {
      if (item.values[from] === null || item.values[to] === null) return;
      const lineY = y(item.values[from]) + (y(item.values[to]) - y(item.values[from])) * (position - from);
      const distance = Math.abs(lineY - (event.clientY - box.top));
      if (distance > nearest) return;
      found = item.name;
      nearest = distance;
    });
    return found;
  }

  function showNearest(event) {
    const offset = event.clientX - svg.getBoundingClientRect().left - margin.left;
    const index = Math.round((offset / plotWidth) * last);
    showPoint(Math.min(last, Math.max(0, index)));
    // 線の上にマウスがあるときは、その線を強調する（指では、下の名前を押して強調する）
    if (event.pointerType !== "mouse") return;
    // 右端の名前は上下にずらすことがあるので、名前の上では、その名前の線にする
    const labelled = event.target.classList.contains("end-label") ? event.target.parentNode.dataset.series : null;
    setHovered(labelled ?? findLine(event));
  }

  svg.addEventListener("pointermove", showNearest);
  svg.addEventListener("pointerdown", showNearest);
  svg.addEventListener("pointerleave", (event) => {
    if (event.pointerType !== "mouse") return;
    hidePoint();
    setHovered(null);
  });
  svg.addEventListener("focus", () => showPoint(activeIndex));
  svg.addEventListener("blur", hidePoint);
  svg.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const step = event.key === "ArrowLeft" ? -1 : 1;
    showPoint(Math.min(last, Math.max(0, activeIndex + step)), true);
  });

  elements.chart.replaceChildren(svg, pill);
  applyFocus();
}

/* ---------- 実データの取得 ---------- */

async function fetchJson(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      const error = new Error(`HTTP ${response.status}`);
      error.status = response.status;
      throw error;
    }
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

const isLimitError = (error) => error?.status === 429 || error?.status === 403;

const isCount = (value) => Number.isFinite(value) && value >= 0;

// "20261125" を、UTC の日時にする
const parseDay = (day) => Date.UTC(Number(day.slice(0, 4)), Number(day.slice(4, 6)) - 1, Number(day.slice(6, 8)));
const toDay = (time) => new Date(time).toISOString().slice(0, 10).replaceAll("-", "");
const toIsoDate = (time) => new Date(time).toISOString().slice(0, 10);

// 英数字で終わる名前は、助詞の前を空ける
const topicOf = (title) => `${title}${/[A-Za-z0-9]$/.test(title) ? " " : ""}は`;

// 最多と次点の、前の週からの増減。前の週が 0 回のときは書かない
function describeLeader({ title, change }) {
  if (change === null) return "";
  if (change === 0) return `${topicOf(title)}前の週とほぼ同じです。`;
  return `${topicOf(title)}前の週より ${formatNumber(Math.abs(change))}% ${change > 0 ? "増えました" : "減りました"}。`;
}

// 伸びが最大の言葉。回数が少なくても分かるように、前の週と直近の週の回数も書く。最多か次点と同じ言葉なら、回数は繰り返さない
function describeRiser(riser, leaders) {
  if (!riser) return "前の週より閲覧数が伸びた言葉はありません。";
  const { title, value, change, history, about } = riser;
  if (leaders.includes(riser)) return `前の週からの伸びが最も大きいのも「${title}」です。${about.text}`;
  return `前の週からの伸びが最も大きいのは「${title}」で、${formatNumber(history.at(-2))} 回から ${formatNumber(value)} 回へ ${formatNumber(change)}% 増えました。${about.text}`;
}

// 解説の見出しと本文。数字は取得した値、言葉の説明は固定の文章で、増減の理由は書かない
function describeKeywords(items, lastWeek) {
  const leaders = items.slice(0, 2);
  const [first, second] = leaders;
  const [riser] = items.filter((item) => item.change > 0).sort((a, b) => b.change - a.change);
  const heading = [`閲覧数の最多は「${first.title}」`, second && `次点は「${second.title}」`, riser && `伸びは「${riser.title}」`].filter(Boolean).join("、");
  const counts = leaders.map(({ title, value }) => `「${title}」が ${formatNumber(value)} 回`).join("、");
  // 取れなかった言葉があると、順位が変わることがある
  const partial = items.length < LIVE_KEYWORDS.length ? `順位は、取得できた ${items.length} 語の中のものです。` : "";
  return {
    comment: {
      heading,
      text: `日本語版 Wikipedia の記事は、${lastWeek}の 1 週間に、${counts}見られました。${leaders.map(describeLeader).join("")}${describeRiser(riser, leaders)}${partial}`,
      sources: riser ? [riser.about.source] : [],
    },
  };
}

// 推移の区切り。週と 2 週間は、いちばん新しい日を終わりにして、days 日ずつさかのぼる
function dayBuckets(latest, count, days) {
  const first = latest - (count * days - 1) * DAY_MS;
  return Array.from({ length: count }, (_, index) => {
    const from = first + index * days * DAY_MS;
    return { from, to: from + (days - 1) * DAY_MS };
  });
}

// 月は、終わりまでそろった月だけ（途中の月は、少なく見えるので出さない）
function monthBuckets(latest, count) {
  const next = new Date(latest + DAY_MS);
  const [year, month] = [next.getUTCFullYear(), next.getUTCMonth()];
  return Array.from({ length: count }, (_, index) => ({
    from: Date.UTC(year, month - count + index, 1),
    to: Date.UTC(year, month - count + index + 1, 1) - DAY_MS,
  }));
}

const sumViews = (views, { from, to }) =>
  Array.from({ length: (to - from) / DAY_MS + 1 }, (_, day) => views.get(toDay(from + day * DAY_MS)) ?? 0).reduce(
    (sum, value) => sum + value,
    0,
  );

async function loadKeywordViews() {
  const now = Date.now();
  // 「1 年」で 12 か月分がそろうように、13 か月前の月の初めから取る
  const today = new Date(now);
  const requestedFrom = Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - 13, 1);
  const range = `${toDay(requestedFrom)}/${toDay(now)}`;
  const fetched = [];
  let lastError = null;

  // Wikimedia の案内に合わせて、1 件ずつ順番に取得する
  for (const keyword of LIVE_KEYWORDS) {
    const article = encodeURIComponent(keyword.article.replaceAll(" ", "_"));
    const url = `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/ja.wikipedia.org/all-access/user/${article}/daily/${range}`;
    try {
      const json = await fetchJson(url);
      const views = new Map(
        json.items
          .filter((item) => /^\d{10}$/.test(item.timestamp) && isCount(item.views))
          .map((item) => [item.timestamp.slice(0, 8), item.views]),
      );
      if (views.size > 0) fetched.push({ keyword, views });
    } catch (error) {
      lastError = error;
      if (isLimitError(error)) break;
    }
  }
  if (fetched.length === 0) throw lastError ?? new Error("no data");

  // いちばん新しい日を基準に区切る。閲覧がない日は 0
  const latest = Math.max(...fetched.flatMap(({ views }) => [...views.keys()].map(parseDay)));
  const periods = [
    { id: "8w", label: `${WEEKS} 週`, unit: "週", buckets: dayBuckets(latest, WEEKS, 7) },
    { id: "6m", label: "6 か月", unit: "2 週間", buckets: dayBuckets(latest, 13, 14) },
    { id: "1y", label: "1 年", unit: "月", buckets: monthBuckets(latest, 12) },
  ];

  const items = fetched.map(({ keyword, views }) => {
    // 記事の記録が途中から始まる言葉は、それより前（始まりを含む区切りも）を 0 にせず空欄にする
    const firstRecord = Math.min(...[...views.keys()].map(parseDay));
    const startsLate = firstRecord > requestedFrom + 7 * DAY_MS;
    const counts = Object.fromEntries(
      periods.map(({ id, buckets }) => [
        id,
        buckets.map((bucket) => (startsLate && bucket.from < firstRecord ? null : sumViews(views, bucket))),
      ]),
    );
    const history = counts["8w"];
    const [previous, value] = history.slice(-2);
    return {
      title: keyword.title,
      hint: `日本語版 Wikipedia の記事「${keyword.article}」`,
      about: keyword.about,
      // グラフの色は、言葉ごとに固定する
      color: LIVE_KEYWORDS.indexOf(keyword) + 1,
      link: `https://ja.wikipedia.org/wiki/${encodeURIComponent(keyword.article.replaceAll(" ", "_"))}`,
      history,
      counts,
      value,
      change: previous > 0 ? Math.round(((value - previous) / previous) * 100) : null,
    };
  });

  // カードの上の行は、取れなかった言葉があるときだけ
  const missing = LIVE_KEYWORDS.length - items.length;
  const note = missing > 0 ? `${missing} 件は取得できませんでした（再読み込みで取り直せます）` : "";
  items.sort((a, b) => b.value - a.value);
  return { items, periods, note, ...describeKeywords(items, `${formatDate(toIsoDate(latest - 6 * DAY_MS))}〜${formatDate(toIsoDate(latest))}`) };
}

const LOADERS = { keywords: loadKeywordViews };

// 取得中にもう一度呼ばれたら、同じ取得の完了を待つ
function refreshLive(key) {
  const entry = liveData[key];
  if (entry.status === "loading") return entry.promise;

  entry.status = "loading";
  entry.promise = LOADERS[key]()
    .then((data) => {
      entry.status = "ready";
      entry.data = data;
    })
    .catch((error) => {
      entry.status = "error";
      entry.message = isLimitError(error)
        ? "取得の回数が上限に達しました。時間をおいて、「もう一度読み込む」を押してください。"
        : "データを取得できませんでした。通信の状態を確認して、「もう一度読み込む」を押してください。";
    })
    .then(() => {
      if (listKey() !== key) return;
      render();
      elements.status.textContent = entry.status === "ready" ? "データを表示しました。" : entry.message;
    });
  return entry.promise;
}

/* ---------- カード ---------- */

// retry は、取得に失敗したときに「もう一度読み込む」を出す
function showCardMessage(text, { loading = false, retry = false } = {}) {
  elements.cardMessage.hidden = false;
  elements.retryButton.hidden = !retry;
  elements.cardMessage.classList.toggle("is-loading", loading);
  elements.cardMessageText.textContent = text;
}

// 解説と 1 枚のカードを表示する。どのタブも同じ部品
function renderCardView(key) {
  const config = isRanking(key) ? RANKINGS[key] : LISTS[key];
  const entry = config.live ? liveData[key] : null;
  const ready = !entry || entry.status === "ready";
  // 表の中身。固定の一覧は定義そのもので、「ランキング」は RANKINGS から作るので null
  const data = ready && !isRanking(key) ? (entry?.data ?? config) : null;
  const trend = getTrend(key);
  // 「データ」は、出す内容ごとに、題と、グラフか表かが違う
  const view = getView(key);
  const chartOnly = Boolean(view?.chartOnly);
  const showHistory = Boolean(trend) && (chartOnly || state.view[key] === "history");
  const isLinkList = key === "news" || key === "video";

  elements.viewToggle.hidden = !trend || chartOnly;

  elements.rankingTitle.textContent = view?.title ?? config.title;
  elements.rankingTitle.hidden = showHistory;
  elements.chartTitle.hidden = !showHistory;
  elements.rankingPanel.hidden = !ready || showHistory || isLinkList;
  elements.linkList.hidden = !isLinkList;
  elements.historyPanel.hidden = !showHistory;
  elements.cardMessage.hidden = true;
  elements.period.hidden = true;

  // 題の下の行は、取得できなかった件数があるときだけ
  elements.cardNote.hidden = !data?.note;
  elements.cardNote.textContent = data?.note ?? "";
  elements.tableNote.hidden = !view?.tableNote;
  elements.tableNote.textContent = view?.tableNote ?? "";
  renderIconSwitch(key);

  if (!ready) {
    renderLead("");
    if (entry.status === "error") showCardMessage(entry.message, { retry: true });
    else showCardMessage(config.loadingText, { loading: true });
    return;
  }

  const comment = data ? data.comment : config.comment;
  // 出典は、どのタブも解説の下に出す。実データは、取得先を先に並べる
  const sources = [...(config.live ? [config.source] : []), ...(comment?.sources ?? [])];
  renderLead(comment?.text ?? "", sources, comment?.heading, comment?.notice);

  if (isLinkList) {
    renderLinkList(key);
    return;
  }

  if (!chartOnly) {
    const table = buildTable(key, view ?? data);
    renderTableHead(table.columns);
    elements.rankingBody.replaceChildren(...table.rows);
    elements.rankingTable.className = ["ranking", `ranking--${table.kind}`, table.modifier, data ? "ranking--list" : ""].filter(Boolean).join(" ");
    if (table.rows.length === 0) {
      elements.rankingPanel.hidden = true;
      showCardMessage("表示できるデータがありませんでした。");
    }
  }

  if (!trend) return;
  renderSwitch(elements.period, key, getPeriodOptions(key));
  // ボタンは題の隣（グラフの枠の外）にあるので、順位の表示では隠す
  if (!showHistory) elements.period.hidden = true;
  elements.chartTitle.textContent = trend.title;
  // 順位と推移のアイコン。各表示のカードの題を、吹き出しと読み上げの名前に使う
  [...elements.viewToggle.children].forEach((button) => {
    const isHistory = button.dataset.value === "history";
    const name = isHistory ? trend.title : elements.rankingTitle.textContent;
    button.setAttribute("aria-label", name);
    button.dataset.tip = name;
    button.setAttribute("aria-pressed", String(isHistory === showHistory));
  });
  elements.legendNote.textContent = trend.legendNote;
  elements.legendNote.hidden = !trend.legendNote;
  renderLegend(key, trend);
  renderHistoryTable(trend);
  renderChart();
}

/* ---------- 画面の切り替え ---------- */

// 開いていたタブと表示は、再読み込みしても保つ（そのタブの間だけ）
const SCREEN_KEY = "trendscan-screen";

function restoreScreen() {
  try {
    const saved = JSON.parse(window.sessionStorage.getItem(SCREEN_KEY));
    const tab = [...elements.tabs].find((item) => item.dataset.tab === saved?.tab);
    if (!tab) return;
    state.section = tab.parentElement.dataset.group;
    state.tab[state.section] = saved.tab;
    if (saved.view === "history") state.view[saved.tab] = "history";
  } catch {
    // 保存を使えない環境では、最初の画面を出す
  }
}

function saveScreen() {
  const tab = listKey();
  try {
    window.sessionStorage.setItem(SCREEN_KEY, JSON.stringify({ tab, view: state.view[tab] ?? "ranking" }));
  } catch {
    // 保存を使えない環境では、覚えない
  }
}

// 選んでいる分類のタブの帯だけを出し、選択中のタブをそろえる
function renderTabs() {
  elements.tabLists.forEach((list) => {
    list.hidden = list.dataset.group !== state.section;
  });
  elements.tabs.forEach((tab) => {
    const selected = tab.dataset.tab === state.tab[tab.parentElement.dataset.group];
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  elements.tabPanel.setAttribute("aria-labelledby", `tab-${listKey()}`);
}

// 下線を今置いている帯と位置
let indicator = {};

// 選んでいるタブの下へ、帯の下線を置く。slide は、前の位置から滑らせるとき
function placeTabIndicator(slide) {
  const list = [...elements.tabLists].find((item) => !item.hidden);
  const tab = list.querySelector('[aria-selected="true"]');
  const next = { list, x: tab.offsetLeft, y: tab.offsetTop + tab.offsetHeight - 2, width: tab.offsetWidth };
  // 同じ位置なら触らない（動いている下線を止めない）
  if (Object.keys(next).every((name) => next[name] === indicator[name])) return;
  // 滑らせるのは、同じ帯の同じ段で移るときだけ
  list.classList.toggle("is-sliding", slide && list === indicator.list && next.y === indicator.y);
  list.style.setProperty("--tab-x", `${next.x}px`);
  list.style.setProperty("--tab-y", `${next.y}px`);
  list.style.setProperty("--tab-width", `${next.width}px`);
  indicator = next;
}

function render() {
  const { section } = state;
  const key = listKey();
  saveScreen();

  elements.sectionButtons.forEach((button) => {
    if (button.dataset.section === section) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
  elements.pageTitle.textContent = SECTION_TITLES[section];

  renderTabs();

  // 実データは、そのタブを開いたときに初めて取得する
  if (LISTS[key]?.live && liveData[key].status === "idle") refreshLive(key);

  elements.viewCard.hidden = false;
  renderCardView(key);

  // 本文を出したあとの幅で測る
  placeTabIndicator(true);
}

function retryLive() {
  const key = listKey();
  if (liveData[key]?.status !== "error") return;
  refreshLive(key);
  render();
  // 押したボタンは消えるので、キーボードの位置をメッセージに移す
  elements.cardMessage.focus();
  elements.status.textContent = "読み込み直しています。";
}

function switchView(update, announcement) {
  update();
  elements.status.textContent = "";
  render();
  // 切り替えた画面は上から見せる
  window.scrollTo(0, 0);
  if (announcement) elements.status.textContent = announcement;
}

/* ---------- イベント ---------- */

elements.sectionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.section === state.section) return;
    switchView(() => (state.section = button.dataset.section), `${button.textContent.trim()}を表示しています。`);
  });
});

function selectTab(tab) {
  if (state.tab[state.section] === tab.dataset.tab) return;
  switchView(() => (state.tab[state.section] = tab.dataset.tab), `${tab.textContent}を表示しています。`);
}

// タブは、矢印キー（端で反対側へ回る）・Home・End で移動し、移ると同時に切り替わる
elements.tabs.forEach((tab) => {
  tab.addEventListener("click", () => selectTab(tab));
  tab.addEventListener("keydown", (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const tabs = [...tab.parentElement.querySelectorAll("[data-tab]")];
    const index = tabs.indexOf(tab);
    const targets = {
      ArrowRight: (index + 1) % tabs.length,
      ArrowLeft: (index - 1 + tabs.length) % tabs.length,
      Home: 0,
      End: tabs.length - 1,
    };
    if (!Object.hasOwn(targets, event.key)) return;
    event.preventDefault();
    const next = tabs[targets[event.key]];
    next.focus();
    selectTab(next);
  });
});

elements.retryButton.addEventListener("click", retryLive);

elements.period.addEventListener("click", (event) => {
  const button = event.target.closest(".period-button");
  if (!button) return;
  const key = listKey();
  state.period[key] = isRanking(key) ? Number(button.dataset.value) : button.dataset.value;
  render();
});

elements.viewSwitch.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-value]");
  if (!button) return;
  state.content[listKey()] = button.dataset.value;
  render();
});

elements.viewToggle.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-value]");
  // 表示中のアイコンを押しても、何もしない
  if (!button || button.getAttribute("aria-pressed") === "true") return;
  const showHistory = button.dataset.value === "history";
  state.view[listKey()] = button.dataset.value;
  render();
  elements.status.textContent = `${showHistory ? "推移" : "順位"}を表示しています。`;
});

elements.historyTable.closest("details").addEventListener("toggle", (event) => {
  if (event.target.open) showLatestColumn();
});

// 名前を押すと、その線の強調を固定する。もう一度押すと戻す
elements.legend.addEventListener("click", (event) => {
  const button = event.target.closest(".legend-button");
  if (!button) return;
  const key = listKey();
  const { name } = button.dataset;
  state.pinned[key] = state.pinned[key] === name ? null : name;
  [...elements.legend.children].forEach((item) => {
    item.setAttribute("aria-pressed", String(item.dataset.name === state.pinned[key]));
  });
  // 外したときは、マウスが上にあっても、すぐに元の濃さに戻す
  hoveredName = state.pinned[key];
  applyFocus();
});

// 名前にマウスを当てたときと、キーで選んだときは、押さなくても強調する
elements.legend.addEventListener("pointerover", (event) => {
  if (event.pointerType === "mouse") setHovered(event.target.closest(".legend-button")?.dataset.name ?? null);
});
elements.legend.addEventListener("pointerleave", () => setHovered(null));
elements.legend.addEventListener("focusin", (event) => {
  if (event.target.matches(":focus-visible")) setHovered(event.target.dataset.name);
});
elements.legend.addEventListener("focusout", () => setHovered(null));

// 幅が変わったら、グラフを描き直す
let chartWidth = 0;
new ResizeObserver(() => {
  const width = elements.chart.clientWidth;
  if (width === chartWidth) return;
  chartWidth = width;
  if (width > 0) renderChart();
}).observe(elements.chart);

// 書体の読み込みや幅の変化でタブがずれたら、下線を滑らせずに合わせ直す
const tabSizes = new ResizeObserver(() => placeTabIndicator(false));
[...elements.tabLists, ...elements.tabs].forEach((node) => tabSizes.observe(node));

restoreScreen();
render();
